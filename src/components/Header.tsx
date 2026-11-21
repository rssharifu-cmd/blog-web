import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Search, Sparkles, ChevronDown } from 'lucide-react';
import { BLOG_CATEGORIES_MENU } from '../data/agencyContent.js';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onSearchOpen: () => void;
}

export default function Header({ currentPath, navigate, darkMode, setDarkMode, onSearchOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileBlogCatsOpen, setMobileBlogCatsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Our Work', path: '/our-work' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      navigate(path);
      setMobileMenuOpen(false);
    }
  };

  const isPathActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    if (path === '/blog') return currentPath === '/blog' || currentPath.startsWith('/blog/');
    if (path === '/products') return currentPath === '/products' || currentPath.startsWith('/products/');
    return currentPath === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center gap-2.5 shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
          >
            <div className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-gold-500" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
              Net<span className="text-gold-500">Ventures</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center space-x-6 xl:space-x-7">
            {links.map((link) => {
              const active = isPathActive(link.path);
              return (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  aria-current={active ? 'page' : undefined}
                  className={`whitespace-nowrap font-medium text-sm py-1 border-b-2 transition-colors rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 ${
                    active
                      ? 'text-gold-600 dark:text-gold-500 border-gold-500'
                      : 'text-gray-600 dark:text-gray-300 border-transparent hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Utility Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              type="button"
              onClick={onSearchOpen}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              aria-label="Search site and articles"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <Sun className="h-5 w-5 text-gold-500" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Mobile Navigation"
          className="lg:hidden border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-5 space-y-1 transition-colors duration-200"
        >
          {links.map((link) => {
            const active = isPathActive(link.path);
            if (link.path === '/blog') {
              return (
                <div key={link.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <a
                      href={link.path}
                      onClick={(e) => handleNavClick(e, link.path)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex-1 block px-3 py-2.5 rounded-lg font-medium text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
                        active
                          ? 'bg-gold-50/70 dark:bg-gold-500/10 text-gold-700 dark:text-gold-500'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      {link.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => setMobileBlogCatsOpen(!mobileBlogCatsOpen)}
                      aria-expanded={mobileBlogCatsOpen}
                      aria-label="Toggle blog categories"
                      className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileBlogCatsOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {mobileBlogCatsOpen && (
                    <div className="pl-4 ml-3 border-l border-gray-200 dark:border-zinc-800 space-y-1 py-1">
                      {BLOG_CATEGORIES_MENU.map((cat) => {
                        const catPath = `/blog/category/${cat.slug}`;
                        const catActive = currentPath === catPath;
                        return (
                          <a
                            key={cat.slug}
                            href={catPath}
                            onClick={(e) => handleNavClick(e, catPath)}
                            className={`block px-3 py-1.5 rounded-md text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
                              catActive
                                ? 'text-gold-700 dark:text-gold-500 font-semibold'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            {cat.name}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                aria-current={active ? 'page' : undefined}
                className={`block w-full text-left px-3 py-2.5 rounded-lg font-medium text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
                  active
                    ? 'bg-gold-50/70 dark:bg-gold-500/10 text-gold-700 dark:text-gold-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
