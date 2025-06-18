// src/hooks/useProfile.ts
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/utils/supabase";
import { useEffect, useState } from "react";

export const useProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            const fetchProfile = async () => {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('name, email, role, department, phone')
                    .eq('id', user.id)
                    .single();

                if (!error) setProfile(data);
                setLoading(false);
            };
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [user]);

    return { profile, loading };
};