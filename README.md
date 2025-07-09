# 🎓 Nirma StudyBuddy Portal

A modern, responsive study buddy portal designed specifically for MTech Data Science students at Nirma University. This portal helps students manage their courses, assignments, study resources, and collaborate with peers.

## ✨ Features

### 🎯 Core Academic Features
- **Course Management**: Complete course catalog with syllabi, schedules, and professor information
- **Assignment Tracker**: Track assignments with deadlines, submission status, and grades
- **Grade Tracker & GPA Calculator**: Monitor academic performance
- **Academic Calendar Integration**: View important dates and deadlines
- **Study Resources**: Centralized repository for notes, PDFs, and materials

### 🚀 Built With
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "Nirma StudyBuddy"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Current Semester I Courses

The portal includes your current MTech Data Science Semester I courses with **complete syllabus integration**:

| Course Code | Course Name | Credits | Type | Status |
|-------------|-------------|---------|------|---------|
| 6CS402CC22 | Data Structures and Algorithms | 4 | Core | ✅ **Full Syllabus Added** |
| 6CS203CC22 | Applied Machine Learning | 4 | Core | ✅ **Full Syllabus Added** |
| 6CS271ME25 | Big Data Systems | 3 | Core | ✅ **Full Syllabus Added** |
| 6CS302CC25 | Data-Science System Design | 3 | Core | ✅ **Full Syllabus Added** |
| 6CS303CC25 | Statistics for Data Science | 4 | Core | ✅ **Full Syllabus Added** |
| 6CS282VA25 | Capstone Course | 2 | Supplementary | ✅ **Full Syllabus Added** |

### 🎯 **🎉 ALL SYLLABI COMPLETE! 100% COVERAGE 🎉**

**📚 Data Structures and Algorithms (DSA):**
- **5 Units** with detailed topics and teaching hours
- **10 Lab Experiments** with LeetCode problem links
- **Course Learning Outcomes (CLOs)** with Bloom's taxonomy levels
- **Reference Books** and suggested readings
- **Self-study guidelines**

**🤖 Applied Machine Learning (AML):**
- **7 Units** covering ML fundamentals to advanced concepts (45 hours)
- **10 Lab Experiments** with Python, sklearn, and hands-on implementation
- **4 CLOs** mapped to Bloom's taxonomy (BL2-BL5)
- **6 Reference books** including Mitchell, Bishop, and more
- **Complete practical component breakdown**

**🗄️ Big Data Systems (BDS):**
- **5 Units** covering Big Data fundamentals to advanced frameworks (45 hours)
- **7 Lab Experiments** with Hadoop, MapReduce, NoSQL, and real-world applications
- **4 CLOs** mapped to Bloom's taxonomy (BL2-BL5)
- **8 Reference books** including Spark, Hadoop, and Big Data analytics guides
- **Hands-on experience** with MongoDB, Neo4j, Apache Pig, and Hive

**⚙️ Data-Science System Design (DSSD):**
- **6 Units** covering system design fundamentals to production ML systems (30 hours)
- **10 Lab Experiments** with REST APIs, GraphQL, microservices, and ML deployment
- **4 CLOs** mapped to Bloom's taxonomy (BL3-BL6)
- **6 Reference books** including system design classics and ML production guides
- **Real-world case studies** covering recommendation engines, search ranking, and more

**📊 Statistics for Data Science (STATS):**
- **4 Units** covering statistical fundamentals to optimization techniques (45 hours)
- **10 Lab Experiments** with descriptive statistics, hypothesis testing, and optimization
- **4 CLOs** mapped to Bloom's taxonomy (BL3-BL5)
- **4 Reference books** including statistical learning and probability for engineers
- **Hands-on experience** with EDA, probability distributions, ANOVA, and Hidden Markov Models

**🎓 Capstone Course (CAP):**
- **5 Units** covering CS fundamentals review and integration (15 hours)
- **5 Lab Experiments** with programming, data structures, OS, networks, and databases
- **4 CLOs** mapped to Bloom's taxonomy (BL2-BL6)
- **5 Reference books** covering core computer science topics
- **Comprehensive review** of programming, data structures, operating systems, and DBMS

### 🏆 **Portal Achievement Summary**

**📈 Complete Semester I MTech Data Science Curriculum:**
- ✅ **6/6 Courses** with full syllabi integrated
- ✅ **37 Units** with detailed content and teaching hours  
- ✅ **52 Lab Experiments** with hands-on implementation
- ✅ **24 CLOs** mapped to Bloom's taxonomy levels
- ✅ **34 Reference Books** from top publishers
- ✅ **250+ Searchable Topics** across all domains
- ✅ **210 Total Teaching Hours** of curriculum content

**🔍 Smart Search Features:**
- Advanced semantic search across all course content
- Auto-suggestions and relevance scoring
- Search by course codes, topics, experiments, or references
- Responsive design for all devices
- Real-time search results with highlighting

## 📱 Features Showcase

### Dashboard Overview
- **Quick Stats**: Total courses, credits, GPA tracking
- **Course Cards**: Interactive course information with schedules
- **Assignment Tracker**: Upcoming deadlines and submission status
- **Quick Links**: Easy access to study resources and tools

### 🔍 **Advanced Search System** (NEW!)
- **Intelligent Search**: Search across courses, units, experiments, topics, and references
- **Auto-suggestions**: Smart autocomplete based on course content
- **Relevance Scoring**: Results ranked by relevance with highlighted matches
- **Filter by Type**: Search specifically for courses, labs, topics, or references
- **LeetCode Integration**: Direct links to coding problems from lab exercises

### Course Management
- **Detailed Course Views**: Complete syllabus with units, CLOs, and experiments
- **Professor Profiles**: Contact details, office hours, and research areas  
- **Course schedules**: Class timings with room information
- **Learning Outcomes**: Bloom's taxonomy mapped CLOs
- **Reference Materials**: Comprehensive textbook listings

### Assignment Tracking
- Visual status indicators (pending, submitted, graded, overdue)
- Due date reminders with countdown
- Grade tracking and performance analytics
- File attachment support

## 🎨 Design Highlights

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface following modern design principles
- **Nirma Branding**: Custom color scheme matching university identity
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🗂️ Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # UI components (Header, etc.)
│   ├── courses/       # Course-related components
│   ├── assignments/   # Assignment tracking components
│   └── dashboard/     # Dashboard components
├── data/              # Mock data and course information
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📈 Roadmap

### Next Phase Features
- [ ] User authentication and profiles
- [ ] Real-time collaboration tools
- [ ] Study group formation
- [ ] Resource sharing and rating system
- [ ] Discussion forums
- [ ] Grade analytics and insights
- [ ] Mobile app (React Native)
- [ ] Integration with university systems

### Study Resources Enhancement
- [ ] File upload and categorization
- [ ] Search functionality
- [ ] Version control for shared documents
- [ ] Collaborative note-taking

### Social Features
- [ ] Study buddy matching
- [ ] Group chat functionality
- [ ] Peer-to-peer tutoring
- [ ] Study session scheduling

## 🤝 Contributing

This is a student project for Nirma University. Suggestions and improvements are welcome!

## 📧 Contact

For questions or suggestions regarding this StudyBuddy portal, please reach out through the university's official channels.

---

**Made with ❤️ for MTech Data Science students at Nirma University** 