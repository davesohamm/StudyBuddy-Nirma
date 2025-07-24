'use client';

import { useState } from 'react';

export default function EmailInstructionsCard() {
  const [selectedProvider, setSelectedProvider] = useState('gmail');

  const providers = {
    gmail: {
      name: 'Gmail',
      icon: '📬',
      instructions: [
        'Check your Spam folder',
        'Find emails from "davesohamm1@outlook.com"',
        'Click "Not spam" button',
        'Move email to Primary inbox',
        'Add sender to contacts for future emails'
      ]
    },
    outlook: {
      name: 'Outlook/Hotmail',
      icon: '📧',
      instructions: [
        'Check your Junk Email folder',
        'Find emails from "davesohamm1@outlook.com"',
        'Right-click and select "Not junk"',
        'Click "Trust sender" if prompted',
        'Add sender to Safe senders list'
      ]
    },
    yahoo: {
      name: 'Yahoo Mail',
      icon: '📮',
      instructions: [
        'Check your Spam folder',
        'Find emails from "davesohamm1@outlook.com"',
        'Click "Not spam" button',
        'Add sender to your Address Book',
        'Create filter to always allow our emails'
      ]
    },
    other: {
      name: 'Other Providers',
      icon: '📨',
      instructions: [
        'Check your Spam/Junk folder',
        'Look for emails from "davesohamm1@outlook.com"',
        'Mark as "Not spam" or "Safe"',
        'Add sender to your contacts/whitelist',
        'Check email filters and rules'
      ]
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">📧 How to Receive Assignment Emails</h3>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">
          Select your email provider for specific instructions:
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(providers).map(([key, provider]) => (
            <button
              key={key}
              onClick={() => setSelectedProvider(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedProvider === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {provider.icon} {provider.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
          {providers[selectedProvider as keyof typeof providers].icon}
          <span className="ml-2">Instructions for {providers[selectedProvider as keyof typeof providers].name}:</span>
        </h4>
        <ol className="space-y-2">
          {providers[selectedProvider as keyof typeof providers].instructions.map((instruction, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-sm text-gray-700">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start">
          <svg className="flex-shrink-0 h-5 w-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="ml-2">
            <p className="text-sm font-medium text-green-800">Why is this important?</p>
            <p className="text-sm text-green-700 mt-1">
              By marking our emails as safe, you'll receive assignment notifications, due date reminders, and important academic updates directly in your main inbox instead of spam folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 