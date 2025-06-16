import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/useUsers';
import { supabase } from '@/lib/utils/supabase';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const EditProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUserProfile } = useUsers();
    const { toast } = useToast();

    // Get profile data from location state
    const [profile, setProfile] = useState(location.state?.profile || {
        id: '',
        name: '',
        phone: '',
        department: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('name, phone, department')
                    .eq('id', user.id)
                    .single();
                if (data) setProfile(data);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUserProfile({
                name: profile.name,
                phone: profile.phone,
                department: profile.department
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
        }
    };

    return (
        <div className="mt-10 container mx-auto p-6 max-w-2xl dmsans-regular border border-zinc-200 rounded-xl my-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Input
                        id="department"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
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
                    <Button className='bg-emerald-100 text-emerald-500 hover:bg-emerald-200 hover:text-emerald-600' type="submit">Save Changes</Button>
                </div>
            </form>
        </div>
    );
};