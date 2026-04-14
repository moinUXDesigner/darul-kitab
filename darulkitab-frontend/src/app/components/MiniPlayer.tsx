import React from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { Play, Pause, X, ChevronUp, Crown, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const DEFAULT_RECITER_NAME = 'Moula Muft Amir Khan Quasmi';

export function MiniPlayer({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { currentAyah, isPlaying, isBuffering, currentTime, duration, togglePlayPause, maximize, close } = useAudioPlayer();
  const { isPremium } = useAuth();

  if (!currentAyah) return null;

  const isLocked = !isPremium && (
    currentAyah.isPremium === true ||
    (typeof currentAyah.surahNumber === 'number' && currentAyah.surahNumber !== 1)
  );

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-[72px] md:bottom-0 left-0 right-0 bg-card border-t border-border z-40"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5">
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
              Ayah {currentAyah.ayahNumber}{currentAyah.ayahEnd ? `–${currentAyah.ayahEnd}` : ''} • {currentAyah.reciter}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {isLocked ? (
              <button
                onClick={() => onNavigate('subscription')}
                className="px-3 h-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors flex items-center justify-center text-xs font-medium"
              >
                Pay for Premium
              </button>
            ) : (
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                {isBuffering ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>
            )}

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
          <div className="mt-2 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2">
            <p className="text-[11px] text-muted-foreground text-center">
              Premium content. Subscribe to unlock playback with secure Razorpay payment.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
