'use client';

import { GraduationCap, Bell, User, Search, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchClick = () => {
    router.push('/search');
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/auth');
  };

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleSearchClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-nirma-red p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">StudyBuddy</h1>
              <p className="text-xs text-gray-500">Nirma University</p>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex-1 max-w-lg mx-8">
            <motion.button
              onClick={handleSearchClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group relative overflow-hidden"
            >
              {/* Subtle shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
              
              <Search className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors mr-3 relative z-10" />
              <span className="text-gray-500 group-hover:text-gray-700 font-medium flex-1 text-left relative z-10">
                Search courses, topics, experiments, algorithms...
              </span>
              <div className="hidden sm:flex items-center gap-1 ml-2 relative z-10">
                <kbd className="px-2 py-1 text-xs text-gray-400 bg-white border border-gray-200 rounded shadow-sm group-hover:border-blue-200 group-hover:text-blue-500 transition-colors">
                  Ctrl
                </kbd>
                <kbd className="px-2 py-1 text-xs text-gray-400 bg-white border border-gray-200 rounded shadow-sm group-hover:border-blue-200 group-hover:text-blue-500 transition-colors">
                  K
                </kbd>
              </div>
            </motion.button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="bg-primary-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {user?.profile?.program || 'MTech DS'} - Sem {user?.profile?.semester || 1}
                  </p>
                </div>
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/profile');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Profile Settings
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 