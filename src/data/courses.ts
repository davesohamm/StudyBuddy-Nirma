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
    name: 'Dr. Ankit Thakkar',
    email: 'ankit.thakkar@nirmauni.ac.in',
    department: 'Computer Science',
    office: 'Block E-501',
    researchAreas: ['Data Structures', 'Algorithms', 'Complexity Analysis']
  },
  {
    id: 'prof2', 
    name: 'Dr. Nilesh Patel',
    email: 'nilesh.patel@nirmauni.ac.in',
    department: 'Computer Science',
    office: 'Block E-501',
    researchAreas: ['Machine Learning', 'Deep Learning', 'Neural Networks']
  },
  {
    id: 'prof3',
    name: 'Dr. Jaiprakash Verma',
    email: 'jaiprakash.verma@nirmauni.ac.in', 
    department: 'Computer Science',
    office: 'Block E-1106B',
    researchAreas: ['Big Data', 'Distributed Systems', 'Cloud Computing']
  },
  {
    id: 'prof4',
    name: 'Dr. Monika Shah',
    email: 'monika.shah@nirmauni.ac.in',
    department: 'Computer Science', 
    office: 'Block E-1106B',
    researchAreas: ['System Design', 'Software Architecture', 'Database Systems']
  },
  {
    id: 'prof5',
    name: 'Dr. Swati Jain',
    email: 'swati.jain@nirmauni.ac.in',
    department: 'Computer Science',
    office: 'Block E-1106B',
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
    professor: professors[0], // Dr. Amit Thakkar
    description: 'Comprehensive study of fundamental data structures and algorithms including complexity analysis, sorting, searching, graph algorithms, and dynamic programming.',
    syllabus: dsaSyllabus,
    schedule: {
      courseId: 'course1',
      sessions: [
        {
          day: 'Tuesday',
          startTime: '14:25',
          endTime: '15:20',
          room: 'E501',
          type: 'lecture'
        },
        {
          day: 'Wednesday', 
          startTime: '15:20',
          endTime: '16:15',
          room: 'E501',
          type: 'lecture'
        },
        {
          day: 'Thursday',
          startTime: '15:20',
          endTime: '16:15',
          room: 'E501',
          type: 'lecture'
        },
        {
          day: 'Friday',
          startTime: '10:45',
          endTime: '11:40',
          room: 'E1108C',
          type: 'lecture'
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
    professor: professors[1], // Dr. Nilesh K. Patel
    description: 'Introduction to machine learning concepts, supervised and unsupervised learning, feature engineering, model evaluation, and practical ML applications.',
    syllabus: amlSyllabus,
    schedule: {
      courseId: 'course2',
      sessions: [
        {
          day: 'Monday',
          startTime: '12:35',
          endTime: '13:30',
          room: 'E501',
          type: 'lecture'
        },
        {
          day: 'Wednesday',
          startTime: '14:25', 
          endTime: '15:20',
          room: 'E501',
          type: 'lecture'
        },
        {
          day: 'Thursday',
          startTime: '14:25',
          endTime: '15:20',
          room: 'E501',
          type: 'lecture'
        },
        {
          day: 'Wednesday',
          startTime: '16:30',
          endTime: '17:25',
          room: 'E1108C',
          type: 'lecture'
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
    professor: professors[2], // Dr. Jitendra Vaghani
    description: 'Study of big data technologies, distributed computing frameworks like Hadoop and Spark, NoSQL databases, and data processing pipelines.',
    syllabus: bigDataSyllabus,
    schedule: {
      courseId: 'course3',
      sessions: [
        {
          day: 'Monday',
          startTime: '11:40',
          endTime: '12:35',
          room: 'E1106B',
          type: 'lecture'
        },
        {
          day: 'Monday',
          startTime: '14:25',
          endTime: '15:20', 
          room: 'E1108C',
          type: 'lecture'
        },
        {
          day: 'Thursday',
          startTime: '16:30',
          endTime: '17:25',
          room: 'E501',
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
    professor: professors[3], // Dr. Mayank Shah
    description: 'Principles of designing scalable data science systems, architecture patterns, microservices, API design, and system optimization.',
    syllabus: dataScienceDesignSyllabus,
    schedule: {
      courseId: 'course4',
      sessions: [
        {
          day: 'Tuesday',
          startTime: '12:35',
          endTime: '13:30',
          room: 'E1106B',
          type: 'lecture'
        },
        {
          day: 'Wednesday',
          startTime: '10:45',
          endTime: '11:40',
          room: 'W5062',
          type: 'lecture'
        },
        {
          day: 'Friday',
          startTime: '14:25',
          endTime: '15:20',
          room: 'E1106B',
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
    professor: professors[4], // Dr. Smita Jain
    description: 'Statistical foundations for data science including probability distributions, hypothesis testing, regression analysis, and statistical inference.',
    syllabus: statisticsSyllabus,
    schedule: {
      courseId: 'course5',
      sessions: [
        {
          day: 'Tuesday',
          startTime: '15:20',
          endTime: '16:15',
          room: 'E1106B',
          type: 'lecture'
        },
        {
          day: 'Thursday',
          startTime: '10:45',
          endTime: '11:40',
          room: 'E1106B',
          type: 'lecture'
        },
        {
          day: 'Friday',
          startTime: '15:20',
          endTime: '16:15',
          room: 'E1106B',
          type: 'lecture'
        },
        {
          day: 'Tuesday',
          startTime: '16:30',
          endTime: '17:25',
          room: 'E1108C',
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
    professor: professors[4], // Dr. Smita Jain
    description: 'Foundational course covering programming, data structures, operating systems, computer networks, and database management systems for comprehensive computer science understanding.',
    syllabus: capstoneSyllabus,
    schedule: {
      courseId: 'course6',
      sessions: [
        {
          day: 'Thursday',
          startTime: '11:40',
          endTime: '12:35',
          room: 'E501',
          type: 'lecture'
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