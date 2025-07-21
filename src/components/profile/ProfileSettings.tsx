'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Globe, 
  BookOpen, 
  Heart, 
  Code, 
  Settings,
  Save,
  Edit,
  Plus,
  Trash2,
  Camera,
  Link,
  ArrowLeft,
  Home,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { initializeProfile, validateProfileData, type ProfileData } from '@/lib/profile-utils';

export default function ProfileSettings() {
  const { user } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');
  
  // Individual section saving states
  const [sectionSaving, setSectionSaving] = useState<{[key: string]: boolean}>({});
  const [sectionSuccess, setSectionSuccess] = useState<{[key: string]: boolean}>({});
  const [sectionErrors, setSectionErrors] = useState<{[key: string]: string}>({});

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'social', label: 'Social Links', icon: Link },
    { id: 'interests', label: 'Interests & Skills', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 ProfileSettings - Token exists:', !!token);
      
      if (!token) {
        console.log('❌ ProfileSettings - No token found');
        setErrors(['Authentication required. Please log in again.']);
        setLoading(false);
        return;
      }

      console.log('🔍 ProfileSettings - Making API call...');
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 ProfileSettings - Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ ProfileSettings - Profile data loaded:', !!data.user);
        console.log('📄 ProfileSettings - Actual profile data:', data.user);
        
        if (validateProfileData(data.user)) {
          setProfileData(data.user);
          setErrors([]); // Clear any previous errors
          console.log('✅ ProfileSettings - Profile data set successfully');
        } else {
          console.log('⚠️ ProfileSettings - Invalid profile data, using fallback');
          setProfileData(initializeProfile(user));
          setErrors([]); // Clear any previous errors when using fallback
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.log('❌ ProfileSettings - API error:', errorData);
        
        if (response.status === 401) {
          setErrors(['Session expired. Please log in again.']);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else {
          // Use fallback data from AuthContext if API fails
          if (user) {
            console.log('⚠️ ProfileSettings - Using fallback data from AuthContext');
            setProfileData(initializeProfile(user));
            setErrors([]); // Don't show errors if we have fallback data working
          } else {
            setErrors([errorData.error || 'Failed to load profile data']);
          }
        }
      }
    } catch (error) {
      console.error('❌ ProfileSettings - Network error:', error);
      
      // Use fallback data from AuthContext if network fails
      if (user) {
        console.log('⚠️ ProfileSettings - Network error, using fallback data from AuthContext');
        setProfileData(initializeProfile(user));
        setErrors([]); // Don't show errors if we have fallback data
      } else {
        setErrors(['Network error. Please check your connection and try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  // Individual section save function
  const handleSectionSave = async (section: string, sectionData: any) => {
    if (!profileData) return;

    setSectionSaving(prev => ({ ...prev, [section]: true }));
    setSectionErrors(prev => ({ ...prev, [section]: '' }));
    setSectionSuccess(prev => ({ ...prev, [section]: false }));

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        section,
        data: sectionData
      };

      const response = await fetch('/api/profile/section', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setSectionSuccess(prev => ({ ...prev, [section]: true }));
        
        // Update local profile data with the returned data from the server
        if (responseData.user) {
          setProfileData(responseData.user);
          
          // Also update localStorage to persist the data
          localStorage.setItem('user', JSON.stringify(responseData.user));
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSectionSuccess(prev => ({ ...prev, [section]: false }));
        }, 3000);

      } else {
        const data = await response.json();
        setSectionErrors(prev => ({ 
          ...prev, 
          [section]: data.error || `Failed to update ${section} section` 
        }));
      }
    } catch (error) {
      setSectionErrors(prev => ({ 
        ...prev, 
        [section]: `Error updating ${section} section` 
      }));
    } finally {
      setSectionSaving(prev => ({ ...prev, [section]: false }));
    }
  };

  const updateProfile = (path: string, value: any) => {
    if (!profileData) return;

    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(profileData));
    
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setProfileData(newData);
  };

  const addCustomField = () => {
    if (!profileData) return;
    
    const newCustomFields = [...(profileData.profile.customFields || []), { fieldName: '', fieldValue: '' }];
    updateProfile('profile.customFields', newCustomFields);
  };

  const removeCustomField = (index: number) => {
    if (!profileData) return;
    
    const newCustomFields = profileData.profile.customFields?.filter((_, i) => i !== index) || [];
    updateProfile('profile.customFields', newCustomFields);
  };

  // Section save buttons component
  const SectionSaveButton = ({ section, getData }: { section: string, getData: () => any }) => (
    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
      <motion.button
        onClick={() => handleSectionSave(section, getData())}
        disabled={sectionSaving[section]}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
          sectionSuccess[section]
            ? 'bg-green-500 text-white'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
      >
        {sectionSaving[section] ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : sectionSuccess[section] ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Saved!
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save {section.charAt(0).toUpperCase() + section.slice(1)}
          </>
        )}
      </motion.button>
      
      {sectionErrors[section] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md"
        >
          {sectionErrors[section]}
        </motion.div>
      )}
    </div>
  );

  const renderPersonalTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={profileData?.profile.firstName || ''}
            onChange={(e) => updateProfile('profile.firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={profileData?.profile.lastName || ''}
            onChange={(e) => updateProfile('profile.lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          rows={4}
          value={profileData?.profile.bio || ''}
          onChange={(e) => updateProfile('profile.bio', e.target.value)}
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us about yourself..."
        />
        <p className="text-xs text-gray-500 mt-1">{profileData?.profile.bio?.length || 0}/500 characters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={profileData?.profile.dateOfBirth || ''}
            onChange={(e) => updateProfile('profile.dateOfBirth', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={profileData?.profile.gender || ''}
            onChange={(e) => updateProfile('profile.gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
        <input
          type="text"
          value={profileData?.profile.nationality || ''}
          onChange={(e) => updateProfile('profile.nationality', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <SectionSaveButton 
        section="personal" 
        getData={() => ({
          profile: {
            ...profileData?.profile,
            firstName: profileData?.profile.firstName,
            lastName: profileData?.profile.lastName,
            bio: profileData?.profile.bio,
            dateOfBirth: profileData?.profile.dateOfBirth,
            gender: profileData?.profile.gender,
            nationality: profileData?.profile.nationality
          }
        })}
      />
    </div>
  );

  const renderAcademicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            value={profileData?.profile.academic?.studentId || ''}
            onChange={(e) => updateProfile('profile.academic.studentId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
          <select
            value={profileData?.profile.academic?.semester || 1}
            onChange={(e) => updateProfile('profile.academic.semester', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1}>1st Semester</option>
            <option value={2}>2nd Semester</option>
            <option value={3}>3rd Semester</option>
            <option value={4}>4th Semester</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
        <input
          type="text"
          value={profileData?.profile.academic?.program || ''}
          onChange={(e) => updateProfile('profile.academic.program', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Year</label>
          <input
            type="number"
            min="2020"
            max="2030"
            value={profileData?.profile.academic?.enrollmentYear || ''}
            onChange={(e) => updateProfile('profile.academic.enrollmentYear', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <input
            type="text"
            value={profileData?.profile.academic?.department || ''}
            onChange={(e) => updateProfile('profile.academic.department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="10"
          value={profileData?.profile.academic?.cgpa || ''}
          onChange={(e) => updateProfile('profile.academic.cgpa', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <SectionSaveButton 
        section="academic" 
        getData={() => ({
          profile: {
            ...profileData?.profile,
            academic: profileData?.profile.academic
          }
        })}
      />
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profileData?.profile.phone || ''}
            onChange={(e) => updateProfile('profile.phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={profileData?.profile.address?.city || ''}
            onChange={(e) => updateProfile('profile.address.city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
        <textarea
          rows={3}
          value={profileData?.profile.address?.street || ''}
          onChange={(e) => updateProfile('profile.address.street', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={profileData?.profile.address?.state || ''}
            onChange={(e) => updateProfile('profile.address.state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
          <input
            type="text"
            value={profileData?.profile.address?.zipCode || ''}
            onChange={(e) => updateProfile('profile.address.zipCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
        <input
          type="text"
          value={profileData?.profile.address?.country || ''}
          onChange={(e) => updateProfile('profile.address.country', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <SectionSaveButton 
        section="contact" 
        getData={() => ({
          profile: {
            ...profileData?.profile,
            phone: profileData?.profile.phone,
            address: profileData?.profile.address
          }
        })}
      />
    </div>
  );

  const renderInterestsTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
        <input
          type="text"
          value={profileData?.profile.interests?.join(', ') || ''}
          onChange={(e) => updateProfile('profile.interests', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
          placeholder="Machine Learning, Web Development, AI (comma-separated)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
        <input
          type="text"
          value={profileData?.profile.skills?.join(', ') || ''}
          onChange={(e) => updateProfile('profile.skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
          placeholder="Python, JavaScript, React (comma-separated)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
        <input
          type="text"
          value={profileData?.profile.languages?.join(', ') || ''}
          onChange={(e) => updateProfile('profile.languages', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
          placeholder="English, Hindi, Spanish (comma-separated)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
        <textarea
          rows={4}
          value={profileData?.profile.achievements?.join('\n') || ''}
          onChange={(e) => updateProfile('profile.achievements', e.target.value.split('\n').filter(s => s.trim()))}
          placeholder="List your achievements (one per line)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <SectionSaveButton 
        section="interests" 
        getData={() => ({
          profile: {
            ...profileData?.profile,
            interests: profileData?.profile.interests,
            skills: profileData?.profile.skills,
            languages: profileData?.profile.languages,
            achievements: profileData?.profile.achievements
          }
        })}
      />
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
        <input
          type="url"
          value={profileData?.profile.socialLinks?.linkedin || ''}
          onChange={(e) => updateProfile('profile.socialLinks.linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
        <input
          type="url"
          value={profileData?.profile.socialLinks?.github || ''}
          onChange={(e) => updateProfile('profile.socialLinks.github', e.target.value)}
          placeholder="https://github.com/yourusername"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
        <input
          type="url"
          value={profileData?.profile.socialLinks?.twitter || ''}
          onChange={(e) => updateProfile('profile.socialLinks.twitter', e.target.value)}
          placeholder="https://twitter.com/yourusername"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
        <input
          type="url"
          value={profileData?.profile.socialLinks?.portfolio || ''}
          onChange={(e) => updateProfile('profile.socialLinks.portfolio', e.target.value)}
          placeholder="https://yourwebsite.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <SectionSaveButton 
        section="social" 
        getData={() => ({
          profile: {
            ...profileData?.profile,
            socialLinks: profileData?.profile.socialLinks
          }
        })}
      />
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-8">
      {/* Notification Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={profileData?.preferences?.notifications?.email || false}
              onChange={(e) => updateProfile('preferences.notifications.email', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Push Notifications</label>
              <p className="text-sm text-gray-500">Receive push notifications</p>
            </div>
            <input
              type="checkbox"
              checked={profileData?.preferences?.notifications?.push || false}
              onChange={(e) => updateProfile('preferences.notifications.push', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={profileData?.preferences?.notifications?.sms || false}
              onChange={(e) => updateProfile('preferences.notifications.sms', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={profileData?.preferences?.privacy?.profileVisibility || 'public'}
              onChange={(e) => updateProfile('preferences.privacy.profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Show Email</label>
              <p className="text-sm text-gray-500">Display email on public profile</p>
            </div>
            <input
              type="checkbox"
              checked={profileData?.preferences?.privacy?.showEmail || false}
              onChange={(e) => updateProfile('preferences.privacy.showEmail', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Show Phone</label>
              <p className="text-sm text-gray-500">Display phone on public profile</p>
            </div>
            <input
              type="checkbox"
              checked={profileData?.preferences?.privacy?.showPhone || false}
              onChange={(e) => updateProfile('preferences.privacy.showPhone', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <SectionSaveButton 
        section="settings" 
        getData={() => ({
          preferences: profileData?.preferences
        })}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          {/* Back Navigation */}
          <div className="flex gap-2 mr-6">
            <button
              onClick={() => router.back()}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
              <button
              onClick={() => router.push('/')}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Go to dashboard"
            >
              <Home className="w-5 h-5" />
              </button>
          </div>
          
          {/* Title */}
        <div>
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-500 mb-2">
              <button
                onClick={() => router.push('/')}
                className="hover:text-gray-700 transition-colors"
              >
                Dashboard
              </button>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Profile Settings</span>
            </nav>
            
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <ul className="text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              {sectionSuccess[tab.id] && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'personal' && renderPersonalTab()}
        {activeTab === 'academic' && renderAcademicTab()}
        {activeTab === 'contact' && renderContactTab()}
        {activeTab === 'social' && renderSocialTab()}
        {activeTab === 'interests' && renderInterestsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </motion.div>
    </div>
  );
} 