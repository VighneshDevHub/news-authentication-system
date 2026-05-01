'use client';

import React, { useState } from 'react';
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
  Play,
  Plus,
  Minus,
  Mail,
  Smartphone,
  Layout
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How accurate is the NewsGuard AI?",
      a: "Our neural network maintains a 99.9% accuracy rate across 1.2 million verified articles. We continuously train our models on real-time news data to detect even the most subtle synthetic misinformation patterns."
    },
    {
      q: "Does it work with non-English news?",
      a: "Yes, NewsGuard Neural 3.0 supports over 40 languages, including major European, Asian, and Middle Eastern languages, with specialized training for regional linguistic nuances."
    },
    {
      q: "Can I integrate NewsGuard into my existing workflow?",
      a: "Absolutely. We offer a robust API and official integrations for popular platforms like Slack, Microsoft Teams, and custom CMS plugins for newsrooms."
    },
    {
      q: "How does the bias detection work?",
      a: "Our system analyzes institutional bias by examining linguistic patterns, emotionally charged language, and the presence of loaded terms. It compares the report against a wide spectrum of verified sources to identify missing perspectives."
    }
  ];

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden selection:bg-indigo-500/30 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-52 lg:pb-40 hero-gradient overflow-hidden">
        {/* Cinematic Background Effects */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"></div>
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent"></div>
          
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Animated Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-500/5 blur-[100px] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-morphism border border-indigo-200/50 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black mb-12 shadow-xl shadow-indigo-500/10 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
              <span className="tracking-[0.15em] uppercase">Neural Network v3.2 Now Live</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter text-slate-900 dark:text-white mb-12 leading-[0.85] text-balance"
            >
              Decode the <br />
              <span className="text-gradient">Digital Truth.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg lg:text-2xl text-slate-600 dark:text-slate-400 mb-16 leading-relaxed max-w-3xl mx-auto font-medium"
            >
              NewsGuard AI is the definitive authentication layer for the modern internet. 
              Real-time detection of synthetic bias, linguistic manipulation, and AI-generated disinformation.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-12 py-6 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-4 active:scale-95 group text-lg"
              >
                Start Verification
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#demo"
                className="w-full sm:w-auto px-12 py-6 glass-morphism text-slate-900 dark:text-white font-black rounded-3xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 group active:scale-95 text-lg"
              >
                <div className="p-2 bg-indigo-600 rounded-full text-white">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                Live Demo
              </Link>
            </motion.div>

            {/* Trusted By / Logo Cloud */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-32"
            >
              <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.4em] mb-12">Deployed by industry leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-12 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 ease-in-out">
                {['The Verge', 'TechCrunch', 'Wired', 'Forbes', 'Bloomberg', 'Reuters'].map((brand) => (
                  <span key={brand} className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter hover:scale-110 transition-transform cursor-default select-none">{brand}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Preview / Demo Section */}
      <section id="demo" className="py-24 lg:py-40 relative bg-slate-50/50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Experience the Power</h2>
            <p className="text-4xl md:text-6xl font-heading font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Neural Audit Interface.</p>
            <p className="text-xl text-slate-500 dark:text-zinc-400 font-medium">The most intuitive dashboard for high-stakes information verification.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-morphism p-2 rounded-[3.5rem] border-gradient shadow-[0_50px_100px_-20px_rgba(79,70,229,0.2)]"
          >
            <div className="bg-white dark:bg-zinc-950 rounded-[3.2rem] overflow-hidden relative group">
              <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-transparent transition-colors duration-700"></div>
              
              {/* Simulated UI Content */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-12 border-b border-slate-100 dark:border-zinc-900 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Active Scan</p>
                      <p className="text-base font-black text-slate-900 dark:text-white">report_0x882.pdf</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      System Online
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-slate-400">
                      <Layout className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-8">
                    <div className="h-4 w-1/3 bg-slate-100 dark:bg-zinc-900 rounded-full"></div>
                    <div className="space-y-4">
                      <div className="h-3 w-full bg-slate-50 dark:bg-zinc-900 rounded-full"></div>
                      <div className="h-3 w-full bg-slate-50 dark:bg-zinc-900 rounded-full"></div>
                      <div className="h-3 w-3/4 bg-slate-50 dark:bg-zinc-900 rounded-full"></div>
                    </div>
                    <div className="p-8 bg-indigo-600/5 dark:bg-indigo-500/5 rounded-3xl border border-indigo-100 dark:border-indigo-500/10">
                      <p className="text-sm font-bold text-slate-700 dark:text-zinc-300 leading-relaxed italic">
                        "The proprietary neural engine detected institutional bias in paragraph 4. Cross-referencing against Reuters and AP suggests a 42% discrepancy in factual reporting of the events..."
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-5 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full border-8 border-indigo-600/10 flex items-center justify-center relative">
                      <div className="absolute inset-0 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-center">
                        <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">98.4%</p>
                        <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-2">Authenticity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] bg-slate-950/20">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-2xl"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 lg:py-40 relative bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Process</h2>
            <p className="text-5xl md:text-7xl font-heading font-black text-slate-900 dark:text-white mb-8 tracking-tight">How it works.</p>
            <p className="text-xl text-slate-500 dark:text-zinc-400 font-medium">Three steps to complete news transparency. Powered by NewsGuard Neural.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-100 dark:via-zinc-800 to-transparent -z-10"></div>
            
            {[
              { 
                step: '01', 
                title: 'Submit Content', 
                desc: 'Paste a news article, social media post, or a specific claim into our neural analyzer.',
                icon: Layers,
                color: 'from-blue-500 to-indigo-500'
              },
              { 
                step: '02', 
                title: 'AI Audit', 
                desc: 'Our neural network cross-references 15,000+ sources and analyzes linguistic patterns.',
                icon: Cpu,
                color: 'from-indigo-500 to-fuchsia-500'
              },
              { 
                step: '03', 
                title: 'Get Results', 
                desc: 'Receive a detailed authenticity report with bias analysis and supporting evidence.',
                icon: BarChart3,
                color: 'from-fuchsia-500 to-rose-500'
              }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="mb-10 relative">
                  <div className={cn("w-20 h-20 rounded-[2rem] bg-gradient-to-tr flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110 duration-500", item.color)}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-zinc-950 rounded-full flex items-center justify-center text-lg font-black text-slate-900 dark:text-white border-4 border-slate-50 dark:border-zinc-900 shadow-xl">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-40 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Support</h2>
            <p className="text-5xl md:text-7xl font-heading font-black text-slate-900 dark:text-white mb-8 tracking-tight">Questions?</p>
            <p className="text-xl text-slate-500 dark:text-zinc-400 font-medium">Everything you need to know about NewsGuard.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={false}
                className={cn(
                  "rounded-[2rem] border transition-all duration-300 overflow-hidden",
                  openFaq === i 
                    ? "bg-slate-50 dark:bg-zinc-900/50 border-indigo-500/30" 
                    : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                )}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-8 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{faq.q}</span>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                    openFaq === i ? "bg-indigo-600 text-white rotate-45" : "bg-slate-100 dark:bg-zinc-900 text-slate-500"
                  )}>
                    <Plus className="w-5 h-5" />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-8 pb-8 pt-0">
                        <p className="text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="demo" className="py-24 lg:py-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Neural Capabilities</h2>
              <p className="text-5xl md:text-7xl font-heading font-black text-slate-900 dark:text-white leading-none tracking-tighter">Everything you need to <span className="text-gradient">authenticate.</span></p>
            </div>
            <p className="text-xl text-slate-500 dark:text-zinc-400 max-w-sm font-medium leading-relaxed">
              Our enterprise-grade toolset provides deep insights into every piece of digital content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Card 1: Main Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 p-12 rounded-[3rem] bg-slate-900 dark:bg-zinc-900 text-white relative overflow-hidden group border border-zinc-800"
            >
              <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Fingerprint className="w-64 h-64" />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-indigo-600/40">
                  <Fingerprint className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black mb-6 tracking-tight">Source Fingerprinting</h3>
                <p className="text-zinc-400 text-xl leading-relaxed max-w-lg mb-12">
                  Automatically track the origin of any claim across 15,000+ verified news nodes and millions of social data points.
                </p>
                <div className="mt-auto flex flex-wrap gap-4">
                  {['Cross-referencing', 'Metadata Analysis', 'Chain of Custody'].map(tag => (
                    <span key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bento Card 2: Small Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 p-12 rounded-[3rem] glass-morphism border border-slate-200 dark:border-zinc-800 flex flex-col justify-between group"
            >
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform">
                <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Real-time Latency</h3>
                <p className="text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                  Average analysis time of 184ms. Faster than human cognition.
                </p>
              </div>
            </motion.div>

            {/* Bento Card 3: Small Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 p-12 rounded-[3rem] glass-morphism border border-slate-200 dark:border-zinc-800 flex flex-col justify-between group"
            >
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Enterprise Privacy</h3>
                <p className="text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                  Military-grade encryption for all verification requests and history.
                </p>
              </div>
            </motion.div>

            {/* Bento Card 4: Medium Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 p-12 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/20"
            >
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,white_50%,transparent_75%)] bg-[size:200%_200%] animate-gradient"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">Emotional Bias Audit</h3>
                    <p className="text-indigo-100 font-bold">Linguistic Sentiment Detection</p>
                  </div>
                </div>
                <p className="text-lg text-indigo-50 font-medium leading-relaxed max-w-2xl">
                  Our neural network identifies loaded language, logical fallacies, and emotional triggers designed to bypass critical thinking.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="py-24 border-y border-slate-100 dark:border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Workflow Ready</h2>
              <p className="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white mb-8 tracking-tight">Connect with your favorite tools.</p>
              <p className="text-lg text-slate-500 dark:text-zinc-400 font-medium mb-10 leading-relaxed">
                Deploy NewsGuard anywhere. From your browser to your enterprise CMS, verification is just a click away.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 text-sm font-bold text-slate-600 dark:text-zinc-400 shadow-sm">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  Browser Extension
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 text-sm font-bold text-slate-600 dark:text-zinc-400 shadow-sm">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  iOS & Android
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 text-sm font-bold text-slate-600 dark:text-zinc-400 shadow-sm">
                  <Layout className="w-4 h-4 text-indigo-600" />
                  REST API
                </div>
              </div>
            </div>
            
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full"></div>
              <div className="relative grid grid-cols-3 gap-6 p-8 glass-morphism rounded-[3rem] border border-white/20 shadow-2xl">
                {[
                  { name: 'Slack', color: 'bg-orange-500' },
                  { name: 'Teams', color: 'bg-blue-600' },
                  { name: 'Discord', color: 'bg-indigo-500' },
                  { name: 'GitHub', color: 'bg-zinc-800' },
                  { name: 'Notion', color: 'bg-zinc-900' },
                  { name: 'Linear', color: 'bg-indigo-600' },
                  { name: 'Figma', color: 'bg-pink-500' },
                  { name: 'Zoom', color: 'bg-blue-400' },
                  { name: 'Trello', color: 'bg-blue-700' },
                ].map((app) => (
                  <motion.div 
                    key={app.name}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="aspect-square rounded-2xl bg-white dark:bg-zinc-800 shadow-xl border border-slate-100 dark:border-zinc-700 flex items-center justify-center p-4"
                  >
                    <div className={cn("w-full h-full rounded-xl opacity-20", app.color)} />
                    <span className="absolute text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{app.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Bento Grid Implementation */}
      <section id="features" className="py-24 lg:py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Core Capabilities</h2>
              <p className="text-5xl md:text-7xl font-heading font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">Built for the <br /> modern truth.</p>
            </div>
            <p className="text-lg text-slate-500 dark:text-zinc-400 max-w-sm font-medium leading-relaxed">
              Our neural network is specifically architected to identify cognitive biases and synthetic patterns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Large Bento Item */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-3 md:row-span-2 p-10 rounded-[3rem] bg-slate-900 dark:bg-zinc-900 text-white relative overflow-hidden group border border-zinc-800"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <Cpu className="w-64 h-64" />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-600/40">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-black mb-6 tracking-tight">Deep Neural <br />Analysis Engine</h3>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-xs mb-auto">
                  Proprietary LLMs trained on millions of verified reports to detect subtle linguistic manipulation and AI-generated misinformation.
                </p>
                <div className="pt-10 flex items-center gap-4">
                  <span className="px-4 py-1.5 rounded-full bg-zinc-800 text-xs font-bold uppercase tracking-widest">Version 3.0</span>
                  <span className="px-4 py-1.5 rounded-full bg-indigo-600/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">Active Learning</span>
                </div>
              </div>
            </motion.div>

            {/* Top Right Bento Item */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-3 p-10 rounded-[3rem] glass-morphism border border-slate-200 dark:border-zinc-800/50 flex flex-col justify-between group"
            >
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Globe className="w-7 h-7" />
                </div>
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                      <div className="w-full h-full bg-indigo-500/20" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Global Verification Network</h3>
                <p className="text-slate-500 dark:text-zinc-400 font-medium">
                  Real-time cross-referencing against 15,000+ trusted news sources and official databases worldwide.
                </p>
              </div>
            </motion.div>

            {/* Bottom Right Bento Items */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-1.5 p-10 rounded-[3rem] glass-morphism border border-slate-200 dark:border-zinc-800/50 group"
            >
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
                <Activity className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Bias Detection</h3>
              <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                Identify institutional bias and emotionally charged language.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-1.5 p-10 rounded-[3rem] glass-morphism border border-slate-200 dark:border-zinc-800/50 group"
            >
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Privacy First</h3>
              <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                Enterprise-grade encryption for all verification requests.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium Look */}
      <section id="pricing" className="py-24 lg:py-40 bg-slate-50 dark:bg-zinc-900/50 border-y border-slate-200 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Pricing</h2>
            <p className="text-5xl md:text-7xl font-heading font-black text-slate-900 dark:text-white mb-8 tracking-tight">Scale your truth.</p>
            <p className="text-xl text-slate-500 dark:text-zinc-400 font-medium">Simple, transparent pricing for teams of all sizes. No hidden fees, just pure verification.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {[
              { name: 'Starter', price: 'Free', desc: 'Perfect for individual fact-checkers.', features: ['10 Scans / month', 'Basic Source Audit', 'Community Support', 'Standard API'] },
              { name: 'Professional', price: '$49', desc: 'For growing newsrooms & researchers.', features: ['Unlimited Scans', 'Advanced Neural Engine', 'Full API Access', 'Priority Support', 'Custom Sources'], popular: true },
              { name: 'Enterprise', price: 'Custom', desc: 'Bespoke solutions for organizations.', features: ['Custom LLM Training', 'SLA Guarantee', 'Dedicated Account Manager', 'On-prem Deployment', 'White-labeling'] },
            ].map((plan) => (
              <motion.div 
                key={plan.name} 
                whileHover={{ y: -8 }}
                className={cn(
                  "relative p-10 rounded-[3rem] flex flex-col",
                  plan.popular 
                    ? 'bg-slate-900 text-white shadow-2xl shadow-indigo-500/20 ring-1 ring-white/10' 
                    : 'bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/30">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-10">
                  <h3 className="text-2xl font-black mb-3 tracking-tight">{plan.name}</h3>
                  <p className={cn("text-sm font-medium", plan.popular ? 'text-zinc-400' : 'text-slate-500 dark:text-zinc-500')}>
                    {plan.desc}
                  </p>
                </div>

                <div className="mb-10 flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className={cn("text-sm font-black uppercase tracking-widest", plan.popular ? 'text-zinc-500' : 'text-slate-400')}>/mo</span>}
                </div>

                <div className="flex-grow space-y-5 mb-12">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-4 text-sm font-bold tracking-tight">
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", plan.popular ? 'bg-indigo-600' : 'bg-indigo-50 dark:bg-indigo-900/30')}>
                        <Check className={cn("w-3 h-3", plan.popular ? 'text-white' : 'text-indigo-600 dark:text-indigo-400')} />
                      </div>
                      <span className={plan.popular ? 'text-zinc-300' : 'text-slate-600 dark:text-zinc-400'}>{f}</span>
                    </div>
                  ))}
                </div>

                <button className={cn(
                  "w-full py-5 rounded-2xl font-black transition-all active:scale-95 text-sm uppercase tracking-widest",
                  plan.popular 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30' 
                    : 'bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800'
                )}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 lg:py-40 bg-white dark:bg-zinc-950 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-video bg-indigo-600/5 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-morphism p-1 rounded-[4rem] border-gradient">
            <div className="bg-white dark:bg-zinc-950 p-12 lg:p-24 rounded-[3.8rem] text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform">
                <Mail className="w-64 h-64 text-indigo-600" />
              </div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Stay Informed</h2>
                <p className="text-4xl md:text-6xl font-heading font-black text-slate-900 dark:text-white mb-8 tracking-tight">The Neural Digest.</p>
                <p className="text-lg text-slate-500 dark:text-zinc-400 font-medium mb-12">
                  Weekly insights on AI-generated misinformation trends, new verification techniques, and NewsGuard updates.
                </p>
                
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <button className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/25 active:scale-95 uppercase tracking-widest text-sm">
                    Subscribe
                  </button>
                </form>
                <p className="mt-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em]">
                  Join 25,000+ subscribers. No spam, ever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-indigo-600">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-10 backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-current" />
              Trusted by 10k+ Professionals
            </div>
            <h2 className="text-5xl md:text-8xl font-heading font-black mb-12 tracking-tighter leading-tight">
              Ready to verify <br /> the internet?
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100 mb-16 font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
              Join the world's leading journalists, researchers, and organizations in the fight for authenticated information.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-indigo-600 font-black rounded-[2rem] hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 text-lg uppercase tracking-widest"
              >
                Get Started Free
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link 
                href="/signin" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-12 py-6 bg-transparent text-white border-2 border-white/30 font-black rounded-[2rem] hover:bg-white/10 transition-all active:scale-95 text-lg uppercase tracking-widest backdrop-blur-md"
              >
                Log In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">NewsGuard AI</span>
              </Link>
              <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium leading-relaxed mb-8">
                The world's most advanced AI-powered news verification system. Building a future of authenticated information.
              </p>
              <div className="flex gap-4">
                {['twitter', 'github', 'linkedin'].map(social => (
                  <div key={social} className="w-10 h-10 rounded-xl glass-morphism border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600/30 cursor-pointer transition-all">
                    <span className="sr-only">{social}</span>
                    {/* Social Icons would go here */}
                  </div>
                ))}
              </div>
            </div>
            
            {['Product', 'Resources', 'Company'].map((title, i) => (
              <div key={title}>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8">{title}</h4>
                <ul className="space-y-4">
                  {['Features', 'API', 'Pricing', 'Documentation'].map(item => (
                    <li key={item}>
                      <Link href="#" className="text-sm font-bold text-slate-500 dark:text-zinc-500 hover:text-indigo-600 transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-12 border-t border-slate-200 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
              © 2026 NewsGuard Neural Systems. Built for truth.
            </p>
            <div className="flex gap-8 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em]">
              <Link href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
