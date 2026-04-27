'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  Globe,
  CreditCard,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { getToken } from '@/utils/auth';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role: string;
  preferences: {
    notifications?: boolean;
    darkMode?: boolean;
    language?: string;
    verificationLevel?: 'standard' | 'strict';
  };
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('General');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          password: '',
          confirmPassword: '',
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const token = getToken();
      const payload: any = {
        username: formData.username,
        email: formData.email,
      };
      if (formData.password) payload.password = formData.password;

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/me`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.detail || 'Failed to update profile.' 
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = async (key: string, value: any) => {
    if (!user) return;
    
    const newPrefs = { ...user.preferences, [key]: value };
    try {
      const token = getToken();
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/me`,
        { preferences: newPrefs },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
    } catch (err) {
      console.error('Failed to update preference:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
        <p className="text-zinc-500 font-black animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Account Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage your profile, security, and application preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          {[
            { label: 'General', icon: User },
            { label: 'Security', icon: Shield },
            { label: 'Notifications', icon: Bell },
            { label: 'Preferences', icon: Globe },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all
                ${activeTab === item.label 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {activeTab === item.label && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2">
          {activeTab === 'General' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 space-y-8 shadow-sm"
            >
              <div className="flex items-center gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-800">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-violet-500/20">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white">{user?.username}</h3>
                  <p className="text-sm font-bold text-zinc-500 capitalize">{user?.role || 'User'} Account</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>

                {message.text && (
                  <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full bg-violet-600 text-white py-4 rounded-2xl font-black hover:bg-violet-700 shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Profile Changes'}
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'Security' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 space-y-8 shadow-sm"
            >
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">Update Password</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full bg-violet-600 text-white py-4 rounded-2xl font-black hover:bg-violet-700 shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Security Settings'}
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'Notifications' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 space-y-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white">Email Notifications</h3>
                  <p className="text-sm text-zinc-500 font-medium">Receive alerts about your verifications</p>
                </div>
                <button 
                  onClick={() => updatePreference('notifications', !user?.preferences.notifications)}
                  className={`w-14 h-8 rounded-full transition-all relative ${user?.preferences.notifications ? 'bg-violet-600' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${user?.preferences.notifications ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'Preferences' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 space-y-8 shadow-sm"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white">Verification Level</h3>
                    <p className="text-sm text-zinc-500 font-medium">Choose between speed and depth</p>
                  </div>
                  <select 
                    value={user?.preferences.verificationLevel || 'standard'}
                    onChange={(e) => updatePreference('verificationLevel', e.target.value)}
                    className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  >
                    <option value="standard">Standard</option>
                    <option value="strict">Strict (High Accuracy)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white">Default Language</h3>
                    <p className="text-sm text-zinc-500 font-medium">Your preferred interface language</p>
                  </div>
                  <select 
                    value={user?.preferences.language || 'en'}
                    onChange={(e) => updatePreference('language', e.target.value)}
                    className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="ar">Arabic (RTL)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
