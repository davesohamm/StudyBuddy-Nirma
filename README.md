# 🎓 Nirma StudyBuddy Portal

A comprehensive, modern study management portal designed specifically for MTech Data Science students at Nirma University. This portal provides a complete academic ecosystem for managing courses, assignments, timetables, and study resources.

## ✨ Features

### 🎯 **Core Academic Features**
- **📚 Course Management**: Complete course catalog with detailed syllabi, schedules, and professor information
- **📅 Class Timetable**: Interactive weekly timetable with lab sessions and room information
- **📋 Assignment Tracker**: Comprehensive assignment management with deadlines, submission status, and notifications
- **📊 Academic Calendar**: Complete semester schedule with holidays, events, and important dates
- **🔔 Smart Notifications**: Real-time assignment notifications with overdue alerts
- **👨‍🏫 Faculty Directory**: Complete professor profiles with contact information

### 🚀 **Built With**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **MongoDB** - Database for assignments and user data
- **Brevo** - Email notification system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- MongoDB database (for production)

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

The portal includes your complete MTech Data Science Semester I curriculum:

| Course Code | Course Name | Faculty | Credits | Type |
|-------------|-------------|---------|---------|------|
| 6CS402CC22 | Data Structures and Algorithms | Dr. Ankit Thakkar | 4 | Core |
| 6CS203CC22 | Applied Machine Learning | Dr. Nilesh Patel | 4 | Core |
| 6CS271ME25 | Big Data Systems | Dr. Jaiprakash Verma | 3 | Core |
| 6CS302CC25 | Data-Science System Design | Dr. Monika Shah | 3 | Core |
| 6CS303CC25 | Statistics for Data Science | Dr. Swati Jain | 4 | Core |
| 6CS282VA25 | Capstone Course | Dr. Monika Shah | 2 | Supplementary |

### 🎯 **Complete Syllabus Integration**
All courses include:
- **Detailed Unit-wise Content** with teaching hours
- **Lab Experiments** with hands-on implementation
- **Course Learning Outcomes (CLOs)** mapped to Bloom's taxonomy
- **Reference Books** and suggested readings
- **Self-study guidelines**

## 📱 Features Showcase

### 🏠 **Dashboard Overview**
- **Quick Links**: Class WhatsApp Group, Academic Calendar, Study Resources, Class Timetable
- **Course Cards**: Interactive course information with venue details
- **Assignment Notifications**: Real-time assignment count with overdue alerts
- **AI Study Assistant**: Intelligent chat-based study help

### 📅 **Class Timetable**
- **Weekly Schedule**: Monday to Friday class schedule
- **Lab Sessions**: 2-hour lab sessions with dedicated faculty
- **Room Information**: Complete venue details (E501, E502, etc.)
- **Time Slots**: 11:40 AM to 6:20 PM with recess period
- **Mobile Responsive**: Optimized for all devices

### 📋 **Assignment Management**
- **Admin Panel**: Faculty can create and manage assignments
- **Smart Due Date Picker**: Advanced calendar with time selection
- **Subject Integration**: 6 core subjects with 5 faculty members
- **Notification System**: Email alerts and in-app notifications
- **Status Tracking**: Pending, submitted, graded, and overdue status

### 📊 **Academic Calendar**
- **Semester Schedule**: Complete academic timeline
- **Holiday List**: All university holidays and breaks
- **Important Events**: Exam dates, submission deadlines
- **Visual Timeline**: Easy-to-read calendar format

### 🔔 **Notification System**
- **Bell Icon**: Shows assignment count (red for overdue, blue for total)
- **Notification Page**: Detailed assignment information
- **Email Integration**: Brevo-powered email notifications
- **Real-time Updates**: Live assignment tracking

### 👨‍🏫 **Admin Features**
- **Assignment Creation**: Advanced form with custom date picker
- **User Management**: View and manage registered users
- **Email System**: Send announcements to all users
- **Data Management**: Comprehensive admin controls

### 📚 **Study Resources**
- **Coming Soon Page**: Beautiful placeholder for future LMS integration
- **Resource Organization**: Categorized study materials
- **Search Functionality**: Find specific topics quickly
- **File Management**: Upload and organize documents

## 🎨 Design Highlights

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Nirma Branding**: Custom color scheme matching university identity
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Dark Mode Ready**: Optimized for different viewing preferences

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── assignments/   # Assignment management
│   │   ├── auth/          # Authentication
│   │   └── chat/          # AI chat system
│   ├── timetable/         # Class timetable page
│   ├── study-materials/   # Study resources page
│   ├── academic-calendar/ # Academic calendar page
│   ├── notifications/     # Notification center
│   └── course/            # Course detail pages
├── components/            # React components
│   ├── ui/               # UI components (Header, Footer)
│   ├── admin/            # Admin panel components
│   ├── courses/          # Course-related components
│   ├── assignments/      # Assignment components
│   ├── chat/             # AI chat components
│   └── dashboard/        # Dashboard components
├── data/                 # Course data and syllabi
├── lib/                  # Utility libraries
├── models/               # Database models
├── types/                # TypeScript definitions
└── utils/                # Helper functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📈 Current Features Status

### ✅ **Fully Implemented**
- [x] Complete course catalog with 6 subjects
- [x] Interactive class timetable with lab sessions
- [x] Assignment management system with admin panel
- [x] Academic calendar with semester schedule
- [x] Notification system with email integration
- [x] AI Study Assistant chat interface
- [x] Responsive design for all devices
- [x] Admin panel with user management
- [x] Study materials placeholder page
- [x] Advanced date picker for assignments
- [x] Real-time assignment notifications

### 🚧 **In Development**
- [ ] User authentication system
- [ ] File upload for study materials
- [ ] Grade tracking and analytics
- [ ] Study group formation
- [ ] Discussion forums

### 📋 **Planned Features**
- [ ] Mobile app (React Native)
- [ ] Integration with university LMS
- [ ] Advanced analytics dashboard
- [ ] Peer-to-peer tutoring system
- [ ] Study session scheduling
- [ ] Resource sharing and rating system

## 🎯 **Key Technical Achievements**

### **Database Integration**
- MongoDB connection for persistent data
- Mongoose models for type-safe database operations
- Real-time data synchronization

### **Email System**
- Brevo integration for reliable email delivery
- Automated assignment notifications
- Admin announcement system

### **Advanced UI Components**
- Custom date picker with timezone handling
- Responsive timetable with mobile optimization
- Animated components with Framer Motion
- Smart notification badges

### **API Architecture**
- RESTful API design
- Type-safe API routes
- Error handling and validation
- Admin-only endpoints

## 🤝 Contributing

This is a student project for Nirma University. Suggestions and improvements are welcome!

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain responsive design
- Add proper error handling
- Include accessibility features

## 📧 Contact

For questions or suggestions regarding this StudyBuddy portal, please reach out through the university's official channels.

## 🏆 **Portal Statistics**

- **6 Courses** with complete syllabi
- **37 Units** with detailed content
- **52 Lab Experiments** with hands-on implementation
- **24 CLOs** mapped to Bloom's taxonomy
- **34 Reference Books** from top publishers
- **250+ Searchable Topics** across all domains
- **210 Total Teaching Hours** of curriculum content

---

**Made with ❤️ for MTech Data Science students at Nirma University**

*Empowering students with modern technology for better academic success* 
