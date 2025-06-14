// server.ts
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

app.post('/api/invite-user', async (req, res) => {
    const { email, name, phone, role } = req.body;

    try {
        // Invite user via email
        const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            data: { name, phone, role },
            redirectTo: `${process.env.VITE_SITE_URL}/auth/callback?next=/reset-password`
        });

        if (error) throw error;

        // Add to profiles table
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: data.user?.id,
                email,
                name,
                phone,
                role,
            });

        if (profileError) throw profileError;

        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});