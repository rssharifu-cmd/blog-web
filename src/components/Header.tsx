import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Search } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onSearchOpen: () => void;
}

export default function Header({ currentPath, navigate, darkMode, setDarkMode, onSearchOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer shrink-0" onClick={() => handleLinkClick('/')}>
            <div className="relative flex items-center gap-2">
              <div className="w-9 h-9 bg-zinc-900 dark:bg-amber-400 text-amber-400 dark:text-zinc-950 rounded-xl flex items-center justify-center font-display font-bold text-sm" aria-hidden="true">
                SM
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-gray-900 dark:text-white">MD Sharif Miah</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Websites · SaaS · Learning</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-3.5 xl:space-x-5">
            {links.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.path)}
                  className={`whitespace-nowrap font-medium text-[13px] transition-colors cursor-pointer ${
                    isActive
                      ? 'text-gold-500 dark:text-gold-500'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Utility Controls */}
          <div className="flex items-center space-x-4 shrink-0">
            <button
              onClick={onSearchOpen}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-gold-500" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-1 transition-colors duration-200">
          {links.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.path)}
                className={`block w-full text-left px-3 py-2 rounded-md font-medium text-base transition-colors ${
                  isActive
                    ? 'bg-gold-50/50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-500'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
