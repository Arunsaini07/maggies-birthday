import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { EDITORIAL_EASE, useInViewport } from './ScrollChoreography.tsx';

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export const CountdownFlipClock: React.FC<CountdownProps> = ({ targetDate }) => {
  const [containerRef, isVisible] = useInViewport<HTMLDivElement>('80px');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPassed: false,
      });
    };

    calculateTime();
    if (!isVisible) return;

    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, isVisible]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const units = [
    { label: 'DAYS', value: pad(timeLeft.days) },
    { label: 'HOURS', value: pad(timeLeft.hours) },
    { label: 'MINUTES', value: pad(timeLeft.minutes) },
    { label: 'SECONDS', value: pad(timeLeft.seconds) },
  ];

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col items-center">
      {/* Editorial Timepiece Nameplate */}
      <div className="flex items-center justify-center gap-3 mb-5 w-full">
        <span className="hidden sm:block w-10 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/70" />
        <div className="text-[10px] sm:text-[11px] font-mono-split font-bold uppercase tracking-[0.26em] text-[#F3E5AB] flex items-center gap-2">
          <Heart
            className="w-3 h-3 text-[#C41E3A] fill-[#C41E3A] animate-heartbeat-gentle"
            style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
          />
          <span>KEEPSAKE COUNTDOWN</span>
          <span className="text-[#D4AF37] text-[8px]">◆</span>
          <span className="text-[#e6ca65]">
            {timeLeft.isPassed ? "IT'S HER SPECIAL DAY!" : 'AWAITING CELEBRATION'}
          </span>
        </div>
        <span className="hidden sm:block w-10 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/70" />
      </div>

      {/* Chronograph Flip Units */}
      <div className="flex items-center gap-2 sm:gap-3.5 md:gap-4">
        {units.map((unit, idx) => {
          const isSeconds = unit.label === 'SECONDS';
          return (
            <React.Fragment key={unit.label}>
              <div className="group flex flex-col items-center">
                {/* Outer Metallic Brass Bezel */}
                <div
                  className={`p-[1.5px] rounded-xl transition-transform duration-200 ease-out group-hover:-translate-y-0.5 ${
                    isSeconds
                      ? 'bg-gradient-to-b from-[#FFE088]/80 via-[#D4AF37]/45 to-[#871321]/70 shadow-[0_10px_24px_rgba(196,30,58,0.22)]'
                      : 'bg-gradient-to-b from-[#D4AF37]/55 via-[#D4AF37]/20 to-[#590A14]/60 shadow-[0_10px_24px_rgba(0,0,0,0.45)]'
                  }`}
                >
                  {/* Split Flap Drum Module */}
                  <div className="relative w-16 sm:w-20 md:w-24 h-20 sm:h-24 md:h-28 bg-gradient-to-b from-[#1e1719] via-[#130e10] to-[#191214] rounded-[10.5px] overflow-hidden flex flex-col justify-center items-center">
                    {/* Upper plate subtle luminance */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none z-10" />
                    {/* Lower plate subtle depth */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent pointer-events-none z-10" />

                    {/* Mechanical Center Hinge Seam & Twin Brass Pins */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-black/85 z-20 border-b border-white/10" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3 rounded-r-sm bg-gradient-to-b from-[#FFE088]/70 to-[#8c6b1f]/80 z-30" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3 rounded-l-sm bg-gradient-to-b from-[#FFE088]/70 to-[#8c6b1f]/80 z-30" />

                    {/* Smooth Mechanical Digit Transition */}
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={unit.value}
                        initial={{ opacity: 0, y: -9 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 9 }}
                        transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
                        className={`font-bodoni font-bold text-3xl sm:text-4xl md:text-[3.1rem] tracking-tight relative z-0 tabular-nums leading-none [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] ${
                          isSeconds ? 'text-[#F3E5AB]' : 'text-[#FAF6F0]'
                        }`}
                      >
                        {unit.value}
                      </motion.span>
                    </AnimatePresence>

                    {/* Precision Brass Corner Rivets */}
                    <div className="absolute top-1.5 left-2 w-1 h-1 rounded-full bg-[#D4AF37]/45" />
                    <div className="absolute top-1.5 right-2 w-1 h-1 rounded-full bg-[#D4AF37]/45" />
                    <div className="absolute bottom-1.5 left-2 w-1 h-1 rounded-full bg-[#D4AF37]/45" />
                    <div className="absolute bottom-1.5 right-2 w-1 h-1 rounded-full bg-[#D4AF37]/45" />
                  </div>
                </div>

                {/* Engraved Unit Label */}
                <span
                  className={`font-mono-split text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.24em] mt-2.5 flex items-center gap-1.5 ${
                    isSeconds ? 'text-[#F3E5AB]' : 'text-stone-300/90'
                  }`}
                >
                  {isSeconds && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] inline-block" />
                  )}
                  <span>{unit.label}</span>
                </span>
              </div>

              {idx < units.length - 1 && (
                <div
                  className="hidden sm:flex flex-col items-center justify-center gap-2.5 self-center -mt-6 px-0.5"
                  aria-hidden="true"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.65)]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/75 shadow-[0_0_6px_rgba(212,175,55,0.45)]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
