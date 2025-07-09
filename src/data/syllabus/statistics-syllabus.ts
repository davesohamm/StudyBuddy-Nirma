import { CourseSyllabus } from '@/types';

export const statisticsSyllabus: CourseSyllabus = {
  courseCode: '6CS303CC25',
  courseName: 'Statistics for Data Science',
  credits: 4,
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
      description: 'apply statistical concepts such as descriptive statistics, probability distributions, and inferential techniques to analyze and summarize data',
      bloomLevel: 'BL3'
    },
    {
      clo: 'CLO2', 
      description: 'evaluate hypotheses and perform statistical tests to make data-driven decisions',
      bloomLevel: 'BL5'
    },
    {
      clo: 'CLO3',
      description: 'interpret and visualize statistical results effectively for decision-making in data science applications',
      bloomLevel: 'BL4'
    },
    {
      clo: 'CLO4',
      description: 'formulate and solve optimization problems using Linear Programming',
      bloomLevel: 'BL3'
    }
  ],
  units: [
    {
      unitNumber: 'Unit-I',
      title: 'Descriptive Statistics & Data Visualization',
      contents: 'Measures of central tendency, Measures of dispersion, Data visualization techniques (Histograms, Boxplots, Scatter plots, Bar charts), Exploratory Data Analysis (EDA)',
      teachingHours: 6,
      topics: [
        'Descriptive Statistics',
        'Central Tendency',
        'Mean',
        'Median',
        'Mode',
        'Measures of Dispersion',
        'Variance',
        'Standard Deviation',
        'Data Visualization',
        'Histograms',
        'Boxplots',
        'Scatter Plots',
        'Bar Charts',
        'Exploratory Data Analysis',
        'EDA',
        'Statistical Summaries',
        'Data Distribution'
      ]
    },
    {
      unitNumber: 'Unit-II',
      title: 'Probability Theory & Distributions',
      contents: 'Basics of probability (Rules, Conditional Probability, Bayes Theorem), Discrete and continuous probability distributions, Common distributions: Binomial, Poisson, Normal, Exponential, Central Limit Theorem (CLT)',
      teachingHours: 9,
      topics: [
        'Probability Theory',
        'Probability Rules',
        'Conditional Probability',
        'Bayes Theorem',
        'Probability Distributions',
        'Discrete Distributions',
        'Continuous Distributions',
        'Binomial Distribution',
        'Poisson Distribution',
        'Normal Distribution',
        'Exponential Distribution',
        'Central Limit Theorem',
        'CLT',
        'Expected Value',
        'Distribution Functions',
        'Random Variables'
      ]
    },
    {
      unitNumber: 'Unit-III', 
      title: 'Statistical Inference & Hypothesis Testing',
      contents: 'Point Estimation, Sampling methods and sampling distribution, Confidence intervals, Correlation and covariance, Hypothesis testing (t-test, z-test, ANOVA, Chi-square test), Type I & II Errors, p-value interpretation, Markov chains, Hidden Markov Models',
      teachingHours: 15,
      topics: [
        'Statistical Inference',
        'Point Estimation',
        'Sampling Methods',
        'Sampling Distribution',
        'Confidence Intervals',
        'Correlation',
        'Covariance',
        'Hypothesis Testing',
        'T-test',
        'Z-test',
        'ANOVA',
        'Chi-square Test',
        'Type I Error',
        'Type II Error',
        'P-value',
        'Statistical Significance',
        'Markov Chains',
        'Hidden Markov Models',
        'HMM',
        'Viterbi Algorithm',
        'Statistical Tests'
      ]
    },
    {
      unitNumber: 'Unit-IV',
      title: 'Optimization Techniques',
      contents: 'Introduction to Optimization, Role of optimization in data science and machine learning, Types of optimization problems: Unconstrained vs. Constrained, Linear & Nonlinear Optimization: Linear Programming (LP) and Simplex Method, Quadratic and Nonlinear Programming, least square optimization, Gradient-Based Optimization, Convex Optimization',
      teachingHours: 15,
      topics: [
        'Optimization',
        'Optimization Techniques',
        'Data Science Optimization',
        'Machine Learning Optimization',
        'Unconstrained Optimization',
        'Constrained Optimization',
        'Linear Programming',
        'LP',
        'Simplex Method',
        'Quadratic Programming',
        'Nonlinear Programming',
        'Least Square Optimization',
        'Gradient-Based Optimization',
        'Gradient Descent',
        'Convex Optimization',
        'Optimization Problems',
        'Mathematical Optimization'
      ]
    }
  ],
  references: [
    'Montgomery, D. C., & Runger, G. C., Applied Statistics and Probability for Engineers, Wiley',
    'Rice, J. A., Mathematical Statistics and Data Analysis, Cengage Learning',
    'Wasserman, L., All of Statistics: A Concise Course in Statistical Inference, Springer',
    'Hastie, T., Tibshirani, R., & Friedman, J., The Elements of Statistical Learning, Springer'
  ],
  experiments: [
    {
      srNo: 1,
      name: 'Descriptive Statistics Analysis',
      description: 'Given a dataset (e.g., student exam scores), compute the mean, median, mode, variance, and standard deviation. Analyze how these measures change with different datasets (skewed vs. normal distributions) and interpret the results',
      hours: 2,
      topics: ['Descriptive Statistics', 'Mean', 'Median', 'Mode', 'Variance', 'Standard Deviation', 'Skewed Distribution', 'Normal Distribution', 'Statistical Measures']
    },
    {
      srNo: 2,
      name: 'Data Visualization Techniques',
      description: 'Data Visualization Techniques (Histograms, Boxplots, Scatter Plots, Bar Charts): Use a financial dataset (e.g., stock prices) to create a boxplot. Identify outliers and extreme values, and interpret their significance. Discuss what might cause these outliers and their impact on data analysis',
      hours: 2,
      topics: ['Data Visualization', 'Histograms', 'Boxplots', 'Scatter Plots', 'Bar Charts', 'Financial Dataset', 'Outliers', 'Extreme Values', 'Stock Prices']
    },
    {
      srNo: 3,
      name: 'Exploratory Data Analysis (EDA)',
      description: 'Exploratory Data Analysis (EDA) on a Real-World Dataset: Perform exploratory analysis on Titanic or any other dataset',
      hours: 2,
      topics: ['Exploratory Data Analysis', 'EDA', 'Real-World Dataset', 'Titanic Dataset', 'Data Exploration', 'Data Analysis']
    },
    {
      srNo: 4,
      name: 'Correlation Analysis and Visualization',
      description: 'Analyze a dataset with multiple variables (e.g., sales vs. advertising budget, temperature vs. humidity). Compute the correlation matrix and create a heatmap to visualize relationships. Explain how these correlations can impact decision-making',
      hours: 2,
      topics: ['Correlation Analysis', 'Multiple Variables', 'Correlation Matrix', 'Heatmap', 'Relationship Visualization', 'Sales Analysis', 'Decision Making']
    },
    {
      srNo: 5,
      name: 'Probability Distribution Simulation',
      description: 'Simulating Discrete & Continuous Probability Distributions: Simulate 1,000 trials of flipping a fair coin. Use the binomial distribution to compute the expected number of heads and tails. Compare the simulated and theoretical results, and discuss the concept of expected value',
      hours: 2,
      topics: ['Probability Simulation', 'Discrete Distributions', 'Continuous Distributions', 'Coin Flipping', 'Binomial Distribution', 'Expected Value', 'Simulation vs Theory']
    },
    {
      srNo: 6,
      name: 'Hypothesis Testing Implementation',
      description: 'Hypothesis Testing (t-test, z-test, Chi-square test) on relevant use cases',
      hours: 4,
      topics: ['Hypothesis Testing', 'T-test', 'Z-test', 'Chi-square Test', 'Statistical Tests', 'Use Cases', 'Statistical Inference']
    },
    {
      srNo: 7,
      name: 'Viterbi Algorithm for Hidden Markov Models',
      description: 'Implement Viterbi algorithm for addressing the decoding problem in hidden Markov models',
      hours: 4,
      topics: ['Viterbi Algorithm', 'Hidden Markov Models', 'HMM', 'Decoding Problem', 'Algorithm Implementation', 'Markov Chains']
    },
    {
      srNo: 8,
      name: 'Weather Prediction using Hidden Markov Models',
      description: 'Given a sequence of weather observations (e.g., sunny, cloudy, rainy), and a set of possible hidden states (e.g., "high pressure system", "low pressure system"), use a Hidden Markov Model to predict the next weather state',
      hours: 4,
      topics: ['Weather Prediction', 'Hidden Markov Models', 'Weather Observations', 'Hidden States', 'Pressure Systems', 'State Prediction', 'Time Series']
    },
    {
      srNo: 9,
      name: 'ANOVA Testing for Group Comparison',
      description: 'Conduct an ANOVA test to compare the means of three or more groups and determine if at least one of the group means is significantly different from the others',
      hours: 4,
      topics: ['ANOVA Test', 'Group Comparison', 'Multiple Groups', 'Group Means', 'Statistical Significance', 'Variance Analysis']
    },
    {
      srNo: 10,
      name: 'Gradient Descent Optimization',
      description: 'Gradient Descent optimization for machine learning models',
      hours: 4,
      topics: ['Gradient Descent', 'Optimization', 'Machine Learning Models', 'Optimization Algorithms', 'Model Training', 'Convergence']
    }
  ],
  selfStudy: 'The self-study contents will be declared at the commencement of the semester. Around 10% of the questions will be asked from self-study content.',
  totalTeachingHours: 45
}; 