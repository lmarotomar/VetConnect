// VetConnect — Supabase Edge Function
// Handles IMMEDIATE messages (appointment confirmation on creation)
// Called directly from app.js triggerAutomation → no queue needed

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MESSAGING_AGENT_URL = Deno.env.get('MESSAGING_AGENT_URL')!;
const MESSAGING_AGENT_SECRET = Deno.env.get('MESSAGING_AGENT_SECRET')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

Deno.serve(async (req) => {
    // Validate caller
    const auth = req.headers.get('Authorization');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!auth || auth !== `Bearer ${supabaseAnonKey}`) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();
    const { type, appointment } = body;

    if (!type || !appointment) {
        return new Response(JSON.stringify({ error: 'Missing type or appointment' }), { status: 400 });
    }

    const payload = {
        jobType: type,
        jobId: null, // Immediate — no scheduled_jobs entry
        recipient: {
            phone: appointment.client?.phone,
            name: appointment.client?.name,
            email: appointment.client?.email
        },
        appointment: {
            id: appointment.id,
            date: appointment.appointment_date,
            time: appointment.appointment_time,
            type: appointment.type,
            petName: appointment.patient?.name || 'tu mascota'
        }
    };

    if (!payload.recipient.phone) {
        return new Response(JSON.stringify({ error: 'No phone number for client' }), { status: 422 });
    }

    try {
        const response = await fetch(MESSAGING_AGENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MESSAGING_AGENT_SECRET}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Log communication
        if (appointment.client?.id) {
            await supabase.from('communications').insert({
                client_id: appointment.client.id,
                channel: 'whatsapp',
                type,
                content: `Immediate ${type} sent`,
                status: response.ok ? 'sent' : 'failed',
                sent_at: new Date().toISOString(),
                external_id: result.messageId || null
            });
        }

        return new Response(JSON.stringify(result), { status: response.ok ? 200 : 502 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
});
