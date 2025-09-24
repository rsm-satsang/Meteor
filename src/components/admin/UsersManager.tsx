import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Crown, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DataTable from './DataTable';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  age_group: 'preteens' | 'teens' | 'young_adults';
  gender?: string;
  city?: string;
  country?: string;
  role: 'user' | 'admin';
  consent_given: boolean;
  created_at: string;
}

const UsersManager = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const getRoleBadge = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      return (
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <Crown className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <User className="h-3 w-3 mr-1" />
        User
      </Badge>
    );
  };

  const getAgeGroupBadge = (ageGroup: string) => {
    const colors = {
      preteens: 'bg-blue-500',
      teens: 'bg-green-500',
      young_adults: 'bg-purple-500'
    };
    
    return (
      <Badge className={`${colors[ageGroup as keyof typeof colors]} text-white`}>
        {ageGroup.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const columns = [
    { key: 'full_name', label: 'Name' },
    {
      key: 'age',
      label: 'Age & Group',
      render: (age: number, row: Profile) => (
        <div className="space-y-1">
          <div className="font-medium">{age} years</div>
          {getAgeGroupBadge(row.age_group)}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (_, row: Profile) => {
        const parts = [row.city, row.country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : '-';
      }
    },
    {
      key: 'role',
      label: 'Role',
      render: (role: 'user' | 'admin') => getRoleBadge(role)
    },
    {
      key: 'consent_given',
      label: 'Consent',
      render: (consent: boolean) => (
        <Badge variant={consent ? 'default' : 'destructive'}>
          {consent ? 'Given' : 'Not Given'}
        </Badge>
      )
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Manager</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card/90 backdrop-blur-sm border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            Total Users
          </div>
          <div className="text-2xl font-bold">{users.length}</div>
        </div>
        
        <div className="bg-card/90 backdrop-blur-sm border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Crown className="h-4 w-4" />
            Admins
          </div>
          <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
        </div>

        <div className="bg-card/90 backdrop-blur-sm border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <User className="h-4 w-4" />
            Regular Users
          </div>
          <div className="text-2xl font-bold">{users.filter(u => u.role === 'user').length}</div>
        </div>

        <div className="bg-card/90 backdrop-blur-sm border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Consent Given</div>
          <div className="text-2xl font-bold">{users.filter(u => u.consent_given).length}</div>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search users by name, city, or email..."
        actions={(user) => (
          <div className="flex gap-2">
            <Select
              value={user.role}
              onValueChange={(newRole: 'user' | 'admin') => updateUserRole(user.user_id, newRole)}
            >
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      />
    </div>
  );
};

export default UsersManager;