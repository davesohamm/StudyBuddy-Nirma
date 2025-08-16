'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TimeSlot {
  time: string;
  start: string;
  end: string;
}

interface ClassSession {
  course: string;
  faculty: string;
  room: string;
  isLab?: boolean;
}

interface DaySchedule {
  [timeSlot: string]: ClassSession | null;
}

const timeSlots: TimeSlot[] = [
  { time: '11:40-12:35', start: '11:40', end: '12:35' },
  { time: '12:35-1:30', start: '12:35', end: '13:30' },
  { time: '1:30-2:25', start: '13:30', end: '14:25' },
  { time: '2:25-3:20', start: '14:25', end: '15:20' },
  { time: '3:20-4:15', start: '15:20', end: '16:15' },
  { time: '4:30-5:25', start: '16:30', end: '17:25' },
  { time: '5:25-6:20', start: '17:25', end: '18:20' },
];

const timetable: { [day: string]: DaySchedule } = {
  'MON': {
    '11:40-12:35': { course: 'BDS', faculty: 'JV', room: 'E1106B' },
    '12:35-1:30': { course: 'AML', faculty: 'NKP', room: 'E501' },
    '2:25-3:20': { course: 'BDS', faculty: 'JV', room: 'E1108C', isLab: true },
    '3:20-4:15': { course: 'BDS', faculty: 'JV', room: 'E1108C', isLab: true },
  },
  'TUE': {
    '11:40-12:35': { course: 'BDS', faculty: 'JV', room: 'E1106B' },
    '12:35-1:30': { course: 'DSSD', faculty: 'MS', room: 'E1106B' },
    '2:25-3:20': { course: 'DSA', faculty: 'AT', room: 'E501' },
    '3:20-4:15': { course: 'SDS', faculty: 'SJ', room: 'E1106B' },
    '4:30-5:25': { course: 'SDS', faculty: 'SJ', room: 'E1108C', isLab: true },
    '5:25-6:20': { course: 'SDS', faculty: 'SJ', room: 'E1108C', isLab: true },
  },
  'WED': {
    '11:40-12:35': { course: 'DSSD', faculty: 'MS', room: 'W5062', isLab: true },
    '12:35-1:30': { course: 'DSSD', faculty: 'MS', room: 'W5062', isLab: true },
    '2:25-3:20': { course: 'AML', faculty: 'NKP', room: 'E501' },
    '3:20-4:15': { course: 'DSA', faculty: 'AT', room: 'E501' },
    '4:30-5:25': { course: 'AML', faculty: 'NKP', room: 'E1108C', isLab: true },
    '5:25-6:20': { course: 'AML', faculty: 'NKP', room: 'E1108C', isLab: true },
  },
  'THU': {
    '11:40-12:35': { course: 'SDS', faculty: 'SJ', room: 'E1106B' },
    '12:35-1:30': { course: 'Capstone', faculty: 'SJ', room: 'E501' },
    '2:25-3:20': { course: 'AML', faculty: 'NKP', room: 'E501' },
    '3:20-4:15': { course: 'DSA', faculty: 'AT', room: 'E501' },
    '4:30-5:25': { course: 'BDS', faculty: 'JV', room: 'E501' },
  },
  'FRI': {
    '11:40-12:35': { course: 'DSA', faculty: 'AT', room: 'E1108C', isLab: true },
    '12:35-1:30': { course: 'DSA', faculty: 'AT', room: 'E1108C', isLab: true },
    '2:25-3:20': { course: 'DSSD', faculty: 'MS', room: 'E1106B' },
    '3:20-4:15': { course: 'SDS', faculty: 'SJ', room: 'E1106B' },
    '4:30-5:25': { course: 'PROGCODE', faculty: '', room: 'E1108C', isLab: true },
    '5:25-6:20': { course: 'PROGCODE', faculty: '', room: 'E1108C', isLab: true },
  },
};

const courseNames: { [code: string]: string } = {
  'BDS': 'Big Data Systems',
  'AML': 'Applied Machine Learning',
  'DSSD': 'Data-Science System Design',
  'DSA': 'Data Structures and Algorithms',
  'SDS': 'Statistics for Data Science',
  'Capstone': 'Capstone Course',
  'PROGCODE': 'Programming & Coding',
};

const facultyNames: { [initials: string]: string } = {
  'JV': 'Dr. Jaiprakash Verma',
  'NKP': 'Dr. Nilesh Patel',
  'MS': 'Dr. Monika Shah',
  'AT': 'Dr. Ankit Thakkar',
  'SJ': 'Dr. Swati Jain',
};

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState<string>('MON');

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i];
      if (currentTime >= slot.start && currentTime <= slot.end) {
        return slot.time;
      }
    }
    return null;
  };

  const currentTimeSlot = getCurrentTimeSlot();
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Menu
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Class Timetable</h1>
                  <p className="text-sm text-gray-600">MTech Data Science - ODD Term 2025-26</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Branch: 1MCEDA</p>
              <p className="text-xs text-gray-600">Computer Science & Engineering</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Day Selector */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {Object.keys(timetable).map((day) => (
              <motion.button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                } ${day === currentDay ? 'ring-2 ring-blue-300' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {day}
                {day === currentDay && (
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-1 sm:ml-2"></div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

                {/* Timetable Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm">Time</th>
                  {Object.keys(timetable).map((day) => (
                    <th 
                      key={day} 
                      className={`px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-xs sm:text-sm ${
                        selectedDay === day ? 'bg-white bg-opacity-20' : ''
                      }`}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, index) => (
                  <tr 
                    key={slot.time}
                    className={`border-b border-gray-100 ${
                      currentTimeSlot === slot.time && selectedDay === currentDay
                        ? 'bg-blue-50 border-blue-200'
                        : index % 2 === 0
                        ? 'bg-gray-50'
                        : 'bg-white'
                    }`}
                  >
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 border-r border-gray-200">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                        <span>{slot.time}</span>
                      </div>
                      {slot.time === '1:30-2:25' && (
                        <div className="text-xs text-orange-600 font-medium mt-1">(Recess)</div>
                      )}
                    </td>
                    {Object.keys(timetable).map((day) => {
                      const session = timetable[day][slot.time];
                      return (
                        <td 
                          key={day} 
                          className={`px-2 sm:px-4 py-2 sm:py-3 text-center ${
                            selectedDay === day ? 'bg-blue-50' : ''
                          }`}
                        >
                          {slot.time === '1:30-2:25' ? (
                            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-2 sm:p-3">
                              <div className="text-xs sm:text-sm font-medium text-orange-800">Recess</div>
                              <div className="text-xs text-orange-600">Lunch Break</div>
                            </div>
                          ) : session ? (
                            <motion.div
                              className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                                currentTimeSlot === slot.time && day === currentDay
                                  ? 'border-blue-500 bg-blue-100 shadow-lg'
                                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="font-semibold text-xs sm:text-sm text-gray-900 mb-1">
                                {courseNames[session.course] || session.course}
                              </div>
                              <div className="text-xs text-gray-600 mb-1">
                                {facultyNames[session.faculty] || session.faculty}
                              </div>
                              <div className="flex items-center justify-center text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {session.room}
                              </div>
                              {session.isLab && (
                                <div className="mt-1">
                                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-1 sm:px-2 py-1 rounded-full">
                                    Lab
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          ) : (
                            <div className="text-gray-400 text-xs sm:text-sm">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                <span className="text-sm text-gray-700">Current Time Slot</span>
              </div>
                             <div className="flex items-center space-x-2">
                 <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
                 <span className="text-sm text-gray-700">Lab Session (2 Hours)</span>
               </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-700">Selected Day</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 