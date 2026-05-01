'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3,
  Search, 
  Bookmark, 
  Settings, 
  LogOut, 
  Shield,
  Menu,
  X,
  User,
  Bell,
  History
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const menuItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Verify News', href: '/dashboard/verify', icon: Search },
  { label: 'Neural History', href: '/dashboard/scans', icon: History },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'My Library', href: '/dashboard/library', icon: Bookmark },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/signin?redirect=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || (!user && pathname !== '/signin' && pathname !== '/signup')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-white dark:bg-zinc-950">
        <div className="p-4 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-600/30 animate-glow">
          <Shield className="w-12 h-12 text-white animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Authenticating Session</p>
          <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] mt-2">Neural Security Check In Progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-900 transition-all duration-500 lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-8">
          <Link href="/" className="flex items-center gap-3 mb-12 px-2 group">
            <div className="p-2.5 bg-indigo-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-600/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">NewsGuard</span>
          </Link>
          
          <nav className="flex-1 space-y-2">
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-6 px-4">Navigation</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-[13px] font-bold transition-all duration-300 group
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                      : 'text-slate-500 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-400'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 border-t border-slate-100 dark:border-zinc-900 space-y-6">
            <div className="p-5 bg-slate-50 dark:bg-zinc-900/50 rounded-[1.5rem] border border-slate-100 dark:border-zinc-800/50 shadow-inner">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-[1rem] bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-600/20">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{user?.username || 'User'}</p>
                  <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest truncate">{user?.role || 'Pro Member'}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 transition-all active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                Secure Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50/50 dark:bg-zinc-950">
        {/* Header */}
        <header className="h-20 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-900 flex items-center justify-between px-8 lg:px-12 flex-shrink-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-3 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-all"
            >
              <Menu className="w-6 h-6 text-slate-600 dark:text-zinc-400" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-900 dark:text-white capitalize tracking-tight">
                {pathname.split('/').pop() || 'Overview'}
              </h1>
              <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em]">Neural Dashboard v3.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button className="p-3 bg-slate-50 dark:bg-zinc-900 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all relative group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-zinc-900 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{user?.username}</span>
                <span className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Active Status</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
