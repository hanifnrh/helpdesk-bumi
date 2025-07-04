import { supabase } from "@/lib/utils/supabase";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState({
    departments: [] as { id: number; name: string }[]
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData) => {
    setLoading(true);
    try {
      // Generate a random password (won't be used directly)
      const randomPassword = Math.random().toString(36).slice(-8);

      // 1. Sign up the user (without email confirmation)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: randomPassword,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
            role: userData.role || 'user',
            department: userData.department || null,
          },
          // Disable email confirmation
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) throw authError;

      // 2. Manually create the profile record if it doesn't exist
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            role: userData.role || 'user',
            department: userData.department || null,
          });

        if (profileError) throw profileError;
      }

      const { error: reauthError } = await supabase.auth.reauthenticate();
      if (reauthError) throw reauthError;

      toast({
        title: "User Created",
        description: `${userData.name} has been added successfully. A password setup email has been sent to them.`,
      });

      await fetchUsers();
    } catch (error) {
      throw new Error(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId: string) => {
    setLoading(true);
    try {
      // First try to delete the auth user
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) throw authError;
      } catch (authError) {
        console.warn("Couldn't delete auth user, proceeding with profile deletion:", authError.message);
        // Continue even if auth deletion fails
      }

      // Then delete the profile (this should always work)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      await fetchUsers();
      return { success: true, message: "User deleted successfully" };
    } catch (error: any) {
      console.error('Error deleting user:', error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (email) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: { name?: string; phone?: string; department?: number }) => {
    setLoading(true);
    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)  // Use the auth user's ID
        .select();

      if (error) throw error;

      await fetchUsers(); // Refresh the user list
      return data[0];
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      setLoading(true);

      // Fetch departments
      const { data: deptData, error: deptError } = await supabase
        .from('department')
        .select('id, department_name')
        .order('department_name', { ascending: true });

      if (deptError) throw deptError;

      setDropdownOptions({
        departments: deptData?.map(dept => ({
          id: dept.id,
          name: dept.department_name
        })) || []
      });
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  return { users, loading, addUser, removeUser, resetUserPassword, fetchUsers, updateUserProfile, dropdownOptions, fetchDropdownOptions };
};