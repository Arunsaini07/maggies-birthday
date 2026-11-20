import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music2 } from 'lucide-react';
import { musicPlayer } from '../utils/audio.ts';
import { EDITORIAL_EASE } from './ScrollChoreography.tsx';

interface VinylMusicPlayerProps {
  title?: string;
  artist?: string;
}

export const VinylMusicPlayer: React.FC<VinylMusicPlayerProps> = ({
  title = "L'Amour & La Nuit (Vintage Waltz)",
  artist = 'Acoustic Keepsake Ensemble',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      musicPlayer.pause();
      setIsPlaying(false);
    } else {
      musicPlayer.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
    musicPlayer.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      musicPlayer.setVolume(volume);
    } else {
      setIsMuted(true);
      musicPlayer.setVolume(0);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Controls Card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.24, ease: EDITORIAL_EASE }}
            className="mb-3 w-72 bg-[#1A1A1A]/96 text-white p-4 rounded-2xl shadow-2xl border border-[#D4AF37]/50"
          >
            <div className="flex items-center gap-3">
              {/* Spinning Vinyl Record */}
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-950 border-2 border-[#D4AF37]/60 shadow-lg flex items-center justify-center relative overflow-hidden flex-shrink-0 ${
                  isPlaying ? 'animate-spin [animation-duration:4s]' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full border border-white/10" />
                <div className="w-6 h-6 rounded-full border border-white/10" />
                <div className="w-4 h-4 rounded-full bg-[#D4AF37] border border-black flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-black" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono-split font-bold text-[#D4AF37] uppercase tracking-wider truncate">
                  {title}
                </p>
                <p className="text-[11px] text-stone-400 truncate">
                  {artist}
                </p>
                {/* Bouncing Audio Visualizer */}
                <div className="flex items-end gap-1 h-3 mt-1.5">
                  {[40, 80, 60, 100, 50, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-[#C41E3A] rounded-full transition-transform duration-200 ${
                        isPlaying ? 'animate-pulse' : ''
                      }`}
                      style={{
                        height: isPlaying ? `${h}%` : '20%',
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <button onClick={toggleMute} className="text-stone-400 hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-[#871321] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Pill Dock Toggle */}
      <div className="flex items-center gap-2 bg-[#1A1A1A]/96 p-2 pl-3 rounded-full shadow-2xl border border-[#D4AF37]/50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs font-mono-split text-[#F9F6F0] pr-1 hover:text-[#D4AF37] transition-colors"
          title="Toggle Track Info"
        >
          <Music2 className={`w-4 h-4 text-[#D4AF37] ${isPlaying ? 'animate-heartbeat-gentle' : ''}`} />
          <span className="hidden sm:inline font-bold tracking-wider">
            {isPlaying ? 'PLAYING SOUNDTRACK' : 'BIRTHDAY MUSIC'}
          </span>
        </button>

        {/* Play / Pause Primary Action */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#871321] hover:bg-[#630011] text-white flex items-center justify-center transition-transform duration-200 shadow-md border border-[#D4AF37]/60 hover:scale-105 active:scale-95"
          title={isPlaying ? 'Pause Music' : 'Play Romantic Birthday Music'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>
      </div>
    </div>
  );
};
