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
      // First sign up the user with a default password
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: 'temporary-password', // This will be reset
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          name: userData.name,
          role: userData.role
        }
      });

      if (authError) throw authError;

      // Then insert their profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role
        });

      if (profileError) throw profileError;

      // Send password reset email
      const { error: resetError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: userData.email,
      });

      if (resetError) throw resetError;

      return authData.user;
    } catch (error) {
      console.error('Error adding user:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId) => {
    setLoading(true);
    try {
      // First delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      // Then delete from profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Refresh user list
      await fetchUsers();
    } catch (error) {
      console.error('Error removing user:', error.message);
      throw error;
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