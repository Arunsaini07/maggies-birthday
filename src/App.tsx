/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { Sparkles, ArrowDown } from 'lucide-react';
import { HeaderNav } from './components/HeaderNav.tsx';
import { CountdownFlipClock } from './components/CountdownFlipClock.tsx';
import { VipBadgePass } from './components/VipBadgePass.tsx';
import { CakeCelebration } from './components/CakeCelebration.tsx';
import { VogueSpread } from './components/VogueSpread.tsx';
import { MemoryScrapbook } from './components/MemoryScrapbook.tsx';
import { PhotoRibbon } from './components/PhotoRibbon.tsx';
import { WaxSealedLetter } from './components/WaxSealedLetter.tsx';
import { VinylMusicPlayer } from './components/VinylMusicPlayer.tsx';
import { FinalSurprise } from './components/FinalSurprise.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { AuthGate } from './components/AuthGate.tsx';
import {
  ScrollProgressBar,
  EditorialDivider,
  EditorialReveal,
  ParallaxBackdrop,
  RomanticAmbience,
  EDITORIAL_EASE,
} from './components/ScrollChoreography.tsx';
import { PhotoItem, BirthdayContent, WebsiteSettingsData, GuestWish, RegisteredUser } from './types/index.ts';

// Initial fallback state matching database seed
const INITIAL_CONTENT: BirthdayContent = {
  heroGreeting: 'Happy 24th Birthday, Maggie',
  heroSubtitle: 'A curated celebration of elegance, laughter, and an unforgettable journey.',
  heroAge: '24',
  vogueHeadline: 'MAGGIE: THE ART OF RADIANCE',
  vogueSubheadline: 'An exclusive retrospective on twenty-four years of unmatched style, warmth, and grace.',
  vogueIssueNumber: 'SPECIAL NO. 24',
  vogueDateText: 'NOVEMBER SPECIAL ISSUE',
  letterRecipient: 'Dearest Maggie,',
  letterBody: `To know you is to understand what true elegance, warmth, and loyalty feel like.

Over the past year, through every spontaneous coffee run, museum stroll, whispered secret, and uncontrollable fit of laughter, you have been an anchor of pure joy. You carry yourself with such effortless grace—turning ordinary moments into cinematic memories that belong in the pages of Vogue.

Today we celebrate everything you are: your kindness that never wavers, your infectious energy that lights up every room before you even speak, and your fearless spirit that inspires everyone around you.

As you step into 24, I hope this year wraps you in gold, brings you breathtaking adventures, and rewards your beautiful heart with all the happiness and peace you give so freely to others.

Thank you for being my constant, my confidante, and my best friend.`,
  letterSignOff: 'Forever and always with boundless love,',
  letterSender: 'Your Best Friend',
  surpriseHeadline: 'A Golden Wish for Your 24th Year',
  surpriseMessage: 'May every sunrise bring you fresh inspiration, may every road lead you to places you dream of, and may you always remember how deeply cherished you are.',
  quoteText: 'True glamour is not about what you wear; it is the glow of kindness you leave in every room you enter.',
  quoteAuthor: 'Vogue Birthday Editorial Edition'
};

const defaultBirthdayDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  d.setHours(20, 0, 0, 0);
  return d.toISOString();
};

const INITIAL_SETTINGS: WebsiteSettingsData = {
  birthdayDate: defaultBirthdayDate(),
  siteTitle: "Maggie's Birthday – Velvet & Keepsake",
  musicTitle: "L'Amour & La Nuit (Vintage Waltz)",
  musicArtist: "Acoustic Keepsake Ensemble",
  musicUrl: '',
  theme: 'velvet',
  allowGuestWishes: true,
  guestWishes: [
    {
      id: 'wish-1',
      name: 'Elena & Lucas',
      message: 'Happy Birthday Maggie! Keep shining like the brilliant queen you are! Love you endlessly! ✨',
      date: 'Today at 14:20',
      stampIcon: 'heart'
    },
    {
      id: 'wish-2',
      name: 'Sofia V.',
      message: 'To the most stylish, kind-hearted soul. Here is to 24 and endless champagne toasts! 🥂',
      date: 'Today at 16:05',
      stampIcon: 'star'
    }
  ]
};

const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    url: '/src/assets/images/maggie_vogue_cover_1794012861093.jpg',
    title: 'Vogue Special Edition',
    caption: 'Cover star of our hearts: Velvet blazer, gold tones, and effortless confidence.',
    category: 'vogue',
    date: 'Autumn Issue',
    location: 'Studio Milano',
    rotationDeg: -2,
    isFeatured: true,
    order: 1
  },
  {
    id: 'photo-2',
    url: '/src/assets/images/maggie_candid_smile_1794012862220.jpg',
    title: 'Morning in Saint-Germain',
    caption: 'Coffee, fresh croissants, and laughter that made the whole terrace turn heads.',
    category: 'polaroid',
    date: 'October 14',
    location: 'Paris, France',
    rotationDeg: -3,
    isFeatured: true,
    order: 2
  },
  {
    id: 'photo-3',
    url: '/src/assets/images/maggie_polaroid_travel_1794012862363.jpg',
    title: 'Amalfi Coast Memories',
    caption: 'Sun-drenched cliffs, sea breeze, and that golden sunset we promised never to forget.',
    category: 'polaroid',
    date: 'August 28',
    location: 'Positano, Italy',
    rotationDeg: 4,
    isFeatured: true,
    order: 3
  },
  {
    id: 'photo-4',
    url: '/src/assets/images/maggie_vip_portrait_1794012861926.jpg',
    title: 'Rembrandt Noir Portrait',
    caption: 'The warmth in your eyes and the genuine heart behind every smile.',
    category: 'scrapbook',
    date: 'November Keepsake',
    location: 'Atelier Portrait',
    rotationDeg: 2,
    isFeatured: true,
    order: 4
  },
  {
    id: 'photo-5',
    url: '/src/assets/images/maggie_hero_celebration_1794012861156.jpg',
    title: 'The Royal Banquet Call',
    caption: 'Velvet drapery, sparkling crystal, and toasts raised high for our best friend.',
    category: 'ribbon',
    date: 'Midnight Gala',
    location: 'Grand Ballroom',
    rotationDeg: -1,
    isFeatured: true,
    order: 5
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [content, setContent] = useState<BirthdayContent>(INITIAL_CONTENT);
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [settings, setSettings] = useState<WebsiteSettingsData>(INITIAL_SETTINGS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem('maggie_theme_mode') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
    try {
      localStorage.setItem('maggie_theme_mode', themeMode);
    } catch {
      // ignore storage errors
    }
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Restore visitor session before entering the application
  useEffect(() => {
    let isCancelled = false;

    const verifySession = async () => {
      const token = localStorage.getItem('maggie_visitor_token');
      if (!token) {
        if (!isCancelled) setIsCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch('/api/user-auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!isCancelled) {
          if (res.ok && data.success && data.data?.authenticated && data.data?.user) {
            setCurrentUser(data.data.user);
          } else {
            localStorage.removeItem('maggie_visitor_token');
            setCurrentUser(null);
          }
        }
      } catch {
        if (!isCancelled) {
          setCurrentUser(null);
        }
      } finally {
        if (!isCancelled) {
          setIsCheckingAuth(false);
        }
      }
    };

    verifySession();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Hydrate data from backend API once authenticated
  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const [contentRes, photosRes, settingsRes] = await Promise.all([
          fetch('/api/content'),
          fetch('/api/photos'),
          fetch('/api/settings'),
        ]);

        if (contentRes.ok) {
          const cData = await contentRes.json();
          if (cData.success && cData.data) setContent(cData.data);
        }
        if (photosRes.ok) {
          const pData = await photosRes.json();
          if (pData.success && pData.data) setPhotos(pData.data);
        }
        if (settingsRes.ok) {
          const sData = await settingsRes.json();
          if (sData.success && sData.data) setSettings(sData.data);
        }
      } catch (err) {
        console.warn('Backend hydration notice: using default seed data.', err);
      }
    };

    fetchData();
  }, [currentUser?.id]);

  const handleAuthenticated = (user: RegisteredUser) => {
    setCurrentUser(user);
    setIsCheckingAuth(false);
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem('maggie_visitor_token');
    localStorage.removeItem('maggie_visitor_token');
    setIsAdminOpen(false);
    setCurrentUser(null);
    if (token) {
      try {
        await fetch('/api/user-auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Session cleared client-side
      }
    }
  };

  const handleAddWish = (newWish: GuestWish) => {
    setSettings(prev => ({
      ...prev,
      guestWishes: [newWish, ...prev.guestWishes]
    }));
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#1c0408] text-[#FAF6F0] flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 rounded-full bg-[#871321] border border-[#D4AF37] flex items-center justify-center shadow-lg mb-4 animate-pulse">
          <span className="font-bodoni text-xl font-bold text-[#F9F6F0]">M</span>
        </div>
        <p className="font-mono-split text-xs uppercase tracking-[0.22em] text-[#F3E5AB]">
          Preparing Maggie's Archive...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthGate
        onAuthenticated={handleAuthenticated}
        themeMode={themeMode}
        onToggleTheme={toggleThemeMode}
      />
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#fcf9f3] dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6] flex flex-col font-sans selection:bg-[#871321] selection:text-[#ffffff] transition-colors duration-300">
        {/* Top Navigation */}
        <HeaderNav
          onOpenAdmin={() => setIsAdminOpen(true)}
          currentUserName={currentUser.name}
          onSignOut={handleSignOut}
          themeMode={themeMode}
          onToggleTheme={toggleThemeMode}
        />

        {/* Luxury Editorial Reading Progress Bar */}
        <ScrollProgressBar />

        {/* ACT 1: WELCOME / LANDING PAGE HERO */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden bg-[#1a0408]">
          {/* Background Atmosphere Image with Lightweight GPU Scroll Parallax & Scrim */}
          <ParallaxBackdrop
            src="/src/assets/images/maggie_hero_celebration_1794012861156.jpg"
            alt="Opulent Birthday Celebration"
          />
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 34%, rgba(135, 19, 33, 0.34) 0%, rgba(20, 4, 8, 0.72) 55%, var(--color-surface) 100%)',
            }}
          />
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, transparent 50%, var(--color-surface) 100%)',
            }}
          />

          {/* Romantic Floating Hearts & Rose-Gold Embers */}
          <RomanticAmbience variant="hero" />

          {/* Content Floating Frame */}
          <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center pt-8">
            {/* Editorial Kicker */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.04, ease: EDITORIAL_EASE }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1f060b]/80 border border-[#D4AF37]/55 text-amber-200 text-xs font-mono-split uppercase tracking-[0.25em] mb-6 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>A BESPOKE KEEPSAKE CELEBRATION</span>
            </motion.div>

            {/* Grand Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: EDITORIAL_EASE }}
              className="font-stylish text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-normal tracking-wide text-[#F9F6F0] leading-[1.15] [text-shadow:0_8px_24px_rgba(0,0,0,0.65)] text-balance"
            >
              {content.heroGreeting}
            </motion.h1>

            {/* Golden Romantic Hairline Sweep */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.22, ease: EDITORIAL_EASE }}
              style={{ transformOrigin: 'center' }}
              className="w-36 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-5"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26, ease: EDITORIAL_EASE }}
              className="font-playfair italic text-lg sm:text-2xl text-amber-100 max-w-2xl mx-auto mt-5 leading-relaxed"
            >
              "{content.heroSubtitle}"
            </motion.p>

            {/* Split-Flap Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34, ease: EDITORIAL_EASE }}
              className="relative mt-12 bg-gradient-to-b from-[#1f070d]/92 via-[#130408]/94 to-[#0b0204]/95 px-5 py-6 sm:px-9 sm:py-8 rounded-3xl border border-[#D4AF37]/50 ring-1 ring-inset ring-[#FFE088]/15 shadow-[0_20px_44px_rgba(0,0,0,0.55)] overflow-hidden"
            >
              {/* Subtle top champagne sheen & radial ruby glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.14) 0%, transparent 62%)',
                }}
              />
              {/* Delicate Brass Corner Brackets */}
              <span className="pointer-events-none absolute top-3 left-3 w-3.5 h-3.5 border-t border-l border-[#D4AF37]/60 rounded-tl-sm" />
              <span className="pointer-events-none absolute top-3 right-3 w-3.5 h-3.5 border-t border-r border-[#D4AF37]/60 rounded-tr-sm" />
              <span className="pointer-events-none absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-[#D4AF37]/60 rounded-bl-sm" />
              <span className="pointer-events-none absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r border-[#D4AF37]/60 rounded-br-sm" />

              <CountdownFlipClock targetDate={settings.birthdayDate} />
            </motion.div>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: EDITORIAL_EASE }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="#celebration"
                className="px-8 py-4 bg-[#871321] hover:bg-[#630011] text-white rounded-full font-mono-split text-xs font-bold uppercase tracking-[0.2em] transition-transform duration-200 shadow-xl hover:scale-[1.03] active:scale-[0.98] border border-[#D4AF37]/60 flex items-center gap-2"
              >
                <span>Enter Experience</span>
                <ArrowDown className="w-4 h-4 text-amber-200" />
              </a>

              <a
                href="#vogue"
                className="px-7 py-4 bg-[#1d080d]/75 hover:bg-[#2b0b12]/90 text-[#F9F6F0] rounded-full font-mono-split text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-200 border border-white/30"
              >
                View Vogue Edition
              </a>
            </motion.div>

            {/* Suspended VIP Badge pass visual preview */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.5, ease: EDITORIAL_EASE }}
              className="mt-14 scale-90 sm:scale-100"
            >
              <VipBadgePass age={content.heroAge} />
            </motion.div>
          </div>
        </section>

        {/* ACT 2: BIRTHDAY CELEBRATION & CAKE */}
        <CakeCelebration content={content} />

        <EditorialDivider />

        {/* ACT 3: VOGUE SPECIAL EDITION */}
        <VogueSpread content={content} voguePhotos={photos} />

        <EditorialDivider />

        {/* ACT 4: MEMORY SCRAPBOOK */}
        <MemoryScrapbook photos={photos} />

        {/* ACT 5: PHOTO RIBBON GALLERY */}
        <PhotoRibbon photos={photos} />

        {/* ACT 6: BIRTHDAY LETTER */}
        <WaxSealedLetter content={content} />

        <EditorialDivider />

        {/* ACT 8: FINAL SURPRISE & GUESTBOOK */}
        <FinalSurprise
          content={content}
          initialWishes={settings.guestWishes}
          onAddWish={handleAddWish}
        />

        {/* Floating Vinyl Music Player (Act 7) */}
        <VinylMusicPlayer
          title={settings.musicTitle}
          artist={settings.musicArtist}
        />

        {/* Admin Dashboard Modal (Section 4) */}
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          photos={photos}
          content={content}
          settings={settings}
          onUpdatePhotos={setPhotos}
          onUpdateContent={setContent}
          onUpdateSettings={setSettings}
        />

        {/* Footer */}
        <footer className="mt-auto py-12 px-4 sm:px-6 border-t border-[#dfbfbe]/50 dark:border-[#3d1c24] bg-[#FAF6F0] dark:bg-[#19080d] text-center transition-colors duration-300">
          <EditorialReveal yOffset={16} className="max-w-4xl mx-auto space-y-4">
            <p className="font-stylish font-normal text-3xl tracking-wide leading-tight text-[#1c1c18] dark:text-[#f5efe6]">
              Maggie's Archive · Chapter 24
            </p>
            <p className="font-playfair italic text-xs text-[#584140] dark:text-[#d4c3be]">
              Crafted with love, laughter, and high-fashion celebration for our best friend.
            </p>
            <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono-split text-[#8c7170] dark:text-[#a9928d]">
              <span>EST. 2026</span>
              <span>·</span>
              <span>DEVELOPED BY YOUR SAURUS</span>
              <span>·</span>
              <span>HONEY I MISS U BABE</span>
            </div>
          </EditorialReveal>
        </footer>
      </div>
    </MotionConfig>
  );
}
