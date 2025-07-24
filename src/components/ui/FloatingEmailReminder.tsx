'use client';

import { useState, useEffect } from 'react';

export default function FloatingEmailReminder() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this reminder recently
    const lastDismissed = localStorage.getItem('emailReminderDismissed');
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

    if (lastDismissed && (now - parseInt(lastDismissed)) < oneWeek) {
      return; // Don't show if dismissed within last week
    }

    // Show the reminder after 30 seconds of being on the page
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('emailReminderDismissed', Date.now().toString());
  };

  const handleNeverShow = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('emailReminderDismissed', (Date.now() + (365 * 24 * 60 * 60 * 1000)).toString()); // 1 year
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-2xl border border-orange-200 p-4 animate-bounce">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold text-gray-900">📧 Missing Assignments?</h3>
            <p className="text-xs text-gray-600 mt-1">
              Check your <strong>spam folder</strong> and mark our emails as <strong>"Not Spam"</strong> to receive notifications!
            </p>
            <p className="text-xs text-orange-600 mt-1 font-medium">
              From: davesohamm1@outlook.com
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex space-x-2">
          <button
            onClick={handleDismiss}
            className="flex-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded hover:bg-orange-200 transition-colors"
          >
            Got it!
          </button>
          <button
            onClick={handleNeverShow}
            className="px-3 py-1 text-gray-500 text-xs hover:text-gray-700 transition-colors"
          >
            Don't show again
          </button>
        </div>
      </div>
    </div>
  );
} 