export interface Course {
  id: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  type: 'core' | 'elective' | 'supplementary';
  professor?: Professor;
  syllabus?: CourseSyllabus | string;
  schedule?: CourseSchedule;
  description?: string;
}

export interface Professor {
  id: string;
  name: string;
  email?: string;
  department: string;
  office?: string;
  phoneNumber?: string;
  researchAreas?: string[];
}

export interface CourseSchedule {
  courseId: string;
  sessions: ClassSession[];
}

export interface ClassSession {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room?: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  submissionDate?: Date;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: number;
  maxMarks: number;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  attachments?: string[];
}

export interface Grade {
  id: string;
  courseId: string;
  assignmentId?: string;
  type: 'assignment' | 'quiz' | 'midterm' | 'final' | 'project';
  score: number;
  maxScore: number;
  weightage: number;
  date: Date;
  comments?: string;
}

export interface StudyResource {
  id: string;
  courseId?: string;
  title: string;
  description?: string;
  type: 'pdf' | 'video' | 'link' | 'notes' | 'code';
  url?: string;
  filePath?: string;
  tags: string[];
  uploadedBy: string;
  uploadDate: Date;
  semester?: number;
  isPublic: boolean;
  downloads: number;
  ratings?: ResourceRating[];
}

export interface ResourceRating {
  userId: string;
  rating: number;
  comment?: string;
  date: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  semester: number;
  program: string;
  avatar?: string;
  enrolledCourses: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    assignments: boolean;
    deadlines: boolean;
    announcements: boolean;
  };
  studyReminders: boolean;
}

export interface Semester {
  id: string;
  number: number;
  name: string;
  startDate: Date;
  endDate: Date;
  courses: Course[];
  isActive: boolean;
}

export interface AcademicCalendar {
  id: string;
  title: string;
  description?: string;
  date: Date;
  endDate?: Date;
  type: 'exam' | 'holiday' | 'assignment' | 'event' | 'deadline';
  courseId?: string;
  isImportant: boolean;
}

// Syllabus related interfaces
export interface SyllabusUnit {
  unitNumber: string;
  title: string;
  contents: string;
  teachingHours: number;
  topics: string[];
}

export interface CourseExperiment {
  srNo: number;
  name: string;
  description: string;
  hours: number;
  leetcodeLinks?: string[];
  topics: string[];
}

export interface CourseSyllabus {
  courseCode: string;
  courseName: string;
  credits: number;
  courseType: string;
  yearOfIntroduction: string;
  practicalComponent: {
    lecture: number;
    tutorial: number;
    practical: number;
    totalCredits: number;
  };
  courseLearningOutcomes: {
    clo: string;
    description: string;
    bloomLevel: string;
  }[];
  units: SyllabusUnit[];
  references: string[];
  experiments: CourseExperiment[];
  selfStudy: string;
  totalTeachingHours: number;
}

// Search related interfaces
export interface SearchResult {
  id: string;
  type: 'course' | 'unit' | 'experiment' | 'topic' | 'reference';
  title: string;
  description: string;
  courseCode?: string;
  courseName?: string;
  unitNumber?: string;
  relevanceScore: number;
  highlightedText?: string;
} 