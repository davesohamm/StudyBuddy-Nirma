'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowLeft, Link as LinkIcon, PlusCircle, Trash2, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { semester1Courses } from '@/data/courses';
import { useAuth } from '@/context/AuthContext';
import { Course } from '@/types';

// Define the structure of a study material link
interface StudyMaterialLink {
  _id: string;
  title?: string;
  url: string;
  courseId: string;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'faculty' | 'admin';
  };
  createdAt: string;
}

// Reusable component for each course section
const CourseSection = ({ course, user }: { course: Course; user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState<StudyMaterialLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ url: '', title: '' });

  const fetchLinks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/study-materials?courseId=${course.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch materials');
      const data = await res.json();
      setLinks(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLinks();
    }
  }, [isOpen]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.url) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/study-materials', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newLink, courseId: course.id }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add link');
      }
      const data = await res.json();
      setLinks([data.data, ...links]);
      setNewLink({ url: '', title: '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/study-materials/${linkId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete link');
      }
      setLinks(links.filter(link => link._id !== linkId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex justify-between items-center transition-colors hover:bg-gray-50"
      >
        <h2 className="text-xl font-bold text-gray-800">{course.name}</h2>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="h-6 w-6 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6"
          >
            {/* Add Link Form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Add a New Resource</h3>
              <form onSubmit={handleAddLink} className="space-y-3">
                <input
                  type="url"
                  placeholder="Link URL (e.g., https://example.com)"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Optional Title"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <PlusCircle className="h-5 w-5 mr-2" /> Add Link
                </button>
              </form>
            </div>
            
            {/* Display Links */}
            {isLoading && <div className="flex justify-center items-center py-4"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}
            {error && <div className="text-red-600 bg-red-100 p-3 rounded-md flex items-center"><AlertCircle className="h-5 w-5 mr-2"/> Error: {error}</div>}
            {!isLoading && !error && (
              links.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No materials uploaded yet. Be the first to share!</p>
              ) : (
                <ul className="space-y-3">
                  {links.map(link => (
                    <li key={link._id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center transition-shadow hover:shadow-md">
                      <div>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold flex items-center">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          {link.title || link.url}
                        </a>
                        <p className="text-sm text-gray-500 mt-1">
                          Shared by {link.uploadedBy?.name || 'Unknown User'} on {new Date(link.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDeleteLink(link._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default function StudyMaterialsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl mb-6">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Study Materials
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access and share study resources for your courses. All links are user-submitted and visible to everyone.
            </p>
          </div>

          <div>
            {semester1Courses.map(course => (
              <CourseSection key={course.id} course={course} user={user} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 