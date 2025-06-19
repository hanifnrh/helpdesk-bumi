import { Resend } from 'resend';

const resend = new Resend(process.env.VITE_RESEND_API_KEY || 'REPLACE_WITH_API_KEY');

export default async (req: Request): Promise<Response> => {
    const body = await req.json();
    const { to, subject, html } = body;

    try {
        const sent = await resend.emails.send({
            from: 'mail@helpdes.bumiauto.works',
            to,
            subject,
            html,
        });

        return new Response(JSON.stringify({ success: true, sent }), {
            status: 200,
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
        });
    }
};
