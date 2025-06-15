import { supabase } from "@/lib/utils/supabase";
import { useState } from "react";

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

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
      const randomPassword = Math.random().toString(36).slice(-8);

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
          emailRedirectTo: `${window.location.origin}/auth/reset-password`
        }
      });

      if (authError) throw authError;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(userData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (resetError) throw resetError;

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
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, addUser, removeUser, resetUserPassword, fetchUsers };
};