import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen, ChevronLeft, ChevronRight, X, Maximize2, Minimize2,
  Volume2, VolumeX, Sparkles, Layers, Eye, RefreshCw, Heart, Star
} from 'lucide-react';
import { BirthdayContent, PhotoItem } from '../types/index.ts';
import { musicPlayer } from '../utils/audio.ts';
import { EditorialReveal, EDITORIAL_EASE } from './ScrollChoreography.tsx';

interface VogueSpreadProps {
  content: BirthdayContent;
  voguePhotos: PhotoItem[];
}

interface SpreadConfig {
  id: string;
  title: string;
  subtitle: string;
  pageNumberLabel: string;
  renderLeft: () => React.ReactNode;
  renderRight: () => React.ReactNode;
  thumbnailSrc?: string;
  fullImageSrc?: string;
}

// ============================================================================
// REUSABLE POLAROID SCRAPBOOK CARD COMPONENT
// Beautiful Polaroid frame, soft natural shadow, 3D red heart pin, handwritten caption
// ============================================================================
interface PolaroidCardProps {
  imageSrc: string;
  caption: string;
  rotationDeg: number;
  pinType?: 'heart' | 'star' | 'tape';
  sizeClass?: string;
  className?: string;
}

const PolaroidCard: React.FC<PolaroidCardProps> = ({
  imageSrc,
  caption,
  rotationDeg,
  pinType = 'heart',
  sizeClass = 'w-36 sm:w-44 md:w-48',
  className = '',
}) => {
  return (
    <div
      style={{ transform: `rotate(${rotationDeg}deg)` }}
      className={`relative group ${sizeClass} transition-transform duration-300 hover:rotate-0 hover:scale-105 hover:z-30 select-none ${className}`}
    >
      {/* 3D Red Heart Pin or Star Sticker on top */}
      {pinType === 'heart' && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-[#C41E3A] shadow-[0_3px_8px_rgba(196,30,58,0.5),inset_0_1.5px_3px_rgba(255,255,255,0.6)] flex items-center justify-center">
            <Heart className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        </div>
      )}

      {pinType === 'star' && (
        <div className="absolute -top-2.5 right-2 z-20 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-[#D4AF37] shadow-md flex items-center justify-center">
            <Star className="w-3 h-3 text-amber-100 fill-amber-100" />
          </div>
        </div>
      )}

      {pinType === 'tape' && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#fed65b]/75 -rotate-2 border-y border-stone-300/40 shadow-sm z-20 pointer-events-none" />
      )}

      {/* Polaroid Physical White Frame */}
      <div className="bg-white p-2 pb-4 sm:p-2.5 sm:pb-5 rounded-[2px] shadow-[0_8px_20px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)] border border-stone-200/90 transition-shadow group-hover:shadow-2xl">
        {/* Photo Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 rounded-[1px]">
          <img
            src={imageSrc}
            alt={caption}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle glossy sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Handwritten-style caption */}
        <div className="pt-2 text-center">
          <p className="font-playfair italic font-medium text-xs sm:text-sm text-[#1c1c18] tracking-tight truncate px-1">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
};

export const VogueSpread: React.FC<VogueSpreadProps> = ({ content, voguePhotos }) => {
  const [isOpenFlipbook, setIsOpenFlipbook] = useState(false);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState<'forward' | 'backward' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [activeInspectImage, setActiveInspectImage] = useState<string | null>(null);

  // Touch and drag swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const coverPhoto = voguePhotos.find(p => p.category === 'vogue') || {
    url: '/src/assets/images/maggie_vogue_cover_1794012861093.jpg',
    caption: 'Cover star of our hearts: Velvet blazer and timeless confidence.'
  };

  // ==========================================================================
  // SPREAD DEFINITIONS (Each spread has a Left Page and a Right Page)
  // Protected with safe spine margins: Left page pr-8, Right page pl-8
  // ==========================================================================

  const spreads: SpreadConfig[] = [
    // ------------------------------------------------------------------------
    // SPREAD 0: FRONT COVER & INSIDE DEDICATION FLAP
    // ------------------------------------------------------------------------
    {
      id: 'spread-0',
      title: 'Vogue Special Edition Cover',
      subtitle: 'Issue No. 24 · Autumn Edition',
      pageNumberLabel: 'PAGE 01 / 08',
      renderLeft: () => (
        <div className="w-full h-full bg-[#FAF6F0] p-6 sm:p-10 pr-8 sm:pr-12 flex flex-col justify-between border-r border-stone-300 relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#dfbfbe_0.75px,transparent_0.75px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono-split text-[#871321] font-bold">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>SPECIAL ANNIVERSARY DEDICATION</span>
            </div>
            <h2 className="font-bodoni text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1c1c18]">
              The Maggie Archive
            </h2>
            <p className="font-playfair italic text-[#584140] leading-relaxed text-xs sm:text-sm lg:text-base">
              "To our extraordinary Maggie on your 24th birthday. May these pages hold a fragment of the wonder, style, and boundless laughter you gift to everyone around you."
            </p>
          </div>

          <div className="relative z-10 p-3.5 bg-white/80 rounded-xl border border-[#D4AF37]/50 shadow-sm">
            <span className="font-mono-split text-[10px] text-[#871321] uppercase tracking-widest block font-bold mb-1">
              DIGITAL FLIPBOOK INSTRUCTIONS
            </span>
            <p className="text-[11px] text-[#584140] leading-normal">
              • Click <strong>NEXT</strong> or the right page arrow to turn forward.<br />
              • Swipe with touch/mouse or press <strong>Right Arrow (→)</strong>.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono-split text-[#8c7170] border-t border-stone-200 pt-3">
            <span>VOLUME 24 · SPECIAL EDITION</span>
            <span>PAGE 01</span>
          </div>
        </div>
      ),
      renderRight: () => (
        <div className="w-full h-full relative overflow-hidden bg-stone-950 pl-8 sm:pl-12 flex flex-col justify-between p-6 sm:p-10 select-none">
          <img
            src={coverPhoto.url}
            alt="Vogue Cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

          {/* Masthead */}
          <div className="relative z-10 text-center">
            <h1 className="font-['Bodoni_Moda'] text-5xl sm:text-6xl font-black tracking-wider text-[#F9F6F0] [text-shadow:0_6px_18px_rgba(0,0,0,0.75)]">
              VOGUE
            </h1>
            <p className="font-mono-split text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] -mt-1 font-bold">
              SPECIAL BIRTHDAY EDITION
            </p>
          </div>

          {/* Headlines on cover */}
          <div className="relative z-10 space-y-2 text-white">
            <div className="inline-block px-2.5 py-0.5 bg-[#871321] text-amber-200 text-[10px] font-mono-split tracking-widest uppercase rounded border border-[#D4AF37]/50">
              EXCLUSIVE RETROSPECTIVE
            </div>
            <h3 className="font-bodoni text-xl sm:text-2xl lg:text-3xl font-bold leading-tight drop-shadow">
              {content.vogueHeadline}
            </h3>
            <p className="text-xs text-stone-200 line-clamp-2 font-sans font-light">
              {content.vogueSubheadline}
            </p>

            <div className="pt-2 flex items-center justify-between text-[9px] font-mono-split text-stone-300 border-t border-white/20">
              <span>MAGGIE · CHAPTER {content.heroAge}</span>
              <span className="text-[#D4AF37] font-bold">FLIP PAGE →</span>
            </div>
          </div>
        </div>
      ),
      thumbnailSrc: coverPhoto.url,
    },

    // ------------------------------------------------------------------------
    // SPREAD 1: EDITORIAL FEATURE & COVER STORY ESSAY
    // ------------------------------------------------------------------------
    {
      id: 'spread-1',
      title: 'Cover Story: The Art of Radiance',
      subtitle: 'Exclusive Feature · Pages 14–19',
      pageNumberLabel: 'PAGE 02–03 / 08',
      renderLeft: () => (
        <div className="w-full h-full p-6 sm:p-10 pr-8 sm:pr-12 flex flex-col justify-between bg-[#FAF6F0] select-none">
          <div>
            <div className="aspect-[4/5] rounded-lg overflow-hidden border border-[#D4AF37]/50 shadow-md bg-stone-900 max-h-[46vh] mx-auto">
              <img
                src={coverPhoto.url}
                alt="Maggie Portrait"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs font-serif italic text-stone-600 text-center mt-3">
              Fig. 1 — Maggie in her signature velvet blazer, styled for her 24th anniversary retrospective.
            </p>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-[10px] font-mono-split text-[#8c7170]">
            <span>VOGUE ARCHIVE</span>
            <span>PAGE 02</span>
          </div>
        </div>
      ),
      renderRight: () => (
        <div className="w-full h-full p-6 sm:p-10 pl-8 sm:pl-12 flex flex-col justify-between bg-[#FDFCF7] select-none">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <span className="font-mono-split text-[10px] uppercase tracking-widest text-[#871321] font-bold">
                EXCLUSIVE ESSAY · PAGES 14–19
              </span>
              <h3 className="font-bodoni text-xl sm:text-2xl font-bold text-[#1c1c18] mt-1 leading-tight">
                The Architecture of Charisma: Why Everyone Loves Maggie
              </h3>
              <p className="font-playfair italic text-xs text-[#871321] mt-1">
                "A rare balance of effortless sophistication, boundless empathy, and the sharpest wit."
              </p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-[#584140] leading-relaxed">
              <p>
                Twenty-four years ago, the world welcomed Maggie. Across two dozen unforgettable chapters, she has cultivated an unmistakable signature: loyalty paired with spontaneous joy.
              </p>
              <p>
                Whether curating museum visits or commanding spontaneous road trips with flawless taste in music, she remains the true protagonist of every memory.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-[#D4AF37]/50">
              <p className="font-serif italic text-xs text-[#1c1c18]">
                "{content.quoteText}"
              </p>
              <p className="text-[10px] font-sans text-[#8c7170] mt-1">
                — {content.quoteAuthor}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-[10px] font-mono-split text-[#8c7170]">
            <span className="text-[#871321] font-bold">CHAPTER 24 RETROSPECTIVE</span>
            <span>PAGE 03</span>
          </div>
        </div>
      ),
      thumbnailSrc: coverPhoto.url,
    },

    // ------------------------------------------------------------------------
    // SPREAD 2: USER'S PAGE 1 ("Happy Birthday Sweety" Ribbon Spiral)
    // Protected Spine: Left page has pr-8 sm:pr-12; Right page has pl-8 sm:pl-12
    // ------------------------------------------------------------------------
    {
      id: 'spread-2',
      title: 'Happy Birthday Sweety · Special Edition',
      subtitle: 'The Sweeping Photo Ribbon Arc',
      pageNumberLabel: 'PAGE 04–05 / 08',
      fullImageSrc: '/public/assets/aistudio/Screenshot_2026-11-07_at_6.55.16_AM_965dc0d0.png',
      renderLeft: () => (
        <div className="w-full h-full p-6 sm:p-8 pr-8 sm:pr-12 flex flex-col justify-between bg-[#FDFCF9] relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#dfbfbe_0.6px,transparent_0.6px)] [background-size:18px_18px] opacity-20 pointer-events-none" />

          {/* Top Kicker */}
          <div className="relative z-10 flex items-center gap-2 text-[10px] font-mono-split text-[#8c7170] uppercase tracking-widest">
            <span>AUG 02</span>
            <span>•</span>
            <span>SPECIAL EDITION</span>
          </div>

          {/* Main Title Group */}
          <div className="relative z-10 my-auto space-y-3">
            <h2 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-[#1c1c18] tracking-tight leading-none">
              Happy<br />Birthday
            </h2>
            <div className="relative inline-block">
              <span className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-[#F59E0B] tracking-tight leading-none block">
                Sweety
              </span>
              <div className="h-1.5 w-16 bg-[#F59E0B] rounded-full mt-2" />
            </div>

            <p className="font-sans text-sm text-[#584140] max-w-xs mt-3 leading-relaxed">
              May this year bring you closer to everything you're chasing.
            </p>

            <div className="flex items-center gap-2 text-xs font-sans text-[#F59E0B] pt-2">
              <Heart className="w-3.5 h-3.5 fill-[#F59E0B]" />
              <span className="text-[11px] text-[#8c7170]">Hover photographs to reveal memory notes</span>
            </div>
          </div>

          {/* Bottom Kicker */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono-split text-[#8c7170] border-t border-stone-200/80 pt-3">
            <span>PAGE 01 / 07</span>
            <span>SPECIAL EDITION</span>
          </div>
        </div>
      ),
      renderRight: () => (
        <div className="w-full h-full p-6 sm:p-8 pl-8 sm:pl-12 flex flex-col justify-between bg-[#FDFCF9] relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#dfbfbe_0.6px,transparent_0.6px)] [background-size:18px_18px] opacity-20 pointer-events-none" />

          {/* Top Kicker */}
          <div className="relative z-10 flex items-center justify-end gap-2 text-[10px] font-mono-split text-[#8c7170] uppercase tracking-widest">
            <span>♪ SONG ON</span>
            <span>·</span>
            <span>VOL. 24</span>
          </div>

          {/* Sweeping Ribbon Showcase Frame */}
          <div className="relative z-10 my-auto flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-stone-200 shadow-md bg-white p-2">
              <img
                src="/public/assets/aistudio/Screenshot_2026-11-07_at_6.55.16_AM_965dc0d0.png"
                alt="Sweeping Ribbon Detail"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Bottom Kicker */}
          <div className="relative z-10 flex items-center justify-end text-[10px] font-mono-split text-[#8c7170] border-t border-stone-200/80 pt-3">
            <span>MADE FOR YOU</span>
          </div>
        </div>
      ),
      thumbnailSrc: '/public/assets/aistudio/Screenshot_2026-11-07_at_6.55.16_AM_965dc0d0.png',
    },

    // ------------------------------------------------------------------------
    // SPREAD 3: REDESIGNED POLAROID SCRAPBOOK COLLAGE
    // Beautiful, non-overlapping polaroids arranged independently on Left and Right
    // CENTER SPINE IS COMPLETELY CLEAR WITH ZERO COLLISIONS!
    // ------------------------------------------------------------------------
    {
      id: 'spread-3',
      title: 'Polaroid Memories Keepsake Collage',
      subtitle: 'Made with endless love for Sweety ♡',
      pageNumberLabel: 'PAGE 06–07 / 08',
      fullImageSrc: '/public/assets/aistudio/Screenshot_2026-11-07_at_6.55.22_AM_7b4bf551.png',
      renderLeft: () => (
        <div className="w-full h-full p-4 sm:p-6 pr-8 sm:pr-12 flex flex-col justify-between bg-[#FAF6F0] relative overflow-hidden select-none">
          {/* Authentic graph paper texture matching reference */}
          <div className="absolute inset-0 bg-[radial-gradient(#dfbfbe_0.75px,transparent_0.75px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

          {/* Scrapbook washi tape accent at top left */}
          <div className="absolute top-2 left-6 w-20 h-5 bg-[#fed65b]/75 -rotate-3 border-y border-stone-300/40 shadow-sm z-0 pointer-events-none" />

          {/* Left Page Independent Polaroid Arrangement (ZERO OVERLAP) */}
          <div className="relative z-10 flex-1 flex flex-col justify-around py-2">
            {/* Top Left Card: "Cutie 🥺" */}
            <div className="flex justify-start pl-2 sm:pl-4">
              <PolaroidCard
                imageSrc="/public/assets/polaroids/cutie.jpg"
                caption="Cutie 🥺"
                rotationDeg={-3}
                pinType="heart"
                sizeClass="w-36 sm:w-44 md:w-48"
              />
            </div>

            {/* Bottom Right Card of Left Page: "Dream Girl 💫" (Well clear of spine!) */}
            <div className="flex justify-end pr-2 sm:pr-4">
              <PolaroidCard
                imageSrc="/public/assets/polaroids/dream_girl.jpg"
                caption="Dream Girl 💫"
                rotationDeg={2.5}
                pinType="heart"
                sizeClass="w-36 sm:w-44 md:w-48"
              />
            </div>
          </div>

          {/* Left Page Bottom Footer text */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono-split text-[#8c7170] pt-2 border-t border-stone-200/60">
            <span className="flex items-center gap-1.5 text-[#C41E3A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A]" />
              <span>Hover over any polaroid to preview memory</span>
            </span>
            <span>SCRAPBOOK · 06</span>
          </div>
        </div>
      ),
      renderRight: () => (
        <div className="w-full h-full p-4 sm:p-6 pl-8 sm:pl-12 flex flex-col justify-between bg-[#FAF6F0] relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#dfbfbe_0.75px,transparent_0.75px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

          {/* Scrapbook golden star accent */}
          <div className="absolute top-4 right-6 text-[#D4AF37] opacity-60 pointer-events-none">
            <Star className="w-4 h-4 fill-[#D4AF37]" />
          </div>

          {/* Right Page Independent Polaroid Arrangement (ZERO OVERLAP, NOT A MIRROR) */}
          <div className="relative z-10 flex-1 flex flex-col justify-around py-2">
            {/* Top Right Card: "Sunflowers 🌻" */}
            <div className="flex justify-end pr-2 sm:pr-4">
              <PolaroidCard
                imageSrc="/public/assets/polaroids/sunflower.jpg"
                caption="Sunflowers 🌻"
                rotationDeg={3.5}
                pinType="heart"
                sizeClass="w-36 sm:w-44 md:w-48"
              />
            </div>

            {/* Bottom Left Card of Right Page: "Queen 👑" (Safely past center spine!) */}
            <div className="flex justify-start pl-2 sm:pl-4">
              <PolaroidCard
                imageSrc="/public/assets/polaroids/queen.jpg"
                caption="Queen 👑"
                rotationDeg={-2}
                pinType="heart"
                sizeClass="w-36 sm:w-44 md:w-48"
              />
            </div>
          </div>

          {/* Right Page Bottom Footer text */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono-split text-[#8c7170] pt-2 border-t border-stone-200/60">
            <span>SCRAPBOOK · 07</span>
            <span className="font-playfair italic font-medium text-xs text-[#584140]">
              Made with endless love for Sweety ♡
            </span>
          </div>
        </div>
      ),
      thumbnailSrc: '/public/assets/polaroids/cutie.jpg',
    },

    // ------------------------------------------------------------------------
    // SPREAD 4: USER'S PAGE 3 ("Aesthetic Memories" Ring Binder Journal Spread)
    // Left & Right Pages with safe spine boundaries
    // ------------------------------------------------------------------------
    {
      id: 'spread-4',
      title: 'Aesthetic Memories · Ring Binder Journal',
      subtitle: 'Vol. 02 · Photobooth & Typewriter Poetry',
      pageNumberLabel: 'PAGE 08–09 / 08',
      fullImageSrc: '/public/assets/aistudio/Screenshot_2026-11-07_at_6.55.31_AM_0e6174a1.png',
      renderLeft: () => (
        <div className="w-full h-full p-4 sm:p-6 pr-8 sm:pr-12 flex flex-col justify-between bg-[#FDFCF9] relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#dfbfbe_0.6px,transparent_0.6px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

          {/* Gazette Clipping at Top */}
          <div className="relative z-10 p-2.5 bg-[#FAF6F0] rounded border border-stone-200/80 shadow-xs max-w-xs">
            <span className="text-[9px] font-mono-split uppercase tracking-widest text-[#8c7170] block font-bold">
              THE GAZETTE • 1924
            </span>
            <p className="text-[10px] font-serif italic text-stone-600 line-clamp-2">
              The gentle murmur of afternoon rainfall gathered along the terrace, reflecting the fading warmth of autumn afternoons...
            </p>
          </div>

          {/* Window Polaroid Photo with Star Pins */}
          <div className="relative z-10 my-auto flex justify-center">
            <PolaroidCard
              imageSrc="/src/assets/images/maggie_candid_smile_1794012862220.jpg"
              caption="Memories in Amber"
              rotationDeg={-2}
              pinType="star"
              sizeClass="w-36 sm:w-44 md:w-48"
            />
          </div>

          {/* Typewriter Taped Poetry Note */}
          <div className="relative z-10 p-2.5 bg-[#fed65b]/30 rounded border border-stone-300/60 shadow-xs max-w-xs">
            <p className="font-mono-split text-[10px] sm:text-[11px] text-[#1c1c18] font-bold leading-tight">
              You are the stars in my<br />
              dark and cold nights—<br />
              shining and unwavering.
            </p>
          </div>
        </div>
      ),
      renderRight: () => (
        <div className="w-full h-full p-4 sm:p-6 pl-8 sm:pl-12 flex flex-col justify-between bg-[#FDFCF9] relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#dfbfbe_0.6px,transparent_0.6px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

          {/* Top Taped Note */}
          <div className="relative z-10 p-2 bg-[#fed65b]/30 rounded border border-stone-300/60 shadow-xs max-w-xs self-start">
            <p className="font-mono-split text-[10px] sm:text-[11px] text-[#1c1c18] font-bold leading-tight">
              may the flowers remind us<br />
              why the rain was so necessary
            </p>
          </div>

          {/* Photobooth Strip & Disco Ball Center */}
          <div className="relative z-10 my-auto flex items-center justify-around gap-2">
            {/* Photobooth vertical card */}
            <div className="p-1.5 bg-white rounded shadow-md border border-stone-200 -rotate-2 w-24 sm:w-28">
              <div className="space-y-1">
                <div className="aspect-square bg-stone-100 overflow-hidden rounded-[1px]">
                  <img src="/public/assets/polaroids/baddie.jpg" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square bg-stone-100 overflow-hidden rounded-[1px]">
                  <img src="/public/assets/polaroids/pink_bouquet.jpg" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-[8px] font-mono-split text-center mt-1 text-stone-500">PHOTOBOOTH</p>
            </div>

            {/* Sparkle Disco Ball */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-stone-300 via-stone-100 to-white border-2 border-stone-400 shadow-lg flex items-center justify-center relative rotate-12">
              <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
            </div>
          </div>

          {/* Bottom Chronicle */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono-split text-[#8c7170] pt-2 border-t border-stone-200/60">
            <span>SPECIAL CHRONICLE</span>
            <span>PAGE 09</span>
          </div>
        </div>
      ),
      thumbnailSrc: '/public/assets/aistudio/Screenshot_2026-11-07_at_6.55.31_AM_0e6174a1.png',
    },

    // ------------------------------------------------------------------------
    // SPREAD 5: BACK COVER & ARCHIVAL BLESSING
    // ------------------------------------------------------------------------
    {
      id: 'spread-5',
      title: 'Vogue Back Cover & Archival Blessing',
      subtitle: 'Chapter 24 · Certified Keepsake',
      pageNumberLabel: 'FINAL / 08',
      renderLeft: () => (
        <div className="w-full h-full bg-[#FAF6F0] p-6 sm:p-10 pr-8 sm:pr-12 flex flex-col justify-between select-none">
          <div className="space-y-4">
            <span className="font-mono-split text-[10px] text-[#871321] uppercase tracking-widest font-bold block">
              EDITORIAL COLOPHON &amp; REGISTRY
            </span>
            <h3 className="font-bodoni text-2xl font-bold text-[#1c1c18]">
              Twenty-Four Chapters of Grace
            </h3>
            <p className="font-playfair italic text-xs sm:text-sm text-[#584140] leading-relaxed">
              "Bound in friendship, preserved in digital permanence, and shared with boundless gratitude for every smile Maggie brings into the world."
            </p>
          </div>

          <div className="p-3 bg-stone-100 rounded-lg text-[11px] font-mono-split text-stone-600 space-y-1">
            <p><strong>PUBLISHER:</strong> The Best Friend Keepsake Press</p>
            <p><strong>PHOTOGRAPHY:</strong> Candid Moments &amp; Studio Milano</p>
            <p><strong>DEDICATION:</strong> For Maggie, Forever Cherished</p>
          </div>

          <div className="pt-3 border-t border-stone-200 text-[10px] font-mono-split text-stone-400 flex justify-between">
            <span>PRINT ARCHIVE</span>
            <span>PAGE 07</span>
          </div>
        </div>
      ),
      renderRight: () => (
        <div className="w-full h-full bg-gradient-to-br from-[#111111] via-[#1A1A1A] to-[#250308] text-white p-6 sm:p-10 pl-8 sm:pl-12 flex flex-col justify-between relative overflow-hidden select-none">
          <div className="text-center mt-4">
            <h2 className="font-bodoni text-3xl sm:text-4xl font-black text-[#D4AF37] tracking-widest">
              VOGUE
            </h2>
            <p className="font-mono-split text-[10px] text-stone-300 uppercase tracking-[0.25em] mt-0.5">
              MAGGIE'S ARCHIVAL KEEPSAKE · 2026
            </p>
          </div>

          <div className="max-w-xs mx-auto text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#871321] border-2 border-[#D4AF37] mx-auto flex items-center justify-center shadow-2xl">
              <Sparkles className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <p className="font-playfair italic text-sm text-amber-100">
              "To the girl who turns ordinary days into poetry. May year twenty-four be your most dazzling masterpiece yet."
            </p>
          </div>

          <div className="border-t border-[#D4AF37]/30 pt-3 flex items-center justify-between text-[10px] font-mono-split text-stone-400">
            <div>
              <p className="font-bold text-white uppercase">VOGUE COMMEMORATIVE</p>
              <p>CERTIFIED SPECIAL NO. 24</p>
            </div>
            <button
              onClick={() => jumpToSpread(0)}
              className="px-3.5 py-1.5 bg-[#871321] hover:bg-[#630011] text-white rounded text-xs font-mono-split uppercase font-bold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Read Again</span>
            </button>
          </div>
        </div>
      ),
      thumbnailSrc: coverPhoto.url,
    },
  ];

  const totalSpreads = spreads.length;

  // ==========================================================================
  // REALISTIC 3D PAGE TURN LOGIC
  // ==========================================================================

  const goToNextSpread = () => {
    if (currentSpreadIndex < totalSpreads - 1 && !isFlipping) {
      if (soundEnabled) musicPlayer.playPageTurnSound();
      setIsFlipping('forward');

      setTimeout(() => {
        setCurrentSpreadIndex(prev => prev + 1);
        setIsFlipping(null);
      }, 580);
    }
  };

  const goToPrevSpread = () => {
    if (currentSpreadIndex > 0 && !isFlipping) {
      if (soundEnabled) musicPlayer.playPageTurnSound();
      setIsFlipping('backward');

      setTimeout(() => {
        setCurrentSpreadIndex(prev => prev - 1);
        setIsFlipping(null);
      }, 580);
    }
  };

  const jumpToSpread = (index: number) => {
    if (index !== currentSpreadIndex && !isFlipping) {
      if (soundEnabled) musicPlayer.playPageTurnSound();
      setIsFlipping(index > currentSpreadIndex ? 'forward' : 'backward');

      setTimeout(() => {
        setCurrentSpreadIndex(index);
        setIsFlipping(null);
      }, 540);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpenFlipbook) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToNextSpread();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevSpread();
      } else if (e.key === 'Escape') {
        setIsOpenFlipbook(false);
        setActiveInspectImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenFlipbook, currentSpreadIndex, isFlipping, soundEnabled]);

  // Touch and drag swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartX.current = clientX;
    touchStartY.current = clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartX.current === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;

    const diffX = clientX - touchStartX.current;
    const diffY = clientY - (touchStartY.current || 0);

    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        goToNextSpread();
      } else {
        goToPrevSpread();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const currentSpread = spreads[currentSpreadIndex];

  return (
    <section id="vogue" className="section-lazy-paint py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <EditorialReveal className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <div className="text-xs font-mono-split font-bold uppercase tracking-[0.25em] text-[#871321] dark:text-[#e67381] mb-2 flex items-center gap-2">
            <span>ACT III</span>
            <span className="text-[#8c7170] dark:text-[#a9928d]">·</span>
            <span>INTERACTIVE SPECIAL EDITION</span>
          </div>
          <h2 className="font-stylish text-5xl sm:text-6xl font-normal tracking-wide leading-[1.18] text-[#1c1c18] dark:text-[#f5efe6]">
            Vogue: The Maggie Edition
          </h2>
          <p className="font-playfair italic text-base text-[#584140] dark:text-[#d4c3be] mt-1">
            A realistic digital keepsake magazine with physical page-turning, retrospective features, and exclusive gallery spreads.
          </p>
        </div>
        <p className="font-mono-split text-xs uppercase tracking-widest text-[#8c7170] dark:text-[#a9928d]">
          ISSUE {content.vogueIssueNumber} · {content.vogueDateText}
        </p>
      </EditorialReveal>

      {/* Magazine Editorial Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: 3D Bound Magazine Cover Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
          className="lg:col-span-5 flex justify-center perspective-book"
        >
          <div
            onClick={() => setIsOpenFlipbook(true)}
            className="group relative cursor-pointer max-w-sm w-full bg-[#111111] p-3 rounded-md book-chassis-shadow transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-[1.015]"
            title="Click to Open Interactive Flipbook"
          >
            {/* Consistent Spine Highlight */}
            <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-stone-950 via-stone-800 to-transparent z-30 opacity-80" />
            <div className="absolute top-0 bottom-0 left-2 w-[1px] bg-white/20 z-30" />

            {/* Cover Artwork */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] bg-stone-900 shadow-inner">
              <img
                src={coverPhoto.url}
                alt="Vogue Maggie Cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

              {/* Masthead */}
              <div className="absolute top-4 inset-x-0 text-center pointer-events-none">
                <h1 className="font-['Bodoni_Moda'] text-6xl sm:text-7xl font-black tracking-wider text-[#F9F6F0] [text-shadow:0_6px_18px_rgba(0,0,0,0.75)]">
                  VOGUE
                </h1>
                <p className="font-mono-split text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] -mt-1 font-bold">
                  SPECIAL BIRTHDAY EDITION
                </p>
              </div>

              {/* Cover Headlines */}
              <div className="absolute bottom-6 left-5 right-5 pointer-events-none text-white space-y-2">
                <div className="inline-block px-2.5 py-0.5 bg-[#871321] text-amber-200 text-[10px] font-mono-split tracking-widest uppercase rounded-sm border border-[#D4AF37]/50">
                  SPECIAL ISSUE NO. 24
                </div>
                <h3 className="font-bodoni text-2xl sm:text-3xl font-bold leading-tight drop-shadow">
                  {content.vogueHeadline}
                </h3>
                <p className="text-xs text-stone-200 line-clamp-2 font-sans font-light">
                  {content.vogueSubheadline}
                </p>

                <div className="pt-2 flex items-center justify-between text-[9px] font-mono-split text-stone-400 border-t border-white/20">
                  <span>MAGGIE · CHAPTER {content.heroAge}</span>
                  <span>ISSUE NO. 24 · PRICELESS</span>
                </div>
              </div>

              {/* Realistic Page Dog-Ear Curl Overlay on Bottom Right */}
              <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden pointer-events-none z-20">
                <div className="w-16 h-16 bg-gradient-to-br from-transparent via-[#FAF6F0] to-[#FAF6F0] rotate-45 transform origin-bottom-right shadow-2xl border-t border-l border-stone-300" />
              </div>

              {/* Hover Badge */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <span className="px-5 py-2.5 bg-white text-stone-900 font-mono-split text-xs font-bold uppercase tracking-widest rounded-full shadow-2xl flex items-center gap-2 transform group-hover:scale-105 transition-transform border border-[#D4AF37]">
                  <BookOpen className="w-4 h-4 text-[#871321]" />
                  <span>Open 3D Flipbook</span>
                </span>
                <span className="text-[11px] font-mono-split text-amber-200 uppercase tracking-widest">
                  8-Page Interactive Magazine
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Editorial Overview & Direct Page Jumpers */}
        <EditorialReveal delay={0.08} className="lg:col-span-7 space-y-6">
          <div className="border-b border-[#dfbfbe] dark:border-[#3d1c24] pb-6">
            <span className="text-xs font-mono-split uppercase tracking-widest text-[#871321] dark:text-[#e67381] font-bold">
              FLIPBOOK MAGAZINE DIRECTORY
            </span>
            <h3 className="font-bodoni text-3xl sm:text-4xl font-bold text-[#1c1c18] dark:text-[#f5efe6] mt-2">
              The Maggie Retrospective: 8 Curated Pages
            </h3>
            <p className="font-playfair italic text-lg text-[#871321] dark:text-[#F3E5AB] mt-2">
              "Every page unfolds an era of timeless friendship, spontaneous adventures, and radiant joy."
            </p>
          </div>

          {/* Quick Page Previews Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {spreads.slice(1, 5).map((spread, idx) => (
              <button
                key={spread.id}
                type="button"
                onClick={() => {
                  setCurrentSpreadIndex(idx + 1);
                  setIsOpenFlipbook(true);
                }}
                className="group p-3.5 bg-[#FAF6F0] dark:bg-[#1c0b10] rounded-xl border border-stone-200 dark:border-[#3d1c24] hover:border-[#D4AF37] hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-pointer shadow-sm hover:shadow-md flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-[10px] font-mono-split font-bold uppercase text-[#871321] dark:text-[#e67381] block">
                    {spread.pageNumberLabel}
                  </span>
                  <h4 className="font-bodoni font-bold text-sm text-[#1c1c18] dark:text-[#f5efe6] group-hover:text-[#871321] dark:group-hover:text-[#F3E5AB] transition-colors truncate max-w-[200px]">
                    {spread.title}
                  </h4>
                  <p className="text-[11px] text-[#584140] dark:text-[#d4c3be] truncate max-w-[200px]">
                    {spread.subtitle}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 dark:text-[#a9928d] group-hover:text-[#871321] dark:group-hover:text-[#F3E5AB] group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </button>
            ))}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setCurrentSpreadIndex(0);
                setIsOpenFlipbook(true);
              }}
              className="px-7 py-3.5 bg-[#871321] text-white hover:bg-[#630011] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 rounded-full text-xs font-mono-split uppercase tracking-widest font-bold flex items-center gap-2.5 shadow-lg border border-[#D4AF37]/60"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Open Magazine &amp; Flip Pages</span>
            </button>

            <span className="text-xs font-mono-split text-[#8c7170] dark:text-[#a9928d]">
              Non-overlapping polaroids &amp; completely unobstructed center spine
            </span>
          </div>
        </EditorialReveal>
      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN REALISTIC 3D FLIPBOOK THEATER MODAL */}
      {/* ============================================================== */}
      {isOpenFlipbook && (
        <div
          className={`fixed inset-0 z-50 bg-[#0d0406]/96 flex flex-col justify-between p-2 sm:p-6 overflow-hidden select-none animate-fade-in ${
            isFullscreen ? 'p-0' : ''
          }`}
        >
          {/* Top Control Bar matching user reference */}
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4 py-2 px-4 z-40">
            {/* Left Zone: Volume / Issue Label */}
            <div className="flex items-center gap-2 text-white">
              <Heart className="w-3.5 h-3.5 text-[#C41E3A] fill-[#C41E3A] animate-heartbeat-gentle" />
              <span className="font-mono-split text-xs font-bold uppercase tracking-wider text-stone-200">
                AESTHETIC MEMORIES / VOL. 24
              </span>
            </div>

            {/* Center Navigation Dock Pill: PREV · PAGE 0X / 08 · NEXT */}
            <div className="flex items-center gap-1.5 p-1 bg-[#1A1A1A] rounded-full border border-[#D4AF37]/60 shadow-2xl">
              <button
                onClick={goToPrevSpread}
                disabled={currentSpreadIndex === 0 || !!isFlipping}
                className="px-4 py-1.5 rounded-full text-xs font-mono-split font-bold uppercase tracking-wider text-stone-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-1"
                title="Previous Spread (or press Left Arrow)"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">PREV</span>
              </button>

              <div className="px-3 py-1 font-mono-split text-xs font-bold text-amber-300 tracking-wider">
                PAGE {(currentSpreadIndex + 1).toString().padStart(2, '0')} / {totalSpreads.toString().padStart(2, '0')}
              </div>

              <button
                onClick={goToNextSpread}
                disabled={currentSpreadIndex === totalSpreads - 1 || !!isFlipping}
                className="px-4 py-1.5 rounded-full text-xs font-mono-split font-bold uppercase tracking-wider text-stone-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-1"
                title="Next Spread (or press Right Arrow)"
              >
                <span className="hidden sm:inline">NEXT</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>

            {/* Right Zone: Controls (Sound, Thumbnails, Zoom, Fullscreen, Close) */}
            <div className="flex items-center gap-2 text-stone-300">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                title={soundEnabled ? 'Mute Page Turn Sound' : 'Enable Page Turn Sound'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {currentSpread.fullImageSrc && (
                <button
                  onClick={() => setActiveInspectImage(currentSpread.fullImageSrc || null)}
                  className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                  title="Inspect High-Res Spread"
                >
                  <Eye className="w-4 h-4 text-[#D4AF37]" />
                </button>
              )}

              <button
                onClick={() => setShowThumbnails(!showThumbnails)}
                className={`p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors ${
                  showThumbnails ? 'bg-white/20 text-white' : ''
                }`}
                title="Toggle Spread Thumbnails"
              >
                <Layers className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors hidden sm:block"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpenFlipbook(false)}
                className="p-2 rounded-full bg-[#871321] text-white hover:bg-[#630011] transition-colors ml-1"
                title="Close Magazine (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================== */}
          {/* MAIN 3D FLIPBOOK STAGE WITH GROUNDED DESK PRESENTATION */}
          {/* ========================================================== */}
          <div
            className="flex-1 flex items-center justify-center p-2 sm:p-4 perspective-book relative overflow-hidden"
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left Clickable Navigation Flank */}
            <div
              onClick={goToPrevSpread}
              className={`absolute left-0 inset-y-0 w-16 sm:w-28 z-40 flex items-center justify-start pl-4 cursor-pointer group transition-opacity ${
                currentSpreadIndex === 0 ? 'pointer-events-none opacity-0' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-black/70 text-white border border-[#D4AF37]/60 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#871321] transition-all">
                <ChevronLeft className="w-6 h-6" />
              </div>
            </div>

            {/* Right Clickable Navigation Flank */}
            <div
              onClick={goToNextSpread}
              className={`absolute right-0 inset-y-0 w-16 sm:w-28 z-40 flex items-center justify-end pr-4 cursor-pointer group transition-opacity ${
                currentSpreadIndex === totalSpreads - 1 ? 'pointer-events-none opacity-0' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-black/70 text-white border border-[#D4AF37]/60 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#871321] transition-all">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* PHYSICAL BOOK CHASSIS CONTAINER */}
            {/* -------------------------------------------------------- */}
            <div className="relative max-w-5xl w-full aspect-[16/10] max-h-[76vh] bg-[#FAF6F0] rounded-xl book-chassis-shadow overflow-hidden flex border border-[#D4AF37]/50 preserve-3d">
              {/* Stationary Left Base Page */}
              <div className="w-1/2 h-full relative overflow-hidden bg-[#FAF6F0] border-r border-stone-300/40">
                {currentSpread.renderLeft()}
              </div>

              {/* Stationary Right Base Page */}
              <div className="w-1/2 h-full relative overflow-hidden bg-[#FAF6F0] border-l border-stone-300/40">
                {currentSpread.renderRight()}
              </div>

              {/* ====================================================== */}
              {/* DYNAMIC 3D PAGE-TURNING LEAF (Active only during flip) */}
              {/* ====================================================== */}

              {/* FORWARD FLIP: Right Page turns over to the Left */}
              {isFlipping === 'forward' && currentSpreadIndex < totalSpreads - 1 && (
                <div
                  className="absolute top-0 right-0 w-1/2 h-full z-25 origin-left-spine preserve-3d will-change-transform"
                  style={{
                    animation: 'pageFlipForward 580ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
                  }}
                >
                  {/* Front Face: Current Right Page */}
                  <div className="absolute inset-0 w-full h-full backface-hidden overflow-hidden shadow-2xl bg-[#FAF6F0]">
                    {spreads[currentSpreadIndex].renderRight()}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-transparent to-black/10 animate-flip-shadow pointer-events-none" />
                  </div>

                  {/* Back Face: Incoming Next Left Page */}
                  <div className="absolute inset-0 w-full h-full backface-hidden overflow-hidden shadow-2xl bg-[#FAF6F0] [transform:rotateY(180deg)]">
                    {spreads[currentSpreadIndex + 1].renderLeft()}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/10 animate-flip-shadow pointer-events-none" />
                  </div>
                </div>
              )}

              {/* BACKWARD FLIP: Left Page turns over to the Right */}
              {isFlipping === 'backward' && currentSpreadIndex > 0 && (
                <div
                  className="absolute top-0 left-0 w-1/2 h-full z-25 origin-right-spine preserve-3d will-change-transform"
                  style={{
                    animation: 'pageFlipBackward 580ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
                  }}
                >
                  {/* Front Face: Current Left Page */}
                  <div className="absolute inset-0 w-full h-full backface-hidden overflow-hidden shadow-2xl bg-[#FAF6F0]">
                    {spreads[currentSpreadIndex].renderLeft()}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/10 animate-flip-shadow pointer-events-none" />
                  </div>

                  {/* Back Face: Incoming Previous Right Page */}
                  <div className="absolute inset-0 w-full h-full backface-hidden overflow-hidden shadow-2xl bg-[#FAF6F0] [transform:rotateY(-180deg)]">
                    {spreads[currentSpreadIndex - 1].renderRight()}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-transparent to-black/10 animate-flip-shadow pointer-events-none" />
                  </div>
                </div>
              )}

              {/* ====================================================== */}
              {/* PERMANENT, STATIONARY CENTER SPIRAL RING BINDER SPINE */}
              {/* (Never shifts, never stretches, never duplicates, 100% consistent) */}
              {/* PROTECTED BY PR-8 ON LEFT PAGE AND PL-8 ON RIGHT PAGE */}
              {/* ====================================================== */}
              <div
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 sm:w-10 z-35 pointer-events-none select-none flex items-center justify-center"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
                }}
              >
                {/* Soft vertical depth shadow extending onto both page halves */}
                <div className="absolute inset-y-0 -left-4 -right-4 bg-gradient-to-r from-transparent via-black/25 to-transparent pointer-events-none" />

                {/* Subtle vertical center seam */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/40 z-10" />

                {/* Reference Spiral Ring Binder texture from user upload */}
                <img
                  src="/public/assets/aistudio/Screenshot_2026-11-07_at_7.04.35_AM_895e46a6.png"
                  alt="Permanent Center Spiral Binding"
                  className="w-full h-full object-cover object-center relative z-20 contrast-110 brightness-95"
                />
              </div>

              {/* Page Corner Curl Cue on bottom right corner of book */}
              {currentSpreadIndex < totalSpreads - 1 && !isFlipping && (
                <div
                  onClick={goToNextSpread}
                  className="absolute bottom-0 right-0 w-12 h-12 z-20 cursor-pointer overflow-hidden group/corner"
                  title="Click corner to flip to next page"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-transparent via-[#FAF6F0] to-[#FAF6F0] rotate-45 transform origin-bottom-right shadow-2xl border-t border-l border-stone-300 group-hover/corner:scale-115 transition-transform" />
                  <span className="absolute bottom-1 right-1 text-[8px] font-mono-split font-bold text-[#871321] opacity-70">
                    FLIP
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Miniature Spread Thumbnails Tray (Togglable) */}
          {showThumbnails && (
            <div className="w-full max-w-4xl mx-auto py-2 px-4 bg-[#111111] rounded-2xl border border-[#D4AF37]/50 animate-fade-in z-40 mb-2">
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {spreads.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => jumpToSpread(idx)}
                    className={`flex-shrink-0 w-24 p-1 rounded-lg border text-left transition-all ${
                      currentSpreadIndex === idx
                        ? 'border-[#D4AF37] bg-white/20 scale-105 shadow-md'
                        : 'border-white/20 bg-black/40 hover:border-white/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-stone-900 rounded overflow-hidden mb-1 flex items-center justify-center">
                      {s.thumbnailSrc ? (
                        <img
                          src={s.thumbnailSrc}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bodoni font-bold text-xs text-[#D4AF37]">
                          MAGGIE
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono-split text-stone-300 block truncate">
                      {s.pageNumberLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Footer Ribbon Info */}
          <div className="w-full max-w-4xl mx-auto py-1.5 px-4 flex items-center justify-between text-[11px] font-mono-split text-stone-400 z-40">
            <span>SPREAD: {currentSpread.title}</span>
            <span className="hidden sm:inline">USE ← AND → KEYS TO TURN PAGES</span>
            <span>MAGGIE · CHAPTER 24</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* HIGH RESOLUTION ZOOM INSPECT MODAL */}
      {/* ============================================================== */}
      {activeInspectImage && (
        <div className="fixed inset-0 z-60 bg-black/96 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full max-h-[92vh] flex flex-col items-center">
            <button
              onClick={() => setActiveInspectImage(null)}
              className="absolute -top-12 right-0 p-2 text-white bg-[#871321] rounded-full hover:bg-[#630011] transition-colors shadow-lg"
              title="Close Zoom (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full h-full max-h-[85vh] rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl flex items-center justify-center bg-stone-950">
              <img
                src={activeInspectImage}
                alt="High Resolution Page View"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <p className="text-xs font-mono-split text-stone-300 mt-3 text-center">
              ORIGINAL HIGH RESOLUTION EDITORIAL SPREAD · CLICK CLOSE OR PRESS ESC
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
