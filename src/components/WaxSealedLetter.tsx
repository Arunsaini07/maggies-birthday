import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';
import { BirthdayContent } from '../types/index.ts';
import { EditorialReveal, RomanticAmbience, EDITORIAL_EASE, useInViewport } from './ScrollChoreography.tsx';

interface WaxSealedLetterProps {
  content: BirthdayContent;
}

export const WaxSealedLetter: React.FC<WaxSealedLetterProps> = ({ content }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [sectionRef, isVisible] = useInViewport<HTMLElement>('100px');

  return (
    <section ref={sectionRef} id="letter" className="section-lazy-paint relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto overflow-hidden">
      {/* Subtle floating hearts around the keepsake letter */}
      <RomanticAmbience variant="letter" />

      {/* Section Header */}
      <EditorialReveal className="relative z-10 text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono-split font-bold uppercase tracking-[0.25em] text-[#871321] dark:text-[#e67381] mb-2">
          <span>ACT VI</span>
          <span className="text-[#8c7170] dark:text-[#a9928d]">·</span>
          <span>THE KEEPSAKE LETTER</span>
        </div>
        <h2 className="font-stylish text-5xl sm:text-6xl font-normal tracking-wide leading-[1.18] text-[#1c1c18] dark:text-[#f5efe6]">
          Words from the Heart
        </h2>
        <p className="font-playfair italic text-lg text-[#584140] dark:text-[#d4c3be] mt-3">
          A sealed dispatch written especially for Maggie's twenty-fourth milestone.
        </p>
      </EditorialReveal>

      <div className="relative z-10 perspective-book">
        <AnimatePresence mode="wait">
          {/* Sealed Envelope State */}
          {!isOpened ? (
            <motion.div
              key="sealed-envelope"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.48, ease: EDITORIAL_EASE }}
              className="flex flex-col items-center"
            >
              <div
                onClick={() => setIsOpened(true)}
                className="group relative cursor-pointer w-full max-w-md bg-[#FAF6F0] dark:bg-[#1c0b10] rounded-2xl p-8 sm:p-12 shadow-lg border-2 border-[#D4AF37]/50 dark:border-[#D4AF37]/40 hover:shadow-[0_18px_40px_rgba(135,19,33,0.18)] hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.985] flex flex-col items-center text-center overflow-hidden transition-all duration-200 ease-out"
              >
                {/* Parchment background pattern + warm rose-gold radial heart glow */}
                <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_0.6px,transparent_0.6px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 68%, rgba(196, 30, 58, 0.08) 0%, transparent 55%)',
                  }}
                />

                {/* Envelope Flap Lines */}
                <div className="relative z-10 w-full flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-8">
                  <span className="font-mono-split text-[10px] text-[#8c7170] dark:text-[#a9928d] uppercase tracking-widest">
                    AIRMAIL · PAR AVION
                  </span>
                  <span className="font-mono-split text-[10px] text-[#871321] dark:text-[#e67381] font-bold uppercase tracking-widest">
                    WITH LOVE · PERSONAL
                  </span>
                </div>

                {/* Addressed To */}
                <div className="relative z-10 my-6">
                  <p className="font-playfair italic text-sm text-[#8c7170] dark:text-[#a9928d]">Carefully addressed to:</p>
                  <h3 className="font-stylish text-4xl font-normal tracking-wide leading-[1.2] text-[#1c1c18] dark:text-[#f5efe6] mt-1">
                    {content.letterRecipient}
                  </h3>
                  <p className="font-mono-split text-xs text-[#871321] dark:text-[#e67381] mt-1">
                    ROOM OF CELEBRATION · CHAPTER 24
                  </p>
                </div>

                {/* Wax Seal Button with gentle romantic heartbeat */}
                <div className="relative z-10 mt-4 mb-2">
                  <div
                    style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#630011] via-[#871321] to-[#C41E3A] wax-seal-shadow flex flex-col items-center justify-center border-2 border-[#FFE088]/45 animate-heartbeat-gentle transition-transform duration-300 group-hover:scale-110"
                  >
                    <span className="font-bodoni font-black text-2xl text-amber-100 drop-shadow">
                      M
                    </span>
                    <Heart className="w-3 h-3 text-amber-200 fill-amber-200 -mt-1" />
                  </div>
                </div>

                <p className="relative z-10 font-mono-split text-[11px] font-bold uppercase tracking-widest text-[#735c00] dark:text-[#F3E5AB] mt-6 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Tap to Break Seal &amp; Read</span>
                </p>
              </div>
            </motion.div>
          ) : (
            /* Unfolded Keepsake Letter Tabletop Scene */
            <motion.div
              key="opened-letter"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.48, ease: EDITORIAL_EASE }}
              style={{
                transformOrigin: '50% 0%',
                backgroundColor: '#3f2212',
                backgroundImage:
                  'radial-gradient(circle at 12% 10%, rgba(255, 200, 110, 0.28) 0%, rgba(255, 165, 70, 0.08) 28%, transparent 56%), repeating-linear-gradient(2deg, rgba(28, 13, 5, 0.24) 0px, rgba(28, 13, 5, 0.24) 2px, transparent 2px, transparent 11px), linear-gradient(155deg, #5b331c 0%, #3d2010 48%, #2a1509 100%)',
              }}
              className="relative rounded-2xl p-5 sm:p-8 md:p-10 shadow-xl border-2 border-[#D4AF37]/45 overflow-hidden"
            >
              {/* Soft vignette around wooden desk edges */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 70px rgba(10, 4, 2, 0.65)',
                }}
              />

              {/* Top-Right Fold Control */}
              <div className="relative z-30 flex justify-end mb-3 sm:mb-0 sm:absolute sm:top-4 sm:right-4">
                <button
                  type="button"
                  onClick={() => setIsOpened(false)}
                  className="px-3 py-1.5 rounded-full bg-black/45 hover:bg-[#871321] text-[#f5efe6] border border-[#D4AF37]/50 text-[11px] font-mono-split uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Fold Letter</span>
                </button>
              </div>

              {/* Top Tabletop Props Row: Candle + Kraft Envelope with Twine, Wax Seal & Charm */}
              <div className="relative z-10 flex items-start justify-center gap-5 sm:gap-10 mb-7 sm:mb-9">
                {/* Warm Glowing Pillar Candle (Top Left) */}
                <div className="hidden sm:flex flex-col items-center relative -ml-4 mt-1 select-none pointer-events-none">
                  {/* Candlelight aura */}
                  <div
                    className="absolute -top-7 w-32 h-32 rounded-full pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(255, 224, 136, 0.58) 0%, rgba(255, 175, 75, 0.16) 50%, transparent 72%)',
                    }}
                  />
                  {/* Flame */}
                  <div
                    style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
                    className="relative z-10 w-3 h-5 rounded-full bg-gradient-to-t from-amber-500 via-yellow-200 to-white shadow-[0_0_14px_rgba(255,210,100,0.92)] animate-candle-flicker -mb-1"
                  />
                  {/* Ivory Melted Wax Body with Soft Wax Drips */}
                  <div className="w-14 h-16 rounded-t-xl rounded-b-lg bg-gradient-to-b from-[#fff8e8] via-[#efdcbe] to-[#c7ac85] shadow-lg border border-amber-100/45 relative overflow-hidden">
                    <div className="w-11 h-2.5 rounded-full bg-[#e3c798]/80 mx-auto mt-1 shadow-inner" />
                    <div className="absolute top-2.5 left-2 w-1.5 h-5 rounded-full bg-[#fff5de]/65" />
                    <div className="absolute top-3 right-3 w-1.5 h-3.5 rounded-full bg-[#fff5de]/55" />
                  </div>
                  {/* Ceramic Saucer */}
                  <div className="w-20 h-4 -mt-1.5 rounded-full bg-gradient-to-b from-[#69523c] via-[#453323] to-[#261b11] shadow-md border border-[#d4af37]/25" />
                </div>

                {/* Luxury Kraft Paper Envelope with Layered Folds, SVG Twine Bow, Embossed Wax Seal & Brass Charm */}
                <div
                  className="relative w-full max-w-[310px] sm:max-w-[360px] h-40 sm:h-48 rounded-[3px] shadow-[0_18px_36px_rgba(0,0,0,0.52)] border border-[#8e6a42]/70 overflow-visible select-none"
                  style={{
                    backgroundColor: '#b99367',
                    backgroundImage:
                      'radial-gradient(ellipse at 50% 45%, rgba(232,196,152,0.22) 0%, transparent 65%), repeating-linear-gradient(45deg, rgba(110,75,40,0.06) 0px, rgba(110,75,40,0.06) 1px, transparent 1px, transparent 5px), linear-gradient(160deg, #cda87e 0%, #ae8356 100%)',
                  }}
                >
                  {/* Subtle Lower Envelope Fold Seams */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-35"
                    style={{
                      clipPath: 'polygon(0 100%, 50% 42%, 100% 100%)',
                      background: 'linear-gradient(180deg, rgba(110,72,34,0.25) 0%, rgba(72,44,18,0.12) 100%)',
                    }}
                  />

                  {/* Subtle Sepia Stationery Postmark (Bottom Left) */}
                  <div className="absolute bottom-2.5 left-3.5 z-10 pointer-events-none opacity-55">
                    <span className="block font-mono-split text-[8px] uppercase tracking-[0.22em] text-[#4a3016] font-bold">
                      PAR AVION · NO. 24
                    </span>
                    <span className="block w-12 h-px bg-[#4a3016]/40 mt-0.5" />
                  </div>

                  {/* Envelope Triangular Flap with Crisp Debossed Rim */}
                  <div
                    className="absolute inset-x-0 top-0 h-[59%]"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      background: 'linear-gradient(180deg, #d7b388 0%, #bd9366 75%, #ad8154 100%)',
                      filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.28))',
                    }}
                  >
                    <div
                      className="w-full h-full border-t border-[#f3dfc4]/35"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(255,244,224,0.18) 0%, transparent 35%)',
                      }}
                    />
                  </div>

                  {/* Natural Jute Twine Horizontal Wrap (Double-strand look) */}
                  <div className="absolute inset-x-0 top-[46%] h-[3px] bg-gradient-to-r from-[#7e5e38] via-[#c7a06f] to-[#7e5e38] shadow-sm z-10" />
                  <div className="absolute inset-x-0 top-[49.5%] h-[2px] bg-[#644726]/75 z-10" />

                  {/* Realistic Organic SVG Twine Bow & Hanging Tails */}
                  <svg
                    viewBox="0 0 120 70"
                    className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-28 h-16 z-15 pointer-events-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M58 31 C40 12, 18 18, 28 33 C36 42, 52 36, 58 32"
                      stroke="#c39a67"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M62 31 C80 12, 102 18, 92 33 C84 42, 68 36, 62 32"
                      stroke="#c39a67"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M57 33 C46 47, 38 56, 31 64"
                      stroke="#ab8250"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M63 33 C73 48, 82 57, 89 65"
                      stroke="#ab8250"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* 3D Poured Crimson Heart Wax Seal */}
                  <div className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 z-20 w-13 h-13 sm:w-15 sm:h-15 rounded-[48%_52%_50%_50%/50%_47%_53%_50%] bg-gradient-to-br from-[#b51d2e] via-[#810e1a] to-[#4c040b] shadow-[0_7px_16px_rgba(0,0,0,0.55),inset_0_2px_5px_rgba(255,190,190,0.34)] border border-[#d64e5b]/45 flex items-center justify-center">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#4a040a]/70 bg-gradient-to-b from-[#7b0d18] to-[#961422] shadow-inner flex items-center justify-center">
                      <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#54060d] fill-[#650811] drop-shadow-[0_1px_0_rgba(255,185,185,0.35)]" />
                    </div>
                  </div>

                  {/* Dangling Antique Brass Filigree Heart Charm */}
                  <div className="absolute right-[16%] top-[49%] z-20 flex flex-col items-center rotate-6 pointer-events-none">
                    <div className="w-2 h-3.5 border-[1.5px] border-[#d4af37]/80 rounded-full -mb-1" />
                    <div className="w-7 h-7 rounded-full bg-[#382310]/30 shadow-md flex items-center justify-center border border-[#d4af37]/25">
                      <Heart className="w-5 h-5 text-[#e6c470] fill-[#9e772d] drop-shadow" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Tabletop Stage: Handwritten Parchment Letter + Tilted Polaroid + Rose Petals */}
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-7">
                {/* Scattered Dried Crimson Rose Petals (Bottom Left) */}
                <div className="hidden sm:block absolute -left-2 bottom-2 z-20 pointer-events-none select-none" aria-hidden="true">
                  <span className="block w-6 h-7 rounded-[65%_35%_55%_45%] bg-gradient-to-br from-[#9e2736] to-[#590d17] shadow-md -rotate-12 mb-3 ml-2" />
                  <span className="block w-7 h-6 rounded-[45%_55%_65%_35%] bg-gradient-to-br from-[#b43647] to-[#6a101d] shadow-md rotate-24 mb-4" />
                  <span className="block w-6 h-7 rounded-[55%_45%_35%_65%] bg-gradient-to-br from-[#8c1d2b] to-[#4c0811] shadow-md -rotate-32 mb-2 ml-4" />
                  <span className="block w-7 h-5 rounded-[60%_40%_50%_50%] bg-gradient-to-br from-[#a32c3c] to-[#5d0e18] shadow-md rotate-12 ml-1" />
                </div>

                {/* Antique Torn-Edge Deckled Parchment Letter */}
                <div className="relative w-full md:w-[60%] [filter:drop-shadow(0_18px_32px_rgba(0,0,0,0.58))]">
                  <div
                    className="relative px-7 py-8 sm:px-11 sm:py-11 text-[#1d130b]"
                    style={{
                      backgroundColor: '#ebd7b7',
                      backgroundImage: [
                        'radial-gradient(circle at 18% 14%, rgba(168, 122, 68, 0.14) 0%, transparent 32%)',
                        'radial-gradient(circle at 84% 26%, rgba(154, 108, 56, 0.16) 0%, transparent 28%)',
                        'radial-gradient(circle at 22% 78%, rgba(162, 114, 62, 0.15) 0%, transparent 34%)',
                        'radial-gradient(circle at 78% 86%, rgba(150, 102, 50, 0.18) 0%, transparent 30%)',
                        'radial-gradient(ellipse at 50% 48%, rgba(250, 239, 218, 0.78) 0%, rgba(235, 212, 175, 0.56) 62%, rgba(186, 144, 92, 0.8) 100%)',
                      ].join(', '),
                      boxShadow:
                        'inset 0 0 40px rgba(124, 78, 30, 0.38), inset 0 0 12px rgba(90, 52, 14, 0.34)',
                      clipPath:
                        'polygon(0.6% 0.8%, 5% 0.3%, 11% 0.9%, 17% 0.4%, 23% 0.7%, 29% 0.2%, 35% 0.8%, 42% 0.3%, 49% 0.9%, 56% 0.3%, 63% 0.7%, 70% 0.2%, 77% 0.9%, 84% 0.4%, 91% 0.8%, 96% 0.3%, 99.4% 0.7%, 99.0% 6%, 99.7% 13%, 98.9% 20%, 99.6% 28%, 99.1% 36%, 99.8% 44%, 99.0% 52%, 99.6% 60%, 98.9% 68%, 99.7% 76%, 99.1% 84%, 99.6% 92%, 99.2% 99.2%, 94% 99.6%, 88% 99.0%, 81% 99.7%, 74% 99.1%, 67% 99.6%, 60% 98.9%, 53% 99.5%, 46% 99.1%, 39% 99.7%, 32% 99.0%, 25% 99.6%, 18% 99.1%, 11% 99.7%, 5% 99.1%, 0.7% 99.5%, 0.4% 93%, 1.1% 85%, 0.3% 77%, 1.0% 69%, 0.4% 61%, 1.1% 53%, 0.3% 45%, 1.0% 37%, 0.4% 29%, 1.1% 21%, 0.3% 13%, 0.9% 6%)',
                    }}
                  >
                    {/* Subtle paper fiber grain overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-25"
                      style={{
                        backgroundImage:
                          'radial-gradient(rgba(110, 72, 30, 0.25) 0.6px, transparent 0.6px)',
                        backgroundSize: '14px 14px',
                      }}
                    />

                    {/* Delicate Inner Stationery Hairline Frame */}
                    <div className="relative z-10 border border-[#9e7743]/25 px-4 py-5 sm:px-6 sm:py-6 space-y-5">
                      {/* Bespoke Stationery Header Crest */}
                      <div className="flex items-center justify-between border-b border-[#8e6a3c]/25 pb-2.5">
                        <span className="font-mono-split text-[9px] uppercase tracking-[0.28em] text-[#6d4d25]/80 font-bold">
                          PERSONAL DISPATCH
                        </span>
                        <span className="font-mono-split text-[9px] uppercase tracking-[0.24em] text-[#7c121e]/85 font-bold flex items-center gap-1.5">
                          <Heart className="w-2.5 h-2.5 fill-[#7c121e]/80 text-[#7c121e]" />
                          <span>CHAPTER XXIV</span>
                        </span>
                      </div>

                      {/* Calligraphic Salutation */}
                      <h3 className="font-stylish text-3xl sm:text-[2.35rem] font-normal tracking-wide text-[#24130a] leading-[1.15]">
                        {content.letterRecipient}
                      </h3>

                      {/* Handwritten Letter Body with Illuminated Calligraphic Drop Cap */}
                      <div className="font-handwriting text-[1.2rem] sm:text-[1.32rem] font-medium text-[#21150c] leading-[1.58] space-y-4">
                        {content.letterBody.split('\n\n').map((paragraph, index) => (
                          <p
                            key={index}
                            className={
                              index === 0
                                ? 'first-letter:font-stylish first-letter:text-5xl sm:first-letter:text-[3.35rem] first-letter:font-normal first-letter:float-left first-letter:mr-3 first-letter:mt-0.5 first-letter:leading-[0.82] first-letter:text-[#7c121e]'
                                : ''
                            }
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Editorial Hairline & Calligraphic Sign-off */}
                      <div className="pt-3 space-y-1">
                        <div className="w-24 h-px bg-gradient-to-r from-[#7c121e]/55 via-[#9e7743]/40 to-transparent mb-3" />
                        <p className="font-handwriting text-[1.18rem] sm:text-[1.3rem] text-[#352214]">
                          {content.letterSignOff}
                        </p>
                        <p className="font-stylish text-3xl sm:text-[2.1rem] font-normal tracking-wide text-[#6b101b] inline-flex items-center gap-2 leading-tight">
                          <span>{content.letterSender}</span>
                          <Heart
                            style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
                            className="w-3.5 h-3.5 text-[#7c121e] fill-[#7c121e] animate-heartbeat-gentle"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tilted Vintage Polaroid Keepsake Card (Right Side) */}
                <div className="w-60 sm:w-64 md:w-[34%] max-w-[260px] flex-shrink-0 md:mt-6 rotate-[3.5deg] hover:rotate-0 transition-transform duration-300 ease-out">
                  <div
                    className="p-3 pb-5 sm:p-3.5 sm:pb-6 rounded-[2px] shadow-[0_14px_30px_rgba(0,0,0,0.52)] border border-[#d6c7ae]"
                    style={{
                      background: 'linear-gradient(155deg, #f8f2e6 0%, #ebe0ca 100%)',
                    }}
                  >
                    <div className="aspect-square overflow-hidden bg-stone-900 rounded-[1px] shadow-inner">
                      <img
                        src="/src/assets/images/maggie_candid_smile_1794012862220.jpg"
                        alt="Maggie Keepsake Polaroid"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-handwriting text-2xl sm:text-[1.65rem] font-bold text-[#1e140c] text-center mt-3 leading-none">
                      Happy Birthday Maggie
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
