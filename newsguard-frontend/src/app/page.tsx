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
  MousePointer2,
  Star,
  Quote
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
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden selection:bg-violet-100 dark:selection:bg-violet-900/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800/50 text-violet-600 dark:text-violet-400 text-xs font-black uppercase tracking-widest mb-8 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>v2.0 Neural Verification Engine</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl md:text-7xl lg:text-[110px] font-black tracking-tight text-zinc-900 dark:text-white mb-8 leading-[0.85]"
            >
              Trust in the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-300% animate-gradient">Age of AI.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              NewsGuard AI deploys advanced neural networks to verify news authenticity in milliseconds. Protect your organization from synthetic misinformation.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-10 py-5 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-500/25 flex items-center justify-center gap-3 group active:scale-95"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all flex items-center justify-center group"
              >
                How it Works
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Analyses Daily", value: "2.5M+" },
              { label: "Accuracy Rate", value: "99.9%" },
              { label: "Processing Speed", value: "<150ms" },
              { label: "Active Users", value: "500k+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl lg:text-5xl font-black text-zinc-900 dark:text-white mb-2">{stat.value}</p>
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6">Built for the next generation of digital truth.</h2>
            <p className="text-lg text-zinc-500 font-medium">Our platform combines multiple AI layers to detect even the most sophisticated deepfake news and synthetic claims.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Neural Cross-Verification",
                desc: "Analyzes claims across 10,000+ verified global sources in real-time.",
                icon: Cpu,
                color: "bg-violet-500"
              },
              {
                title: "Linguistic Pattern Analysis",
                desc: "Detects emotional manipulation and synthetic writing styles used in fake news.",
                icon: Activity,
                color: "bg-fuchsia-500"
              },
              {
                title: "Source Origin Tracking",
                desc: "Traces information back to its original source to verify credibility.",
                icon: Globe,
                color: "bg-emerald-500"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-violet-500/5 transition-all"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-zinc-200 dark:shadow-none`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-zinc-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Quote className="w-64 h-64" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-violet-500 text-violet-500" />)}
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                "NewsGuard has completely changed how our newsroom handles incoming reports."
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700" />
                <div>
                  <p className="font-black">Sarah Jenkins</p>
                  <p className="text-zinc-500 text-sm font-bold">Chief Editor, Global Times</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                "Unmatched Speed",
                "Highly Accurate",
                "Easy Integration",
                "Reliable Sources"
              ].map((label, i) => (
                <div key={i} className="p-8 bg-zinc-800/50 rounded-3xl border border-zinc-700/50 backdrop-blur-sm">
                  <CheckCircle2 className="w-8 h-8 text-violet-500 mb-4" />
                  <p className="font-black text-lg">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6">Simple, transparent pricing.</h2>
            <p className="text-lg text-zinc-500 font-medium">Choose the plan that fits your needs. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Free", price: "$0", features: ["10 scans/day", "Basic Analysis", "Public Sources"], cta: "Start for Free", popular: false },
              { name: "Pro", price: "$29", features: ["Unlimited scans", "Neural Deep Scan", "Priority Support", "Library Storage"], cta: "Get Pro Now", popular: true },
              { name: "Enterprise", price: "$99", features: ["API Access", "Custom Models", "Dedicated Manager", "White-labeling"], cta: "Contact Sales", popular: false },
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`p-10 rounded-[3rem] border ${plan.popular ? 'border-violet-600 bg-violet-600 text-white shadow-2xl shadow-violet-500/20' : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white'} relative transition-transform hover:-translate-y-2`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 bg-white text-violet-600 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                )}
                <p className={`text-sm font-black uppercase tracking-widest mb-4 ${plan.popular ? 'text-white/70' : 'text-zinc-400'}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className={`text-sm font-bold ${plan.popular ? 'text-white/70' : 'text-zinc-500'}`}>/mo</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 font-bold text-sm">
                      <CheckCircle2 className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-violet-600'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-2xl font-black transition-all ${plan.popular ? 'bg-white text-violet-600 hover:bg-zinc-100' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-violet-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-zinc-900 dark:text-white">NewsGuard AI</span>
          </div>
          <p className="text-zinc-500 font-bold mb-8">Empowering truth in the digital age.</p>
          <div className="flex justify-center gap-10 text-sm font-black text-zinc-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-violet-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-violet-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-violet-600 transition-colors">Contact</Link>
          </div>
          <p className="mt-12 text-zinc-400 text-xs font-medium">© 2024 NewsGuard AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
