import React from 'react';
import { Mail, Shield, Book, Award, Heart, Sparkles, Rss, Map } from 'lucide-react';
import { SiteSettings } from '../types.js';

interface FooterProps {
  navigate: (path: string) => void;
  settings: SiteSettings;
}

export default function Footer({ navigate, settings }: FooterProps) {
  const handleLinkClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleLinkClick('/')}>
              <div className="p-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-gold-500" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                Net<span className="text-gold-500">Ventures</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              {settings.siteDescription}
            </p>
            <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
              <a href="/rss.xml" target="_blank" className="hover:text-gold-500 transition-colors flex items-center gap-1 text-xs font-mono">
                <Rss className="h-3.5 w-3.5" /> RSS Feed
              </a>
              <span className="text-gray-300">|</span>
              <a href="/sitemap.xml" target="_blank" className="hover:text-gold-500 transition-colors flex items-center gap-1 text-xs font-mono">
                <Map className="h-3.5 w-3.5" /> XML Sitemap
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
              Platform
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleLinkClick('/')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Magazine Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/blog')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Articles & Tutorials
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/about')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Editorial Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/contact')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Inquiries & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Compliance Links */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
              Compliance
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleLinkClick('/privacy')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/terms')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/disclosure')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Affiliate Disclosure
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate disclosure disclaimer */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-900 text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-sans">
          {settings.affiliateDisclosure}
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {settings.footerText}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              Build for AI & human discovery. Designed with <Heart className="h-3 w-3 text-red-500 fill-current" /> in 2026.
            </p>
            <button 
              onClick={() => handleLinkClick('/secret-cms-login')} 
              className="text-[10px] text-gray-300 dark:text-zinc-800 hover:text-gold-500 hover:dark:text-gold-500 transition-colors font-mono select-none cursor-pointer"
              title="Admin Access"
            >
              0000
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
