'use client';

import React from 'react';
import Navbar from "@/components/Navbar";
import { 
  Shield, 
  Zap, 
  Search, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Fingerprint,
  Activity,
  Lock,
  Cpu,
  BarChart3,
  Layers,
  Star,
  Quote,
  Check,
  Play
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950 overflow-x-hidden selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Modern SaaS Grid Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Introducing NewsGuard Neural 3.0</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]"
            >
              Verify News with <br />
              <span className="text-indigo-600 dark:text-indigo-400">AI Confidence.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              The industry standard for real-time news authentication. Deployed by newsrooms and organizations to detect synthetic misinformation at scale.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-95"
              >
                Start Verification Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                View Demo
              </Link>
            </motion.div>

            {/* Trusted By Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-20 pt-10 border-t border-slate-200 dark:border-zinc-800"
            >
              <p className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-8">Trusted by industry leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {['The Verge', 'TechCrunch', 'Wired', 'Forbes', 'Bloomberg'].map((brand) => (
                  <span key={brand} className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{brand}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Articles Verified', value: '1.2M+' },
              { label: 'Accuracy Rate', value: '99.9%' },
              { label: 'Latency', value: '< 200ms' },
              { label: 'Data Sources', value: '15,000+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">{stat.value}</p>
                <p className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">Core Capabilities</h2>
            <p className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Built for the modern truth.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Deep Neural Analysis",
                desc: "Proprietary LLMs trained on millions of verified news reports to detect subtle linguistic manipulation.",
                icon: Cpu,
                color: "indigo"
              },
              {
                title: "Cross-Source Verification",
                desc: "Real-time cross-referencing against 15,000+ trusted global news sources and official databases.",
                icon: Globe,
                color: "indigo"
              },
              {
                title: "Sentiment & Bias Detection",
                desc: "Identify institutional bias and emotionally charged language designed to bypass rational thought.",
                icon: Activity,
                color: "indigo"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-300">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-900 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 text-white">
            <h2 className="text-4xl font-extrabold mb-4">Scale your verification.</h2>
            <p className="text-slate-400">Simple, transparent pricing for teams of all sizes.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: 'Free', features: ['10 Scans / month', 'Basic Source Audit', 'Community Support'] },
              { name: 'Professional', price: '$49', features: ['Unlimited Scans', 'Advanced Neural Engine', 'API Access', 'Email Support'], popular: true },
              { name: 'Enterprise', price: 'Custom', features: ['Custom LLM Training', 'SLA Guarantee', 'Dedicated Manager', 'On-prem deployment'] },
            ].map((plan) => (
              <div key={plan.name} className={`relative p-8 rounded-[2.5rem] ${plan.popular ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 ring-4 ring-indigo-500/50' : 'bg-slate-800 text-white'}`}>
                {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-indigo-600 text-xs font-black rounded-full uppercase tracking-widest">Most Popular</span>}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-slate-400">/mo</span>}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium">
                      <Check className={`w-4 h-4 ${plan.popular ? 'text-white' : 'text-indigo-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-white text-indigo-600 hover:bg-slate-50' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-20 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">NewsGuard AI</span>
          </Link>
          <p className="text-slate-500 dark:text-zinc-500 text-sm mb-8">© 2026 NewsGuard Neural Systems. All rights reserved.</p>
          <div className="flex justify-center gap-8 text-sm font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
            <Link href="#" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Security</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
