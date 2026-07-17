import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Search, BookOpen, Terminal, Sparkles } from 'lucide-react';

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
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
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
          <div className="flex items-center cursor-pointer" onClick={() => handleLinkClick('/')}>
            <div className="relative flex items-center gap-2">
              <div className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 animate-pulse text-gold-500" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                Net<span className="text-gold-500">Ventures</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => {
              const isActive = currentPath === link.path || (link.path === '/blog' && currentPath.startsWith('/blog/'));
              return (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.path)}
                  className={`font-medium text-sm transition-colors cursor-pointer ${
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
          <div className="flex items-center space-x-4">
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
              className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-1 transition-colors duration-200">
          {links.map((link) => {
            const isActive = currentPath === link.path || (link.path === '/blog' && currentPath.startsWith('/blog/'));
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
