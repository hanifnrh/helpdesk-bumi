
import { useState, useEffect } from 'react';
import { User, UserFormData } from '@/types/auth';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock users for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      { id: '1', email: 'admin@company.com', password: 'admin123', name: 'Admin User', phone: '+6281234567890', role: 'admin' },
      { id: '2', email: 'user@company.com', password: 'kerjaibadah', name: 'Regular User', phone: '+6281234567891', role: 'user' },
      { id: '3', email: 'alice@company.com', password: 'kerjaibadah', name: 'Alice Johnson', phone: '+6281234567892', role: 'user' },
    ];
    setUsers(mockUsers);
  }, []);

  const addUser = (userData: UserFormData) => {
    setLoading(true);
    const newUser: User = {
      id: crypto.randomUUID(),
      ...userData,
      password: 'kerjaibadah' // Default password
    };
    
    setTimeout(() => {
      setUsers(prev => [...prev, newUser]);
      setLoading(false);
    }, 500);
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const resetUserPassword = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, password: 'kerjaibadah' }
          : user
      )
    );
  };

  return {
    users,
    loading,
    addUser,
    removeUser,
    resetUserPassword
  };
};
