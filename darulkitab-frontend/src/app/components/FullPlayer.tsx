import React, { useEffect, useState } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle,
  ChevronDown, Heart, X, Download, Clock, Crown, Loader2, CheckCircle2, RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';

const DEFAULT_RECITER_NAME = 'Moula Muft Amir Khan Quasmi';

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
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [actionLoading, setActionLoading] = useState<'complete' | 'reset' | null>(null);
  const [sleepTimerEndAt, setSleepTimerEndAt] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 390,
    height: typeof window !== 'undefined' ? window.innerHeight : 844,
  }));

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSleepTimer = (seconds: number) => {
    if (seconds <= 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

    return minutes > 0 ? `${minutes}m` : `${secs}s`;
  };

  useEffect(() => {
    if (sleepTimerEndAt === null) {
      setSleepTimerRemaining(null);
      return;
    }

    const updateRemaining = () => {
      const nextRemaining = Math.max(0, Math.ceil((sleepTimerEndAt - Date.now()) / 1000));

      if (nextRemaining <= 0) {
        setSleepTimerEndAt(null);
        setSleepTimerRemaining(null);
        setShowTimerMenu(false);

        if (isPlaying) {
          togglePlayPause();
        }
        return;
      }

      setSleepTimerRemaining(nextRemaining);
    };

    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 1000);

    return () => window.clearInterval(intervalId);
  }, [sleepTimerEndAt, isPlaying, togglePlayPause]);

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
  const remainingTime = duration > 0 ? Math.max(duration - currentTime, 0) : 0;
  const displayReciter = currentAyah.reciter || DEFAULT_RECITER_NAME;
  const ayahLabel = `Ayah ${currentAyah.ayahNumber}${currentAyah.ayahEnd ? `-${currentAyah.ayahEnd}` : ''}`;
  const arabicDisplay = currentAyah.arabicText || currentAyah.surahNameArabic || 'Quran Audio';
  const hasSleepTimer = sleepTimerRemaining !== null && sleepTimerRemaining > 0;
  const sleepTimerOptions = [
    { label: '10 min', seconds: 10 * 60 },
    { label: '20 min', seconds: 20 * 60 },
    { label: '30 min', seconds: 30 * 60 },
    { label: '45 min', seconds: 45 * 60 },
  ];
  const isCompactViewport = viewportSize.height < 860 || viewportSize.width < 390;
  const isVeryCompactViewport = viewportSize.height < 760 || viewportSize.width < 370;
  const shellPaddingClass = isVeryCompactViewport ? 'px-3 pb-4 pt-2' : isCompactViewport ? 'px-4 pb-5 pt-2.5' : 'px-4 pb-8 pt-3 sm:px-6';
  const heroPaddingClass = isVeryCompactViewport ? 'p-4' : isCompactViewport ? 'p-5' : 'p-6';
  const heroMinHeightClass = isVeryCompactViewport ? 'min-h-[11.75rem]' : isCompactViewport ? 'min-h-[14rem]' : 'min-h-[18rem]';
  const titleClass = isVeryCompactViewport ? 'mt-2 text-2xl font-semibold tracking-tight' : 'mt-3 text-3xl font-semibold tracking-tight';
  const arabicClass = isVeryCompactViewport ? 'mt-3 px-2 text-center text-2xl leading-[1.7]' : isCompactViewport ? 'mt-4 px-2 text-center text-[2rem] leading-[1.8]' : 'mt-5 px-2 text-center text-3xl leading-[1.9]';
  const sectionSpacingClass = isVeryCompactViewport ? 'mt-4' : isCompactViewport ? 'mt-5' : 'mt-8';
  const controlGapClass = isVeryCompactViewport ? 'gap-2.5' : 'gap-4';
  const primaryControlClass = isVeryCompactViewport ? 'h-16 w-16' : isCompactViewport ? 'h-[4.5rem] w-[4.5rem]' : 'h-20 w-20';
  const secondaryControlClass = isVeryCompactViewport ? 'h-10 w-10' : 'h-12 w-12';
  const tertiaryControlClass = isVeryCompactViewport ? 'h-9 w-9' : 'h-11 w-11';
  const premiumCardPaddingClass = isVeryCompactViewport ? 'p-4' : isCompactViewport ? 'p-5' : 'p-6';

  const startSleepTimer = (seconds: number) => {
    setSleepTimerEndAt(Date.now() + seconds * 1000);
    setSleepTimerRemaining(seconds);
    setShowTimerMenu(false);
  };

  const clearSleepTimer = () => {
    setSleepTimerEndAt(null);
    setSleepTimerRemaining(null);
    setShowTimerMenu(false);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 overflow-hidden bg-background"
    >
      <div className="h-dvh bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_22%)]">
        <div className={`mx-auto flex h-full w-full max-w-2xl flex-col ${shellPaddingClass}`}>
          <div className="mb-3 flex justify-center">
            <div className="h-1.5 w-16 rounded-full bg-foreground/15" />
          </div>

          <div className="flex items-center justify-between pb-4">
            <button
              onClick={minimize}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-muted"
              aria-label="Minimize player"
            >
              <ChevronDown className="h-6 w-6" />
            </button>
            <div className="min-w-0 flex-1 px-3 text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Now Playing</p>
              <h3 className="truncate text-sm font-medium text-foreground">{displayReciter}</h3>
            </div>
            <button
              onClick={close}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-muted"
              aria-label="Close player"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 min-h-0 flex-col">
            <div className="mx-auto flex h-full w-full max-w-md flex-col justify-between">
              <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 text-white shadow-[0_28px_60px_-28px_rgba(5,150,105,0.65)] ${heroPaddingClass}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.24),_transparent_28%)]" />
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

                {isLocked && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35 backdrop-blur-sm">
                    <div className="px-6 text-center">
                      <Crown className="mx-auto mb-4 h-14 w-14" />
                      <p className="text-lg font-semibold">Premium Content</p>
                    </div>
                  </div>
                )}

                <div className={`relative z-0 flex flex-col justify-between ${heroMinHeightClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/90">
                      Quran Fahmi
                    </div>
                    <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                      {ayahLabel}
                    </div>
                  </div>

                  <div className="py-8 text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/75">Surah</p>
                    <h2 className={titleClass}>{currentAyah.surahName}</h2>
                    <p className={arabicClass} style={{ fontFamily: 'var(--font-family-arabic)' }}>
                      {arabicDisplay}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-white/85">
                    <span>{displayReciter}</span>
                    {isBuffering && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Buffering
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isLocked ? (
                <div className={`${sectionSpacingClass} rounded-[2rem] border border-accent/25 bg-card/95 text-center shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] ${premiumCardPaddingClass}`}>
                  <div className={`mx-auto mb-3 flex items-center justify-center rounded-full bg-accent/15 text-accent ${isVeryCompactViewport ? 'h-12 w-12' : 'h-14 w-14'}`}>
                    <Crown className={isVeryCompactViewport ? 'h-6 w-6' : 'h-7 w-7'} />
                  </div>
                  <h3 className={isVeryCompactViewport ? 'text-xl font-semibold' : 'text-2xl font-semibold'}>Premium recitation</h3>
                  <p className={`mt-2 text-muted-foreground ${isVeryCompactViewport ? 'text-xs leading-5' : 'text-sm leading-6'}`}>
                    This track is part of the premium library. Subscribe to unlock playback, all reciters, and secure checkout.
                  </p>
                  <div className={`flex flex-col gap-3 ${isVeryCompactViewport ? 'mt-4' : 'mt-6'} sm:flex-row`}>
                    <button
                      onClick={() => onNavigate('subscription')}
                      className={`flex-1 rounded-2xl bg-accent font-medium text-accent-foreground transition-colors hover:bg-accent/90 ${isVeryCompactViewport ? 'px-4 py-2.5' : 'px-5 py-3'}`}
                    >
                      Subscribe and Pay
                    </button>
                    <button
                      onClick={close}
                      className={`rounded-2xl border border-border text-sm transition-colors hover:bg-muted ${isVeryCompactViewport ? 'px-4 py-2.5' : 'px-5 py-3'}`}
                    >
                      Close Player
                    </button>
                  </div>
                  <p className={`text-muted-foreground ${isVeryCompactViewport ? 'mt-2 text-[11px]' : 'mt-3 text-xs'}`}>Secure payment powered by Razorpay</p>
                </div>
              ) : (
                <>
                  <div className={isVeryCompactViewport ? 'mt-4' : 'mt-7'}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{currentAyah.surahName}</p>
                        <p className="truncate text-muted-foreground">{ayahLabel}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className={isVeryCompactViewport ? 'relative h-5' : 'relative h-6'}>
                        <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div
                          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(16,185,129,0.14)] transition-all ${isVeryCompactViewport ? 'h-4 w-4' : 'h-5 w-5'}`}
                          style={{ left: `calc(${progressPercent}% - ${isVeryCompactViewport ? 8 : 10}px)` }}
                        />
                        <input
                          type="range"
                          min={0}
                          max={duration > 0 ? duration : 0}
                          step={1}
                          value={Math.min(currentTime, duration || currentTime)}
                          onChange={(e) => seek(Number(e.target.value))}
                          disabled={duration <= 0}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                          aria-label="Seek audio"
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
                          {Math.round(progressPercent)}%
                        </span>
                        <span>-{formatTime(remainingTime)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-center ${sectionSpacingClass} ${controlGapClass}`}>
                    <button className={`flex items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${tertiaryControlClass}`}>
                      <Shuffle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={skipPrevious}
                      className={`flex items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:bg-muted ${secondaryControlClass}`}
                    >
                      <SkipBack className="h-6 w-6" />
                    </button>
                    <button
                      onClick={togglePlayPause}
                      className={`flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_24px_40px_-18px_rgba(16,185,129,0.8)] transition-colors hover:bg-primary/90 ${primaryControlClass}`}
                    >
                      {isBuffering ? (
                        <Loader2 className="h-9 w-9 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-9 w-9" />
                      ) : (
                        <Play className="ml-1 h-9 w-9" />
                      )}
                    </button>
                    <button
                      onClick={skipNext}
                      disabled={queueIndex >= queue.length - 1}
                      className={`flex items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:bg-muted disabled:opacity-50 ${secondaryControlClass}`}
                    >
                      <SkipForward className="h-6 w-6" />
                    </button>
                    <button className={`flex items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${tertiaryControlClass}`}>
                      <Repeat className="h-5 w-5" />
                    </button>
                  </div>

                  <div className={`relative flex items-center justify-center text-muted-foreground ${sectionSpacingClass} ${isVeryCompactViewport ? 'gap-3' : 'gap-5'}`}>
                    <button
                      className="relative inline-flex min-w-[2.75rem] items-center justify-center rounded-full border border-border bg-background/80 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() => {
                        setShowSpeedMenu(!showSpeedMenu);
                        setShowTimerMenu(false);
                      }}
                    >
                      {playbackSpeed}x
                      {showSpeedMenu && (
                        <div className="absolute bottom-full left-1/2 z-20 mb-3 min-w-[88px] -translate-x-1/2 rounded-2xl border border-border bg-card p-2 shadow-xl">
                          {speeds.map((speed) => (
                            <button
                              key={speed}
                              onClick={() => {
                                setSpeed(speed);
                                setShowSpeedMenu(false);
                              }}
                              className={`w-full rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted ${
                                playbackSpeed === speed ? 'text-primary' : 'text-foreground'
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
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTrackAction('complete')}
                      disabled={actionLoading !== null}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 transition-colors hover:bg-muted hover:text-green-700 disabled:opacity-60"
                      aria-label="Mark track as complete"
                    >
                      {actionLoading === 'complete' ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTrackAction('reset')}
                      disabled={actionLoading !== null || !canReset}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
                      aria-label="Reset track progress"
                    >
                      {actionLoading === 'reset' ? <Loader2 className="h-5 w-5 animate-spin" /> : <RotateCcw className="h-5 w-5" />}
                    </button>
                    <button
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                      disabled={!isPremium}
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isPremium) {
                            onNavigate('subscription');
                            return;
                          }
                          setShowTimerMenu(!showTimerMenu);
                          setShowSpeedMenu(false);
                        }}
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                          hasSleepTimer
                            ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
                            : 'border-border bg-background/80 hover:bg-muted hover:text-foreground'
                        }`}
                        aria-label={hasSleepTimer ? `Sleep timer active: ${formatSleepTimer(sleepTimerRemaining ?? 0)} remaining` : 'Sleep timer'}
                      >
                        <Clock className="h-5 w-5" />
                        {!isPremium && <Crown className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-background text-amber-500" />}
                      </button>
                      {showTimerMenu && isPremium && (
                        <div className="absolute bottom-full right-0 z-20 mb-3 w-52 rounded-3xl border border-border bg-card p-3 text-left text-foreground shadow-xl">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">Sleep timer</p>
                              <p className="text-xs text-muted-foreground">
                                {hasSleepTimer ? `Stops in ${formatSleepTimer(sleepTimerRemaining ?? 0)}` : 'Pause playback automatically'}
                              </p>
                            </div>
                            {hasSleepTimer && (
                              <button
                                type="button"
                                onClick={clearSleepTimer}
                                className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {sleepTimerOptions.map((option) => (
                              <button
                                key={option.label}
                                type="button"
                                onClick={() => startSleepTimer(option.seconds)}
                                className="rounded-2xl border border-border px-3 py-2 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                              >
                                {option.label}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => startSleepTimer(Math.max(Math.ceil(remainingTime), 1))}
                              className="col-span-2 rounded-2xl border border-border px-3 py-2 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                            >
                              End of track
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
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
