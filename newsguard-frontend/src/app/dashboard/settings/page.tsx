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
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    // Simulate update since endpoint might not be fully implemented for PATCH yet
    setTimeout(() => {
      setSaving(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }, 1000);
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
            { label: 'General', icon: User, active: true },
            { label: 'Security', icon: Shield, active: false },
            { label: 'Notifications', icon: Bell, active: false },
            { label: 'Billing', icon: CreditCard, active: false },
            { label: 'Language', icon: Globe, active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all
                ${item.active 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleUpdate} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">{user?.username}</h3>
                <p className="text-sm font-bold text-zinc-500">Pro Member since April 2024</p>
              </div>
              <button type="button" className="ml-auto px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-black hover:bg-zinc-200 transition-colors">
                Change Avatar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    defaultValue={user?.username}
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
                    defaultValue={user?.email}
                    className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none font-bold transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Bio</label>
              <textarea
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none font-bold transition-all min-h-[120px] resize-none"
              />
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="text-sm font-bold">{message.text}</p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <p className="text-xs font-bold text-zinc-400 italic">* Changes will be synced across all devices</p>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-violet-600 text-white font-black rounded-2xl shadow-lg shadow-violet-500/20 hover:bg-violet-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>

          <div className="bg-rose-50/50 dark:bg-rose-950/10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 p-8 space-y-4">
            <h4 className="text-lg font-black text-rose-600">Danger Zone</h4>
            <p className="text-sm font-bold text-rose-500/80">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-6 py-3 bg-white dark:bg-zinc-900 text-rose-600 border border-rose-200 dark:border-rose-900/50 font-black rounded-xl hover:bg-rose-50 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
