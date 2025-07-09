import { Course, Semester, Professor } from '@/types';
import { dsaSyllabus } from './syllabus/dsa-syllabus';
import { amlSyllabus } from './syllabus/aml-syllabus';
import { bigDataSyllabus } from './syllabus/big-data-syllabus';
import { dataScienceDesignSyllabus } from './syllabus/data-science-design-syllabus';
import { statisticsSyllabus } from './syllabus/statistics-syllabus';
import { capstoneSyllabus } from './syllabus/capstone-syllabus';

export const professors: Professor[] = [
  {
    id: 'prof1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@nirmauni.ac.in',
    department: 'Computer Science',
    office: 'Block A-301',
    researchAreas: ['Data Structures', 'Algorithms', 'Complexity Analysis']
  },
  {
    id: 'prof2', 
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@nirmauni.ac.in',
    department: 'Computer Science',
    office: 'Block B-205',
    researchAreas: ['Machine Learning', 'Deep Learning', 'Neural Networks']
  },
  {
    id: 'prof3',
    name: 'Dr. Amit Patel',
    email: 'amit.patel@nirmauni.ac.in', 
    department: 'Computer Science',
    office: 'Block C-401',
    researchAreas: ['Big Data', 'Distributed Systems', 'Cloud Computing']
  },
  {
    id: 'prof4',
    name: 'Dr. Neha Jain',
    email: 'neha.jain@nirmauni.ac.in',
    department: 'Computer Science', 
    office: 'Block A-205',
    researchAreas: ['System Design', 'Software Architecture', 'Database Systems']
  },
  {
    id: 'prof5',
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@nirmauni.ac.in',
    department: 'Mathematics',
    office: 'Block D-301',
    researchAreas: ['Statistics', 'Probability Theory', 'Statistical Modeling']
  }
];

export const semester1Courses: Course[] = [
  {
    id: 'course1',
    code: '6CS402CC22',
    name: 'Data Structures and Algorithms',
    semester: 1,
    credits: 4,
    type: 'core',
    professor: professors[0],
    description: 'Comprehensive study of fundamental data structures and algorithms including complexity analysis, sorting, searching, graph algorithms, and dynamic programming.',
    syllabus: dsaSyllabus,
    schedule: {
      courseId: 'course1',
      sessions: [
        {
          day: 'Monday',
          startTime: '09:00',
          endTime: '10:30',
          room: 'CSE-101',
          type: 'lecture'
        },
        {
          day: 'Wednesday', 
          startTime: '09:00',
          endTime: '10:30',
          room: 'CSE-101',
          type: 'lecture'
        },
        {
          day: 'Friday',
          startTime: '14:00',
          endTime: '17:00',
          room: 'Lab-A',
          type: 'lab'
        }
      ]
    }
  },
  {
    id: 'course2',
    code: '6CS203CC22', 
    name: 'Applied Machine Learning',
    semester: 1,
    credits: 4,
    type: 'core',
    professor: professors[1],
    description: 'Introduction to machine learning concepts, supervised and unsupervised learning, feature engineering, model evaluation, and practical ML applications.',
    syllabus: amlSyllabus,
    schedule: {
      courseId: 'course2',
      sessions: [
        {
          day: 'Tuesday',
          startTime: '10:30',
          endTime: '12:00',
          room: 'CSE-102',
          type: 'lecture'
        },
        {
          day: 'Thursday',
          startTime: '10:30', 
          endTime: '12:00',
          room: 'CSE-102',
          type: 'lecture'
        },
        {
          day: 'Monday',
          startTime: '14:00',
          endTime: '17:00',
          room: 'Lab-B',
          type: 'lab'
        }
      ]
    }
  },
  {
    id: 'course3',
    code: '6CS271ME25',
    name: 'Big Data Systems', 
    semester: 1,
    credits: 3,
    type: 'core',
    professor: professors[2],
    description: 'Study of big data technologies, distributed computing frameworks like Hadoop and Spark, NoSQL databases, and data processing pipelines.',
    syllabus: bigDataSyllabus,
    schedule: {
      courseId: 'course3',
      sessions: [
        {
          day: 'Monday',
          startTime: '11:00',
          endTime: '12:30',
          room: 'CSE-103',
          type: 'lecture'
        },
        {
          day: 'Wednesday',
          startTime: '11:00',
          endTime: '12:30', 
          room: 'CSE-103',
          type: 'lecture'
        }
      ]
    }
  },
  {
    id: 'course4',
    code: '6CS302CC25',
    name: 'Data-Science System Design',
    semester: 1,
    credits: 3,
    type: 'core',
    professor: professors[3],
    description: 'Principles of designing scalable data science systems, architecture patterns, microservices, API design, and system optimization.',
    syllabus: dataScienceDesignSyllabus,
    schedule: {
      courseId: 'course4',
      sessions: [
        {
          day: 'Tuesday',
          startTime: '14:00',
          endTime: '15:30',
          room: 'CSE-104',
          type: 'lecture'
        },
        {
          day: 'Thursday',
          startTime: '14:00',
          endTime: '15:30',
          room: 'CSE-104', 
          type: 'lecture'
        }
      ]
    }
  },
  {
    id: 'course5',
    code: '6CS303CC25',
    name: 'Statistics for Data Science',
    semester: 1,
    credits: 4,
    type: 'core',
    professor: professors[4],
    description: 'Statistical foundations for data science including probability distributions, hypothesis testing, regression analysis, and statistical inference.',
    syllabus: statisticsSyllabus,
    schedule: {
      courseId: 'course5',
      sessions: [
        {
          day: 'Tuesday',
          startTime: '09:00',
          endTime: '10:30',
          room: 'MATH-201',
          type: 'lecture'
        },
        {
          day: 'Friday',
          startTime: '09:00',
          endTime: '10:30',
          room: 'MATH-201',
          type: 'lecture'
        }
      ]
    }
  },
  {
    id: 'course6',
    code: '6CS282VA25',
    name: 'Capstone Course',
    semester: 1,
    credits: 2,
    type: 'supplementary',
    professor: professors[1],
    description: 'Foundational course covering programming, data structures, operating systems, computer networks, and database management systems for comprehensive computer science understanding.',
    syllabus: capstoneSyllabus,
    schedule: {
      courseId: 'course6',
      sessions: [
        {
          day: 'Saturday',
          startTime: '09:00',
          endTime: '12:00',
          room: 'Project Lab',
          type: 'lab'
        }
      ]
    }
  }
];

export const semester1: Semester = {
  id: 'sem1',
  number: 1,
  name: 'Semester I',
  startDate: new Date('2024-01-15'),
  endDate: new Date('2024-05-15'),
  courses: semester1Courses,
  isActive: true
}; 