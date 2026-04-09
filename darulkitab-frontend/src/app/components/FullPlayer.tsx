import React, { useState, useRef } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  ChevronDown, Heart, X, Download, Clock, Languages, Crown, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

export function FullPlayer({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { 
    currentAyah, 
    isPlaying,
    isBuffering,
    currentTime, 
    duration,
    playbackSpeed,
    queue,
    queueIndex,
    isFavorite,
    togglePlayPause, 
    setSpeed, 
    seek,
    skipNext,
    skipPrevious,
    minimize,
    close,
    isMinimized,
    toggleFavorite,
  } = useAudioPlayer();

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const { isPremium } = useAuth();
  const [showTranslation, setShowTranslation] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(percent * duration);
  };

  if (!currentAyah || isMinimized) return null;

  const isLocked = !isPremium && (
    currentAyah.isPremium === true ||
    (typeof currentAyah.surahNumber === 'number' && currentAyah.surahNumber !== 1)
  );
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-background z-50 overflow-y-auto"
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button
            onClick={minimize}
            className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          <div className="text-center flex-1">
            <h3 className="text-sm">Now Playing</h3>
            <p className="text-xs text-muted-foreground">{currentAyah.reciter}</p>
          </div>
          <button
            onClick={close}
            className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-6xl mx-auto w-full">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Artwork + meta (desktop left) */}
            <div className="w-full lg:w-1/3">
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary overflow-hidden shadow-2xl">
                {isLocked && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Crown className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg mb-4">Premium Content</p>
                      <button
                        onClick={() => onNavigate('subscription')}
                        className="px-6 py-3 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2 text-center">{currentAyah.surahName}</h2>
                  <p style={{ fontFamily: 'var(--font-family-arabic)' }} className="text-3xl text-center">
                    {currentAyah.surahNameArabic}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border p-4 bg-card">
                <h3 className="text-sm text-muted-foreground">Now Playing</h3>
                <p className="font-semibold text-lg mt-1">{currentAyah.surahName}</p>
                <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-family-arabic)' }}>
                  {currentAyah.arabicText || 'Ayah'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Reciter: {currentAyah.reciter || 'Unknown'}
                </p>
              </div>
            </div>

            {/* Player details + controls */}
            <div className="w-full lg:w-2/3">
              {/* Ayah Text */}
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm mb-6">
                    <span>Ayah {currentAyah.ayahNumber}{currentAyah.ayahEnd ? `–${currentAyah.ayahEnd}` : ''}</span>
                  </div>
                </div>

                <div 
                  className="text-center mb-6 px-4" 
                  style={{ fontFamily: 'var(--font-family-arabic)', lineHeight: 2 }}
                >
                  <p className="text-2xl md:text-3xl">{currentAyah.arabicText}</p>
                </div>

                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full hover:bg-muted transition-colors text-sm mb-4"
                >
                  <Languages className="w-4 h-4" />
                  {showTranslation ? 'Hide' : 'Show'} Translation
                </button>

                {showTranslation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-center px-4"
                  >
                    <p className="text-muted-foreground italic">"{currentAyah.translation}"</p>
                  </motion.div>
                )}
              </div>
              {isLocked ? (
                <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6 md:p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Crown className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl mb-2">Premium recitation</h3>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    This ayah is part of the premium library. Subscribe to unlock playback, all reciters, and secure Razorpay checkout.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => onNavigate('subscription')}
                      className="px-6 py-3 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium"
                    >
                      Subscribe and Pay
                    </button>
                    <button
                      onClick={close}
                      className="px-6 py-3 rounded-full border border-border hover:bg-muted transition-colors"
                    >
                      Close Player
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Secure payment powered by Razorpay
                  </p>
                </div>
              ) : (
                <>
                  {/* Progress Bar — interactive */}
                  <div className="mb-6">
                    <div
                      ref={progressBarRef}
                      className="relative h-2 bg-muted rounded-full mb-2 cursor-pointer group"
                      onClick={handleSeek}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-primary rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `calc(${progressPercent}% - 8px)` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center">
                      <Shuffle className="w-5 h-5" />
                    </button>

                    <button 
                      onClick={skipPrevious}
                      className="w-12 h-12 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <SkipBack className="w-6 h-6" />
                    </button>

                    <button
                      onClick={togglePlayPause}
                      className="w-16 h-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center shadow-lg"
                    >
                      {isBuffering ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="w-8 h-8" />
                      ) : (
                        <Play className="w-8 h-8 ml-1" />
                      )}
                    </button>

                    <button 
                      onClick={skipNext}
                      disabled={queueIndex >= queue.length - 1}
                      className="w-12 h-12 rounded-full hover:bg-muted transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      <SkipForward className="w-6 h-6" />
                    </button>

                    <button className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center">
                      <Repeat className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Additional Controls */}
                  <div className="flex items-center justify-center gap-6 text-muted-foreground">
                    <button 
                      className="relative"
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    >
                      <div className="text-sm hover:text-foreground transition-colors">
                        {playbackSpeed}x
                      </div>
                      {showSpeedMenu && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-xl shadow-lg p-2 min-w-[80px]">
                          {speeds.map(speed => (
                            <button
                              key={speed}
                              onClick={() => {
                                setSpeed(speed);
                                setShowSpeedMenu(false);
                              }}
                              className={`w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors ${
                                playbackSpeed === speed ? 'text-primary' : ''
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      )}
                    </button>

                    <button 
                      onClick={toggleFavorite}
                      className="hover:text-foreground transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    <button 
                      className="hover:text-foreground transition-colors disabled:opacity-50"
                      disabled={!isPremium}
                    >
                      <Download className="w-5 h-5" />
                    </button>

                    <button className="hover:text-foreground transition-colors">
                      <Clock className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
</motion.div>
  );
}
