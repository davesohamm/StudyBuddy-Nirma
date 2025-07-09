import { CourseSyllabus } from '@/types';

export const capstoneSyllabus: CourseSyllabus = {
  courseCode: '6CS282VA25',
  courseName: 'Capstone Course',
  credits: 2,
  courseType: 'Supplementary',
  yearOfIntroduction: '2025-26',
  practicalComponent: {
    lecture: 1,
    tutorial: 0,
    practical: 0,
    totalCredits: 2
  },
  courseLearningOutcomes: [
    {
      clo: 'CLO1',
      description: 'summarise the computer network concepts with real-time applications',
      bloomLevel: 'BL2'
    },
    {
      clo: 'CLO2', 
      description: 'make use of DBMS concepts to define an efficient database',
      bloomLevel: 'BL3'
    },
    {
      clo: 'CLO3',
      description: 'analyse the various operating system components and their services',
      bloomLevel: 'BL4'
    },
    {
      clo: 'CLO4',
      description: 'solve real-life problems using programming constructs',
      bloomLevel: 'BL6'
    }
  ],
  units: [
    {
      unitNumber: 'Unit-I',
      title: 'Introduction to Programming',
      contents: 'Concepts of procedural and object-oriented programming constructs, problem-solving',
      teachingHours: 5,
      topics: [
        'Programming Fundamentals',
        'Procedural Programming',
        'Object-Oriented Programming',
        'OOP Concepts',
        'Programming Constructs',
        'Problem Solving',
        'Programming Paradigms',
        'Code Design',
        'Software Development',
        'Programming Logic'
      ]
    },
    {
      unitNumber: 'Unit-II',
      title: 'Introduction to Data Structures',
      contents: 'Linear and non-linear data structures, graphs, and trees',
      teachingHours: 4,
      topics: [
        'Data Structures',
        'Linear Data Structures',
        'Non-Linear Data Structures',
        'Arrays',
        'Linked Lists',
        'Stacks',
        'Queues',
        'Trees',
        'Binary Trees',
        'Graphs',
        'Graph Algorithms',
        'Tree Traversal',
        'Data Organization',
        'Abstract Data Types'
      ]
    },
    {
      unitNumber: 'Unit-III', 
      title: 'Introduction to Operating Systems',
      contents: 'Scheduling algorithms, Inter-process Communications, Memory management, Deadlock',
      teachingHours: 2,
      topics: [
        'Operating Systems',
        'OS Fundamentals',
        'Scheduling Algorithms',
        'Process Scheduling',
        'Inter-Process Communication',
        'IPC',
        'Memory Management',
        'Virtual Memory',
        'Deadlock',
        'Deadlock Prevention',
        'Process Management',
        'System Calls',
        'Operating System Services',
        'Resource Management'
      ]
    },
    {
      unitNumber: 'Unit-IV',
      title: 'Introduction to Computer Networks',
      contents: 'Layer concepts of network protocols, IPv4 Addressing, TCP/UDP, Application layer',
      teachingHours: 2,
      topics: [
        'Computer Networks',
        'Network Protocols',
        'Protocol Layers',
        'OSI Model',
        'TCP/IP Model',
        'IPv4 Addressing',
        'IP Addressing',
        'TCP Protocol',
        'UDP Protocol',
        'Application Layer',
        'Network Layer',
        'Transport Layer',
        'Real-time Applications',
        'Network Communication'
      ]
    },
    {
      unitNumber: 'Unit-V',
      title: 'Introduction to DBMS',
      contents: 'Relational databases, ER Diagrams, and Normalization techniques',
      teachingHours: 2,
      topics: [
        'Database Management Systems',
        'DBMS',
        'Relational Databases',
        'Database Design',
        'Entity Relationship Diagrams',
        'ER Diagrams',
        'Database Normalization',
        'Normalization Techniques',
        'Database Schema',
        'Relational Model',
        'Database Efficiency',
        'Data Modeling',
        'Database Concepts',
        'SQL Fundamentals'
      ]
    }
  ],
  references: [
    'Balagurusamy, E, Object-oriented programming with C++, McGraw Hill',
    'Jean-Paul Tremblay and Paul G. Sorenson, An Introduction to Data Structures with Applications, McGraw Hill',
    'A. S. Tannenbaum, Modern Operating Systems, McGraw Hill',
    'Silberschatz, Korth, Sudarshan, Database System Concepts, McGraw-Hill computer science series',
    'Andrew Tanenbaum, Computer Networks, Pearson'
  ],
  experiments: [
    {
      srNo: 1,
      name: 'Programming Fundamentals Review',
      description: 'Review and practice procedural and object-oriented programming concepts with problem-solving exercises',
      hours: 2,
      topics: ['Programming Review', 'OOP Practice', 'Problem Solving', 'Code Implementation']
    },
    {
      srNo: 2,
      name: 'Data Structures Implementation',
      description: 'Implement basic linear and non-linear data structures including arrays, linked lists, trees, and graphs',
      hours: 2,
      topics: ['Data Structure Implementation', 'Linear Structures', 'Trees', 'Graphs', 'Algorithm Implementation']
    },
    {
      srNo: 3,
      name: 'Operating System Concepts',
      description: 'Study and analyze scheduling algorithms, process communication, and memory management techniques',
      hours: 2,
      topics: ['OS Analysis', 'Scheduling', 'Process Communication', 'Memory Management', 'System Analysis']
    },
    {
      srNo: 4,
      name: 'Network Protocol Analysis',
      description: 'Analyze network protocols, IPv4 addressing schemes, and real-time network applications',
      hours: 2,
      topics: ['Network Analysis', 'Protocol Study', 'IP Addressing', 'Network Applications', 'Communication Protocols']
    },
    {
      srNo: 5,
      name: 'Database Design Project',
      description: 'Design an efficient database using ER diagrams and apply normalization techniques for real-world scenarios',
      hours: 2,
      topics: ['Database Design', 'ER Modeling', 'Normalization', 'Database Efficiency', 'Real-world Database']
    }
  ],
  selfStudy: 'The self-study contents will be declared at the commencement of the semester. Around 10% of the questions will be asked from self-study content.',
  totalTeachingHours: 15
}; 