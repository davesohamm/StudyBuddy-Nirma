'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  User,
  Mail,
  AlertCircle,
  BookOpen,
  Hash,
  FileText,
  Flag,
  Tag
} from 'lucide-react';

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

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssignmentData) => void;
  isLoading: boolean;
}

export default function CreateAssignmentModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading 
}: CreateAssignmentModalProps) {
  const [formData, setFormData] = useState<CreateAssignmentData>({
    title: '',
    subject: '',
    faculty: '',
    dueDate: '',
    marks: 10,
    instructions: '',
    priority: 'medium',
    estimatedHours: undefined,
    submissionType: 'individual',
    groupSize: undefined,
    allowLateSubmission: false,
    latePenalty: undefined,
    tags: [],
    sendEmailNotification: true
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined subjects for quick selection
  const subjects = [
    'Data Structures & Algorithms',
    'Machine Learning',
    'Big Data Analytics',
    'Statistics & Probability',
    'Database Systems',
    'Computer Networks',
    'Software Engineering',
    'Artificial Intelligence',
    'Capstone Project',
    'Research Methodology'
  ];

  // Predefined faculty names
  const facultyMembers = [
    'Dr. Smith Johnson',
    'Prof. Sarah Wilson',
    'Dr. Michael Brown',
    'Prof. Emily Davis',
    'Dr. Robert Miller',
    'Prof. Jessica Garcia',
    'Dr. David Rodriguez',
    'Prof. Lisa Thompson',
    'Dr. James Martinez',
    'Prof. Maria Lopez'
  ];

  const handleInputChange = (field: keyof CreateAssignmentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.faculty.trim()) newErrors.faculty = 'Faculty name is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (formData.marks < 1 || formData.marks > 100) newErrors.marks = 'Marks must be between 1 and 100';
    if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
    
    // Validate due date is in the future
    if (formData.dueDate && new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = 'Due date must be in the future';
    }

    // Validate group assignment fields
    if (formData.submissionType === 'group') {
      if (!formData.groupSize || formData.groupSize < 2) {
        newErrors.groupSize = 'Group size must be at least 2';
      }
    }

    // Validate late submission fields
    if (formData.allowLateSubmission) {
      if (formData.latePenalty === undefined || formData.latePenalty < 0 || formData.latePenalty > 100) {
        newErrors.latePenalty = 'Late penalty must be between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      faculty: '',
      dueDate: '',
      marks: 10,
      instructions: '',
      priority: 'medium',
      estimatedHours: undefined,
      submissionType: 'individual',
      groupSize: undefined,
      allowLateSubmission: false,
      latePenalty: undefined,
      tags: [],
      sendEmailNotification: true
    });
    setTagInput('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create New Assignment</h2>
                  <p className="text-sm text-gray-600">Fill in the details to create and notify students</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Assignment Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Binary Search Tree Implementation"
                      disabled={isLoading}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        list="subjects"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.subject ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Select or type subject"
                        disabled={isLoading}
                      />
                      <datalist id="subjects">
                        {subjects.map((subject) => (
                          <option key={subject} value={subject} />
                        ))}
                      </datalist>
                    </div>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Faculty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faculty Name *
                    </label>
                    <input
                      type="text"
                      list="faculty"
                      value={formData.faculty}
                      onChange={(e) => handleInputChange('faculty', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.faculty ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Select or type faculty name"
                      disabled={isLoading}
                    />
                    <datalist id="faculty">
                      {facultyMembers.map((faculty) => (
                        <option key={faculty} value={faculty} />
                      ))}
                    </datalist>
                    {errors.faculty && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.faculty}
                      </p>
                    )}
                  </div>

                  {/* Due Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date & Time *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="datetime-local"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.dueDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.dueDate}
                      </p>
                    )}
                  </div>

                  {/* Marks & Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Marks *
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={formData.marks}
                          onChange={(e) => handleInputChange('marks', parseInt(e.target.value))}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.marks ? 'border-red-300' : 'border-gray-300'
                          }`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.marks && (
                        <p className="mt-1 text-sm text-red-600 text-xs">
                          {errors.marks}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <div className="relative">
                        <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          value={formData.priority}
                          onChange={(e) => handleInputChange('priority', e.target.value as 'low' | 'medium' | 'high')}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          disabled={isLoading}
                        >
                          <option value="low">🟢 Low</option>
                          <option value="medium">🟡 Medium</option>
                          <option value="high">🔴 High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <textarea
                        value={formData.instructions}
                        onChange={(e) => handleInputChange('instructions', e.target.value)}
                        rows={6}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                          errors.instructions ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Provide detailed instructions for the assignment..."
                        disabled={isLoading}
                      />
                    </div>
                    {errors.instructions && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.instructions}
                      </p>
                    )}
                  </div>

                  {/* Estimated Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Hours (Optional)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        min="0.5"
                        max="100"
                        step="0.5"
                        value={formData.estimatedHours || ''}
                        onChange={(e) => handleInputChange('estimatedHours', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., 8"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Submission Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submission Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('submissionType', 'individual')}
                        className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                          formData.submissionType === 'individual'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        disabled={isLoading}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Individual
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('submissionType', 'group')}
                        className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                          formData.submissionType === 'group'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        disabled={isLoading}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Group
                      </button>
                    </div>
                  </div>

                  {/* Group Size (if group assignment) */}
                  {formData.submissionType === 'group' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Group Size *
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="10"
                        value={formData.groupSize || ''}
                        onChange={(e) => handleInputChange('groupSize', parseInt(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.groupSize ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 4"
                        disabled={isLoading}
                      />
                      {errors.groupSize && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.groupSize}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Late Submission */}
                  <div>
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="allowLateSubmission"
                        checked={formData.allowLateSubmission}
                        onChange={(e) => handleInputChange('allowLateSubmission', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={isLoading}
                      />
                      <label htmlFor="allowLateSubmission" className="ml-2 text-sm font-medium text-gray-700">
                        Allow Late Submission
                      </label>
                    </div>

                    {formData.allowLateSubmission && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Late Penalty (% per day) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.latePenalty || ''}
                          onChange={(e) => handleInputChange('latePenalty', parseFloat(e.target.value))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.latePenalty ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 10"
                          disabled={isLoading}
                        />
                        {errors.latePenalty && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.latePenalty}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Add a tag"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Email Notification */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sendEmailNotification"
                    checked={formData.sendEmailNotification}
                    onChange={(e) => handleInputChange('sendEmailNotification', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="sendEmailNotification" className="ml-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-900">
                        Send email notifications to all students
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Automatically notify all registered students about this assignment via email
                    </p>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Create Assignment
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
} 