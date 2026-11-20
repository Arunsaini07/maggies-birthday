import React from 'react';
import { Sparkles, Crown, Heart } from 'lucide-react';
import { useInViewport } from './ScrollChoreography.tsx';

interface VipBadgePassProps {
  age?: string;
}

export const VipBadgePass: React.FC<VipBadgePassProps> = ({ age = '24' }) => {
  const [badgeRef, isVisible] = useInViewport<HTMLDivElement>('80px');

  return (
    <div
      ref={badgeRef}
      style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
      className="relative group w-[290px] sm:w-[310px] mx-auto cursor-default animate-pendulum transition-transform duration-300 ease-out hover:scale-[1.03]"
    >
      {/* Sleek Satin Lanyard Ribbon & Precision Brushed-Gold Clasp */}
      <div className="flex flex-col items-center relative z-20">
        {/* Crimson-Obsidian Woven Lanyard Ribbon with Gold Edge Piping */}
        <div className="w-9 h-12 bg-gradient-to-b from-[#160408] via-[#2c0811] to-[#18050a] border-x border-[#D4AF37]/60 shadow-inner relative flex items-center justify-center overflow-hidden">
          {/* Fine Center Stitched Seam */}
          <div className="w-[1px] h-full bg-gradient-to-b from-[#D4AF37]/45 via-[#FFE088]/25 to-[#D4AF37]/55" />
          {/* Subtle Diagonal Satin Highlight */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />
        </div>

        {/* Sculpted Metallic Gold Swivel Clasp & Ring */}
        <div className="flex flex-col items-center -mt-1">
          <div className="w-7 h-3 rounded-t-md bg-gradient-to-r from-[#8d6815] via-[#ffe699] to-[#8d6815] border border-[#5e4409]/60 shadow-md flex items-center justify-center">
            <div className="w-4 h-[1.5px] bg-black/45 rounded-full" />
          </div>
          <div className="w-4 h-3.5 -mt-0.5 rounded-b-full border-[2.5px] border-[#e6c567] bg-gradient-to-b from-[#d4af37]/30 to-[#78570e]/40 shadow-sm" />
        </div>
      </div>

      {/* Outer Metallic Gold Bezel */}
      <div className="-mt-2.5 p-[1.5px] rounded-[22px] bg-gradient-to-b from-[#FFE088]/80 via-[#D4AF37]/45 to-[#871321]/75 shadow-[0_22px_48px_rgba(0,0,0,0.58)]">
        {/* Luxury Obsidian-Velvet VIP Pass Body */}
        <div
          className="relative rounded-[20.5px] p-5 sm:p-6 overflow-hidden text-[#F9F6F0]"
          style={{
            background:
              'linear-gradient(155deg, #210910 0%, #140509 48%, #0c0305 100%)',
          }}
        >
          {/* Subtle Champagne Radial Aura & Satin Sheen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 85% 12%, rgba(212, 175, 55, 0.16) 0%, transparent 45%), radial-gradient(circle at 15% 88%, rgba(196, 30, 58, 0.14) 0%, transparent 45%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.07] pointer-events-none" />

          {/* Precision Die-Cut Lanyard Slot */}
          <div className="relative z-10 w-12 h-2 rounded-full bg-[#090204] border border-[#D4AF37]/45 shadow-inner mx-auto mb-4" />

          {/* Top Credential Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#D4AF37]/25 pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#FFE088]" />
              <span className="font-mono-split text-[10px] font-bold tracking-[0.24em] uppercase text-[#F3E5AB]">
                VIP ATELIER
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/12 border border-[#D4AF37]/40 font-mono-split text-[9px] font-bold tracking-[0.18em] text-[#FFE088]">
              PASS #{age}
            </span>
          </div>

          {/* Sleek Framed Portrait Window */}
          <div className="relative z-10 aspect-[4/3.8] rounded-xl overflow-hidden border border-[#D4AF37]/45 mb-4 bg-stone-950 shadow-inner">
            <img
              src="/src/assets/images/maggie_vip_portrait_1794012861926.jpg"
              alt="Maggie VIP Keepsake Portrait"
              referrerPolicy="no-referrer"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* Soft Gold Editorial Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0306]/85 via-transparent to-white/[0.06] pointer-events-none" />

            {/* Modern Frosted Footer Strip inside Portrait */}
            <div className="absolute bottom-2 left-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-[#140509]/85 border border-[#D4AF37]/35 flex items-center justify-between">
              <span className="text-[9px] font-mono-split font-bold tracking-[0.22em] text-[#F3E5AB] uppercase">
                HONORED GUEST
              </span>
              <Heart className="w-3 h-3 text-[#C41E3A] fill-[#C41E3A]" />
            </div>
          </div>

          {/* Calligraphic Nameplate & Jubilee Subtitle */}
          <div className="relative z-10 text-center space-y-0.5">
            <h3 className="font-stylish text-4xl sm:text-[2.6rem] font-normal tracking-wide text-[#FFF7E2] leading-[1.1] flex items-center justify-center gap-2">
              <span>Maggie</span>
              <Sparkles className="w-4 h-4 text-[#FFE088] shrink-0" />
            </h3>
            <p className="font-playfair italic text-[15px] tracking-wide text-[#D4AF37]">
              The Golden Jubilee Edition
            </p>
          </div>

          {/* Modern Metallic Smart-Chip & Engraved Serial Plate */}
          <div className="relative z-10 mt-5 pt-3.5 border-t border-[#D4AF37]/25 flex items-center justify-between gap-3">
            <div className="flex flex-col text-left">
              <span className="font-mono-split text-[8.5px] tracking-[0.22em] text-[#b89f99] uppercase">
                PRIVATE ACCESS
              </span>
              <span className="font-mono-split text-[10.5px] font-bold tracking-[0.14em] text-[#F3E5AB] mt-0.5">
                CH. {age} · EST. 2026
              </span>
            </div>

            {/* Brushed-Gold Metallic Holographic Chip */}
            <div
              className="w-10 h-7 rounded-md p-[1px] bg-gradient-to-br from-[#fff2b8] via-[#d4af37] to-[#7d5a12] shadow-md shrink-0"
              aria-hidden="true"
            >
              <div className="w-full h-full rounded-[5px] bg-gradient-to-br from-[#e7c76b] via-[#c79c32] to-[#987219] relative overflow-hidden flex items-center justify-center">
                <div className="w-full h-[1px] bg-black/25 absolute top-1/2 -translate-y-1/2" />
                <div className="h-full w-[1px] bg-black/25 absolute left-1/3" />
                <div className="h-full w-[1px] bg-black/25 absolute right-1/3" />
                <div className="w-3.5 h-3.5 rounded-sm border border-black/30 bg-[#f5dc86]/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
