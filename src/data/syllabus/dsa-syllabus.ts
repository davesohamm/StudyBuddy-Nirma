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

export const dsaSyllabus: CourseSyllabus = {
  courseCode: '6CS402CC22',
  courseName: 'Data Structures and Algorithms',
  credits: 4,
  courseType: 'Core',
  yearOfIntroduction: '2022-23',
  practicalComponent: {
    lecture: 3,
    tutorial: 0,
    practical: 2,
    totalCredits: 4
  },
  courseLearningOutcomes: [
    {
      clo: 'CLO1',
      description: 'relate to time & space complexity and formal aspects of algorithms',
      bloomLevel: 'BL2'
    },
    {
      clo: 'CLO2', 
      description: 'identify appropriate data structures and approaches for efficient algorithm design',
      bloomLevel: 'BL3'
    },
    {
      clo: 'CLO3',
      description: 'analyse algorithmic techniques to solve computational problems',
      bloomLevel: 'BL3'
    },
    {
      clo: 'CLO4',
      description: 'design and implement efficient algorithms using various approaches',
      bloomLevel: 'BL6'
    }
  ],
  units: [
    {
      unitNumber: 'Unit-I',
      title: 'Introduction to Data Structure and Algorithms',
      contents: 'Notions of time and space complexity, Asymptotic Analysis, Recurrence relation, Overview of linear and nonlinear data structures such as Linked List, Tree, Binary Heap, Binomial Heap, Fibonacci Heap',
      teachingHours: 12,
      topics: [
        'Time Complexity',
        'Space Complexity', 
        'Asymptotic Analysis',
        'Big O Notation',
        'Recurrence Relations',
        'Linked Lists',
        'Trees',
        'Binary Heap',
        'Binomial Heap',
        'Fibonacci Heap',
        'Linear Data Structures',
        'Non-linear Data Structures'
      ]
    },
    {
      unitNumber: 'Unit-II',
      title: 'Divide and Conquer',
      contents: 'General template, Various algorithm implementations like Binary search, Merge sort, Quick sort, etc.',
      teachingHours: 9,
      topics: [
        'Divide and Conquer',
        'Binary Search',
        'Merge Sort',
        'Quick Sort',
        'Algorithm Templates',
        'Sorting Algorithms',
        'Searching Algorithms'
      ]
    },
    {
      unitNumber: 'Unit-III', 
      title: 'Greedy Algorithms',
      contents: 'Making change, graphs and minimum spanning tree, shortest path, Knapsack problem, Scheduling, etc.',
      teachingHours: 9,
      topics: [
        'Greedy Algorithms',
        'Making Change Problem',
        'Graph Algorithms',
        'Minimum Spanning Tree',
        'Shortest Path',
        'Knapsack Problem',
        'Job Scheduling',
        'Activity Selection'
      ]
    },
    {
      unitNumber: 'Unit-IV',
      title: 'Dynamic Programming',
      contents: 'Introduction of Dynamic Programming, Principle of Optimality, Examples like Single source shortest paths, Knapsack problem, Chained matrix multiplication, Longest common subsequence, etc.',
      teachingHours: 8,
      topics: [
        'Dynamic Programming',
        'Principle of Optimality',
        'Single Source Shortest Path',
        'Knapsack Problem',
        'Chain Matrix Multiplication',
        'Longest Common Subsequence',
        'Optimal Substructure',
        'Memoization',
        'Tabulation'
      ]
    },
    {
      unitNumber: 'Unit-V',
      title: 'Graph Algorithms',
      contents: 'Elementary algorithms, Depth-first search, Breadth First Search, Disjoint set structures, Backtracking, and Branch & Bound techniques with related examples.',
      teachingHours: 7,
      topics: [
        'Graph Algorithms',
        'Depth First Search',
        'Breadth First Search',
        'DFS',
        'BFS',
        'Disjoint Set Union',
        'Union Find',
        'Backtracking',
        'Branch and Bound',
        'Graph Traversal'
      ]
    }
  ],
  references: [
    'Gilles Brassard and Paul Bratley, Fundamentals of Algorithmics, Prentice Hall',
    'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest& Clifford Stein, Introduction to Algorithms, Prentice Hall',
    'Ellis Horowitz, SartajSahni, Sangutahevar Rajasekaran, Fundamentals of Computer Algorithms, University Press',
    'Jean-Paul Tremblay and Paul G. Sorenson, An Introduction to Data Structures with Applications, McGraw Hill',
    'Robert L. Kruse, Data Structures and Program Design in C, Prentice Hall'
  ],
  experiments: [
    {
      srNo: 1,
      name: 'Sorting Algorithm Analysis',
      description: 'Implement iterative and full recursive versions of the following sorting techniques and repeat the experiment for larger values of n with different input patterns, and plot the comparison graph of a number of elements versus execution time taken.',
      hours: 2,
      topics: ['Selection Sort', 'Bubble Sort', 'Insertion Sort', 'Sorting Analysis', 'Time Complexity Analysis']
    },
    {
      srNo: 2,
      name: 'Searching Algorithms',
      description: 'a. Implement linear and binary searching and compare the time complexity of both algorithms for larger data sets. b. You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element, which appears exactly once. Return the single element that appears only once. Your solution must run in O(log n) time and O(1) space.',
      hours: 2,
      leetcodeLinks: ['https://leetcode.com/problems/single-element-in-a-sorted-array/'],
      topics: ['Linear Search', 'Binary Search', 'Time Complexity', 'Space Complexity', 'Array Problems']
    },
    {
      srNo: 3,
      name: 'Recursion and Complexity Analysis', 
      description: 'a. Implement recursive algorithm for the following and evaluate the time complexity of each algorithm: Finding Factorial, Sum of n numbers, Tower of Hanoi, Finding min-max. b. Given an integer n, return true if it is a power of four. Otherwise, return false. An integer n is a power of four, if there exists an integer x such that n == 4x.',
      hours: 4,
      leetcodeLinks: ['https://leetcode.com/problems/power-of-four/'],
      topics: ['Recursion', 'Factorial', 'Tower of Hanoi', 'Min-Max', 'Power of Four', 'Mathematical Problems']
    },
    {
      srNo: 4,
      name: 'Linked List to Binary Search Tree',
      description: 'Solve the following problems on Leet Code coding platform: a. Given the head of a singly linked list where elements are sorted in ascending order, convert sorted list to a binary search tree.',
      hours: 4,
      leetcodeLinks: ['https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/', 
        'https://leetcode.com/problems/middle-of-the-linked-list/',
      ],
      topics: ['Linked Lists', 'Binary Search Tree', 'Tree Construction', 'Sorted Arrays']
    },
    {
      srNo: 5,
      name: 'Advanced Algorithm Problems',
      description: 'b. Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node. a. Solve the Make-Change problem using the Greedy approach and dynamic programming. b. Given a string s, return true if the s can be palindrome after deleting at most one character from it. c. You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return 0.',
      hours: 4,
      leetcodeLinks: [
        'https://leetcode.com/problems/valid-palindrome-ii/',
        'https://leetcode.com/problems/coin-change-ii/description/'
      ],
      topics: ['Middle Node', 'Palindrome', 'Coin Change', 'Dynamic Programming', 'Greedy Algorithms']
    },
    {
      srNo: 6,
      name: 'Minimum Spanning Tree',
      description: "Implement Kruskal's algorithm to find MST using a greedy approach.",
      hours: 4,
      topics: ['Minimum Spanning Tree', 'Kruskal Algorithm', 'Greedy Approach', 'Graph Algorithms']
    },
    {
      srNo: 7,
      name: 'Job Scheduling',
      description: 'Implement Job Scheduling problems using a greedy approach.',
      hours: 2,
      topics: ['Job Scheduling', 'Greedy Algorithms', 'Optimization Problems']
    },
    {
      srNo: 8,
      name: 'Knapsack Problem',
      description: 'Implement 0-1 knapsack problem using dynamic programming.',
      hours: 2,
      topics: ['Knapsack Problem', 'Dynamic Programming', 'Optimization', '0-1 Knapsack']
    },
    {
      srNo: 9,
      name: 'Longest Common Subsequence',
      description: 'Given two sequences X and Y, find the longest common subsequence (LCS) of X and Y using dynamic programming.',
      hours: 2,
      topics: ['Longest Common Subsequence', 'Dynamic Programming', 'String Algorithms', 'LCS']
    },
    {
      srNo: 10,
      name: 'Maximum Score Words',
      description: 'Given a list of words, a list of single letters (might be repeating), and a score of every character. Return the maximum score of any valid set of words formed by using the given letters (words[i] cannot be used two or more times). It is not necessary to use all characters in letters, and each letter can only be used once. Score of letters \'a\', \'b\', \'c\', ... ,\'z\' is given by score[0], score[1], ... , score[25] respectively.',
      hours: 4,
      leetcodeLinks: ['https://leetcode.com/problems/maximum-score-words-formed-by-letters/description/'],
      topics: ['Backtracking', 'Word Formation', 'Optimization', 'String Problems', 'Dynamic Programming']
    }
  ],
  selfStudy: 'The self-study contents will be declared at the commencement of the semester. Around 10% of the questions will be asked from self-study content.',
  totalTeachingHours: 45
}; 