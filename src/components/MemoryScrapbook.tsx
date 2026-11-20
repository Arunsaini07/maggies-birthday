import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, Calendar, ZoomIn, X } from 'lucide-react';
import { PhotoItem } from '../types/index.ts';
import { EditorialReveal, EDITORIAL_EASE } from './ScrollChoreography.tsx';

interface MemoryScrapbookProps {
  photos: PhotoItem[];
}

export const MemoryScrapbook: React.FC<MemoryScrapbookProps> = ({ photos }) => {
  const [filter, setFilter] = useState<'all' | 'polaroid' | 'scrapbook' | 'vogue'>('all');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  const filteredPhotos = filter === 'all'
    ? photos
    : photos.filter(p => p.category === filter);

  return (
    <section id="scrapbook" className="section-lazy-paint py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <EditorialReveal className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono-split font-bold uppercase tracking-[0.25em] text-[#871321] dark:text-[#e67381] mb-2">
          <span>ACT IV</span>
          <span className="text-[#8c7170] dark:text-[#a9928d]">·</span>
          <span>THE SCRAPBOOK</span>
        </div>
        <h2 className="font-stylish text-5xl sm:text-6xl font-normal tracking-wide leading-[1.18] text-[#1c1c18] dark:text-[#f5efe6]">
          Memories Pinned in Time
        </h2>
        <p className="font-playfair italic text-lg text-[#584140] dark:text-[#d4c3be] mt-3">
          Taped polaroids, sun-drenched afternoons, and spontaneous moments captured forever.
        </p>

        {/* Category Filter Controls */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 p-1.5 bg-[#FAF6F0] dark:bg-[#1c0b10] rounded-full border border-[#D4AF37]/40 w-fit mx-auto shadow-sm">
          {(['all', 'polaroid', 'scrapbook', 'vogue'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wider transition-colors duration-200 ${
                filter === cat
                  ? 'bg-[#871321] text-white shadow-md'
                  : 'text-[#584140] dark:text-[#d4c3be] hover:text-[#1c1c18] dark:hover:text-[#f5efe6] hover:bg-stone-200/50 dark:hover:bg-[#2c121a]'
              }`}
            >
              {cat === 'all' ? 'All Keepsakes' : cat === 'polaroid' ? 'Polaroids' : cat === 'scrapbook' ? 'Candid Moments' : 'Editorial'}
            </button>
          ))}
        </div>
      </EditorialReveal>

      {/* Scrapbook Board / Tactile Canvas */}
      <EditorialReveal
        delay={0.05}
        yOffset={16}
        className="relative bg-[#FAF6F0] dark:bg-[#1c0b10] rounded-3xl p-6 sm:p-12 shadow-md border-2 border-[#D4AF37]/30 min-h-[500px] transition-colors duration-300"
      >
        {/* Subtle grid watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_0.6px,transparent_0.6px)] [background-size:20px_20px] opacity-10 pointer-events-none rounded-3xl" />

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredPhotos.map((photo, idx) => {
            const rotation = photo.rotationDeg || (idx % 2 === 0 ? -2 : 3);

            return (
              <div
                key={photo.id}
                style={{ ['--card-rot' as string]: `${rotation}deg` }}
                className="group relative cursor-pointer [transform:rotate(var(--card-rot))] hover:[transform:rotate(0deg)_scale(1.03)_translateY(-6px)] hover:z-30 transition-transform duration-200 ease-out"
                onClick={() => setActivePhoto(photo)}
              >
                {/* 3D Red Heart Pin or Washi Tape on corner */}
                {idx % 2 === 0 ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#C41E3A] shadow-[0_4px_10px_rgba(196,30,58,0.45),inset_0_2px_4px_rgba(255,255,255,0.55)] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Heart className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#fed65b]/75 -rotate-2 border-y border-stone-300/40 shadow-sm z-20 pointer-events-none" />
                )}

                {/* Polaroid Frame Card */}
                <div className="bg-[#FFFFFF] dark:bg-[#f5efe6] p-3.5 pb-6 rounded-sm shadow-md border border-stone-200 dark:border-stone-300/60">
                  {/* Photo area */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 rounded-[1px] mb-3">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-end p-2">
                      <span className="p-1.5 bg-white/90 rounded-full text-stone-800 shadow">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Handwritten-style captions & meta */}
                  <div className="px-1 text-center">
                    <h3 className="font-bodoni text-lg font-bold text-[#1c1c18] tracking-tight line-clamp-1">
                      {photo.title}
                    </h3>
                    <p className="font-playfair italic text-xs text-[#584140] mt-1 line-clamp-2">
                      "{photo.caption}"
                    </p>

                    {(photo.date || photo.location) && (
                      <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] font-mono-split text-[#8c7170]">
                        {photo.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-[#871321]" />
                            <span>{photo.location}</span>
                          </span>
                        )}
                        {photo.date && (
                          <span className="flex items-center gap-1 ml-auto">
                            <Calendar className="w-2.5 h-2.5 text-[#D4AF37]" />
                            <span>{photo.date}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </EditorialReveal>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/88 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.26, ease: EDITORIAL_EASE }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-[#FAF6F0] dark:bg-[#1c0b10] rounded-2xl shadow-2xl border-2 border-[#D4AF37] overflow-hidden p-6 sm:p-8"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 dark:bg-[#2a1118] text-stone-700 dark:text-[#f5efe6] hover:bg-[#871321] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center">
                <div className="w-full max-h-[55vh] rounded-xl overflow-hidden shadow-lg border border-[#D4AF37]/50 mb-5 bg-stone-900">
                  <img
                    src={activePhoto.url}
                    alt={activePhoto.title}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mx-auto"
                  />
                </div>

                <div className="text-center max-w-lg">
                  <div className="inline-block px-3 py-0.5 bg-[#871321] text-amber-200 text-[10px] font-mono-split uppercase tracking-widest rounded-full mb-2">
                    {activePhoto.category}
                  </div>
                  <h3 className="font-bodoni text-2xl font-bold text-[#1c1c18] dark:text-[#f5efe6]">
                    {activePhoto.title}
                  </h3>
                  <p className="font-playfair italic text-base text-[#584140] dark:text-[#d4c3be] mt-2">
                    "{activePhoto.caption}"
                  </p>

                  {(activePhoto.date || activePhoto.location) && (
                    <div className="mt-4 pt-3 border-t border-[#dfbfbe] dark:border-[#3d1c24] flex items-center justify-center gap-6 text-xs font-mono-split text-[#8c7170] dark:text-[#a9928d]">
                      {activePhoto.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#871321] dark:text-[#e67381]" />
                          <span>{activePhoto.location}</span>
                        </span>
                      )}
                      {activePhoto.date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{activePhoto.date}</span>
                        </span>
                      )}
                    </div>
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
