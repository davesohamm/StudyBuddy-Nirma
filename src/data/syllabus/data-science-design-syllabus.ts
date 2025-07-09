import { CourseSyllabus } from '@/types';

export const dataScienceDesignSyllabus: CourseSyllabus = {
  courseCode: '6CS302CC25',
  courseName: 'Data-Science System Design',
  credits: 3,
  courseType: 'Core',
  yearOfIntroduction: '2025-26',
  practicalComponent: {
    lecture: 2,
    tutorial: 0,
    practical: 2,
    totalCredits: 3
  },
  courseLearningOutcomes: [
    {
      clo: 'CLO1',
      description: 'identify the appropriate infrastructure needs for the ML system',
      bloomLevel: 'BL3'
    },
    {
      clo: 'CLO2', 
      description: 'apply suitable tools to implement, test and deploy the applications',
      bloomLevel: 'BL3'
    },
    {
      clo: 'CLO3',
      description: 'analyse data-science applications with respect to fault-tolerance and scalability',
      bloomLevel: 'BL4'
    },
    {
      clo: 'CLO4',
      description: 'design the high-level architecture of the ML system',
      bloomLevel: 'BL6'
    }
  ],
  units: [
    {
      unitNumber: 'Unit-I',
      title: 'Introduction to Data-Science (DS) Systems Design',
      contents: 'Requirements for DS systems, Framing DS Problems, ML Project Lifecycle, DS System Architecture',
      teachingHours: 3,
      topics: [
        'Data Science Systems',
        'DS Systems Design',
        'DS Requirements',
        'Data Science Problems',
        'ML Project Lifecycle',
        'Machine Learning Lifecycle',
        'DS System Architecture',
        'System Architecture',
        'Requirements Engineering',
        'Problem Framing',
        'System Design Fundamentals'
      ]
    },
    {
      unitNumber: 'Unit-II',
      title: 'Network and Distributed Systems',
      contents: 'IP and Addressing, TCP/UDP, HTTP, Concurrency and Synchronization, Scheduling and Logging, Rate Limiter, Leader Election, Clustering, Availability, Scalability',
      teachingHours: 5,
      topics: [
        'Network Systems',
        'Distributed Systems',
        'IP Addressing',
        'TCP Protocol',
        'UDP Protocol',
        'HTTP Protocol',
        'Concurrency',
        'Synchronization',
        'Task Scheduling',
        'System Logging',
        'Rate Limiting',
        'Rate Limiter',
        'Leader Election',
        'Clustering',
        'System Availability',
        'Scalability',
        'Distributed Computing',
        'Network Protocols'
      ]
    },
    {
      unitNumber: 'Unit-III', 
      title: 'Communication Approaches',
      contents: 'REST API and API Gateway, GraphQL, gRPC, Websockets, Long-Polling, Server Sent Events, Message Queues, Message Brokers, Publish and Subscribe, Distributed Queues',
      teachingHours: 5,
      topics: [
        'Communication Protocols',
        'REST API',
        'API Gateway',
        'GraphQL',
        'gRPC',
        'WebSockets',
        'Long Polling',
        'Server Sent Events',
        'Message Queues',
        'Message Brokers',
        'Publish Subscribe',
        'Pub Sub Pattern',
        'Distributed Queues',
        'API Design',
        'Real-time Communication',
        'Asynchronous Communication',
        'Event-Driven Architecture'
      ]
    },
    {
      unitNumber: 'Unit-IV',
      title: 'Data Processing and Storage',
      contents: 'SQL and NoSQL Databases, Data Models and Data Flow, Indexing, Searching, Normalization, Replication and Sharding, Consistency models, Distributed Transactions, Data Preprocessing, Data Pipelines, Scaling Data Storage and Data Processing, CDN, Blob Storage and S3',
      teachingHours: 6,
      topics: [
        'Data Processing',
        'Data Storage',
        'SQL Databases',
        'NoSQL Databases',
        'Data Models',
        'Data Flow',
        'Database Indexing',
        'Data Searching',
        'Database Normalization',
        'Database Replication',
        'Database Sharding',
        'Consistency Models',
        'Distributed Transactions',
        'Data Preprocessing',
        'Data Pipelines',
        'Storage Scaling',
        'Processing Scaling',
        'CDN',
        'Content Delivery Network',
        'Blob Storage',
        'Amazon S3',
        'Cloud Storage'
      ]
    },
    {
      unitNumber: 'Unit-V',
      title: 'Performance Aspects and Resiliency',
      contents: 'Load Balancing, Caching, Hashing, Service Discovery, Circuit Breakers, Disaster Recovery, Testing and Monitoring, Securing the System',
      teachingHours: 4,
      topics: [
        'System Performance',
        'System Resiliency',
        'Load Balancing',
        'Load Balancer',
        'System Caching',
        'Hashing Algorithms',
        'Service Discovery',
        'Circuit Breakers',
        'Fault Tolerance',
        'Disaster Recovery',
        'System Testing',
        'System Monitoring',
        'System Security',
        'Performance Optimization',
        'Reliability Engineering',
        'High Availability'
      ]
    },
    {
      unitNumber: 'Unit-VI',
      title: 'Architecture, Infrastructure and Case Studies',
      contents: 'Microservices Architecture, Cloud Infrastructure, Serverless Computing, Virtual Machines, Containers and Orchestration Tools, Responsible ML Engineering, Case Studies: Recommendation Engine, Ad Click Prediction, Visual Search, Twitter Feed, Food Delivery, Search Ranking',
      teachingHours: 7,
      topics: [
        'System Architecture',
        'Microservices Architecture',
        'Cloud Infrastructure',
        'Serverless Computing',
        'Virtual Machines',
        'Containers',
        'Container Orchestration',
        'Orchestration Tools',
        'Responsible ML Engineering',
        'ML Engineering',
        'Recommendation Engine',
        'Ad Click Prediction',
        'Visual Search',
        'Twitter Feed',
        'Food Delivery Systems',
        'Search Ranking',
        'Case Studies',
        'Real-world Applications',
        'Docker',
        'Kubernetes'
      ]
    }
  ],
  references: [
    'Chip Huyen, Designing Machine Learning Systems: An Iterative Process for Production-Ready Applications, O\'Reilly',
    'Martin Kleppmann, Designing Data-Intensive Applications, O\'Reilly',
    'Roberto Vitillo, Understanding Distributed Systems: What every developer should know about large distributed applications, Shroff Publishers',
    'Emmanuel Ameisen, Building Machine Learning Powered Applications: Going from Idea to Product, O\'Reilly',
    'Machine Learning in Production: From Models to Products, Christian Kästner, CMU Press',
    'Valerii Babushkin and Arseny Kravchenko, Machine Learning System Design, Manning Publications'
  ],
  experiments: [
    {
      srNo: 1,
      name: 'REST API Server with CRUD Operations',
      description: 'Design REST API based server with CRUD operations',
      hours: 4,
      topics: ['REST API', 'CRUD Operations', 'API Design', 'Server Development', 'HTTP Methods', 'API Endpoints']
    },
    {
      srNo: 2,
      name: 'GraphQL API Server Design',
      description: 'Design API based server with GraphQL',
      hours: 2,
      topics: ['GraphQL', 'API Design', 'Query Language', 'GraphQL Schema', 'Resolvers', 'Server Development']
    },
    {
      srNo: 3,
      name: 'Message Queue Implementation',
      description: 'Implement a producer-consumer problem using a message queue (RabbitMQ, Kafka)',
      hours: 2,
      topics: ['Message Queues', 'Producer Consumer', 'RabbitMQ', 'Apache Kafka', 'Messaging Systems', 'Asynchronous Processing']
    },
    {
      srNo: 4,
      name: 'Database Horizontal Sharding',
      description: 'Implement horizontal sharding for a basic database application',
      hours: 4,
      topics: ['Database Sharding', 'Horizontal Sharding', 'Database Scaling', 'Distributed Databases', 'Partitioning', 'Database Architecture']
    },
    {
      srNo: 5,
      name: 'Master-Slave Database Replication',
      description: 'Set up master-slave replication between multiple databases',
      hours: 4,
      topics: ['Database Replication', 'Master Slave Architecture', 'Database Clustering', 'Data Synchronization', 'High Availability', 'Database Management']
    },
    {
      srNo: 6,
      name: 'Data Pipeline Implementation',
      description: 'Design and implement a data pipeline to collect and preprocess raw data from multiple sources (CSV files, APIs, or databases)',
      hours: 4,
      topics: ['Data Pipelines', 'Data Collection', 'Data Preprocessing', 'ETL Process', 'Data Sources', 'Data Processing', 'Pipeline Architecture']
    },
    {
      srNo: 7,
      name: 'LRU Cache Server',
      description: 'Build a simple LRU (Least Recently Used) cache server',
      hours: 2,
      topics: ['Caching Systems', 'LRU Cache', 'Cache Algorithms', 'Memory Management', 'Performance Optimization', 'Cache Server']
    },
    {
      srNo: 8,
      name: 'Round-Robin Load Balancer',
      description: 'Implement a simple round-robin load balancer demonstrating how traffic is distributed across multiple servers',
      hours: 2,
      topics: ['Load Balancing', 'Round Robin Algorithm', 'Traffic Distribution', 'Server Management', 'Load Balancer', 'Distributed Systems']
    },
    {
      srNo: 9,
      name: 'Fault-Tolerant System with Circuit Breakers',
      description: 'Build a fault-tolerant system by introducing retries and circuit breakers in an API based application',
      hours: 2,
      topics: ['Fault Tolerance', 'Circuit Breakers', 'Retry Mechanisms', 'System Resilience', 'Error Handling', 'Reliability Engineering']
    },
    {
      srNo: 10,
      name: 'ML Model Deployment API',
      description: 'Create a REST API to deploy a machine learning model using Flask or FastAPI',
      hours: 4,
      topics: ['ML Model Deployment', 'Flask', 'FastAPI', 'Model Serving', 'API Development', 'Machine Learning Production', 'Model APIs']
    }
  ],
  selfStudy: 'The self-study contents will be declared at the commencement of the semester. Around 10% of the questions will be asked from self-study content.',
  totalTeachingHours: 30
}; 