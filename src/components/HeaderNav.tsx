import React from 'react';
import { Key, LogOut, Moon, Sun } from 'lucide-react';

interface HeaderNavProps {
  onOpenAdmin: () => void;
  currentUserName?: string;
  onSignOut?: () => void;
  themeMode?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenAdmin,
  currentUserName,
  onSignOut,
  themeMode = 'light',
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 transform-gpu bg-[#FAF6F0]/96 dark:bg-[#18070c]/95 border-b border-[#dfbfbe]/60 dark:border-[#3d1c24] shadow-[0_2px_12px_rgba(28,28,24,0.04)] dark:shadow-[0_2px_14px_rgba(0,0,0,0.4)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single element Brand Wordmark */}
        <a
          href="#"
          className="font-stylish text-2xl sm:text-[1.85rem] font-normal tracking-wide leading-none text-[#1c1c18] dark:text-[#f5efe6] hover:text-[#871321] dark:hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 pt-0.5"
        >
          <span>Maggie's Archive</span>
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono-split font-bold uppercase tracking-widest text-[#584140] dark:text-[#d4c3be]">
          <a href="#celebration" className="hover:text-[#871321] dark:hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0">
            Celebration
          </a>
          <a href="#vogue" className="hover:text-[#871321] dark:hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0">
            Vogue Edition
          </a>
          <a href="#scrapbook" className="hover:text-[#871321] dark:hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0">
            Scrapbook
          </a>
          <a href="#ribbon" className="hover:text-[#871321] dark:hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0">
            Photo Ribbon
          </a>
          <a href="#letter" className="hover:text-[#871321] dark:hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0">
            Keepsake Letter
          </a>
          <a href="#surprise" className="hover:text-[#871321] dark:hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0">
            Surprise
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-9 h-9 rounded-full border border-[#dfbfbe]/80 dark:border-[#D4AF37]/40 bg-white/80 dark:bg-[#240e14] text-[#584140] dark:text-[#F3E5AB] hover:text-[#871321] dark:hover:text-white hover:border-[#D4AF37] transition-colors flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#871321]"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          )}
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              title={currentUserName ? `Signed in as ${currentUserName}` : 'Sign Out'}
              className="px-3 py-1.5 text-xs font-mono-split uppercase font-bold tracking-wider text-[#584140] dark:text-[#d4c3be] hover:text-[#871321] dark:hover:text-[#F3E5AB] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#871321] rounded-md"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-3.5 py-1.5 bg-[#1A1A1A] dark:bg-[#871321] hover:bg-[#871321] dark:hover:bg-[#630011] text-white rounded-full text-xs font-mono-split uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 shadow-sm border border-[#D4AF37]/50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#871321]"
          >
            <Key className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>Admin Suite</span>
          </button>
        </div>
      </div>
    </header>
  );
};
