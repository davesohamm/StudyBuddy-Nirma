'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CreateAssignmentModal from '../../components/admin/CreateAssignmentModal';
import AssignmentDetailsModal from '../../components/admin/AssignmentDetailsModal';
import RegisteredUsers from '../../components/admin/RegisteredUsers';
import EmailTester from '../../components/admin/EmailTester';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Mail, 
  Calendar, 
  Edit3, 
  Trash2, 
  Eye, 
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Download,
  BarChart3
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  faculty: string;
  dueDate: string;
  marks: number;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'cancelled';
  submissionType: 'individual' | 'group';
  emailSent: boolean;
  studentsNotified: number;
  createdAt: string;
}

interface CreateAssignmentData {
  title: string;
  subject: string;
  faculty: string;
  dueDate: string;
  marks: number;
  instructions: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  submissionType: 'individual' | 'group';
  groupSize?: number;
  allowLateSubmission: boolean;
  latePenalty?: number;
  tags: string[];
  sendEmailNotification: boolean;
}

export default function AdminDashboard() {
  const { user, token, isLoading: loading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!user || (user as any).role !== 'admin')) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      const authToken = token || storedToken;
      console.log('🔐 Admin Auth Debug:', {
        hasToken: !!token,
        hasStoredToken: !!storedToken,
        authToken: authToken ? authToken.substring(0, 20) + '...' : 'none',
        userRole: user?.role
      });
      
      if (!authToken) {
        console.error('❌ No authentication token found');
        setMessage({
          type: 'error',
          text: 'Authentication token not found. Please logout and login again.'
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/admin/assignments', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssignments(data.data.assignments);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch assignments:', errorData);
        setMessage({
          type: 'error',
          text: errorData.message || 'Failed to fetch assignments'
        });
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setMessage({
        type: 'error',
        text: 'Network error while fetching assignments'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAssignments();
    }
  }, [user]);

  // Create assignment
  const handleCreateAssignment = async (assignmentData: CreateAssignmentData) => {
    setIsCreating(true);
    try {
      const storedToken = localStorage.getItem('token');
      const authToken = token || storedToken;
      
      console.log('🚀 Creating assignment:', {
        authToken: authToken ? authToken.substring(0, 20) + '...' : 'none',
        assignmentData
      });
      
      const response = await fetch('/api/admin/assignments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignmentData)
      });

      const data = await response.json();
      
      console.log('📝 Assignment API Response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Assignment created successfully! ${data.data.emailNotification?.sent ? 
            `Emails sent to ${data.data.emailNotification.totalRecipients} students.` : 
            'No email notifications sent.'}`
        });
        setShowCreateForm(false);
        fetchAssignments(); // Refresh the list
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to create assignment'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please try again.'
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Delete assignment
  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const storedToken = localStorage.getItem('token');
      const authToken = token || storedToken;
      const response = await fetch(`/api/admin/assignments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Assignment deleted successfully!'
        });
        fetchAssignments();
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to delete assignment'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please try again.'
      });
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesFilter = filter === 'all' || assignment.status === filter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-gray-600">Manage assignments and send notifications</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user.profile?.firstName} {user.profile?.lastName}</span>
              </div>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-semibold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments.filter(a => a.emailSent).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments.filter(a => a.priority === 'high').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Create Assignment Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Assignment
            </motion.button>
          </div>
        </div>

        {/* Message Alert */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                {message.text}
                <button
                  onClick={() => setMessage(null)}
                  className="ml-auto text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assignments List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Assignments ({filteredAssignments.length})
            </h2>
          </div>

          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first assignment.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssignments.map((assignment, index) => (
                    <motion.tr
                      key={assignment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                          <div className="text-sm text-gray-500">{assignment.faculty}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assignment.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(assignment.dueDate).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(assignment.status)}`}>
                          {assignment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {assignment.emailSent ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Sent to {assignment.studentsNotified}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-400">
                              <Mail className="h-4 w-4 mr-1" />
                              <span className="text-xs">Not sent</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedAssignment(assignment)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {/* TODO: Edit functionality */}}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Email Configuration Test Section */}
        <div className="mt-8">
          <EmailTester />
        </div>

        {/* Registered Users Section */}
        <div className="mt-8">
          <RegisteredUsers />
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <CreateAssignmentModal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateAssignment}
          isLoading={isCreating}
        />
      )}

      {/* Assignment Details Modal */}
      {selectedAssignment && (
        <AssignmentDetailsModal
          assignment={selectedAssignment}
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  );
}


 