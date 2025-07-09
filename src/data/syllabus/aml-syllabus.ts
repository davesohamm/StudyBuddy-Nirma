import { CourseSyllabus } from '@/types';

export const amlSyllabus: CourseSyllabus = {
  courseCode: '6CS203CC22',
  courseName: 'Applied Machine Learning',
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
      description: 'explain statistical methods as the basis of the machine learning domain',
      bloomLevel: 'BL2'
    },
    {
      clo: 'CLO2', 
      description: 'identify the learning algorithms for appropriate applications',
      bloomLevel: 'BL3'
    },
    {
      clo: 'CLO3',
      description: 'analyse machine learning techniques to solve problems in applicable domains',
      bloomLevel: 'BL4'
    },
    {
      clo: 'CLO4',
      description: 'evaluate algorithms based on different metrics and parameters',
      bloomLevel: 'BL5'
    }
  ],
  units: [
    {
      unitNumber: 'Unit-I',
      title: 'Introduction to AML',
      contents: 'Motivation and Applications, importance of Data Visualisation, Basics of Supervised and Unsupervised Learning, Significance of Model Training',
      teachingHours: 3,
      topics: [
        'Machine Learning Motivation',
        'ML Applications',
        'Data Visualization',
        'Supervised Learning',
        'Unsupervised Learning',
        'Model Training',
        'ML Fundamentals'
      ]
    },
    {
      unitNumber: 'Unit-II',
      title: 'Regression Techniques',
      contents: 'Basic concepts and applications of Regression, Simple Linear Regression – Gradient Descent and Normal Equation Method, Multiple Linear Regression, Non-Linear Regression, Linear Regression with Regularization, Hyper-parameters tuning, and Loss Functions',
      teachingHours: 14,
      topics: [
        'Linear Regression',
        'Simple Linear Regression',
        'Multiple Linear Regression',
        'Gradient Descent',
        'Normal Equation Method',
        'Non-Linear Regression',
        'Regularization',
        'Ridge Regression',
        'Lasso Regression',
        'Hyperparameter Tuning',
        'Loss Functions',
        'Cost Functions',
        'Optimization'
      ]
    },
    {
      unitNumber: 'Unit-III', 
      title: 'Classification Techniques',
      contents: 'Naive Bayes Classification, Fitting Multivariate Bernoulli Distribution, Gaussian Distribution and Multinomial Distribution, K-Nearest Neighbours, Decision trees. Support Vector Machines: Hard Margin and Soft Margin, Kernels and Kernel Trick, Evaluation Measures for Classification Techniques',
      teachingHours: 10,
      topics: [
        'Classification',
        'Naive Bayes',
        'Multivariate Bernoulli Distribution',
        'Gaussian Distribution', 
        'Multinomial Distribution',
        'K-Nearest Neighbors',
        'KNN',
        'Decision Trees',
        'Support Vector Machines',
        'SVM',
        'Hard Margin',
        'Soft Margin',
        'Kernels',
        'Kernel Trick',
        'RBF Kernel',
        'Classification Metrics',
        'Confusion Matrix'
      ]
    },
    {
      unitNumber: 'Unit-IV',
      title: 'Model Evaluation',
      contents: 'Bias, Variance, Cross-validation, Precision-Recall, ROC Curve, Out-of-Bag metric, the evaluation metric for regression',
      teachingHours: 3,
      topics: [
        'Model Evaluation',
        'Bias-Variance Tradeoff',
        'Cross Validation',
        'K-Fold Cross Validation',
        'Precision',
        'Recall', 
        'F1-Score',
        'ROC Curve',
        'AUC',
        'Out-of-Bag Error',
        'Regression Metrics',
        'MSE',
        'RMSE',
        'MAE',
        'R-squared'
      ]
    },
    {
      unitNumber: 'Unit-V',
      title: 'Artificial Neural Networks',
      contents: 'Biological Neurons and Biological Neural Networks, Perceptron Learning, Activation Functions, Multilayer Perceptrons, Back-propagation Neural Networks, Competitive Neural Networks, Regularization',
      teachingHours: 8,
      topics: [
        'Neural Networks',
        'Artificial Neural Networks',
        'Biological Neurons',
        'Perceptron',
        'Perceptron Learning',
        'Activation Functions',
        'Sigmoid Function',
        'ReLU',
        'Tanh',
        'Multilayer Perceptron',
        'MLP',
        'Backpropagation',
        'Feedforward Networks',
        'Competitive Neural Networks',
        'Neural Network Regularization',
        'Dropout'
      ]
    },
    {
      unitNumber: 'Unit-VI',
      title: 'Clustering',
      contents: 'K-means Clustering Algorithm, Expectation Maximization, Convergence, Application of K-means, Gaussian Mixture Models: EM for GMM',
      teachingHours: 4,
      topics: [
        'Clustering',
        'Unsupervised Learning',
        'K-means Clustering',
        'K-means Algorithm',
        'Expectation Maximization',
        'EM Algorithm',
        'Convergence',
        'Cluster Analysis',
        'Gaussian Mixture Models',
        'GMM',
        'EM for GMM'
      ]
    },
    {
      unitNumber: 'Unit-VII',
      title: 'Advanced Concepts',
      contents: 'Basics of Semi-Supervised and Reinforcement Learning, PCA, Linear Discriminant Analysis, Introduction to Deep Learning',
      teachingHours: 3,
      topics: [
        'Semi-Supervised Learning',
        'Reinforcement Learning',
        'Principal Component Analysis',
        'PCA',
        'Linear Discriminant Analysis',
        'LDA',
        'Dimensionality Reduction',
        'Deep Learning',
        'Feature Extraction',
        'Feature Selection'
      ]
    }
  ],
  references: [
    'Tom Mitchell, Machine Learning, McGraw Hill',
    'C. Bishop, Pattern Recognition and Machine Learning, Springer',
    'R. O. Duda, P. E. Hart and D. G. Stork, Pattern Classification and Scene Analysis, Wiley',
    'Kishan Mehrotra, Chilukuri Mohan, and Sanjay Ranka, Elements of Artificial Neural Networks, Penram International',
    'Rajjan Shinghal, Pattern Recognition, Techniques and Applications, OXFORD',
    'Athem Ealpaydın, Introduction to Machine Learning, Prentice Hall'
  ],
  experiments: [
    {
      srNo: 1,
      name: 'Introduction to Python and Numpy',
      description: 'Introduction to Python programming language and Numpy library for numerical computing and array operations',
      hours: 2,
      topics: ['Python Programming', 'Numpy', 'Array Operations', 'Numerical Computing']
    },
    {
      srNo: 2,
      name: 'Introduction to Pandas, Matplotlib and Sklearn',
      description: 'Introduction to data manipulation with Pandas, data visualization with Matplotlib, and machine learning with Scikit-learn',
      hours: 2,
      topics: ['Pandas', 'Data Manipulation', 'Matplotlib', 'Data Visualization', 'Scikit-learn', 'sklearn']
    },
    {
      srNo: 3,
      name: 'Linear Regression Implementation',
      description: 'Simple and Multiple Linear Regression using Gradient Descent and normal Equation Methods (without using sklearn or equivalent library for both)',
      hours: 4,
      topics: ['Linear Regression', 'Gradient Descent', 'Normal Equation', 'Simple Linear Regression', 'Multiple Linear Regression', 'Implementation from Scratch']
    },
    {
      srNo: 4,
      name: 'Linear Regression with Regularization',
      description: 'Linear Regression with Regularization (without using sklearn or equivalent library) and Simple and Multiple Linear Regression with and without regularization using Sklearn',
      hours: 2,
      topics: ['Regularization', 'Ridge Regression', 'Lasso Regression', 'sklearn Implementation', 'Regularized Regression']
    },
    {
      srNo: 5,
      name: 'Naive Bayes Classification',
      description: 'Naive-Bayes – Multivariate Bernoulli, Multinomial and Gaussian using sklearn',
      hours: 4,
      topics: ['Naive Bayes', 'Multivariate Bernoulli', 'Multinomial Naive Bayes', 'Gaussian Naive Bayes', 'Classification']
    },
    {
      srNo: 6,
      name: 'Decision Trees',
      description: 'Decision Trees – ID3, C4.5 using sklearn',
      hours: 2,
      topics: ['Decision Trees', 'ID3 Algorithm', 'C4.5 Algorithm', 'Tree-based Classification', 'sklearn']
    },
    {
      srNo: 7,
      name: 'Support Vector Classification',
      description: 'Support Vector Classification using sklearn',
      hours: 4,
      topics: ['Support Vector Machines', 'SVM', 'Classification', 'Support Vector Classification', 'sklearn']
    },
    {
      srNo: 8,
      name: 'Perceptron Implementation',
      description: 'AND gate using Perceptron Learning (self-implementation)',
      hours: 4,
      topics: ['Perceptron', 'Perceptron Learning', 'AND Gate', 'Neural Network Basics', 'Implementation from Scratch']
    },
    {
      srNo: 9,
      name: 'Backpropagation Neural Networks',
      description: 'Ex-OR Gate/any other problem using Backpropagation Neural Networks (self-implementation)',
      hours: 4,
      topics: ['Backpropagation', 'Neural Networks', 'XOR Gate', 'Multilayer Perceptron', 'Implementation from Scratch']
    },
    {
      srNo: 10,
      name: 'K-means Clustering',
      description: 'K-means clustering using sklearn',
      hours: 2,
      topics: ['K-means', 'Clustering', 'Unsupervised Learning', 'sklearn', 'Cluster Analysis']
    }
  ],
  selfStudy: 'The self-study contents will be declared at the commencement of the semester. Around 10% of the questions will be asked from self-study content.',
  totalTeachingHours: 45
}; 