'use client';

import { Course } from '@/types';
import { BookOpen, MapPin, User } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'elective': return 'bg-green-100 text-green-800';
      case 'supplementary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  return (
    <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(course.type)}`}>
              {course.type}
            </span>
          </div>
          <p className="text-sm text-gray-600 font-mono">{course.code}</p>
          <p className="text-sm text-gray-600 mt-1">{course.credits} Credits</p>
        </div>
        <div className="bg-primary-50 p-3 rounded-lg">
          <BookOpen className="h-6 w-6 text-primary-600" />
        </div>
      </div>

      {course.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
      )}

      {course.professor && (
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">{course.professor.name}</span>
        </div>
      )}

      {course.schedule?.sessions?.[0]?.room && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{course.schedule.sessions[0].room}</span>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <Link 
          href={`/course/${course.id}`}
          className="btn-secondary text-sm"
        >
          Course Details
        </Link>
        <Link 
          href="/study-materials"
          className="btn-secondary text-sm"
        >
          Study Materials
        </Link>
      </div>
    </div>
  );
} 