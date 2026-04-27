// VetConnect — Supabase Edge Function: send-immediate
// Sends WhatsApp messages via VetPrompt (n8n webhook) using Meta Cloud API.
// Supports: appointment_confirmation, reminder_24h, reminder_2h, follow_up, test.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SUPABASE_ANON_KEY    = Deno.env.get('SUPABASE_ANON_KEY')!;
const VETPROMPT_WEBHOOK_URL    = Deno.env.get('VETPROMPT_WEBHOOK_URL')!;    // https://tu-n8n.app.n8n.cloud/webhook/vetconnect-send
const VETPROMPT_WEBHOOK_SECRET = Deno.env.get('VETPROMPT_WEBHOOK_SECRET')!; // shared secret

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── SEND VIA VETPROMPT ───────────────────────────────────────────────────────

async function sendViaVetPrompt(
    to: string,
    message: string,
    type: string
): Promise<{ success: true; messageId: string }> {
    const res = await fetch(VETPROMPT_WEBHOOK_URL, {
        method:  'POST',
        headers: {
            'Content-Type':        'application/json',
            'x-vetconnect-secret': VETPROMPT_WEBHOOK_SECRET
        },
        body: JSON.stringify({ to, message, type })
    });

    const data = await res.json() as any;
    if (!res.ok || data.error) {
        throw new Error(data.error || `VetPrompt webhook responded ${res.status}`);
    }
    return { success: true, messageId: data.messageId };
}

// ─── MESSAGE BUILDERS ─────────────────────────────────────────────────────────

function buildMessage(type: string, appt: any, clinicName: string): string {
    const clientName = appt?.client?.name || 'Cliente';
    const petName    = appt?.patient?.name || 'tu mascota';
    const date       = appt?.appointment_date || appt?.date || '';
    const time       = appt?.appointment_time || appt?.time || '';

    switch (type) {
        case 'appointment_confirmation':
        case 'confirmation':
            return [
                `Hola ${clientName} 👋`,
                '',
                'Tu cita ha sido confirmada ✅',
                '',
                `📅 Fecha: ${date}`,
                `⏰ Hora: ${time}`,
                `🐾 Mascota: ${petName}`,
                '',
                'Te esperamos. Si necesitas cambiar la cita, responde a este mensaje.',
                '',
                `— ${clinicName}`
            ].join('\n');

        case 'reminder_24h':
            return [
                `Recordatorio de cita ⏰`,
                '',
                `Hola ${clientName}, te recordamos tu cita *mañana*:`,
                `📅 ${date} a las ${time}`,
                `🐾 ${petName}`,
                '',
                'Por favor responde:',
                '1. ¿Cuál es el motivo principal de la consulta?',
                '2. ¿Ha presentado algún síntoma?',
                '3. ¿Come y bebe con normalidad?',
                '',
                'Tus respuestas nos ayudan a preparar mejor la consulta.',
                `— ${clinicName}`
            ].join('\n');

        case 'reminder_2h':
            return [
                `⏰ Tu cita es en 2 horas`,
                '',
                `${clientName}, te esperamos hoy a las *${time}* para la consulta de ${petName}.`,
                '',
                `¡Nos vemos pronto! 🐾`,
                `— ${clinicName}`
            ].join('\n');

        case 'follow_up':
            return [
                `Seguimiento de ${petName} 🔄`,
                '',
                `Hola ${clientName}, ¿cómo ha evolucionado ${petName} después de la consulta?`,
                '',
                'Cuéntanos:',
                '• ¿Ha mejorado su condición?',
                '• ¿Alguna duda sobre el tratamiento?',
                '',
                'Estamos para ayudarte 🐾',
                `— ${clinicName}`
            ].join('\n');

        case 'test':
            return [
                `✅ Prueba de conexión VetConnect`,
                '',
                'La integración de WhatsApp está funcionando correctamente.',
                '',
                `— ${clinicName}`
            ].join('\n');

        default:
            return `Mensaje de ${clinicName}`;
    }
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin':  '*',
                'Access-Control-Allow-Headers': 'authorization, content-type'
            }
        });
    }

    // Auth
    const token = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    if (token !== SUPABASE_ANON_KEY && token !== SUPABASE_SERVICE_KEY) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    let body: any;
    try { body = await req.json(); }
    catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

    const { type, appointment, organization_id } = body;

    if (!type || !organization_id) {
        return new Response(
            JSON.stringify({ error: 'Missing required fields: type, organization_id' }),
            { status: 400 }
        );
    }

    // Fetch org name
    const { data: org, error: orgErr } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', organization_id)
        .single();

    if (orgErr || !org) {
        return new Response(JSON.stringify({ error: 'Organization not found' }), { status: 404 });
    }

    // Determine recipient — test messages go to the configured test number
    const recipientPhone = type === 'test'
        ? (Deno.env.get('VETCONNECT_TEST_PHONE') || body.testPhone)
        : appointment?.client?.phone;

    if (!recipientPhone) {
        return new Response(
            JSON.stringify({ error: 'No hay número de teléfono para el destinatario' }),
            { status: 422 }
        );
    }

    const messageText = buildMessage(type, appointment || {}, org.name);

    try {
        const result = await sendViaVetPrompt(recipientPhone, messageText, type);

        // Log communication (skip for test)
        if (type !== 'test' && appointment?.client?.id) {
            await supabase.from('communications').insert({
                client_id:       appointment.client.id,
                organization_id,
                channel:         'whatsapp',
                type,
                content:         messageText,
                status:          'sent',
                sent_at:         new Date().toISOString(),
                external_id:     result.messageId
            });
        }

        return new Response(JSON.stringify(result), {
            status:  200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        console.error('sendViaVetPrompt error:', err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 502 });
    }
});
