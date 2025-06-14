import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/useUsers';
import { Mail, Phone, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const UserManagement = () => {
  const { users, loading, addUser, removeUser, resetUserPassword, fetchUsers } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '+62',
    role: 'user'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await addUser(formData);
      setFormData({ email: '', name: '', phone: '+62', role: 'user' });
      setIsModalOpen(false);
      toast({
        title: "User Created",
        description: `${formData.name} has been added successfully. A password set email has been sent to them.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleRemoveUser = async (userId: string, userName: string) => {
    try {
      await removeUser(userId);
      toast({
        title: "User Removed",
        description: `${userName} has been removed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove user",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (userId: string, userEmail: string) => {
    try {
      await resetUserPassword(userEmail);
      toast({
        title: "Password Reset",
        description: `Password reset email has been sent to ${userEmail}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">User Management</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Manage system users and their permissions</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading && !users.length ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{user.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(user.id, user.email)}
                        className="flex-1"
                        disabled={loading}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset Password
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id, user.name)}
                        disabled={loading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+62812345678"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};