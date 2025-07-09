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
  Link
} from 'lucide-react';

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  profile: {
    firstName?: string;
    lastName?: string;
    studentId?: string;
    profileImage?: string;
    bio?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    semester?: number;
    program?: string;
    department?: string;
    enrollmentYear?: number;
    graduationYear?: number;
    cgpa?: number;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      instagram?: string;
      website?: string;
    };
    interests?: string[];
    skills?: string[];
    languages?: string[];
    emergencyContact?: {
      name?: string;
      relationship?: string;
      phone?: string;
      email?: string;
    };
    customFields?: { fieldName: string; fieldValue: string; }[];
  };
  settings: {
    notifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends';
      showEmail: boolean;
      showPhone: boolean;
      showAddress: boolean;
    };
  };
}

export default function ProfileSettings() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');

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
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
      } else {
        setErrors(['Failed to load profile data']);
      }
    } catch (error) {
      setErrors(['Error loading profile']);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profileData) return;

    setSaving(true);
    setErrors([]);
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setEditMode(false);
        // Update local storage
        localStorage.setItem('user', JSON.stringify(profileData));
      } else {
        const data = await response.json();
        setErrors([data.error || 'Failed to update profile']);
      }
    } catch (error) {
      setErrors(['Error updating profile']);
    } finally {
      setSaving(false);
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

  const renderPersonalTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={profileData?.profile.firstName || ''}
            onChange={(e) => updateProfile('profile.firstName', e.target.value)}
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={profileData?.profile.lastName || ''}
            onChange={(e) => updateProfile('profile.lastName', e.target.value)}
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          rows={4}
          value={profileData?.profile.bio || ''}
          onChange={(e) => updateProfile('profile.bio', e.target.value)}
          disabled={!editMode}
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
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
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={profileData?.profile.gender || ''}
            onChange={(e) => updateProfile('profile.gender', e.target.value)}
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
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
          disabled={!editMode}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>
    </div>
  );

  const renderAcademicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            value={profileData?.profile.studentId || ''}
            onChange={(e) => updateProfile('profile.studentId', e.target.value)}
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
          <select
            value={profileData?.profile.semester || 1}
            onChange={(e) => updateProfile('profile.semester', parseInt(e.target.value))}
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
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
          value={profileData?.profile.program || ''}
          onChange={(e) => updateProfile('profile.program', e.target.value)}
          disabled={!editMode}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Year</label>
          <input
            type="number"
            min="2020"
            max="2030"
            value={profileData?.profile.enrollmentYear || ''}
            onChange={(e) => updateProfile('profile.enrollmentYear', parseInt(e.target.value))}
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation</label>
          <input
            type="number"
            min="2022"
            max="2035"
            value={profileData?.profile.graduationYear || ''}
            onChange={(e) => updateProfile('profile.graduationYear', parseInt(e.target.value))}
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
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
          value={profileData?.profile.cgpa || ''}
          onChange={(e) => updateProfile('profile.cgpa', parseFloat(e.target.value))}
          disabled={!editMode}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>
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
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={profileData?.profile.city || ''}
            onChange={(e) => updateProfile('profile.city', e.target.value)}
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          rows={3}
          value={profileData?.profile.address || ''}
          onChange={(e) => updateProfile('profile.address', e.target.value)}
          disabled={!editMode}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={profileData?.profile.state || ''}
            onChange={(e) => updateProfile('profile.state', e.target.value)}
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
          <input
            type="text"
            value={profileData?.profile.zipCode || ''}
            onChange={(e) => updateProfile('profile.zipCode', e.target.value)}
            disabled={!editMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
        </div>
      </div>
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
          disabled={!editMode}
          placeholder="Machine Learning, Web Development, AI (comma-separated)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
        <input
          type="text"
          value={profileData?.profile.skills?.join(', ') || ''}
          onChange={(e) => updateProfile('profile.skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
          disabled={!editMode}
          placeholder="Python, JavaScript, React (comma-separated)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
        <input
          type="text"
          value={profileData?.profile.languages?.join(', ') || ''}
          onChange={(e) => updateProfile('profile.languages', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
          disabled={!editMode}
          placeholder="English, Hindi, Spanish (comma-separated)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>

      {/* Custom Fields */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Custom Fields</h3>
          {editMode && (
            <button
              onClick={addCustomField}
              className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Field
            </button>
          )}
        </div>
        
        {profileData?.profile.customFields?.map((field, index) => (
          <div key={index} className="flex gap-4 mb-3">
            <input
              type="text"
              placeholder="Field Name"
              value={field.fieldName}
              onChange={(e) => {
                const newFields = [...(profileData.profile.customFields || [])];
                newFields[index].fieldName = e.target.value;
                updateProfile('profile.customFields', newFields);
              }}
              disabled={!editMode}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
            />
            <input
              type="text"
              placeholder="Field Value"
              value={field.fieldValue}
              onChange={(e) => {
                const newFields = [...(profileData.profile.customFields || [])];
                newFields[index].fieldValue = e.target.value;
                updateProfile('profile.customFields', newFields);
              }}
              disabled={!editMode}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
            />
            {editMode && (
              <button
                onClick={() => removeCustomField(index)}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
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
          disabled={!editMode}
          placeholder="https://linkedin.com/in/yourprofile"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
        <input
          type="url"
          value={profileData?.profile.socialLinks?.github || ''}
          onChange={(e) => updateProfile('profile.socialLinks.github', e.target.value)}
          disabled={!editMode}
          placeholder="https://github.com/yourusername"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
        <input
          type="url"
          value={profileData?.profile.socialLinks?.twitter || ''}
          onChange={(e) => updateProfile('profile.socialLinks.twitter', e.target.value)}
          disabled={!editMode}
          placeholder="https://twitter.com/yourusername"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
        <input
          type="url"
          value={profileData?.profile.socialLinks?.instagram || ''}
          onChange={(e) => updateProfile('profile.socialLinks.instagram', e.target.value)}
          disabled={!editMode}
          placeholder="https://instagram.com/yourusername"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Personal Website</label>
        <input
          type="url"
          value={profileData?.profile.socialLinks?.website || ''}
          onChange={(e) => updateProfile('profile.socialLinks.website', e.target.value)}
          disabled={!editMode}
          placeholder="https://yourwebsite.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </div>
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
              <label className="text-sm font-medium text-gray-700">General Notifications</label>
              <p className="text-sm text-gray-500">Receive general app notifications</p>
            </div>
            <input
              type="checkbox"
              checked={profileData?.settings.notifications || false}
              onChange={(e) => updateProfile('settings.notifications', e.target.checked)}
              disabled={!editMode}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={profileData?.settings.emailNotifications || false}
              onChange={(e) => updateProfile('settings.emailNotifications', e.target.checked)}
              disabled={!editMode}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={profileData?.settings.smsNotifications || false}
              onChange={(e) => updateProfile('settings.smsNotifications', e.target.checked)}
              disabled={!editMode}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={profileData?.settings.theme || 'light'}
              onChange={(e) => updateProfile('settings.theme', e.target.value)}
              disabled={!editMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={profileData?.settings.language || 'en'}
              onChange={(e) => updateProfile('settings.language', e.target.value)}
              disabled={!editMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={profileData?.settings.timezone || 'UTC'}
              onChange={(e) => updateProfile('settings.timezone', e.target.value)}
              disabled={!editMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
            >
              <option value="UTC">UTC</option>
              <option value="Asia/Kolkata">India Standard Time</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">Greenwich Mean Time</option>
            </select>
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
              value={profileData?.settings.privacy?.profileVisibility || 'public'}
              onChange={(e) => updateProfile('settings.privacy.profileVisibility', e.target.value)}
              disabled={!editMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
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
              checked={profileData?.settings.privacy?.showEmail || false}
              onChange={(e) => updateProfile('settings.privacy.showEmail', e.target.checked)}
              disabled={!editMode}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Show Phone</label>
              <p className="text-sm text-gray-500">Display phone on public profile</p>
            </div>
            <input
              type="checkbox"
              checked={profileData?.settings.privacy?.showPhone || false}
              onChange={(e) => updateProfile('settings.privacy.showPhone', e.target.checked)}
              disabled={!editMode}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Show Address</label>
              <p className="text-sm text-gray-500">Display address on public profile</p>
            </div>
            <input
              type="checkbox"
              checked={profileData?.settings.privacy?.showAddress || false}
              onChange={(e) => updateProfile('settings.privacy.showAddress', e.target.checked)}
              disabled={!editMode}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
        </div>
        
        <div className="flex gap-3">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditMode(false);
                  fetchProfile(); // Reset changes
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </button>
            </>
          )}
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
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
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