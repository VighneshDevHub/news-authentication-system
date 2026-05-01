'use client';

import React from 'react';
import Navbar from "@/components/Navbar";
import { 
  Shield, 
  Target, 
  Users, 
  Cpu, 
  Globe, 
  Award,
  ArrowRight,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden selection:bg-indigo-500/30 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 hero-gradient overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-morphism border border-indigo-200/50 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-12 shadow-xl shadow-indigo-500/10"
            >
              <Heart className="w-3 h-3 fill-current" />
              <span>Our Mission</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tighter text-slate-900 dark:text-white mb-10 leading-[0.9]"
            >
              Defending the <br />
              <span className="text-gradient">Sanctity of Truth.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg lg:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              In an era of synthetic media and rapid misinformation, we build the neural infrastructure required to maintain a factual public record.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 lg:py-40 bg-slate-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden glass-morphism p-2 border border-slate-200 dark:border-zinc-800 shadow-2xl">
                <div className="w-full h-full bg-slate-900 dark:bg-zinc-950 rounded-[3.8rem] flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-600/10 animate-pulse"></div>
                  <Shield className="w-32 h-32 text-indigo-500 relative z-10 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent"></div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl p-8 flex flex-col justify-center border border-slate-100 dark:border-zinc-800">
                <p className="text-4xl font-black text-indigo-600 mb-1">99%</p>
                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest leading-tight">Accuracy <br /> Benchmark</p>
              </div>
            </motion.div>

            <div className="space-y-10">
              <div className="max-w-xl">
                <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Why We Exist</h2>
                <p className="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">The battle for <span className="text-gradient">reality</span> is here.</p>
                <p className="text-lg text-slate-600 dark:text-zinc-400 font-medium leading-relaxed mb-8">
                  NewsGuard AI was founded in 2024 by a group of AI researchers and investigative journalists who saw the growing threat of deepfake news and institutional bias. 
                </p>
                <p className="text-lg text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
                  We believe that information is the lifeblood of democracy, and when the signal is drowned out by noise, the entire system is at risk. Our goal is to provide every citizen with a professional-grade audit tool for the digital age.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div>
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Our Vision</h4>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium leading-relaxed">To become the standard authentication layer for global information flow.</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Our Impact</h4>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium leading-relaxed">Protecting millions of users from malicious misinformation daily.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Our Principles</h2>
            <p className="text-5xl md:text-6xl font-heading font-black text-slate-900 dark:text-white mb-8 tracking-tight">The values that <br /> drive our code.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Radical Transparency', 
                desc: 'We don\'t just give a score; we show the receipts. Every audit is backed by verifiable data points and cross-references.',
                icon: Cpu
              },
              { 
                title: 'Institutional Neutrality', 
                desc: 'Our models are architected to be politically and socially agnostic, focusing purely on linguistic patterns and factual consistency.',
                icon: Shield
              },
              { 
                title: 'User Privacy', 
                desc: 'Verification should never come at the cost of your data. We employ military-grade encryption for all requests.',
                icon: Users
              }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/30 transition-all group"
              >
                <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{value.title}</h3>
                <p className="text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Mission CTA */}
      <section className="py-24 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,white_10%,transparent_75%)] bg-[size:200%_200%] opacity-10 animate-gradient"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-10 tracking-tight leading-none">Ready to start <br /> authenticating?</h2>
            <p className="text-xl text-indigo-50 font-medium mb-12 leading-relaxed">
              Join 50,000+ individuals and organizations who trust NewsGuard AI to protect their information integrity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-12 py-6 bg-white text-indigo-600 font-black rounded-3xl hover:bg-slate-50 transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95 group text-lg"
              >
                Get Started Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/verify"
                className="w-full sm:w-auto px-12 py-6 border-2 border-white/30 text-white font-black rounded-3xl hover:bg-white/10 transition-all flex items-center justify-center gap-4 group active:scale-95 text-lg"
              >
                Try Neural Scan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-12 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-indigo-600" />
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">NewsGuard AI</span>
          </Link>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/about" className="text-indigo-600">About</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Terms</Link>
          </div>
          <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
            © 2026 NewsGuard AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
