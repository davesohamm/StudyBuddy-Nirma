'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import StudyAssistant from '@/components/chat/StudyAssistant';
import { ArrowLeft, Home } from 'lucide-react';

export default function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Navigation */}
              <div className="flex gap-2 mr-6">
                <button
                  onClick={() => router.back()}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Go to dashboard"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
              
              {/* Title */}
              <div>
                <nav className="flex items-center text-sm text-gray-500 mb-1">
                  <button 
                    onClick={() => router.push('/')}
                    className="hover:text-gray-700 transition-colors"
                  >
                    Dashboard
                  </button>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900">AI Study Assistant</span>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900">AI Study Assistant</h1>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How can I help you today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">📚 Study Help</h3>
              <p className="text-sm text-blue-700">Get explanations for Data Science concepts, algorithms, and theory</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">💻 Programming</h3>
              <p className="text-sm text-green-700">Python, R, SQL questions and code debugging assistance</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">📊 Project Guidance</h3>
              <p className="text-sm text-purple-700">Ideas, methodologies, and best practices for your projects</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-900 mb-2">📈 Career Advice</h3>
              <p className="text-sm text-orange-700">Industry insights and career path guidance in Data Science</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-medium text-pink-900 mb-2">🧠 Study Tips</h3>
              <p className="text-sm text-pink-700">Effective learning strategies and time management</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-900 mb-2">📝 Assignment Help</h3>
              <p className="text-sm text-indigo-700">Guidance on assignments (understanding, not solutions)</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your AI Study Assistant is powered by Google's Gemini AI and specializes in Data Science education.
            </p>
            <p className="text-sm text-gray-500">
              💡 <strong>Tip:</strong> Be specific in your questions for better responses. 
              Ask about concepts, methodologies, or seek guidance rather than direct answers.
            </p>
          </div>
        </div>
      </div>

      {/* Always show the chat assistant */}
      <StudyAssistant 
        isOpen={true} 
        onToggle={() => {}} 
        onClose={() => router.push('/')} 
      />
    </div>
  );
} 