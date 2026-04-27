// VetConnect — Supabase Edge Function: process-jobs
// Runs on a cron schedule (every hour via Supabase Dashboard → Edge Functions → Cron)
// Reads pending scheduled_jobs, sends WhatsApp via Twilio, marks jobs complete.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL             = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY     = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VETPROMPT_WEBHOOK_URL    = Deno.env.get('VETPROMPT_WEBHOOK_URL')!;
const VETPROMPT_WEBHOOK_SECRET = Deno.env.get('VETPROMPT_WEBHOOK_SECRET')!;

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
    const date       = appt?.appointment_date || '';
    const time       = appt?.appointment_time || '';

    switch (type) {
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

        default:
            return `Recordatorio de cita — ${clinicName}`;
    }
}

// ─── JOB PROCESSOR ───────────────────────────────────────────────────────────

async function processJob(job: any): Promise<void> {
    // Mark as processing
    await supabase
        .from('scheduled_jobs')
        .update({ status: 'processing', last_attempt_at: new Date().toISOString(), attempts: (job.attempts || 0) + 1 })
        .eq('id', job.id);

    const appt   = job.appointment;
    const client = appt?.client;
    const org    = appt?.organization;

    if (!appt)         throw new Error(`No appointment for job ${job.id}`);
    if (!client?.phone) throw new Error(`No phone for client in job ${job.id}`);
    if (!org?.twilio_sid || !org?.twilio_auth_token || !org?.twilio_phone) {
        throw new Error(`Twilio not configured for org in job ${job.id}`);
    }

    const messageText = buildMessage(job.job_type, appt, org.name);

    const result = await sendViaVetPrompt(client.phone, messageText, job.job_type);

    // Mark job complete
    await supabase
        .from('scheduled_jobs')
        .update({ status: 'completed', result: JSON.stringify(result) })
        .eq('id', job.id);

    // Log communication
    await supabase.from('communications').insert({
        client_id:       client.id,
        organization_id: job.organization_id,
        channel:         'whatsapp',
        type:            job.job_type,
        content:         messageText,
        status:          'sent',
        sent_at:         new Date().toISOString(),
        external_id:     result.messageId
    });
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

Deno.serve(async (_req) => {
    const now = new Date().toISOString();

    // Fetch pending jobs with all required relations including org credentials
    const { data: jobs, error } = await supabase
        .from('scheduled_jobs')
        .select(`
            *,
            appointment:appointments(
                id,
                appointment_date,
                appointment_time,
                type,
                organization_id,
                organization:organizations(name, twilio_sid, twilio_auth_token, twilio_phone),
                client:clients(id, name, phone, email),
                patient:patients(id, name, species)
            )
        `)
        .eq('status', 'pending')
        .lte('scheduled_for', now)
        .order('scheduled_for')
        .limit(50);

    if (error) {
        console.error('Error fetching jobs:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!jobs || jobs.length === 0) {
        return new Response(JSON.stringify({ processed: 0, message: 'No pending jobs' }), { status: 200 });
    }

    const results = await Promise.allSettled(jobs.map(job => processJob(job)));

    // Handle failures — retry up to 3 times, then mark failed
    await Promise.allSettled(
        results.map(async (r, i) => {
            if (r.status === 'rejected') {
                const job      = jobs[i];
                const attempts = (job.attempts || 0) + 1;
                const newStatus = attempts >= 3 ? 'failed' : 'pending';
                await supabase
                    .from('scheduled_jobs')
                    .update({
                        status:        newStatus,
                        error_message: r.reason?.message || 'Unknown error',
                        // Retry in 30 min if not final failure
                        ...(newStatus === 'pending' && {
                            scheduled_for: new Date(Date.now() + 30 * 60 * 1000).toISOString()
                        })
                    })
                    .eq('id', job.id);
            }
        })
    );

    const processed = results.filter(r => r.status === 'fulfilled').length;
    const failed    = results.filter(r => r.status === 'rejected').length;

    return new Response(
        JSON.stringify({ processed, failed, total: jobs.length }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
});
