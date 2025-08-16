'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowLeft, Sparkles, FileText, Download, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function StudyMaterialsPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

          {/* Main Content */}
          <div className="text-center">
            {/* Static Icon */}
            <motion.div
              className="mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Study Materials
            </motion.h1>

            {/* Coming Soon Message */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-blue-500 mr-3" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Coming Soon!
                </h2>
              </div>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                I'm working hard to bring you comprehensive study materials for all your courses. 
                I'm curating the best resources, notes, and materials to help you excel in your studies.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <p className="text-blue-800 font-semibold text-lg">
                  "It will be uploaded very soon..."
                </p>
              </div>
            </motion.div>

            {/* Features Preview */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Notes</h3>
                <p className="text-gray-600 text-sm">Comprehensive notes and summaries for each unit</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Resources</h3>
                <p className="text-gray-600 text-sm">PDFs, presentations, and additional materials</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Questions</h3>
                <p className="text-gray-600 text-sm">Quizzes and practice problems for self-assessment</p>
              </div>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-center mb-4">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600 font-medium">Development Progress</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                75% Complete - I'm in the final stages of preparation
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 