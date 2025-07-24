'use client';

import { useState, useEffect } from 'react';

interface RegisteredUser {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  loginAttempts: number;
}

export default function RegisteredUsers() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/admin/list-all-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.allUsers || []);
        console.log('👥 Fetched users:', data.data.allUsers);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      return;
    }

    try {
      setDeleting(userId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ User ${userEmail} deleted successfully!`);
        fetchUsers(); // Refresh the list
      } else {
        alert(`❌ Failed to delete user: ${data.message}`);
      }
    } catch (err) {
      console.error('❌ Error deleting user:', err);
      alert('❌ Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Registered Users</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Registered Users</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">❌ {error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const studentUsers = users.filter(u => u.role === 'student');
  const adminUsers = users.filter(u => u.role === 'admin');
  const allEmails = users.map(u => u.email);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Registered Users</h2>
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-blue-800">Total Users</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{studentUsers.length}</div>
          <div className="text-sm text-green-800">Students</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{adminUsers.length}</div>
          <div className="text-sm text-purple-800">Admins</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{users.filter(u => u.isActive).length}</div>
          <div className="text-sm text-orange-800">Active Users</div>
        </div>
      </div>

      {/* Email List for Quick Copy */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">📧 All Email Addresses:</h3>
        <div className="bg-white p-3 rounded border text-sm font-mono">
          {allEmails.join(', ')}
        </div>
        <button 
          onClick={() => navigator.clipboard.writeText(allEmails.join(', '))}
          className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
        >
          📋 Copy All Emails
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Last Login</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-500">ID: {user.id.slice(-8)}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-mono text-sm">{user.email}</div>
                  {user.emailVerified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mt-1">
                      ✅ Verified
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role === 'admin' ? '👑' : '🎓'} {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                    {user.isActive ? '🟢 Active' : '🔴 Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                </td>
                <td className="px-4 py-3">
                  {user.role !== 'admin' ? (
                    <button
                      onClick={() => deleteUser(user.id, user.email)}
                      disabled={deleting === user.id}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === user.id ? '⏳' : '🗑️'} Delete
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">Admin protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No registered users found.</p>
        </div>
      )}
    </div>
  );
} 