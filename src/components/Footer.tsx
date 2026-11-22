import React from 'react';
import { Mail, Sparkles, Youtube, Facebook } from 'lucide-react';
import { SiteSettings } from '../types.js';
import { SOCIAL_LINKS } from '../data/agencyContent.js';

interface FooterProps {
  navigate: (path: string) => void;
  settings: SiteSettings;
}

export default function Footer({ navigate, settings }: FooterProps) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      navigate(path);
    }
  };

  const publicEmail =
    settings.contactEmail && settings.contactEmail !== 'editor@netventures.online'
      ? settings.contactEmail
      : 'hello@netventures.online';

  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Brand & Direct Contact */}
          <div className="space-y-2">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="inline-flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <div className="p-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-gold-500" />
              </div>
              <span className="font-display font-bold text-base tracking-tight text-gray-900 dark:text-white">
                Net<span className="text-gold-500">Ventures</span>
              </span>
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Stefan Sharf · Founder &amp; CEO
            </p>
          </div>

          {/* Primary Anchor & Blog Navigation */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {[
              { label: 'About', path: '/#about' },
              { label: 'Services', path: '/#services' },
              { label: 'Work', path: '/#work' },
              { label: 'Contact', path: '/#contact' },
              { label: 'Blog', path: '/blog' },
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path)}
                className="text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Email & Socials */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <a
              href={`mailto:${publicEmail}`}
              className="inline-flex items-center gap-1.5 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
            >
              <Mail className="h-3.5 w-3.5 text-gold-500" />
              <span>{publicEmail}</span>
            </a>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="inline-flex items-center gap-1 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
            >
              <Youtube className="h-4 w-4" />
              <span>YouTube</span>
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex items-center gap-1 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
            >
              <Facebook className="h-4 w-4" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright & Essential Legal Links */}
        <div className="pt-5 border-t border-gray-200 dark:border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <p>© 2026 NetVentures · Stefan Sharf</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href="/privacy"
              onClick={(e) => handleLinkClick(e, '/privacy')}
              className="hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleLinkClick(e, '/terms')}
              className="hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="/disclosure"
              onClick={(e) => handleLinkClick(e, '/disclosure')}
              className="hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
            >
              Affiliate Disclosure
            </a>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
            >
              RSS
            </a>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
            >
              Sitemap
            </a>
            <a
              href="/secret-cms-login"
              onClick={(e) => handleLinkClick(e, '/secret-cms-login')}
              className="text-[10px] text-gray-300 dark:text-zinc-800 hover:text-gold-500 transition-colors font-mono select-none"
              title="CMS Access"
            >
              0000
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
