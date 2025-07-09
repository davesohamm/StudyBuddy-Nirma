'use client';

import { Course, CourseSyllabus } from '@/types';
import { 
  BookOpen, 
  Clock, 
  User, 
  MapPin, 
  ExternalLink, 
  FlaskConical,
  Target,
  Calendar,
  FileText,
  Award
} from 'lucide-react';

interface CourseDetailViewProps {
  course: Course;
}

export default function CourseDetailView({ course }: CourseDetailViewProps) {
  const syllabus = course.syllabus as CourseSyllabus;

  if (!syllabus) {
    return (
      <div className="card p-8 text-center">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Detailed Syllabus Available</h3>
        <p className="text-gray-600">The detailed syllabus for this course is not yet available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{course.name}</h1>
                <p className="text-lg text-gray-600 font-mono">{course.code}</p>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6">{course.description}</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Credits</span>
                </div>
                <p className="text-xl font-bold text-blue-900">{course.credits}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Total Hours</span>
                </div>
                <p className="text-xl font-bold text-green-900">{syllabus.totalTeachingHours}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Units</span>
                </div>
                <p className="text-xl font-bold text-purple-900">{syllabus.units.length}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Labs</span>
                </div>
                <p className="text-xl font-bold text-orange-900">{syllabus.experiments.length}</p>
              </div>
            </div>
          </div>

          {/* Professor Info */}
          {course.professor && (
            <div className="bg-gray-50 p-6 rounded-xl min-w-80">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Instructor
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{course.professor.name}</p>
                  <p className="text-sm text-gray-600">{course.professor.department}</p>
                </div>
                {course.professor.email && (
                  <p className="text-sm text-gray-600">{course.professor.email}</p>
                )}
                {course.professor.office && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {course.professor.office}
                  </div>
                )}
                {course.professor.researchAreas && (
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Research Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.professor.researchAreas.map((area, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Learning Outcomes */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary-600" />
          Course Learning Outcomes (CLOs)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {syllabus.courseLearningOutcomes.map((clo, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-primary-600">{clo.clo}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {clo.bloomLevel}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{clo.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course Units */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-600" />
          Course Units
        </h2>
        <div className="space-y-6">
          {syllabus.units.map((unit, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {unit.unitNumber}: {unit.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {unit.teachingHours} hours
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">{unit.contents}</p>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {unit.topics.map((topic, topicIndex) => (
                      <span 
                        key={topicIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lab Experiments */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary-600" />
          Laboratory Experiments
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {syllabus.experiments.map((experiment, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-purple-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-purple-900">
                    Lab {experiment.srNo}: {experiment.name}
                  </h3>
                  <span className="text-sm text-purple-700">
                    {experiment.hours}h
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {experiment.description}
                </p>
                
                {experiment.leetcodeLinks && experiment.leetcodeLinks.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">LeetCode Problems:</p>
                    {experiment.leetcodeLinks.map((link, linkIndex) => (
                      <a 
                        key={linkIndex}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-1 mr-4"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Problem {linkIndex + 1}
                      </a>
                    ))}
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Topics:</p>
                  <div className="flex flex-wrap gap-1">
                    {experiment.topics.map((topic, topicIndex) => (
                      <span 
                        key={topicIndex}
                        className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* References */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary-600" />
          Suggested References
        </h2>
        <div className="space-y-3">
          {syllabus.references.map((reference, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 text-sm font-medium rounded-full flex items-center justify-center">
                {index + 1}
              </span>
              <p className="text-gray-700 text-sm leading-relaxed">{reference}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Self Study */}
      {syllabus.selfStudy && (
        <div className="card bg-blue-50 border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Self Study
          </h2>
          <p className="text-blue-800 leading-relaxed">{syllabus.selfStudy}</p>
        </div>
      )}
    </div>
  );
} 