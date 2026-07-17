import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '../lib/supabase.js';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const success = await subscribeNewsletter(email);
      if (success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-linear-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 p-8 sm:p-10 transition-all duration-200 shadow-xs">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-gold-500/5 dark:bg-gold-500/2 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-2xl">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 dark:bg-gold-500/10 text-gold-700 dark:text-gold-500 mb-4">
          <Mail className="h-3 w-3" /> The NetVentures Dispatch
        </span>
        
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Join 42,000+ founders automating digital wealth
        </h3>
        <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          Get exclusive weekly breakdowns on high-ticket affiliate strategies, generative content engines, and SaaS marketing playbooks. Strictly zero-spam, actionable insights only.
        </p>

        {status === 'success' ? (
          <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 animate-fade-in">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Subscription confirmed! Welcome to the inside loop. Check your inbox shortly.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your professional email"
              required
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 cursor-pointer group"
            >
              {status === 'loading' ? 'Encrypting...' : 'Get Instant Access'}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500">
          We protect your privacy. No ads, sponsor networks, or sharing. Unsubscribe in 1-click at any time.
        </p>
      </div>
    </div>
  );
}
