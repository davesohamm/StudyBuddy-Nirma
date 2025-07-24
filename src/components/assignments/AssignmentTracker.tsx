'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle, Calendar, User, BookOpen, Target, Tag } from 'lucide-react';

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

export default function AssignmentTracker() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📚 Assignment Tracker
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📚 Assignment Tracker
        </h2>
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading assignments</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📚 Assignment Tracker
        </h2>
        <div className="text-center py-8">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments yet</h3>
          <p className="mt-1 text-sm text-gray-500">Your assignments will appear here when created by admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📚 Assignment Tracker
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {/* Assignment Cards */}
      <div className="p-6 space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {assignment.title}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(assignment.priority)}`}>
                    {assignment.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="ml-4">
                <span className={`px-3 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 ${getStatusColor(assignment.isOverdue, assignment.daysRemaining)}`}>
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

            {/* Subject, Faculty, Marks Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{assignment.subject}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4 text-green-500" />
                <span>{assignment.faculty}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Target className="h-4 w-4 text-purple-500" />
                <span className="font-medium">{assignment.marks} marks</span>
              </div>
            </div>

            {/* Instructions */}
            {assignment.instructions && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {assignment.instructions}
                </p>
              </div>
            )}

            {/* Due Date and Details Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{assignment.formattedDueDate}</span>
              </div>
              {assignment.estimatedHours && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{assignment.estimatedHours}h estimated</span>
                </div>
              )}
              <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                {assignment.submissionType}
              </div>
            </div>

            {/* Tags */}
            {assignment.tags && assignment.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {assignment.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 