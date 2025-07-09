import { CourseSyllabus } from '@/types';

export const bigDataSyllabus: CourseSyllabus = {
  courseCode: '6CS271ME25',
  courseName: 'Big Data Systems',
  credits: 3,
  courseType: 'Core',
  yearOfIntroduction: '2025-26',
  practicalComponent: {
    lecture: 3,
    tutorial: 0,
    practical: 2,
    totalCredits: 4
  },
  courseLearningOutcomes: [
    {
      clo: 'CLO1',
      description: 'outline the significance, challenges, and storage platforms of Big Data in modern computing',
      bloomLevel: 'BL2'
    },
    {
      clo: 'CLO2', 
      description: 'model Big Data applications using Hadoop, NoSQL databases, and distributed computing platforms',
      bloomLevel: 'BL3'
    },
    {
      clo: 'CLO3',
      description: 'utilize big Data processing frameworks like Hadoop, Pig, and Hive for practical business analytics',
      bloomLevel: 'BL3'
    },
    {
      clo: 'CLO4',
      description: 'evaluate the performance of Hadoop applications by analyzing job execution, scheduling, and data processing efficiency',
      bloomLevel: 'BL5'
    }
  ],
  units: [
    {
      unitNumber: 'Unit-I',
      title: 'Introduction to Big Data and Big Data Storage Platforms',
      contents: 'Evolution of Big Data, Types of Big Data, Definition of Big Data, Importance of Big data analytics, Challenges of Conventional Systems, Big data platforms and data storage',
      teachingHours: 6,
      topics: [
        'Big Data Evolution',
        'Types of Big Data',
        'Big Data Definition',
        'Big Data Analytics',
        'Data Analytics Importance',
        'Conventional Systems Challenges',
        'Big Data Platforms',
        'Data Storage Systems',
        'Storage Platforms',
        'Modern Computing',
        'Data Management'
      ]
    },
    {
      unitNumber: 'Unit-II',
      title: 'Hadoop and HDFS',
      contents: 'Hadoop Ecosystem, Comparisons of RDBMS and Hadoop, Distributed Computing Challenges, Hadoop Overview, Hadoop Ecosystem, Hadoop Environment and setup, Hadoop Configuration and administration, Processing Data with Hadoop, Hadoop YARN, Hadoop in the Cloud',
      teachingHours: 6,
      topics: [
        'Hadoop Ecosystem',
        'HDFS',
        'Hadoop Distributed File System',
        'RDBMS vs Hadoop',
        'Distributed Computing',
        'Computing Challenges',
        'Hadoop Overview',
        'Hadoop Environment',
        'Hadoop Setup',
        'Hadoop Configuration',
        'Hadoop Administration',
        'Data Processing',
        'Hadoop YARN',
        'Cloud Computing',
        'Hadoop Cloud',
        'Distributed Systems'
      ]
    },
    {
      unitNumber: 'Unit-III', 
      title: 'MapReduce',
      contents: 'working with Map Reduce, Anatomy of a Map Reduce Job Run, Failures, Job Scheduling, Shuffle, and Sort, Task Execution, Map Reduce Types and Formats, Map Reduce Features',
      teachingHours: 10,
      topics: [
        'MapReduce',
        'Map Reduce',
        'MapReduce Programming',
        'Job Execution',
        'Job Scheduling',
        'MapReduce Jobs',
        'Task Execution',
        'Shuffle and Sort',
        'MapReduce Types',
        'MapReduce Formats',
        'MapReduce Features',
        'Distributed Processing',
        'Parallel Processing',
        'Job Failures',
        'Fault Tolerance'
      ]
    },
    {
      unitNumber: 'Unit-IV',
      title: 'NoSQL Databases',
      contents: 'Introduction to NoSQL Databases, Types of NoSQL databases, SQL Vs NoSQL, Why NoSQL, Introduction to the Document Database (MongoDB or similar), Data Types and CRUD operations in Document Database, Introduction to the Graph Database (Neo4j or similar), CRUD operations in Graph Database, Relevant Case Studies',
      teachingHours: 14,
      topics: [
        'NoSQL Databases',
        'NoSQL',
        'Database Types',
        'SQL vs NoSQL',
        'Document Database',
        'MongoDB',
        'Graph Database',
        'Neo4j',
        'CRUD Operations',
        'Data Types',
        'Database Operations',
        'Document Store',
        'Graph Store',
        'Case Studies',
        'Database Design',
        'Non-Relational Databases'
      ]
    },
    {
      unitNumber: 'Unit-V',
      title: 'Introduction to other frameworks',
      contents: 'Data Processing Operators in Pig, HiveQL, Querying Data in Hive, Applications on Big Data using Pig and Hive, Fundamentals of HBase and ZooKeeper',
      teachingHours: 9,
      topics: [
        'Apache Pig',
        'Pig Latin',
        'Data Processing Operators',
        'Apache Hive',
        'HiveQL',
        'Hive Queries',
        'Data Querying',
        'HBase',
        'Apache HBase',
        'ZooKeeper',
        'Apache ZooKeeper',
        'Big Data Frameworks',
        'Data Processing Frameworks',
        'Distributed Storage',
        'Coordination Services'
      ]
    }
  ],
  references: [
    'Bill Chambers and Matei Zaharis, Spark: The Definitive Guide: Big Data Processing Made Simple, O\'Reilly',
    'Michael Berthold, David J. Hand, Intelligent Data Analysis, Springer',
    'Chris Eaton, Dirk DeRoos, Tom Deutsch, George Lapis, Paul Zikopoulos, Understanding Big Data: Analytics for Enterprise Class Hadoop and Streaming Data, McGraw Hill',
    'Anand Rajaraman and Jeffrey David Ullman, Mining of Massive Datasets, Cambridge University Press',
    'Seema Acharya and Subhashini C, Big Data and Analytics, Wiley',
    'Dan Mccreary, Ann Kelly, Making Sense of NoSQL Manning Publication dream tech press',
    'Paul Zikopoulos, Dirk deRoos, Krishnan Parasuraman, Thomas Deutsch, James Giles, David Corrigan, Harness the Power of Big Data The IBM Big Data Platform, Tata McGraw Hill Publications',
    'Anand Rajaraman and Jeffrey David Ullman, Mining of Massive Datasets, Cambridge University Press'
  ],
  experiments: [
    {
      srNo: 1,
      name: 'Big Data Applications Study',
      description: 'Study and explore various applications of big data in different domains. Choose one of them and study in detail. Also, write down the report on different types of digital data generated in selected applications. For example: Big Data in Retail, Big Data in Healthcare, Big Data in Education, Big Data in E-commerce, Big Data in Media and Entertainment, Big Data in Finance, Big Data in Travel Industry, Big Data in Telecom',
      hours: 4,
      topics: ['Big Data Applications', 'Domain Applications', 'Retail Analytics', 'Healthcare Analytics', 'Education Analytics', 'E-commerce Analytics', 'Media Analytics', 'Finance Analytics', 'Travel Analytics', 'Telecom Analytics', 'Digital Data Types', 'Data Generation']
    },
    {
      srNo: 2,
      name: 'Hadoop Single-Node Cluster Setup',
      description: 'Set up a single-node Hadoop cluster and apply HDFS commands to the single-node Hadoop Cluster',
      hours: 4,
      topics: ['Hadoop Installation', 'Single-Node Cluster', 'HDFS Commands', 'Hadoop Setup', 'Cluster Configuration', 'Distributed File System']
    },
    {
      srNo: 3,
      name: 'MapReduce Algorithm Design and Analysis',
      description: 'a) Design MapReduce algorithms to take a very large file of integers and produce as output: The largest integer, The average of all the integers, The same set of integers but with each integer appearing only once, The count of the number of distinct integers in the input. b) Analyze the impact of different numbers of mappers and reducers on the same definition as practical 3(a). Prepare a conclusive report on the analysis',
      hours: 6,
      topics: ['MapReduce Algorithms', 'Algorithm Design', 'Integer Processing', 'Largest Integer', 'Average Calculation', 'Distinct Elements', 'Mappers and Reducers', 'Performance Analysis', 'MapReduce Optimization']
    },
    {
      srNo: 4,
      name: 'MongoDB Environment and CRUD Operations',
      description: 'Set up the MongoDB environment in your system. Import restaurant dataset and perform CRUD operation',
      hours: 4,
      topics: ['MongoDB Setup', 'MongoDB Environment', 'Restaurant Dataset', 'CRUD Operations', 'Document Database', 'Data Import', 'Database Operations']
    },
    {
      srNo: 5,
      name: 'Graph Database CRUD Operations',
      description: 'To perform CRUD operations on Graph Database (Neo4j or similar)',
      hours: 4,
      topics: ['Graph Database', 'Neo4j', 'CRUD Operations', 'Graph Operations', 'Graph Queries', 'Node Operations', 'Relationship Operations']
    },
    {
      srNo: 6,
      name: 'Big Data Analytics and Cloud Study',
      description: 'To study and prepare a report on Big Data Analytics and Cloud',
      hours: 4,
      topics: ['Big Data Analytics', 'Cloud Computing', 'Cloud Analytics', 'Big Data Cloud', 'Analytics Report', 'Cloud Platforms', 'Distributed Analytics']
    },
    {
      srNo: 7,
      name: 'Apache Pig and Hive Data Processing',
      description: 'To load an employee dataset into Apache Pig, filter employees earning above ₹50,000 and store the results in HDFS. Then, using Apache Hive, create a table, load the same dataset, and write a query to find the average salary per department, analyzing structured data efficiently',
      hours: 4,
      topics: ['Apache Pig', 'Apache Hive', 'Employee Dataset', 'Data Filtering', 'HDFS Storage', 'Hive Tables', 'SQL Queries', 'Salary Analysis', 'Department Analysis', 'Structured Data', 'Data Efficiency']
    }
  ],
  selfStudy: 'The self-study contents will be declared at the commencement of the semester. Around 10% of the questions will be asked from self-study content.',
  totalTeachingHours: 45
}; 