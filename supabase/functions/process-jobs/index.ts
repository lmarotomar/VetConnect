// VetConnect — Supabase Edge Function
// Runs on a cron schedule (every hour via Supabase Dashboard)
// Reads pending scheduled_jobs and dispatches them to the VetConnect Messaging Agent

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MESSAGING_AGENT_URL = Deno.env.get('MESSAGING_AGENT_URL')!;
const MESSAGING_AGENT_SECRET = Deno.env.get('MESSAGING_AGENT_SECRET')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

Deno.serve(async (_req) => {
    const now = new Date().toISOString();

    // Fetch pending jobs that are due
    const { data: jobs, error } = await supabase
        .from('scheduled_jobs')
        .select(`
            *,
            appointment:appointments(
                id,
                appointment_date,
                appointment_time,
                type,
                client:clients(id, name, phone, email),
                patient:patients(id, name, species)
            )
        `)
        .eq('status', 'pending')
        .lte('scheduled_for', now)
        .order('scheduled_for')
        .limit(50); // Process max 50 per run to avoid timeouts

    if (error) {
        console.error('Error fetching jobs:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!jobs || jobs.length === 0) {
        return new Response(JSON.stringify({ processed: 0 }), { status: 200 });
    }

    const results = await Promise.allSettled(jobs.map(job => processJob(job)));

    const processed = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return new Response(JSON.stringify({ processed, failed, total: jobs.length }), { status: 200 });
});

async function processJob(job: any): Promise<void> {
    // Mark as processing
    await supabase
        .from('scheduled_jobs')
        .update({ status: 'processing', last_attempt_at: new Date().toISOString(), attempts: (job.attempts || 0) + 1 })
        .eq('id', job.id);

    try {
        const appointment = job.appointment;
        if (!appointment) throw new Error(`No appointment found for job ${job.id}`);

        const client = appointment.client;
        const patient = appointment.patient;
        if (!client?.phone) throw new Error(`No phone for client in job ${job.id}`);

        // Build payload for Messaging Agent
        const payload = {
            jobType: job.job_type,
            jobId: job.id,
            recipient: {
                phone: client.phone,
                name: client.name,
                email: client.email
            },
            appointment: {
                id: appointment.id,
                date: appointment.appointment_date,
                time: appointment.appointment_time,
                type: appointment.type,
                petName: patient?.name || 'tu mascota'
            }
        };

        // Call the VetConnect Messaging Agent
        const response = await fetch(MESSAGING_AGENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MESSAGING_AGENT_SECRET}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Agent responded ${response.status}: ${body}`);
        }

        const result = await response.json();

        // Mark job as completed
        await supabase
            .from('scheduled_jobs')
            .update({
                status: 'completed',
                result: JSON.stringify(result)
            })
            .eq('id', job.id);

        // Log in communications table
        await supabase.from('communications').insert({
            client_id: client.id,
            channel: 'whatsapp',
            type: job.job_type,
            content: `Job ${job.job_type} dispatched via Messaging Agent`,
            status: 'sent',
            sent_at: new Date().toISOString(),
            external_id: result.messageId || null
        });

    } catch (err: any) {
        console.error(`Job ${job.id} failed:`, err.message);

        const attempts = (job.attempts || 0) + 1;
        const newStatus = attempts >= 3 ? 'failed' : 'pending'; // Retry up to 3 times

        await supabase
            .from('scheduled_jobs')
            .update({
                status: newStatus,
                error_message: err.message,
                // If retrying, reschedule 30 min later
                scheduled_for: newStatus === 'pending'
                    ? new Date(Date.now() + 30 * 60 * 1000).toISOString()
                    : undefined
            })
            .eq('id', job.id);
    }
}
