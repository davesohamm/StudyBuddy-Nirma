'use client';

import { useState } from 'react';

export default function EmailAnnouncementBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 bg-white bg-opacity-20 rounded-full">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                📧 <strong>IMPORTANT:</strong> To receive assignment notifications on time, please check your{' '}
                <span className="font-bold underline">Spam/Junk folder</span> and mark our emails as{' '}
                <span className="font-bold bg-white bg-opacity-20 px-2 py-1 rounded">"Not Spam"</span>
              </p>
              <p className="text-xs mt-1 opacity-90">
                💡 Look for emails from: <strong>davesohamm1@outlook.com</strong> (Nirma StudyBuddy Portal)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDismissed(true)}
              className="flex-shrink-0 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md p-1 transition-colors"
              aria-label="Dismiss announcement"
            >
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 