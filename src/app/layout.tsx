'use client';

import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

// export const metadata: Metadata = {
//   title: 'Nirma StudyBuddy Portal',
//   description: 'Study Buddy Portal for MTech Data Science at Nirma University',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Nirma StudyBuddy Portal</title>
        <meta name="description" content="Study Buddy Portal for MTech Data Science at Nirma University" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 