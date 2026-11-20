import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, Heart, Send, CheckCircle2, Star, Wine } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BirthdayContent, GuestWish } from '../types/index.ts';
import { EditorialReveal, RomanticAmbience, EDITORIAL_EASE, useInViewport } from './ScrollChoreography.tsx';

interface FinalSurpriseProps {
  content: BirthdayContent;
  initialWishes: GuestWish[];
  onAddWish: (wish: GuestWish) => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  content,
  initialWishes,
  onAddWish,
}) => {
  const [sectionRef, isVisible] = useInViewport<HTMLElement>('100px');
  const [isRevealed, setIsRevealed] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [stamp, setStamp] = useState<'heart' | 'star' | 'wine'>('heart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#871321', '#FFE088', '#C41E3A']
    });
  };

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, stampIcon: stamp })
      });
      const data = await res.json();
      if (data.success && data.data) {
        onAddWish(data.data);
        setName('');
        setMessage('');
        setSubmittedSuccess(true);
        setTimeout(() => setSubmittedSuccess(false), 4000);
        confetti({ particleCount: 50, spread: 60, colors: ['#D4AF37', '#871321'] });
      }
    } catch (err) {
      console.error('Failed to submit wish:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="surprise" className="section-lazy-paint py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <EditorialReveal className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono-split font-bold uppercase tracking-[0.25em] text-[#871321] dark:text-[#e67381] mb-2">
          <span>ACT VIII</span>
          <span className="text-[#8c7170] dark:text-[#a9928d]">·</span>
          <span>THE FINAL SURPRISE &amp; GUESTBOOK</span>
        </div>
        <h2 className="font-stylish text-5xl sm:text-6xl font-normal tracking-wide leading-[1.18] text-[#1c1c18] dark:text-[#f5efe6]">
          The Closing Keepsake
        </h2>
        <p className="font-playfair italic text-lg text-[#584140] dark:text-[#d4c3be] mt-3">
          A secret tribute and a permanent book of wishes left by those who adore Maggie.
        </p>
      </EditorialReveal>

      {/* Secret Gift Box Chamber */}
      <div className="mb-20">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="gift-wrapped"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.03 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.48, ease: EDITORIAL_EASE }}
              className="flex flex-col items-center"
            >
              <div
                onClick={handleReveal}
                className="group relative cursor-pointer bg-[#FAF6F0] dark:bg-[#1c0b10] rounded-3xl p-10 sm:p-14 shadow-lg border-2 border-[#D4AF37]/50 dark:border-[#D4AF37]/40 max-w-lg w-full flex flex-col items-center text-center hover:shadow-[0_18px_40px_rgba(135,19,33,0.2)] hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.985] transition-all duration-200 ease-out"
              >
                {/* Golden 3D Ribbon Wrap */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-[#D4AF37] via-[#FFE088] to-[#D4AF37] shadow-md border-y border-stone-800/20" />
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-b from-[#D4AF37] via-[#FFE088] to-[#D4AF37] shadow-md border-x border-stone-800/20" />

                {/* Gift Bow Icon */}
                <div
                  style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
                  className="relative z-10 w-24 h-24 rounded-full bg-[#871321] border-2 border-[#FFE088] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 animate-heartbeat-gentle"
                >
                  <Gift className="w-12 h-12 text-[#FFE088]" />
                </div>

                <div className="relative z-10 mt-6 bg-[#FAF6F0]/96 dark:bg-[#1c0b10]/96 p-4 rounded-xl border border-[#D4AF37]/40">
                  <h3 className="font-stylish text-3xl font-normal tracking-wide leading-[1.2] text-[#1c1c18] dark:text-[#f5efe6]">
                    Untie Maggie's Golden Surprise
                  </h3>
                  <p className="font-sans text-xs text-[#584140] dark:text-[#d4c3be] mt-1">
                    Click the velvet package to reveal the milestone blessing.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Revealed Secret Message */
            <motion.div
              key="gift-revealed"
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.52, ease: EDITORIAL_EASE }}
              className="relative bg-gradient-to-b from-[#871321] via-[#590A14] to-[#3a060d] text-[#F9F6F0] rounded-3xl p-8 sm:p-14 shadow-lg border-2 border-[#D4AF37] text-center max-w-2xl mx-auto overflow-hidden"
            >
              <RomanticAmbience variant="hero" />

              <div className="relative z-10">
                <div
                  style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2b040a]/60 border border-[#D4AF37]/50 mx-auto mb-4 animate-heartbeat-gentle"
                >
                  <Heart className="w-6 h-6 text-[#F3E5AB] fill-[#C41E3A]" />
                </div>

                <h3 className="font-stylish text-4xl sm:text-5xl font-normal tracking-wide leading-[1.2] text-amber-200">
                  {content.surpriseHeadline}
                </h3>

                <p className="font-playfair italic text-lg sm:text-xl text-stone-100 mt-4 leading-relaxed max-w-xl mx-auto">
                  "{content.surpriseMessage}"
                </p>

                <div className="mt-8 pt-6 border-t border-[#D4AF37]/40 flex items-center justify-center gap-3">
                  <Heart
                    style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
                    className="w-5 h-5 text-[#C41E3A] fill-[#C41E3A] animate-heartbeat-gentle"
                  />
                  <span className="font-mono-split text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                    Maggie's Chapter 24 · Immortalized with Love
                  </span>
                  <Heart
                    style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
                    className="w-5 h-5 text-[#C41E3A] fill-[#C41E3A] animate-heartbeat-gentle"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Guest Wishing Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Wish Submission Form */}
        <EditorialReveal
          delay={0.05}
          className="lg:col-span-5 bg-[#FAF6F0] dark:bg-[#1c0b10] rounded-2xl p-6 sm:p-8 shadow-md border border-[#D4AF37]/40 dark:border-[#D4AF37]/30 transition-colors duration-300"
        >
          <div className="flex items-center gap-2 text-xs font-mono-split font-bold uppercase tracking-widest text-[#871321] dark:text-[#e67381] mb-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>LEAVE A TRIBUTE</span>
          </div>
          <h3 className="font-bodoni text-2xl font-bold text-[#1c1c18] dark:text-[#f5efe6] mb-1">
            Write to Maggie
          </h3>
          <p className="text-xs text-[#584140] dark:text-[#d4c3be] mb-6">
            Your note will be pinned onto her digital keepsake board forever.
          </p>

          <form onSubmit={handleSubmitWish} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-split text-[#1c1c18] dark:text-[#f5efe6] font-bold uppercase mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Charlotte K."
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-[#4a222c] bg-white dark:bg-[#120609] text-sm text-stone-900 dark:text-[#f5efe6] placeholder:text-stone-400 dark:placeholder:text-[#8c7170] focus:outline-none focus:ring-2 focus:ring-[#871321]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-split text-[#1c1c18] dark:text-[#f5efe6] font-bold uppercase mb-1">
                Your Birthday Wish
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Maggie, wishing you the happiest 24th birthday! You are pure gold..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-[#4a222c] bg-white dark:bg-[#120609] text-sm text-stone-900 dark:text-[#f5efe6] placeholder:text-stone-400 dark:placeholder:text-[#8c7170] focus:outline-none focus:ring-2 focus:ring-[#871321]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-split text-[#1c1c18] dark:text-[#f5efe6] font-bold uppercase mb-1.5">
                Keepsake Seal Stamp
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'heart', label: 'Heart', icon: Heart },
                  { id: 'wine', label: 'Toast', icon: Wine },
                  { id: 'star', label: 'Star', icon: Star },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStamp(s.id as any)}
                      className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                        stamp === s.id
                          ? 'bg-[#871321] text-white border-[#871321] shadow-sm'
                          : 'bg-white dark:bg-[#240e14] text-stone-700 dark:text-[#d4c3be] border-stone-300 dark:border-[#4a222c] hover:bg-stone-50 dark:hover:bg-[#31131c]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#1A1A1A] dark:bg-[#871321] hover:bg-[#871321] dark:hover:bg-[#630011] text-white rounded-lg font-mono-split text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md mt-2 border border-transparent dark:border-[#D4AF37]/50 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sealing Tribute...' : 'Pin Wish to Keepsake'}</span>
            </button>

            {submittedSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Your wish has been pinned to Maggie's keepsake board!</span>
              </div>
            )}
          </form>
        </EditorialReveal>

        {/* Wishes Feed */}
        <EditorialReveal delay={0.12} className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#dfbfbe] dark:border-[#3d1c24]">
            <h3 className="font-bodoni text-xl font-bold text-[#1c1c18] dark:text-[#f5efe6]">
              Wishes &amp; Dedications ({initialWishes.length})
            </h3>
            <span className="text-xs font-mono-split text-[#8c7170] dark:text-[#a9928d]">LIVE REGISTRY</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {initialWishes.map((wish) => (
              <div
                key={wish.id}
                className="bg-[#FAF6F0] dark:bg-[#1c0b10] p-4 sm:p-5 rounded-xl border border-stone-200 dark:border-[#3d1c24] shadow-sm relative group hover:border-[#D4AF37] hover:translate-x-1 transition-all duration-200 ease-out"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#871321] text-white font-bodoni font-bold text-xs flex items-center justify-center">
                      {wish.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-bodoni font-bold text-sm text-[#1c1c18] dark:text-[#f5efe6]">
                      {wish.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-split text-[#8c7170] dark:text-[#a9928d]">
                    {wish.date}
                  </span>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#584140] dark:text-[#d4c3be] leading-relaxed">
                  "{wish.message}"
                </p>

                {/* Stamp Icon badge */}
                <div className="absolute bottom-3 right-3 text-[#D4AF37]/80">
                  {wish.stampIcon === 'star' ? (
                    <Star className="w-4 h-4 fill-[#D4AF37]" />
                  ) : wish.stampIcon === 'wine' ? (
                    <Wine className="w-4 h-4" />
                  ) : (
                    <Heart className="w-4 h-4 fill-[#C41E3A] text-[#C41E3A]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </EditorialReveal>
      </div>
    </section>
  );
};
