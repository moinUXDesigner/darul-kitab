import React from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { Play, Pause, X, ChevronUp, Crown } from 'lucide-react';
import { motion } from 'motion/react';

export function MiniPlayer({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { currentAyah, isPlaying, currentTime, duration, togglePlayPause, maximize, close } = useAudioPlayer();
  const { isPremium } = useAuth();

  if (!currentAyah) return null;

  const isLocked = currentAyah.isPremium && !isPremium;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Album Art / Artwork */}
          <div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 cursor-pointer"
            onClick={maximize}
          >
            <span className="text-white text-sm">{currentAyah.surahNumber}</span>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={maximize}>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="truncate text-sm">{currentAyah.surahName}</h4>
              {isLocked && <Crown className="w-3 h-3 text-accent flex-shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              Ayah {currentAyah.ayahNumber} • {currentAyah.reciter}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              disabled={isLocked}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={maximize}
              className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            <button
              onClick={close}
              className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {isLocked && (
          <div className="mt-2">
            <button
              onClick={() => onNavigate('subscription')}
              className="w-full py-2 bg-accent/10 text-accent rounded-lg text-xs hover:bg-accent/20 transition-colors"
            >
              Unlock with Premium
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
