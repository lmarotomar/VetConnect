// VetConnect — Supabase Edge Function: send-immediate
// Sends WhatsApp template messages via Meta Cloud API directly.
// Supports: appointment_confirmation, reminder_24h, reminder_2h, follow_up, test.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL          = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SUPABASE_ANON_KEY     = Deno.env.get('SUPABASE_ANON_KEY')!;
const META_WHATSAPP_TOKEN   = Deno.env.get('META_WHATSAPP_TOKEN')!;
const META_PHONE_NUMBER_ID  = Deno.env.get('META_PHONE_NUMBER_ID')!; // 1123110644209986

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface NamedParam {
    name:  string;
    value: string;
}

interface TemplatePayload {
    templateName: string;
    params:       NamedParam[];
}

// ─── SEND TEMPLATE VIA META CLOUD API ────────────────────────────────────────

async function sendTemplate(
    to:           string,
    templateName: string,
    params:       NamedParam[]
): Promise<{ success: true; messageId: string }> {
    const res = await fetch(
        `https://graph.facebook.com/v25.0/${META_PHONE_NUMBER_ID}/messages`,
        {
            method:  'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${META_WHATSAPP_TOKEN}`
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to,
                type: 'template',
                template: {
                    name:     templateName,
                    language: { code: 'es' },
                    components: [{
                        type:       'body',
                        parameters: params.map(p => ({
                            type:           'text',
                            text:           p.value,
                            parameter_name: p.name
                        }))
                    }]
                }
            })
        }
    );

    const data = await res.json() as any;
    if (!res.ok || data.error) {
        throw new Error(data.error?.message || `Meta API responded ${res.status}`);
    }
    return { success: true, messageId: data.messages?.[0]?.id };
}

// ─── TEMPLATE BUILDERS ───────────────────────────────────────────────────────

function buildTemplatePayload(
    type:       string,
    appt:       any,
    clinicName: string
): TemplatePayload {
    const clientName = appt?.client?.name       || 'Cliente';
    const petName    = appt?.patient?.name      || 'tu mascota';
    const date       = appt?.appointment_date   || appt?.date || '';
    const time       = appt?.appointment_time   || appt?.time || '';

    switch (type) {
        case 'appointment_confirmation':
        case 'confirmation':
            return {
                templateName: 'vetconnect_confirmacion_cita',
                params: [
                    { name: 'cliente_nombre', value: clientName },
                    { name: 'cita_fecha',     value: date       },
                    { name: 'cita_hora',      value: time       },
                    { name: 'mascota_nombre', value: petName    },
                    { name: 'clinica_nombre', value: clinicName }
                ]
            };

        case 'reminder_24h':
            return {
                templateName: 'vetconnect_recordatorio_24h',
                params: [
                    { name: 'cliente_nombre', value: clientName },
                    { name: 'cita_fecha',     value: date       },
                    { name: 'cita_hora',      value: time       },
                    { name: 'mascota_nombre', value: petName    },
                    { name: 'clinica_nombre', value: clinicName }
                ]
            };

        case 'reminder_2h':
            return {
                templateName: 'vetconnect_recordatorio_2h',
                params: [
                    { name: 'cita_hora',      value: time       },
                    { name: 'mascota_nombre', value: petName    },
                    { name: 'cliente_nombre', value: clientName },
                    { name: 'clinica_nombre', value: clinicName }
                ]
            };

        case 'follow_up':
            return {
                templateName: 'vetconnect_seguimiento',
                params: [
                    { name: 'mascota_nombre', value: petName    },
                    { name: 'cita_fecha',     value: date       },
                    { name: 'cliente_nombre', value: clientName },
                    { name: 'clinica_nombre', value: clinicName }
                ]
            };

        case 'test':
            return {
                templateName: 'vetprompt_bienvenida',
                params: [{ name: 'name', value: 'Test VetConnect' }]
            };

        default:
            throw new Error(`Unknown message type: ${type}`);
    }
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: CORS_HEADERS });
    }

    // Auth — accept anon key (apikey header) OR service key OR a valid session JWT
    const apikey = req.headers.get('apikey') || '';
    const bearer = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const isAuthorized =
        apikey === SUPABASE_ANON_KEY ||
        bearer === SUPABASE_ANON_KEY ||
        bearer === SUPABASE_SERVICE_KEY;

    if (!isAuthorized) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
    }

    let body: any;
    try { body = await req.json(); }
    catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: CORS_HEADERS }); }

    const { type, appointment, organization_id } = body;

    if (!type || !organization_id) {
        return new Response(
            JSON.stringify({ error: 'Missing required fields: type, organization_id' }),
            { status: 400, headers: CORS_HEADERS }
        );
    }

    // Fetch org name
    const { data: org, error: orgErr } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', organization_id)
        .single();

    if (orgErr || !org) {
        return new Response(JSON.stringify({ error: 'Organization not found' }), { status: 404, headers: CORS_HEADERS });
    }

    // Determine recipient
    const recipientPhone = type === 'test'
        ? (Deno.env.get('VETCONNECT_TEST_PHONE') || body.testPhone)
        : appointment?.client?.phone;

    if (!recipientPhone) {
        return new Response(
            JSON.stringify({ error: 'No hay número de teléfono para el destinatario' }),
            { status: 422, headers: CORS_HEADERS }
        );
    }

    let payload: TemplatePayload;
    try {
        payload = buildTemplatePayload(type, appointment || {}, org.name);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return new Response(JSON.stringify({ error: message }), { status: 400, headers: CORS_HEADERS });
    }

    try {
        const result = await sendTemplate(recipientPhone, payload.templateName, payload.params);

        // Log communication (skip for test)
        if (type !== 'test' && appointment?.client?.id) {
            await supabase.from('communications').insert({
                client_id:       appointment.client.id,
                organization_id,
                channel:         'whatsapp',
                type,
                content:         payload.templateName,
                status:          'sent',
                sent_at:         new Date().toISOString(),
                external_id:     result.messageId
            });
        }

        return new Response(JSON.stringify(result), {
            status:  200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('sendTemplate error:', message);
        return new Response(JSON.stringify({ error: message }), { status: 502, headers: CORS_HEADERS });
    }
});
