'use client';

import { Assignment } from '@/types';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

// Mock assignment data
const mockAssignments: Assignment[] = [
  {
    id: 'assign1',
    courseId: 'course2',
    title: 'ML Assignment 1 - Linear Regression',
    description: 'Implement linear regression from scratch using Python',
    dueDate: new Date('2024-01-20'),
    status: 'pending',
    maxMarks: 100,
    type: 'assignment'
  },
  {
    id: 'assign2',
    courseId: 'course5',
    title: 'Statistics Quiz 1',
    description: 'Covers probability distributions and hypothesis testing',
    dueDate: new Date('2024-01-22'),
    status: 'pending',
    maxMarks: 50,
    type: 'quiz'
  },
  {
    id: 'assign3',
    courseId: 'course1',
    title: 'DSA Lab Exercise 2',
    description: 'Graph algorithms implementation',
    dueDate: new Date('2024-01-18'),
    status: 'submitted',
    maxMarks: 75,
    type: 'assignment',
    submissionDate: new Date('2024-01-17')
  }
];

export default function AssignmentTracker() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'graded': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'submitted': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Assignment Tracker</h3>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mockAssignments.map((assignment) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);
          
          return (
            <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {assignment.title}
                </h4>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                  {getStatusIcon(assignment.status)}
                  {assignment.status}
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {assignment.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Due: {formatDate(assignment.dueDate)}</span>
                {assignment.status === 'pending' && (
                  <span className={daysUntilDue <= 1 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                    {daysUntilDue > 0 ? `${daysUntilDue} days left` : 'Overdue'}
                  </span>
                )}
                {assignment.status === 'submitted' && assignment.submissionDate && (
                  <span className="text-green-600">
                    Submitted {formatDate(assignment.submissionDate)}
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Max Marks: {assignment.maxMarks}</span>
                  <button className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                    {assignment.status === 'pending' ? 'Submit' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full btn-primary text-sm">
          Add New Assignment
        </button>
      </div>
    </div>
  );
} 