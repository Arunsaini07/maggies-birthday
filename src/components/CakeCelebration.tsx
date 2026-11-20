import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Flame, Sparkles, Heart } from 'lucide-react';
import { BirthdayContent } from '../types/index.ts';
import { EditorialReveal, EDITORIAL_EASE, useInViewport } from './ScrollChoreography.tsx';

interface CakeCelebrationProps {
  content: BirthdayContent;
}

export const CakeCelebration: React.FC<CakeCelebrationProps> = ({ content }) => {
  const [candleState, setCandleState] = useState<'unlit' | 'lit' | 'blown'>('lit');
  const [sectionRef, isVisible] = useInViewport<HTMLElement>('100px');

  const triggerConfettiBlast = () => {
    const colors = ['#D4AF37', '#871321', '#C41E3A', '#F9F6F0', '#FFE088'];

    confetti({
      particleCount: 70,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors
    });

    confetti({
      particleCount: 70,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors
    });

    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 95,
        origin: { y: 0.6 },
        colors,
        scalar: 1.15
      });
    }, 220);
  };

  const handleBlowCandle = () => {
    setCandleState('blown');
    triggerConfettiBlast();
  };

  const handleRelight = () => {
    setCandleState('lit');
  };

  return (
    <section
      ref={sectionRef}
      id="celebration"
      className="section-lazy-paint py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      {/* Section Header */}
      <EditorialReveal className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono-split font-bold uppercase tracking-[0.25em] text-[#871321] dark:text-[#e67381] mb-2">
          <span>ACT II</span>
          <span className="text-[#8c7170] dark:text-[#a9928d]">·</span>
          <span>THE CELEBRATION</span>
        </div>
        <h2 className="font-stylish text-5xl sm:text-6xl font-normal tracking-wide leading-[1.18] text-[#1c1c18] dark:text-[#f5efe6] mt-1">
          {content.heroGreeting}
        </h2>
        <p className="font-playfair italic text-lg sm:text-xl text-[#584140] dark:text-[#d4c3be] max-w-2xl mx-auto mt-3">
          "{content.quoteText}"
        </p>
      </EditorialReveal>

      {/* Luxury Patisserie Celebration Salon Chamber */}
      <EditorialReveal
        delay={0.05}
        yOffset={16}
        className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF4EA] to-[#F3E9D8] dark:from-[#210910] dark:via-[#17060b] dark:to-[#100307] rounded-3xl px-6 py-10 sm:px-12 sm:py-12 shadow-[0_18px_42px_rgba(32,12,16,0.12)] dark:shadow-[0_22px_50px_rgba(0,0,0,0.55)] border border-[#D4AF37]/55 dark:border-[#D4AF37]/40 ring-1 ring-inset ring-[#D4AF37]/20 max-w-2xl mx-auto overflow-hidden transition-colors duration-300"
      >
        {/* Warm Radial Ambient Lighting */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 24%, rgba(212, 175, 55, 0.16) 0%, rgba(135, 19, 33, 0.06) 45%, transparent 78%)',
          }}
        />

        {/* Delicate Inner Filigree Frame & Corner Brackets */}
        <div className="absolute inset-3 sm:inset-4 rounded-2xl border border-[#D4AF37]/25 pointer-events-none" />
        <span className="pointer-events-none absolute top-3 left-3 sm:top-4 sm:left-4 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/65 rounded-tl-md" />
        <span className="pointer-events-none absolute top-3 right-3 sm:top-4 sm:right-4 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/65 rounded-tr-md" />
        <span className="pointer-events-none absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/65 rounded-bl-md" />
        <span className="pointer-events-none absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/65 rounded-br-md" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Salon Micro-Crest */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/75" />
            <span className="font-mono-split text-[10px] font-bold uppercase tracking-[0.28em] text-[#871321] dark:text-[#F3E5AB]">
              PATISSERIE ROYALE · NO. {content.heroAge}
            </span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/75" />
          </div>

          {/* Sculpted Couture Tiered Birthday Cake */}
          <div className="relative my-5 flex flex-col items-center select-none">
            {/* Tapered Champagne-Gold Candle */}
            <div className="relative flex flex-col items-center -mb-1.5 z-30">
              {/* Interactive Flame / Smoke / Wick */}
              <AnimatePresence mode="wait">
                {candleState === 'lit' && (
                  <motion.div
                    key="lit-flame"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                    className="relative cursor-pointer group"
                    onClick={handleBlowCandle}
                    title="Click to blow out candle"
                  >
                    <div
                      className="absolute -inset-5 rounded-full pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(255, 210, 105, 0.62) 0%, rgba(255, 165, 35, 0.18) 48%, transparent 72%)',
                      }}
                    />
                    <div
                      style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
                      className="w-5 h-8 bg-gradient-to-t from-amber-500 via-yellow-200 to-white rounded-[50%_50%_50%_50%/65%_65%_35%_35%] animate-candle-flicker relative shadow-[0_0_16px_rgba(255,190,65,0.85)]"
                    >
                      <div className="absolute inset-x-1.5 bottom-0.5 top-3 bg-sky-100/85 rounded-full" />
                    </div>
                    <Sparkles className="absolute -top-2.5 -right-3 w-3.5 h-3.5 text-amber-400" />
                  </motion.div>
                )}

                {candleState === 'blown' && (
                  <motion.div
                    key="blown-smoke"
                    initial={{ opacity: 0, y: 4, scale: 0.8 }}
                    animate={{ opacity: [0, 0.95, 0], y: -22, scale: [0.8, 1.15, 1.25] }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                    className="h-8 flex flex-col items-center justify-end pb-1"
                  >
                    <Heart className="w-4 h-4 text-[#C41E3A] fill-[#C41E3A]" />
                  </motion.div>
                )}

                {candleState === 'unlit' && (
                  <div key="unlit-wick" className="h-8 flex items-end">
                    <div className="w-0.5 h-3 bg-stone-800 dark:bg-stone-300" />
                  </div>
                )}
              </AnimatePresence>

              {/* Slender Spiral Gold Candle & Brass Collar */}
              <div className="w-3.5 h-14 rounded-t-full bg-gradient-to-r from-[#b88922] via-[#ffe694] to-[#c4972e] shadow-md border-x border-[#8c6411]/30 relative overflow-hidden flex flex-col justify-evenly py-1">
                <div className="w-[140%] -ml-[20%] h-[1.5px] bg-[#784f0a]/30 -rotate-18" />
                <div className="w-[140%] -ml-[20%] h-[1.5px] bg-[#784f0a]/30 -rotate-18" />
                <div className="w-[140%] -ml-[20%] h-[1.5px] bg-[#784f0a]/30 -rotate-18" />
                <div className="w-[140%] -ml-[20%] h-[1.5px] bg-[#784f0a]/30 -rotate-18" />
              </div>
              <div className="w-6 h-2 rounded-full bg-gradient-to-r from-[#8f691b] via-[#f5d57a] to-[#8f691b] border border-[#6e4e10]/40 shadow-sm -mt-0.5" />
            </div>

            {/* Top Cake Tier (Ivory Chantilly & Sculpted Burgundy Ganache Drips) */}
            <div
              className="relative w-48 sm:w-52 h-20 rounded-t-[18px] rounded-b-sm shadow-[0_8px_18px_rgba(0,0,0,0.2)] border-x border-t border-[#e5d2b3] z-20 overflow-hidden flex flex-col items-center justify-center"
              style={{
                background:
                  'linear-gradient(90deg, #e8dcc8 0%, #fffdf8 32%, #ffffff 50%, #f5ebd9 78%, #decbb0 100%)',
              }}
            >
              {/* Smooth SVG Burgundy Chocolate Ganache Drip Rim */}
              <svg
                viewBox="0 0 220 34"
                preserveAspectRatio="none"
                className="absolute top-0 inset-x-0 w-full h-7 pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="ganacheGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#5c0813" />
                    <stop offset="45%" stopColor="#941727" />
                    <stop offset="100%" stopColor="#520610" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,0 L220,0 L220,11 C211,11 208,24 200,24 C192,24 189,12 180,12 C170,12 167,29 158,29 C149,29 146,13 137,13 C128,13 124,22 115,22 C106,22 103,12 94,12 C84,12 81,28 72,28 C63,28 59,13 50,13 C41,13 38,24 29,24 C20,24 16,11 8,11 C4,11 0,14 0,14 Z"
                  fill="url(#ganacheGrad)"
                />
              </svg>

              {/* Top Tier Monogram */}
              <span className="font-stylish text-[1.75rem] font-normal text-[#7c111e] tracking-wide leading-none mt-4">
                Maggie · {content.heroAge}
              </span>

              {/* Delicate Gold Pearl Trim along bottom of top tier */}
              <div className="absolute bottom-0 inset-x-0 h-2 flex items-center justify-around px-1.5 bg-gradient-to-t from-[#d4af37]/30 to-transparent">
                {Array.from({ length: 13 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-gradient-to-br from-[#fff5cc] via-[#e5c158] to-[#9b7419] shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Grand Base Tier (Deep Royal Red Velvet with Metallic Gold Ribbon & Pearl Collar) */}
            <div
              className="relative w-64 sm:w-72 h-28 rounded-t-xl rounded-b-md shadow-[0_14px_26px_rgba(38,5,10,0.35)] border border-[#D4AF37]/60 -mt-1 z-10 overflow-hidden flex flex-col justify-center items-center px-5"
              style={{
                background:
                  'linear-gradient(90deg, #4b0710 0%, #871321 26%, #a31b2c 50%, #7d101e 76%, #45060e 100%)',
              }}
            >
              {/* Top Metallic Gold Ribbon Band */}
              <div className="absolute top-2.5 inset-x-0 h-[2px] bg-gradient-to-r from-[#8f6818] via-[#ffe699] to-[#8f6818] opacity-90" />

              {/* Center Gold-Framed Calligraphic Plaque */}
              <div className="relative z-10 flex items-center justify-center gap-3 py-2 px-5 rounded-full bg-black/18 border border-[#D4AF37]/40 shadow-inner">
                <Heart className="w-3 h-3 text-[#F3E5AB] fill-[#F3E5AB]" />
                <span className="font-stylish text-2xl sm:text-[1.75rem] font-normal tracking-wide text-[#FFF6DC] leading-none pt-0.5 [text-shadow:0_2px_6px_rgba(0,0,0,0.45)]">
                  Happy Birthday
                </span>
                <Heart className="w-3 h-3 text-[#F3E5AB] fill-[#F3E5AB]" />
              </div>

              {/* Bottom Gold Pearl Garland */}
              <div className="absolute bottom-1 inset-x-0 h-2.5 flex items-center justify-around px-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-gradient-to-br from-[#fff6d4] via-[#d9b243] to-[#8c6614] shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Sculpted Brass & Champagne-Marble Pedestal Cake Stand */}
            <div className="flex flex-col items-center -mt-0.5 z-0">
              {/* Platter Rim */}
              <div className="w-72 sm:w-80 h-4 rounded-full bg-gradient-to-r from-[#b89130] via-[#fff2c2] to-[#b89130] p-[1.5px] shadow-[0_8px_16px_rgba(0,0,0,0.28)]">
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#faf4e8] to-[#dfd2ba] dark:from-[#472029] dark:to-[#291016]" />
              </div>
              {/* Turned Brass Pedestal Stem */}
              <div className="w-12 h-6 bg-gradient-to-r from-[#7c5b14] via-[#f0cf70] to-[#7c5b14] shadow-inner relative flex items-center justify-center">
                <div className="w-14 h-2 rounded-full bg-gradient-to-r from-[#8f6a1a] via-[#ffe699] to-[#8f6a1a] shadow" />
              </div>
              {/* Flared Pedestal Foot */}
              <div className="w-36 h-3.5 rounded-t-full rounded-b-lg bg-gradient-to-r from-[#7c5b14] via-[#f3d478] to-[#7c5b14] shadow-[0_6px_14px_rgba(0,0,0,0.32)] border-b border-[#573d0b]/50" />
            </div>
          </div>

          {/* Interactive Wish / Blow Prompt */}
          <div className="text-center mt-5 w-full">
            <AnimatePresence mode="wait">
              {candleState === 'lit' ? (
                <motion.div
                  key="wish-prompt"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                  className="space-y-5"
                >
                  <p className="font-playfair italic text-base sm:text-lg text-[#4c3736] dark:text-[#e3d3ce] max-w-md mx-auto leading-relaxed">
                    Close your eyes, make your sweetest wish for Year {content.heroAge}, and tap the flame to blow out the candle.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3.5">
                    <button
                      type="button"
                      onClick={handleBlowCandle}
                      className="px-7 py-3 bg-gradient-to-b from-[#9c1627] to-[#6e0b17] text-[#FFFDF9] rounded-full font-mono-split font-bold text-xs tracking-[0.18em] uppercase hover:from-[#ad1a2d] hover:to-[#7a0e1b] transition-all duration-200 shadow-[0_8px_20px_rgba(135,19,33,0.32)] hover:-translate-y-0.5 active:scale-[0.98] border border-[#D4AF37]/70 flex items-center gap-2.5"
                    >
                      <Flame className="w-4 h-4 text-[#FFE088]" />
                      <span>Make Wish &amp; Blow Candle</span>
                    </button>

                    <button
                      type="button"
                      onClick={triggerConfettiBlast}
                      className="px-6 py-3 bg-white/90 dark:bg-[#2a1118] text-[#1c1c18] dark:text-[#F3E5AB] border border-[#D4AF37]/75 rounded-full font-mono-split font-bold text-xs tracking-[0.18em] uppercase hover:bg-[#FAF6F0] dark:hover:bg-[#381720] hover:-translate-y-0.5 transition-all duration-200 shadow-sm flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Launch Confetti</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="wish-made"
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
                  className="space-y-4"
                >
                  <div className="p-5 bg-white/80 dark:bg-[#2a1316]/90 rounded-2xl border border-[#D4AF37]/55 max-w-md mx-auto shadow-sm">
                    <h4 className="font-stylish font-normal text-3xl text-[#871321] dark:text-[#F3E5AB] leading-tight">
                      Your Birthday Wish Is Made!
                    </h4>
                    <p className="font-playfair italic text-sm text-[#584140] dark:text-[#d4c3be] mt-1">
                      The stars have recorded your wish for Year {content.heroAge}. May every dream find its way to you.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRelight}
                      className="px-5 py-2.5 bg-white/90 dark:bg-[#2a1118] text-[#1c1c18] dark:text-[#f5efe6] border border-[#dfbfbe] dark:border-[#4a222c] rounded-full font-mono-split font-bold text-xs tracking-wider uppercase hover:bg-stone-100 dark:hover:bg-[#381720] transition-colors flex items-center gap-2"
                    >
                      <Flame className="w-3.5 h-3.5 text-[#871321] dark:text-[#e67381]" />
                      <span>Relight Candle</span>
                    </button>

                    <button
                      type="button"
                      onClick={triggerConfettiBlast}
                      className="px-6 py-2.5 bg-gradient-to-b from-[#9c1627] to-[#6e0b17] text-white rounded-full font-mono-split font-bold text-xs tracking-wider uppercase hover:from-[#ad1a2d] hover:to-[#7a0e1b] transition-colors flex items-center gap-2 shadow-md border border-[#D4AF37]/60"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FFE088]" />
                      <span>More Confetti</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </EditorialReveal>
    </section>
  );
};
