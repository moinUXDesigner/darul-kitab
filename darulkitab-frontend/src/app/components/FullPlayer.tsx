import React, { useState, useRef } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle,
  ChevronDown, Heart, X, Download, Clock, Languages, Crown, Loader2, CheckCircle2, RotateCcw
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
    markTrackComplete,
    resetTrackProgress,
  } = useAudioPlayer();

  const { isPremium } = useAuth();
  const [showTranslation, setShowTranslation] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [actionLoading, setActionLoading] = useState<'complete' | 'reset' | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(percent * duration);
  };

  const handleTrackAction = async (action: 'complete' | 'reset') => {
    setActionLoading(action);

    try {
      if (action === 'complete') {
        await markTrackComplete();
      } else {
        await resetTrackProgress();
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (!currentAyah || isMinimized) return null;

  const isLocked = !isPremium && (
    currentAyah.isPremium === true ||
    (typeof currentAyah.surahNumber === 'number' && currentAyah.surahNumber !== 1)
  );
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const canReset = currentTime > 0 || duration > 0;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-background"
    >
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-between border-b border-border p-4">
          <button
            onClick={minimize}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
          <div className="flex-1 text-center">
            <h3 className="text-sm">Now Playing</h3>
            <p className="text-xs text-muted-foreground">{currentAyah.reciter}</p>
          </div>
          <button
            onClick={close}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary shadow-2xl">
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="text-center text-white">
                      <Crown className="mx-auto mb-4 h-16 w-16" />
                      <p className="mb-4 text-lg">Premium Content</p>
                      <button
                        onClick={() => onNavigate('subscription')}
                        className="rounded-full bg-accent px-6 py-3 text-accent-foreground transition-colors hover:bg-accent/90"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                  <h2 className="mb-2 text-center text-3xl font-bold">{currentAyah.surahName}</h2>
                  <p style={{ fontFamily: 'var(--font-family-arabic)' }} className="text-center text-3xl">
                    {currentAyah.surahNameArabic}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                <h3 className="text-sm text-muted-foreground">Now Playing</h3>
                <p className="mt-1 text-lg font-semibold">{currentAyah.surahName}</p>
                <p className="mt-1 text-sm" style={{ fontFamily: 'var(--font-family-arabic)' }}>
                  {currentAyah.arabicText || 'Ayah'}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Reciter: {currentAyah.reciter || 'Unknown'}
                </p>
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              <div className="mb-6">
                <div className="mb-4 text-center">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
                    <span>Ayah {currentAyah.ayahNumber}{currentAyah.ayahEnd ? `-${currentAyah.ayahEnd}` : ''}</span>
                  </div>
                </div>

                <div className="mb-6 px-4 text-center" style={{ fontFamily: 'var(--font-family-arabic)', lineHeight: 2 }}>
                  <p className="text-2xl md:text-3xl">{currentAyah.arabicText}</p>
                </div>

                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="mx-auto mb-4 flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Languages className="h-4 w-4" />
                  {showTranslation ? 'Hide' : 'Show'} Translation
                </button>

                {showTranslation && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 text-center">
                    <p className="italic text-muted-foreground">"{currentAyah.translation}"</p>
                  </motion.div>
                )}
              </div>

              {isLocked ? (
                <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6 text-center md:p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Crown className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-2xl">Premium recitation</h3>
                  <p className="mx-auto max-w-xl text-muted-foreground">
                    This ayah is part of the premium library. Subscribe to unlock playback, all reciters, and secure Razorpay checkout.
                  </p>
                  <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                      onClick={() => onNavigate('subscription')}
                      className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                    >
                      Subscribe and Pay
                    </button>
                    <button
                      onClick={close}
                      className="rounded-full border border-border px-6 py-3 transition-colors hover:bg-muted"
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
                  <div className="mb-6">
                    <div
                      ref={progressBarRef}
                      className="group relative mb-2 h-2 cursor-pointer rounded-full bg-muted"
                      onClick={handleSeek}
                    >
                      <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
                      <div
                        className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                        style={{ left: `calc(${progressPercent}% - 8px)` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="mb-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleTrackAction('complete')}
                      disabled={actionLoading !== null}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-500/25 bg-green-500/8 px-4 py-3 text-sm text-green-700 transition-colors hover:bg-green-500/14 disabled:opacity-60"
                    >
                      {actionLoading === 'complete' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Mark as complete
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTrackAction('reset')}
                      disabled={actionLoading !== null || !canReset}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
                    >
                      {actionLoading === 'reset' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                      Reset Track
                    </button>
                  </div>

                  <div className="mb-6 flex items-center justify-center gap-4">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted">
                      <Shuffle className="h-5 w-5" />
                    </button>

                    <button onClick={skipPrevious} className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-muted">
                      <SkipBack className="h-6 w-6" />
                    </button>

                    <button
                      onClick={togglePlayPause}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
                    >
                      {isBuffering ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="ml-1 h-8 w-8" />
                      )}
                    </button>

                    <button
                      onClick={skipNext}
                      disabled={queueIndex >= queue.length - 1}
                      className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      <SkipForward className="h-6 w-6" />
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted">
                      <Repeat className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
                    <button className="relative" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                      <div className="text-sm transition-colors hover:text-foreground">{playbackSpeed}x</div>
                      {showSpeedMenu && (
                        <div className="absolute bottom-full left-1/2 mb-2 min-w-[80px] -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-lg">
                          {speeds.map((speed) => (
                            <button
                              key={speed}
                              onClick={() => {
                                setSpeed(speed);
                                setShowSpeedMenu(false);
                              }}
                              className={`w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${playbackSpeed === speed ? 'text-primary' : ''}`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      )}
                    </button>

                    <button onClick={toggleFavorite} className="transition-colors hover:text-foreground">
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    <button className="transition-colors hover:text-foreground disabled:opacity-50" disabled={!isPremium}>
                      <Download className="h-5 w-5" />
                    </button>

                    <button className="transition-colors hover:text-foreground">
                      <Clock className="h-5 w-5" />
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
