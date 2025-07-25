import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/useUsers';
import { supabase } from '@/lib/utils/supabase';
import { Key } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const EditProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUserProfile, dropdownOptions, loading: dropdownsLoading } = useUsers();
    const { toast } = useToast();

    // State for profile data
    const [profile, setProfile] = useState(location.state?.profile || {
        id: '',
        name: '',
        phone: '',
        department: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                try {
                    setLoading(true);

                    // Fetch profile data
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('name, email, phone, department')
                        .eq('id', user.id)
                        .single();

                    if (profileError) throw profileError;

                    if (profileData) {
                        setProfile({
                            ...profileData,
                            department: profileData.department?.toString() || ''
                        });
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    toast({
                        title: "Error",
                        description: "Failed to load profile data",
                        variant: "destructive",
                    });
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateUserProfile({
                name: profile.name,
                phone: profile.phone,
                department: profile.department ? parseInt(profile.department) : null
            });
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
            navigate(-1); // Go back to previous page
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (userEmail: string, userName: string) => {
        try {
            // Updated to use the new auth method (v2)
            const { data, error } = await supabase.auth.resetPasswordForEmail(userEmail, {
                redirectTo: `${window.location.origin}/auth/handle-reset`
            });

            if (error) throw error;

            toast({
                title: "Password Reset Sent",
                description: `A password reset link has been sent to ${userName}'s email (${userEmail}).`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send password reset",
                variant: "destructive",
            });
        }
    };

    return (
        <div className='p-4 my-10'>
            <div className="container mx-auto p-6 max-w-2xl dmsans-regular border border-zinc-200 rounded-xl my-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Email <span className='text-red-500'>(cannot be changed)</span></Label>
                        <Input
                            id="name"
                            value={profile.email}
                            disabled
                        />
                    </div>
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="department">Department</Label>
                        <Combobox
                            options={dropdownOptions.departments.map(d => ({
                                value: d.id.toString(),
                                label: d.name
                            }))}
                            value={profile.department?.toString() || ""}
                            onValueChange={(value) => setProfile({ ...profile, department: value })}
                            placeholder="Select department"
                            disabled={dropdownsLoading || loading}
                        />
                    </div>
                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className='bg-emerald-100 text-emerald-500 hover:bg-emerald-200 hover:text-emerald-600'
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
                <div className='pt-10'>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-auto w-full p-2 bg-purple-200 text-purple-700 hover:bg-purple-300 hover:text-purple-800 border-purple-300 border-2"
                        onClick={() => handleResetPassword(profile.email, profile.name)}
                        disabled={loading}
                    >
                        Reset Password
                        <Key className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
};