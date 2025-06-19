// api/send-email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const body = await req.json();
        const { to, subject, html } = body;

        const result = await resend.emails.send({
            from: 'mail@helpdesk.bumiauto.works',
            to,
            subject,
            html,
        });

        return new Response(JSON.stringify({ success: true, result }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
