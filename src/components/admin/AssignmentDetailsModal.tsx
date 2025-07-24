'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  User,
  Mail,
  BookOpen,
  Hash,
  FileText,
  Flag,
  Tag,
  CheckCircle,
  AlertCircle,
  Eye
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

interface AssignmentDetailsModalProps {
  assignment: Assignment;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssignmentDetailsModal({ 
  assignment, 
  isOpen, 
  onClose 
}: AssignmentDetailsModalProps) {
  // Get priority color and emoji
  const getPriorityDisplay = (priority: string) => {
    switch (priority) {
      case 'high': return { color: 'text-red-600', bg: 'bg-red-100', emoji: '🔴' };
      case 'medium': return { color: 'text-yellow-600', bg: 'bg-yellow-100', emoji: '🟡' };
      case 'low': return { color: 'text-green-600', bg: 'bg-green-100', emoji: '🟢' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', emoji: '⚪' };
    }
  };

  // Get status color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active': return { color: 'text-blue-600', bg: 'bg-blue-100', text: 'Active' };
      case 'completed': return { color: 'text-green-600', bg: 'bg-green-100', text: 'Completed' };
      case 'cancelled': return { color: 'text-gray-600', bg: 'bg-gray-100', text: 'Cancelled' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', text: 'Unknown' };
    }
  };

  const priorityDisplay = getPriorityDisplay(assignment.priority);
  const statusDisplay = getStatusDisplay(assignment.status);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-xl">
              <div className="flex items-center">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Assignment Details</h2>
                  <p className="text-indigo-100 text-sm">View assignment information</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title & Status */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{assignment.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityDisplay.bg} ${priorityDisplay.color}`}>
                      {priorityDisplay.emoji} {assignment.priority.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                      {statusDisplay.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignment Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Subject</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.subject}</p>
                  </div>
                </div>

                {/* Faculty */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Faculty</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.faculty}</p>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(assignment.dueDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Marks */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Hash className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Marks</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.marks}</p>
                  </div>
                </div>

                {/* Submission Type */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  {assignment.submissionType === 'individual' ? (
                    <User className="h-5 w-5 text-gray-600 mr-3" />
                  ) : (
                    <Users className="h-5 w-5 text-gray-600 mr-3" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Submission Type</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{assignment.submissionType}</p>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Created</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Status */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Email Notification Status</h4>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email Notifications</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {assignment.emailSent ? (
                          <span className="text-green-600">✅ Sent successfully</span>
                        ) : (
                          <span className="text-gray-500">📧 Not sent yet</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {assignment.emailSent && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">Students Notified</p>
                      <p className="text-2xl font-bold text-indigo-600">{assignment.studentsNotified}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Time Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Time Remaining */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Time Remaining</p>
                        <p className="text-lg font-semibold text-blue-900">
                          {(() => {
                            const now = new Date();
                            const due = new Date(assignment.dueDate);
                            const diffMs = due.getTime() - now.getTime();
                            
                            if (diffMs <= 0) return 'Overdue';
                            
                            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            
                            if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
                            if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
                            
                            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                            return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Urgency Level */}
                  <div className={`p-4 rounded-lg border ${(() => {
                    const now = new Date();
                    const due = new Date(assignment.dueDate);
                    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
                    
                    if (diffHours < 0) return 'bg-red-50 border-red-200';
                    if (diffHours <= 24) return 'bg-orange-50 border-orange-200';
                    if (diffHours <= 72) return 'bg-yellow-50 border-yellow-200';
                    return 'bg-green-50 border-green-200';
                  })()}`}>
                    <div className="flex items-center">
                      <AlertCircle className={`h-5 w-5 mr-2 ${(() => {
                        const now = new Date();
                        const due = new Date(assignment.dueDate);
                        const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
                        
                        if (diffHours < 0) return 'text-red-600';
                        if (diffHours <= 24) return 'text-orange-600';
                        if (diffHours <= 72) return 'text-yellow-600';
                        return 'text-green-600';
                      })()}`} />
                      <div>
                        <p className={`text-sm font-medium ${(() => {
                          const now = new Date();
                          const due = new Date(assignment.dueDate);
                          const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
                          
                          if (diffHours < 0) return 'text-red-800';
                          if (diffHours <= 24) return 'text-orange-800';
                          if (diffHours <= 72) return 'text-yellow-800';
                          return 'text-green-800';
                        })()}`}>Urgency Level</p>
                        <p className={`text-lg font-semibold ${(() => {
                          const now = new Date();
                          const due = new Date(assignment.dueDate);
                          const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
                          
                          if (diffHours < 0) return 'text-red-900';
                          if (diffHours <= 24) return 'text-orange-900';
                          if (diffHours <= 72) return 'text-yellow-900';
                          return 'text-green-900';
                        })()}`}>
                          {(() => {
                            const now = new Date();
                            const due = new Date(assignment.dueDate);
                            const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
                            
                            if (diffHours < 0) return 'OVERDUE';
                            if (diffHours <= 24) return 'URGENT';
                            if (diffHours <= 72) return 'SOON';
                            return 'NORMAL';
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
} 