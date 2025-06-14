// pages/ResetPassword.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/utils/supabase';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords don't match",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });

            if (error) throw error;

            toast({
                title: "Success",
                description: "Password updated successfully",
                variant: "default",
            });
            navigate('/');
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to update password",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold">Reset Your Password</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </div>
        </div>
    );
};