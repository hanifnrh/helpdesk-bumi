import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/utils/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const EnterTokenSignUp = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'recovery'
            });

            if (error) throw error;

            toast({
                title: "Token Verified",
                description: "You can now set your new password",
            });
            navigate('/auth/set-password');
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Invalid token. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dmsans-regular flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">Enter Sign Up Token</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email address"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="token">Sign Up Token</Label>
                        <Input
                            id="token"
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            placeholder="Enter the 6-digit token from your email"
                            className="w-full p-2 border rounded-md"
                        />
                        <p className="text-sm text-gray-500">
                            Check your email for sign up token
                        </p>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 font-semibold"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify Token"}
                    </Button>
                </form>
            </div>
        </div>
    );
};