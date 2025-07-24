'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Search,
  Bell,
  MessageSquare,
  Shield,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const handleSearchClick = () => {
    router.push('/search');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu') && !target.closest('.profile-button')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        handleSearchClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">StudyBuddy</h1>
                <p className="text-xs text-gray-500 -mt-1">Nirma University</p>
              </div>
            </Link>
          </div>

          {/* Enhanced Search Button */}
          <div className="flex-1 max-w-lg mx-4 sm:mx-8">
            <motion.button
              onClick={handleSearchClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 border border-gray-200 hover:border-indigo-200 rounded-xl transition-all duration-200 group shadow-sm hover:shadow-md"
            >
              <Search className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 mr-3 transition-colors" />
              <span className="text-gray-500 group-hover:text-gray-700 text-left flex-1 text-sm sm:text-base">
                <span className="hidden sm:inline">Search courses, assignments, materials...</span>
                <span className="sm:hidden">Search...</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="hidden sm:flex items-center text-xs text-gray-400 bg-white border border-gray-300 px-2 py-1 rounded-md font-mono group-hover:text-gray-600 group-hover:border-indigo-300 transition-colors">
                  <span className="text-xs">Ctrl</span>
                  <span className="mx-1">+</span>
                  <span className="text-xs">K</span>
                </span>
                <span className="sm:hidden text-xs text-gray-400 bg-white border border-gray-300 px-2 py-1 rounded-md font-mono group-hover:text-gray-600 group-hover:border-indigo-300 transition-colors">
                  ⌘K
                </span>
              </div>
            </motion.button>
          </div>

          {/* Right side - Actions and Profile */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* AI Chat Button */}
            <Link
              href="/chat"
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="AI Study Assistant"
            >
              <MessageSquare className="h-5 w-5" />
            </Link>

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Admin Dashboard Link (only for admin users) */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Admin Dashboard"
              >
                <Shield className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Admin</span>
              </Link>
            )}

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="profile-button flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="profile-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile Settings
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="sm:hidden flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4 mr-3" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-gray-200 py-4 space-y-2"
          >
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                handleSearchClick();
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5 mr-3" />
              <span className="flex-1 text-left">Search</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded font-mono">
                ⌘K
              </span>
            </button>

            <Link
              href="/chat"
              className="flex items-center px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              AI Study Assistant
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-5 w-5 mr-3" />
                Admin Dashboard
              </Link>
            )}

            <Link
              href="/profile"
              className="flex items-center px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5 mr-3" />
              Profile Settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
} 