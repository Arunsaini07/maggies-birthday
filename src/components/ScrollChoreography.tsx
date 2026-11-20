import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'motion/react';
import { Heart } from 'lucide-react';

export const EDITORIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Lightweight visibility hook so off-screen CSS loops & timers pause automatically
 * and never burn GPU/CPU frames while scrolling elsewhere.
 */
export function useInViewport<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '120px'
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div
      className="fixed top-16 left-0 right-0 h-[2px] z-30 pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
        className="w-full h-full bg-gradient-to-r from-[#871321] via-[#D4AF37] to-[#C41E3A]"
      />
    </div>
  );
};

interface EditorialRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export const EditorialReveal: React.FC<EditorialRevealProps> = ({
  children,
  className = '',
  delay = 0,
  yOffset = 14,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.42,
        delay,
        ease: EDITORIAL_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const EditorialDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`max-w-5xl mx-auto px-6 ${className}`} aria-hidden="true">
      <div className="relative flex items-center justify-center py-3">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/65 to-transparent" />
        <span className="absolute px-2.5 bg-[#fcf9f3] dark:bg-[#120609] flex items-center justify-center transition-colors duration-300">
          <Heart className="w-3.5 h-3.5 text-[#C41E3A] fill-[#C41E3A]/85" />
        </span>
      </div>
    </div>
  );
};

interface ParallaxBackdropProps {
  src: string;
  alt: string;
  className?: string;
}

export const ParallaxBackdrop: React.FC<ParallaxBackdropProps> = ({
  src,
  alt,
  className = '',
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        decoding="async"
        fetchPriority="high"
        className={`w-full h-full object-cover opacity-35 ${className}`}
      />
    </div>
  );
};

interface RomanticAmbienceProps {
  variant?: 'hero' | 'letter';
}

const HERO_MOTES = [
  { left: '12%', bottom: '12%', duration: '10s', delay: '0s', size: 11, kind: 'heart' as const },
  { left: '26%', bottom: '10%', duration: '11.5s', delay: '1.6s', size: 7, kind: 'mote' as const },
  { left: '50%', bottom: '16%', duration: '10s', delay: '2.8s', size: 10, kind: 'heart' as const },
  { left: '74%', bottom: '12%', duration: '11s', delay: '1.1s', size: 11, kind: 'heart' as const },
  { left: '88%', bottom: '18%', duration: '12s', delay: '3.6s', size: 7, kind: 'mote' as const },
];

const LETTER_MOTES = [
  { left: '12%', bottom: '14%', duration: '9.5s', delay: '0.3s', size: 10, kind: 'heart' as const },
  { left: '32%', bottom: '10%', duration: '11s', delay: '2.1s', size: 6, kind: 'mote' as const },
  { left: '72%', bottom: '10%', duration: '10s', delay: '1.1s', size: 10, kind: 'heart' as const },
  { left: '88%', bottom: '16%', duration: '11.5s', delay: '3.2s', size: 6, kind: 'mote' as const },
];

export const RomanticAmbience: React.FC<RomanticAmbienceProps> = ({ variant = 'hero' }) => {
  const [containerRef, isVisible] = useInViewport<HTMLDivElement>('80px');
  const items = variant === 'hero' ? HERO_MOTES : LETTER_MOTES;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"
      aria-hidden="true"
    >
      {items.map((item, idx) => (
        <span
          key={idx}
          className="absolute animate-romantic-float"
          style={{
            left: item.left,
            bottom: item.bottom,
            ['--float-duration' as string]: item.duration,
            ['--float-delay' as string]: item.delay,
            animationPlayState: isVisible ? 'running' : 'paused',
          }}
        >
          {item.kind === 'heart' ? (
            <Heart
              style={{ width: item.size, height: item.size }}
              className={
                variant === 'hero'
                  ? 'text-[#F3E5AB]/55 fill-[#C41E3A]/45'
                  : 'text-[#C41E3A]/45 fill-[#C41E3A]/30'
              }
            />
          ) : (
            <span
              style={{ width: item.size, height: item.size }}
              className="block rounded-full bg-[#D4AF37]/45"
            />
          )}
        </span>
      ))}
    </div>
  );
};
