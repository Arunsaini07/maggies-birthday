import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Film } from 'lucide-react';
import { PhotoItem } from '../types/index.ts';
import { EditorialReveal, EDITORIAL_EASE, useInViewport } from './ScrollChoreography.tsx';

interface PhotoRibbonProps {
  photos: PhotoItem[];
}

export const PhotoRibbon: React.FC<PhotoRibbonProps> = ({ photos }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sectionRef, isVisible] = useInViewport<HTMLElement>('140px');

  const filteredRibbonPhotos = photos.filter(
    (photo) =>
      photo.id !== 'photo-5' &&
      photo.title !== 'The Royal Banquet Call' &&
      !photo.url.includes('maggie_hero_celebration_1794012861156')
  );
  const displayPhotos = filteredRibbonPhotos.length > 0 ? filteredRibbonPhotos : photos;
  const ribbonItems = [...displayPhotos, ...displayPhotos];

  const handleNext = () => {
    if (selectedIndex === null || displayPhotos.length === 0) return;
    setSelectedIndex((selectedIndex + 1) % displayPhotos.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null || displayPhotos.length === 0) return;
    setSelectedIndex((selectedIndex - 1 + displayPhotos.length) % displayPhotos.length);
  };

  return (
    <section
      ref={sectionRef}
      id="ribbon"
      className="section-lazy-paint py-20 bg-[#1A1A1A] text-white overflow-hidden relative"
    >
      {/* Filmstrip Borders */}
      <div className="absolute top-0 inset-x-0 h-4 bg-black flex justify-around items-center px-4 z-10 border-b border-white/10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="w-2.5 h-2 bg-stone-800 rounded-sm" />
        ))}
      </div>
      <div className="absolute bottom-0 inset-x-0 h-4 bg-black flex justify-around items-center px-4 z-10 border-t border-white/10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="w-2.5 h-2 bg-stone-800 rounded-sm" />
        ))}
      </div>

      <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 text-center pt-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono-split font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-1">
          <Film className="w-3.5 h-3.5" />
          <span>ACT V · CINEMATIC PHOTO RIBBON</span>
        </div>
        <h2 className="font-stylish text-4xl sm:text-5xl font-normal tracking-wide leading-[1.18] text-[#F9F6F0]">
          The Moving Filmstrip
        </h2>
        <p className="font-serif italic text-sm text-stone-400 mt-1">
          Hover to pause the reel · Click any frame to inspect full photographic resolution
        </p>
      </EditorialReveal>

      {/* Continuous Horizontal Filmstrip Marquee (auto-paused when scrolled off-screen) */}
      <div className="relative py-4 overflow-hidden group/filmstrip">
        <div
          className="flex gap-5 w-max animate-filmstrip px-6"
          style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
        >
          {ribbonItems.map((photo, idx) => (
            <div
              key={`${photo.id}-${idx}`}
              onClick={() => setSelectedIndex(idx % displayPhotos.length)}
              className="flex-shrink-0 w-64 sm:w-72 group cursor-pointer bg-stone-900 rounded-lg p-2 border border-[#D4AF37]/30 shadow-md hover:border-[#D4AF37] transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.03]"
            >
              <div className="relative aspect-[4/3] rounded overflow-hidden bg-stone-950">
                <img
                  src={photo.url}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bodoni font-bold text-white tracking-wide truncate">
                    {photo.title}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] font-mono-split text-stone-400 px-1">
                <span>FRAME #{((idx % displayPhotos.length) + 1).toString().padStart(2, '0')}</span>
                <span className="text-amber-300">{photo.category.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ribbon Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && displayPhotos[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.26, ease: EDITORIAL_EASE }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#FAF6F0] dark:bg-[#1c0b10] rounded-2xl shadow-2xl border border-[#D4AF37] overflow-hidden p-6 sm:p-10 text-stone-900 dark:text-[#f5efe6]"
            >
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-200 dark:bg-[#2a1118] dark:text-[#f5efe6] hover:bg-[#871321] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900 text-white hover:bg-[#871321] transition-colors shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900 text-white hover:bg-[#871321] transition-colors shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center">
                <div className="w-full max-h-[60vh] rounded-xl overflow-hidden shadow-2xl bg-black mb-6">
                  <img
                    src={displayPhotos[selectedIndex].url}
                    alt={displayPhotos[selectedIndex].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mx-auto"
                  />
                </div>

                <div className="text-center max-w-xl">
                  <span className="font-mono-split text-[11px] text-[#871321] dark:text-[#e67381] font-bold uppercase tracking-widest">
                    FRAME {selectedIndex + 1} OF {displayPhotos.length}
                  </span>
                  <h3 className="font-bodoni text-2xl font-bold text-[#1c1c18] dark:text-[#f5efe6] mt-1">
                    {displayPhotos[selectedIndex].title}
                  </h3>
                  <p className="font-playfair italic text-base text-[#584140] dark:text-[#d4c3be] mt-1">
                    "{displayPhotos[selectedIndex].caption}"
                  </p>
                  {displayPhotos[selectedIndex].location && (
                    <p className="font-mono-split text-xs text-[#8c7170] dark:text-[#a9928d] mt-2">
                      {displayPhotos[selectedIndex].location} · {displayPhotos[selectedIndex].date}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
