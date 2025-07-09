'use client';

import { useParams } from 'next/navigation';
import { semester1Courses } from '@/data/courses';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import CourseDetailView from '@/components/courses/CourseDetailView';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CoursePage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  
  const course = semester1Courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="card p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
              <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
              <Link href="/" className="btn-primary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <CourseDetailView course={course} />
        </div>
      </main>
      <Footer />
    </div>
  );
} 