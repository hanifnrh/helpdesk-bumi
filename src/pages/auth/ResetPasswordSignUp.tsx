import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/utils/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordSignUp = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords don't match",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });

            if (error) throw error;

            toast({
                title: "Success",
                description: "Your password has been updated successfully",
            });
            navigate('/');
        } catch (error: any) {
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
        <div className="dmsans-regular flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">Set Your Password</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="password">Set Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="Enter your password (min 6 characters)"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="Confirm your password"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 font-semibold"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
};