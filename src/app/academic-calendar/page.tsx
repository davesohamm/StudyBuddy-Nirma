'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, BookOpen, GraduationCap, Home, Users, Award } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function AcademicCalendarPage() {
  const semesterSchedule = [
    { event: 'Semester Commencement', date: '17-07-2025', icon: GraduationCap },
    { event: 'Orientation', date: '17-07-2025 to 31-07-2025', icon: Users },
    { event: 'Teaching Starts', date: '01-08-2025', icon: BookOpen },
    { event: 'Sessional Examination', date: '17-09-2025 to 19-09-2025', icon: Award },
    { event: 'Diwali Vacation', date: '17-10-2025 to 24-10-2025', note: '[Tentative]', icon: Home },
    { event: 'Teaching End', date: '05-12-2025', icon: BookOpen },
    { event: 'Semester End', date: '05-12-2025', icon: GraduationCap },
    { event: 'Semester End Examination (SEE)', date: '11-12-2025 onwards', icon: Award },
    { event: 'Commencement of Next Semester', date: '29-12-2025', icon: GraduationCap },
  ];

  const holidays = [
    { holiday: 'Rakshabandhan', date: '09-08-2025' },
    { holiday: 'Independence Day', date: '15-08-2025' },
    { holiday: 'Janmashtami', date: '16-08-2025' },
    { holiday: 'Samvatsari/Ganesh Chaturhi', date: '27-08-2025' },
    { holiday: "Mahatma Gandhi's Birthday / Dussehra (Vijya Dashmi)", date: '02-10-2025' },
    { holiday: "Guru Nanak's Birthday", date: '05-11-2025' },
  ];

  const events = [
    { event: 'Foundation Day', date: '03-10-2025' },
  ];

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
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Academic Calendar
            </h1>
            <p className="text-xl text-gray-600">
              July 2025 - December 2025 | Odd Term 2025-2026
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Total Teaching Days: 77 Days
              </span>
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Sessional Examination: 3 Days
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Semester Schedule */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  M Tech Semester - I (All Programmes)
                </h2>
              </div>
              
              <div className="space-y-4">
                {semesterSchedule.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <item.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.event}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {item.date}
                        {item.note && (
                          <span className="ml-2 text-orange-600 font-medium">{item.note}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Holidays and Events */}
            <div className="space-y-8">
              {/* Holidays */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <Home className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Holiday List</h2>
                </div>
                
                <div className="space-y-3">
                  {holidays.map((holiday, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                      <span className="font-medium text-gray-900">{holiday.holiday}</span>
                      <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                        {holiday.date}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Events */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Events</h2>
                </div>
                
                <div className="space-y-3">
                  {events.map((event, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    >
                      <span className="font-medium text-gray-900">{event.event}</span>
                      <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                        {event.date}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold">Total Teaching Days</h3>
              </div>
              <p className="text-3xl font-bold">77 Days</p>
              <p className="text-blue-100 mt-2">Comprehensive learning period</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center mb-4">
                <Award className="h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold">Sessional Examination</h3>
              </div>
              <p className="text-3xl font-bold">3 Days</p>
              <p className="text-purple-100 mt-2">Mid-semester assessment</p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 