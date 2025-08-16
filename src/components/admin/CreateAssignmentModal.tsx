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
  Tag,
  ChevronLeft,
  ChevronRight,
  Check
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

// Custom Date Picker Component
function CustomDatePicker({ 
  value, 
  onChange, 
  error, 
  disabled 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  error?: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [selectedTime, setSelectedTime] = useState(value ? new Date(value) : new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const generateCalendarDays = () => {
    const days = [];
    
    // Previous month days
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString()
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const newDateTime = new Date(date);
    newDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
    setSelectedTime(newDateTime);
    
    // Create a proper datetime string without timezone conversion
    const year = newDateTime.getFullYear();
    const month = String(newDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(newDateTime.getDate()).padStart(2, '0');
    const hours = String(newDateTime.getHours()).padStart(2, '0');
    const minutes = String(newDateTime.getMinutes()).padStart(2, '0');
    const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    onChange(datetimeString);
  };

  const handleTimeSelect = (hours: number, minutes: number) => {
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(hours, minutes);
    setSelectedTime(newDateTime);
    
    // Create a proper datetime string without timezone conversion
    const year = newDateTime.getFullYear();
    const month = String(newDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(newDateTime.getDate()).padStart(2, '0');
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const datetimeString = `${year}-${month}-${day}T${hoursStr}:${minutesStr}`;
    
    onChange(datetimeString);
  };

  const formatDisplayValue = () => {
    if (!value) return 'Select date and time';
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      {/* Input Field */}
      <div 
        className={`relative cursor-pointer ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        } border rounded-lg transition-all duration-200`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <div className="pl-10 pr-3 py-2 text-left">
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {formatDisplayValue()}
          </span>
        </div>
        <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Date Picker Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
                         className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 min-w-[600px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  const prevMonth = new Date(currentDate);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setCurrentDate(prevMonth);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
              </div>
              
              <button
                onClick={() => {
                  const nextMonth = new Date(currentDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setCurrentDate(nextMonth);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

                         <div className="grid grid-cols-2 gap-6">
               {/* Calendar Grid */}
               <div>
                 <div className="mb-4">
                   {/* Day Headers */}
                   <div className="grid grid-cols-7 gap-1 mb-2">
                     {days.map((day) => (
                       <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                         {day}
                       </div>
                     ))}
                   </div>

                   {/* Calendar Days */}
                   <div className="grid grid-cols-7 gap-1">
                     {generateCalendarDays().map((day, index) => (
                       <button
                         key={index}
                         onClick={() => day.isCurrentMonth && handleDateSelect(day.date)}
                         disabled={!day.isCurrentMonth}
                         className={`
                           relative p-2 text-sm rounded-lg transition-all duration-200
                           ${day.isCurrentMonth 
                             ? 'hover:bg-blue-50 cursor-pointer' 
                             : 'text-gray-300 cursor-not-allowed'
                           }
                           ${day.isToday 
                             ? 'ring-2 ring-blue-200 bg-blue-50' 
                             : ''
                           }
                           ${day.isSelected 
                             ? 'bg-blue-600 text-white hover:bg-blue-700' 
                             : day.isCurrentMonth 
                               ? 'text-gray-900' 
                               : ''
                           }
                         `}
                       >
                         {day.date.getDate()}
                         {day.isSelected && (
                           <Check className="absolute top-1 right-1 h-3 w-3" />
                         )}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>

               {/* Time Picker */}
               <div>
                 <div className="flex items-center gap-2 mb-3">
                   <Clock className="h-4 w-4 text-gray-500" />
                   <span className="text-sm font-medium text-gray-700">Time</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   {/* Hours */}
                   <div>
                     <label className="text-xs text-gray-500 mb-2 block">Hour</label>
                     <div className="h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                       <div className="space-y-1">
                         {Array.from({ length: 24 }, (_, i) => (
                           <button
                             key={i}
                             onClick={() => handleTimeSelect(i, selectedTime.getMinutes())}
                             className={`
                               w-full p-2 text-xs rounded-lg transition-all duration-200 text-center
                               ${selectedTime.getHours() === i 
                                 ? 'bg-blue-600 text-white' 
                                 : 'hover:bg-gray-100 text-gray-700'
                               }
                             `}
                           >
                             {i.toString().padStart(2, '0')}
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>

                   {/* Minutes */}
                   <div>
                     <label className="text-xs text-gray-500 mb-2 block">Minute</label>
                     <div className="h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                       <div className="space-y-1">
                         {Array.from({ length: 60 }, (_, i) => (
                           <button
                             key={i}
                             onClick={() => handleTimeSelect(selectedTime.getHours(), i)}
                             className={`
                               w-full p-2 text-xs rounded-lg transition-all duration-200 text-center
                               ${selectedTime.getMinutes() === i 
                                 ? 'bg-blue-600 text-white' 
                                 : 'hover:bg-gray-100 text-gray-700'
                               }
                             `}
                           >
                             {i.toString().padStart(2, '0')}
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

            {/* Quick Actions */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                             <button
                 onClick={() => {
                   const today = new Date();
                   today.setHours(23, 59, 0, 0);
                   setSelectedDate(today);
                   setSelectedTime(today);
                   
                   // Create a proper datetime string without timezone conversion
                   const year = today.getFullYear();
                   const month = String(today.getMonth() + 1).padStart(2, '0');
                   const day = String(today.getDate()).padStart(2, '0');
                   const hours = String(23).padStart(2, '0');
                   const minutes = String(59).padStart(2, '0');
                   const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
                   
                   onChange(datetimeString);
                 }}
                 className="text-sm text-blue-600 hover:text-blue-700 font-medium"
               >
                 Today 11:59 PM
               </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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

  // Predefined subjects for quick selection (6 subjects only)
  const subjects = [
    'Data Structures and Algorithms',
    'Applied Machine Learning',
    'Big Data Systems',
    'Data-Science System Design',
    'Statistics for Data Science',
    'Capstone Course'
  ];

  // Predefined faculty names (5 faculties only)
  const facultyMembers = [
    'Dr. Ankit Thakkar',
    'Dr. Nilesh Patel',
    'Dr. Jaiprakash Verma',
    'Dr. Monika Shah',
    'Dr. Swati Jain'
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
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Assignment</h2>
                  <p className="text-sm text-gray-600">Add a new assignment for students</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Title *
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter assignment title"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Subject & Faculty */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          list="subjects"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
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
                        {errors.subject && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.subject}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Faculty *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          list="faculty"
                          value={formData.faculty}
                          onChange={(e) => handleInputChange('faculty', e.target.value)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
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
                    </div>
                  </div>

                  {/* Due Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date & Time *
                    </label>
                    <CustomDatePicker
                      value={formData.dueDate}
                      onChange={(value) => handleInputChange('dueDate', value)}
                      error={errors.dueDate}
                      disabled={isLoading}
                    />
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
                        rows={4}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                          errors.instructions ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter detailed instructions for the assignment..."
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

                  {/* Submission Type & Group Size */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Submission Type
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          value={formData.submissionType}
                          onChange={(e) => handleInputChange('submissionType', e.target.value as 'individual' | 'group')}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          disabled={isLoading}
                        >
                          <option value="individual">👤 Individual</option>
                          <option value="group">👥 Group</option>
                        </select>
                      </div>
                    </div>

                    {formData.submissionType === 'group' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Group Size *
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            min="2"
                            max="10"
                            value={formData.groupSize || ''}
                            onChange={(e) => handleInputChange('groupSize', parseInt(e.target.value))}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              errors.groupSize ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="2-10 students"
                            disabled={isLoading}
                          />
                        </div>
                        {errors.groupSize && (
                          <p className="mt-1 text-sm text-red-600 text-xs">
                            {errors.groupSize}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Late Submission */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="allowLateSubmission"
                        checked={formData.allowLateSubmission}
                        onChange={(e) => handleInputChange('allowLateSubmission', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <label htmlFor="allowLateSubmission" className="text-sm font-medium text-gray-700">
                        Allow Late Submission
                      </label>
                    </div>

                    {formData.allowLateSubmission && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Late Penalty (%)
                        </label>
                        <div className="relative">
                          <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={formData.latePenalty || ''}
                            onChange={(e) => handleInputChange('latePenalty', parseFloat(e.target.value))}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              errors.latePenalty ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="e.g., 10"
                            disabled={isLoading}
                          />
                        </div>
                        {errors.latePenalty && (
                          <p className="mt-1 text-sm text-red-600 text-xs">
                            {errors.latePenalty}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Add tags (press Enter)"
                            disabled={isLoading}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          disabled={isLoading || !tagInput.trim()}
                        >
                          Add
                        </button>
                      </div>
                      
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-blue-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Notification */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="sendEmailNotification"
                      checked={formData.sendEmailNotification}
                      onChange={(e) => handleInputChange('sendEmailNotification', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <label htmlFor="sendEmailNotification" className="text-sm font-medium text-gray-700">
                      Send email notification to students
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Create Assignment
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
} 