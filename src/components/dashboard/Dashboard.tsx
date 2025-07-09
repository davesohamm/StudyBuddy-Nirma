'use client';

import { semester1Courses } from '@/data/courses';
import CourseCard from '@/components/courses/CourseCard';
import AssignmentTracker from '@/components/assignments/AssignmentTracker';
import { Calendar, BookOpen, Target, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const totalCredits = semester1Courses.reduce((sum, course) => sum + course.credits, 0);
  const coreCoursesCount = semester1Courses.filter(course => course.type === 'core').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening in your MTech Data Science program</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Courses Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Semester I Courses</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
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
              <a href="#" className="block text-sm text-primary-600 hover:text-primary-700">
                📚 Study Resources
              </a>
              <a href="#" className="block text-sm text-primary-600 hover:text-primary-700">
                📅 Academic Calendar
              </a>
              <a href="#" className="block text-sm text-primary-600 hover:text-primary-700">
                👥 Study Groups
              </a>
              <a href="#" className="block text-sm text-primary-600 hover:text-primary-700">
                📊 Grade Tracker
              </a>
              <a href="#" className="block text-sm text-primary-600 hover:text-primary-700">
                💬 Discussion Forums
              </a>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded">
                  DUE
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">ML Assignment 1</p>
                  <p className="text-xs text-gray-500">Tomorrow, 11:59 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded">
                  EXAM
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Statistics Quiz</p>
                  <p className="text-xs text-gray-500">Friday, 2:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded">
                  LAB
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Big Data Lab Session</p>
                  <p className="text-xs text-gray-500">Monday, 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 