import React from 'react';
import { Mail, Sparkles, Rss, Map } from 'lucide-react';
import { SiteSettings } from '../types.js';

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

  const contactEmail = settings.contactEmail || 'editor@netventures.online';

  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="inline-flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <div className="p-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-gold-500" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                Net<span className="text-gold-500">Ventures</span>
              </span>
            </a>

            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Digital agency building customer-facing websites, custom management systems, and local &amp; AI search visibility for hotels and restaurants.
            </p>

            <div className="pt-1">
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
              >
                <Mail className="h-4 w-4 text-gold-500 shrink-0" />
                <span>{contactEmail}</span>
              </a>
            </div>
          </div>

          {/* Agency Navigation */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-900 dark:text-white">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', path: '/' },
                { label: 'Services', path: '/services' },
                { label: 'Products', path: '/products' },
                { label: 'Our Work', path: '/our-work' },
                { label: 'Blog', path: '/blog' },
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    onClick={(e) => handleLinkClick(e, item.path)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-900 dark:text-white">
              Hospitality Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/services#hotel-restaurant-websites"
                  onClick={(e) => handleLinkClick(e, '/services#hotel-restaurant-websites')}
                  className="text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                >
                  Hotel &amp; Restaurant Websites
                </a>
              </li>
              <li>
                <a
                  href="/services#custom-management-systems"
                  onClick={(e) => handleLinkClick(e, '/services#custom-management-systems')}
                  className="text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                >
                  Custom Management Apps
                </a>
              </li>
              <li>
                <a
                  href="/services#local-seo-ai-visibility"
                  onClick={(e) => handleLinkClick(e, '/services#local-seo-ai-visibility')}
                  className="text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                >
                  Local SEO &amp; AI Search Visibility
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-900 dark:text-white">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleLinkClick(e, '/privacy')}
                  className="text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLinkClick(e, '/terms')}
                  className="text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a
                  href="/disclosure"
                  onClick={(e) => handleLinkClick(e, '/disclosure')}
                  className="text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                >
                  Affiliate Disclosure
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate disclosure disclaimer (explicitly scoped to blog content) */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-900 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Blog Editorial Disclosure:</span>{' '}
          {settings.affiliateDisclosure}
        </div>

        {/* Bottom copyright & compact feeds */}
        <div className="mt-6 pt-6 border-t border-gray-200/70 dark:border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2026 NetVentures. Websites, custom systems &amp; search visibility for hospitality businesses.
          </p>
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-600 dark:hover:text-gold-500 transition-colors flex items-center gap-1 text-xs font-mono focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
            >
              <Rss className="h-3.5 w-3.5" /> RSS
            </a>
            <span className="text-gray-300 dark:text-zinc-700">|</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-600 dark:hover:text-gold-500 transition-colors flex items-center gap-1 text-xs font-mono focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
            >
              <Map className="h-3.5 w-3.5" /> Sitemap
            </a>
            <span className="text-gray-300 dark:text-zinc-700">|</span>
            <a
              href="/secret-cms-login"
              onClick={(e) => handleLinkClick(e, '/secret-cms-login')}
              className="text-[10px] text-gray-300 dark:text-zinc-800 hover:text-gold-500 transition-colors font-mono select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
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
