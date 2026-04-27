'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  Globe,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  CreditCard,
  LogOut
} from 'lucide-react';
import axios from 'axios';
import { getToken } from '@/utils/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

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
  const { logout } = useAuth();
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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Syncing profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-zinc-400 font-medium">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
          {[
            { id: 'General', label: 'General', icon: User },
            { id: 'Security', label: 'Security', icon: ShieldCheck },
            { id: 'Notifications', label: 'Notifications', icon: Bell },
            { id: 'Preferences', label: 'Preferences', icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-500 hover:bg-white dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <div className="hidden lg:block my-4 border-t border-slate-200 dark:border-zinc-800" />
          <button
            onClick={logout}
            className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all whitespace-nowrap"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden"
            >
              {activeTab === 'General' && (
                <div className="p-8 lg:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 pb-10 border-b border-slate-100 dark:border-zinc-800">
                    <div className="w-24 h-24 rounded-3xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-black">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.username}</h3>
                      <p className="text-slate-500 font-medium">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Verified Account</span>
                        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider capitalize">{user?.role}</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                        <input 
                          type="text" 
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {message.text && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-4 rounded-xl flex items-center gap-3 font-bold ${
                            message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}
                        >
                          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                          {message.text}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      type="submit"
                      disabled={saving}
                      className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Profile'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'Security' && (
                <div className="p-8 lg:p-10">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Change Password</h3>
                    <p className="text-slate-500 font-medium text-sm">Update your password to keep your account secure.</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="max-w-md space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">New Password</label>
                        <input 
                          type="password" 
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
                    </button>
                  </form>

                  <div className="mt-12 pt-10 border-t border-slate-100 dark:border-zinc-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Two-Factor Authentication</h3>
                    <div className="p-6 bg-slate-50 dark:bg-zinc-800/30 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center border border-slate-200 dark:border-zinc-800">
                          <Smartphone className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">Authenticator App</p>
                          <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">Setup 2FA</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Notifications' && (
                <div className="p-8 lg:p-10">
                  <div className="mb-10">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Notification Settings</h3>
                    <p className="text-slate-500 font-medium text-sm">Control how and when you want to be notified.</p>
                  </div>

                  <div className="space-y-6">
                    {[
                      { id: 'notifications', title: 'Email Notifications', desc: 'Receive daily digests and major alerts via email.' },
                      { id: 'security_alerts', title: 'Security Alerts', desc: 'Get notified about new logins and security changes.', permanent: true },
                      { id: 'news_updates', title: 'Neural Analysis Updates', desc: 'Be notified when your background scans are complete.' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-zinc-800/30 rounded-2xl">
                        <div className="max-w-md">
                          <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                        <button 
                          disabled={item.permanent}
                          onClick={() => updatePreference(item.id, !user?.preferences[item.id as keyof typeof user.preferences])}
                          className={`w-14 h-8 rounded-full transition-all relative ${item.permanent || user?.preferences[item.id as keyof typeof user.preferences] ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-zinc-800'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${item.permanent || user?.preferences[item.id as keyof typeof user.preferences] ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Preferences' && (
                <div className="p-8 lg:p-10">
                  <div className="mb-10">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Application Preferences</h3>
                    <p className="text-slate-500 font-medium text-sm">Customize your NewsGuard experience.</p>
                  </div>

                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-zinc-800/30 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Verification Engine</p>
                        <p className="text-sm text-slate-500">Choose your preferred balance of speed and depth.</p>
                      </div>
                      <select 
                        value={user?.preferences.verificationLevel || 'standard'}
                        onChange={(e) => updatePreference('verificationLevel', e.target.value)}
                        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2 font-bold text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="standard">Standard (Fast)</option>
                        <option value="strict">Strict (High Depth)</option>
                        <option value="neural">Neural Pro (Experimental)</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-zinc-800/30 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Default Language</p>
                        <p className="text-sm text-slate-500">The primary language for neural analysis reports.</p>
                      </div>
                      <select 
                        value={user?.preferences.language || 'en'}
                        onChange={(e) => updatePreference('language', e.target.value)}
                        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2 font-bold text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="en">English (US)</option>
                        <option value="en-gb">English (UK)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
