// VetConnect — Supabase Edge Function: process-jobs
// Runs on a cron schedule (every hour via Supabase Dashboard → Edge Functions → Cron)
// Reads pending scheduled_jobs, sends WhatsApp templates via Meta Cloud API directly.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const META_WHATSAPP_TOKEN  = Deno.env.get('META_WHATSAPP_TOKEN')!;
const META_PHONE_NUMBER_ID = Deno.env.get('META_PHONE_NUMBER_ID')!;

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
    const clientName = appt?.client?.name     || 'Cliente';
    const petName    = appt?.patient?.name    || 'tu mascota';
    const date       = appt?.appointment_date || '';
    const time       = appt?.appointment_time || '';

    switch (type) {
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

        default:
            throw new Error(`Unknown job type: ${type}`);
    }
}

// ─── JOB PROCESSOR ───────────────────────────────────────────────────────────

async function processJob(job: any): Promise<void> {
    await supabase
        .from('scheduled_jobs')
        .update({
            status:          'processing',
            last_attempt_at: new Date().toISOString(),
            attempts:        (job.attempts || 0) + 1
        })
        .eq('id', job.id);

    const appt   = job.appointment;
    const client = appt?.client;
    const org    = appt?.organization;

    if (!appt)          throw new Error(`No appointment for job ${job.id}`);
    if (!client?.phone) throw new Error(`No phone for client in job ${job.id}`);
    if (!org?.name)     throw new Error(`No organization name for job ${job.id}`);

    const payload = buildTemplatePayload(job.job_type, appt, org.name);
    const result  = await sendTemplate(client.phone, payload.templateName, payload.params);

    await supabase
        .from('scheduled_jobs')
        .update({ status: 'completed', result: JSON.stringify(result) })
        .eq('id', job.id);

    await supabase.from('communications').insert({
        client_id:       client.id,
        organization_id: job.organization_id,
        channel:         'whatsapp',
        type:            job.job_type,
        content:         payload.templateName,
        status:          'sent',
        sent_at:         new Date().toISOString(),
        external_id:     result.messageId
    });
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

Deno.serve(async (_req) => {
    const now = new Date().toISOString();

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
                organization:organizations(name),
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

    await Promise.allSettled(
        results.map(async (r, i) => {
            if (r.status === 'rejected') {
                const job       = jobs[i];
                const attempts  = (job.attempts || 0) + 1;
                const newStatus = attempts >= 3 ? 'failed' : 'pending';
                await supabase
                    .from('scheduled_jobs')
                    .update({
                        status:        newStatus,
                        error_message: r.reason?.message || 'Unknown error',
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
