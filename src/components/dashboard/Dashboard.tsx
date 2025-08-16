'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { semester1Courses } from '@/data/courses';
import CourseCard from '@/components/courses/CourseCard';
import AssignmentTracker from '@/components/assignments/AssignmentTracker';
import StudyAssistant from '@/components/chat/StudyAssistant';
import { useAuth } from '@/context/AuthContext';
import { Calendar, BookOpen, Target, TrendingUp, Bot, MessageCircle, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userCGPA, setUserCGPA] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const totalCredits = semester1Courses.reduce((sum, course) => sum + course.credits, 0);
  const coreCoursesCount = semester1Courses.filter(course => course.type === 'core').length;

  // Fetch user profile data to get CGPA
  useEffect(() => {
    const fetchUserCGPA = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const cgpa = data.user?.profile?.academic?.cgpa;
          if (cgpa && cgpa > 0) {
            setUserCGPA(cgpa);
          }
        }
      } catch (error) {
        console.error('Error fetching user CGPA:', error);
      }
    };

    fetchUserCGPA();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening in your MTech Data Science program</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{semester1Courses.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Core Courses</p>
              <p className="text-2xl font-bold text-gray-900">{coreCoursesCount}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current GPA</p>
              <p className="text-2xl font-bold text-gray-900">
                {userCGPA ? userCGPA.toFixed(2) : '--'}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* AI Study Assistant Card */}
        <motion.div 
          className="card cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-blue-200 hover:scale-105 relative overflow-hidden"
          onClick={() => setIsChatOpen(true)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
          <div className="flex items-center justify-between relative">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <p className="text-sm font-medium text-blue-700">AI Assistant</p>
              </div>
              <p className="text-lg font-bold text-blue-900">Get Help</p>
              <p className="text-xs text-blue-600 mt-1">24/7 Study Support</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Courses Section */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Semester I Courses</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {semester1Courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AssignmentTracker />
          
          {/* Quick Links */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="https://chat.whatsapp.com/DDM9f5hpRgV2LsUPw5Wvjj?mode=ac_t" target="_blank" rel="noopener noreferrer" className="block text-sm text-primary-600 hover:text-primary-700">
                💬 Class WhatsApp Group
              </a>
              <Link href="/academic-calendar" className="block text-sm text-primary-600 hover:text-primary-700">
                📅 Academic Calendar
              </Link>
              <Link href="/study-materials" className="block text-sm text-primary-600 hover:text-primary-700">
                📚 Study Resources
              </Link>
              <Link href="/timetable" className="block text-sm text-primary-600 hover:text-primary-700">
                📅 Class Timetable
              </Link>
            </div>
          </div>


        </div>
      </div>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsChatOpen(true)}
            className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
            title="Open AI Study Assistant"
          >
            {/* Animated pulse ring */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 animate-pulse"></div>
            
            {/* Main button content */}
            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            
            {/* AI indicator badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-bounce">
              🤖
            </div>
            
            {/* Notification dot */}
            <div className="absolute -top-1 -left-1 bg-orange-400 rounded-full w-3 h-3 animate-ping"></div>
            <div className="absolute -top-1 -left-1 bg-orange-500 rounded-full w-3 h-3"></div>
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap relative">
              AI Study Assistant
              <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -translate-y-1"></div>
            </div>
          </div>
        </div>
      )}

      {/* AI Study Assistant */}
      <StudyAssistant 
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
} 