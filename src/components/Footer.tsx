import React from 'react';
import { Heart, Rss, Map } from 'lucide-react';
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
              <div className="w-8 h-8 bg-zinc-900 dark:bg-amber-400 rounded-lg text-amber-400 dark:text-zinc-950 font-display font-bold text-xs flex items-center justify-center">
                SM
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                MD Sharif <span className="text-gold-500">Miah</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              Independent web and SaaS builder from Bangladesh, based in Saudi Arabia. My projects, services and notes from building things on the web.
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
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleLinkClick('/')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/blog')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Blog & Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/about')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  About Sharif
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/contact')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Contact
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
          Some articles may contain affiliate links. If you buy through one of them, this site may earn a commission at no additional cost to you. Product evaluations and personal experience are described in each article.
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © 2026 MD Sharif Miah. NetVentures articles remain part of this site.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              Built with care and curiosity <Heart className="h-3 w-3 text-red-500 fill-current" />
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
