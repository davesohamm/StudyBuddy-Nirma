'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated, login, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (mounted && !isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router, mounted, isLoading]);

  const handleAuth = (userData: any) => {
    login(userData);
    router.push('/');
  };

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
  };

  // Show loading while mounting or checking auth
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Don't render anything if already authenticated (prevents flash)
  if (isAuthenticated) {
    return null;
  }

  return (
    <AuthForm
      mode={mode}
      onModeChange={handleModeChange}
      onAuth={handleAuth}
    />
  );
} 