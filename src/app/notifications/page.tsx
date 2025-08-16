'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Clock, 
  Calendar, 
  User, 
  BookOpen, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft,
  FileText,
  Hash,
  Flag,
  Tag,
  Users,
  Award
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  faculty: string;
  dueDate: string;
  marks: number;
  instructions: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  tags: string[];
  estimatedHours?: number;
  submissionType: 'individual' | 'group';
  groupSize?: number;
  allowLateSubmission: boolean;
  latePenalty?: number;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
  daysRemaining: number;
  isOverdue: boolean;
  formattedDueDate: string;
}

export default function NotificationsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue'>('all');

  // Fetch assignments from API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/assignments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }

        const data = await response.json();
        
        if (data.success) {
          setAssignments(data.data.assignments || []);
          console.log('📚 Assignments loaded:', data.data.assignments);
        } else {
          setError(data.message || 'Failed to load assignments');
        }
      } catch (err) {
        console.error('❌ Error fetching assignments:', err);
        setError(err instanceof Error ? err.message : 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (isOverdue: boolean, daysRemaining: number) => {
    if (isOverdue) return 'text-red-700 bg-red-50 border-red-200';
    if (daysRemaining <= 1) return 'text-orange-700 bg-orange-50 border-orange-200';
    if (daysRemaining <= 3) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-blue-700 bg-blue-50 border-blue-200';
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'upcoming') return !assignment.isOverdue;
    if (filter === 'overdue') return assignment.isOverdue;
    return true;
  });

  const upcomingCount = assignments.filter(a => !a.isOverdue).length;
  const overdueCount = assignments.filter(a => a.isOverdue).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading assignments</h3>
              <p className="mt-2 text-gray-600">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Assignment Notifications
            </h1>
            <p className="text-xl text-gray-600">
              Stay updated with all your assignments and deadlines
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                  <p className="text-3xl font-bold text-gray-900">{assignments.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-green-600">{upcomingCount}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              {[
                { key: 'all', label: 'All', count: assignments.length },
                { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
                { key: 'overdue', label: 'Overdue', count: overdueCount }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.key
                      ? 'bg-white bg-opacity-20'
                      : 'bg-gray-100'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Assignments List */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No assignments found</h3>
                <p className="mt-2 text-gray-600">
                  {filter === 'all' 
                    ? 'No assignments have been created yet.' 
                    : filter === 'upcoming' 
                      ? 'No upcoming assignments.' 
                      : 'No overdue assignments.'
                  }
                </p>
              </div>
            ) : (
              filteredAssignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            {assignment.title}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(assignment.priority)}`}>
                            {assignment.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{assignment.subject}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-500" />
                            <span>{assignment.faculty}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-purple-500" />
                            <span>{assignment.marks} marks</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="ml-4">
                        <span className={`px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 ${getStatusColor(assignment.isOverdue, assignment.daysRemaining)}`}>
                          {assignment.isOverdue ? (
                            <>
                              <AlertCircle className="h-4 w-4" />
                              Overdue
                            </>
                          ) : assignment.daysRemaining === 0 ? (
                            <>
                              <Clock className="h-4 w-4" />
                              Due Today
                            </>
                          ) : assignment.daysRemaining === 1 ? (
                            <>
                              <Clock className="h-4 w-4" />
                              Due Tomorrow
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4" />
                              {assignment.daysRemaining} days left
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Instructions
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {assignment.instructions}
                          </p>
                        </div>

                        {assignment.tags.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {assignment.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-xs font-medium text-gray-600">Due Date</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {assignment.formattedDueDate}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="text-xs font-medium text-gray-600">Type</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 capitalize">
                              {assignment.submissionType}
                              {assignment.submissionType === 'group' && assignment.groupSize && (
                                <span className="text-gray-500 ml-1">({assignment.groupSize} students)</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {assignment.allowLateSubmission && (
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              <span className="text-xs font-medium text-orange-700">Late Submission</span>
                            </div>
                            <p className="text-sm text-orange-800">
                              Allowed with {assignment.latePenalty}% penalty
                            </p>
                          </div>
                        )}

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">Created By</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {assignment.createdBy.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {assignment.createdBy.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 