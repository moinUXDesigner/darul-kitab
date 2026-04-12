import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

/* ================================
   TYPES
================================ */

export interface AyahData {
  id: string | number;
  surahNumber?: number;
  surahName?: string;
  surahNameArabic?: string;
  ayahNumber?: number;
  ayahEnd?: number;
  arabicText?: string;
  translation?: string;
  reciter?: string;
  title?: string;
  audioUrl: string;
  isPremium?: boolean;
}

interface AudioPlayerContextType {
  currentAyah: AyahData | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  isMinimized: boolean;
  queue: AyahData[];
  queueIndex: number;
  isFavorite: boolean;
  play: (ayah: AyahData) => void;
  playQueue: (ayahs: AyahData[], startIndex?: number) => void;
  pause: () => void;
  togglePlayPause: () => void;
  setSpeed: (speed: number) => void;
  seek: (time: number) => void;
  skipNext: () => void;
  skipPrevious: () => void;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  toggleFavorite: () => Promise<void>;
  markTrackComplete: (audioId?: string | number) => Promise<void>;
  resetTrackProgress: (audioId?: string | number) => Promise<void>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

/* ================================
   HELPERS
================================ */

const SAVE_INTERVAL_MS = 15_000; // auto-save every 15 seconds
const PROGRESS_UPDATED_EVENT = 'darulkitab-progress-updated';

function emitProgressUpdated(detail?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT, { detail }));
  }
}

function requiresPremiumAccess(ayah: AyahData | null | undefined): boolean {
  if (!ayah) return false;
  return ayah.isPremium === true || (typeof ayah.surahNumber === 'number' && ayah.surahNumber !== 1);
}

async function saveProgressToServer(audioId: string | number, position: number, dur: number) {
  try {
    await api.post('/user/save-progress.php', {
      audio_id: Number(audioId),
      position_seconds: position,
      duration_seconds: dur,
    });
    emitProgressUpdated({
      audioId: Number(audioId),
      positionSeconds: position,
      durationSeconds: dur,
    });
  } catch {
    // silent – progress save is best-effort
  }
}

async function getProgressFromServer(audioId: string | number): Promise<number> {
  try {
    const res = await api.get(`/user/get-progress.php?audio_id=${audioId}`);
    if (res.data && res.data.position_seconds > 0 && !res.data.completed) {
      return Number(res.data.position_seconds);
    }
  } catch {
    // silent
  }
  return 0;
}

/* ================================
   PROVIDER
================================ */

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const { isPremium } = useAuth();
  const [currentAyah, setCurrentAyah] = useState<AyahData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMinimized, setIsMinimized] = useState(true);
  const [queue, setQueue] = useState<AyahData[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isFavorite, setIsFavorite] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobFallbackAttempted = useRef<string | null>(null);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentAyahRef = useRef<AyahData | null>(null);
  const isPlayingRef = useRef(false);

  // Keep refs in sync for use in interval callbacks
  useEffect(() => { currentAyahRef.current = currentAyah; }, [currentAyah]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  /* ---- Save progress on interval ---- */
  const startAutoSave = useCallback(() => {
    stopAutoSave();
    saveIntervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      const ayah = currentAyahRef.current;
      if (audio && ayah && isPlayingRef.current && audio.currentTime > 0) {
        saveProgressToServer(ayah.id, audio.currentTime, audio.duration);
      }
    }, SAVE_INTERVAL_MS);
  }, []);

  const stopAutoSave = useCallback(() => {
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }
  }, []);

  /* ---- Save progress immediately (on pause/close/track change) ---- */
  const saveProgressNow = useCallback(() => {
    const audio = audioRef.current;
    const ayah = currentAyahRef.current;
    if (audio && ayah && audio.currentTime > 0) {
      saveProgressToServer(ayah.id, audio.currentTime, audio.duration);
    }
  }, []);

  /* ---- Check favorite status ---- */
  const checkFavorite = useCallback(async (audioId: string | number) => {
    try {
      const res = await api.get(`/user/favorites.php?audio_id=${audioId}`);
      setIsFavorite(res.data?.is_favorite === true);
    } catch {
      setIsFavorite(false);
    }
  }, []);

  /* ---- Toggle favorite ---- */
  const toggleFavorite = useCallback(async () => {
    const ayah = currentAyahRef.current;
    if (!ayah) return;
    try {
      if (isFavorite) {
        await api.delete(`/user/favorites.php?audio_id=${ayah.id}`);
        setIsFavorite(false);
      } else {
        await api.post('/user/favorites.php', { audio_id: Number(ayah.id) });
        setIsFavorite(true);
      }
    } catch {
      // silent
    }
  }, [isFavorite]);

  const markTrackComplete = useCallback(async (audioId?: string | number) => {
    const targetId = audioId ?? currentAyahRef.current?.id;
    if (!targetId) return;

    const audio = audioRef.current;
    const isCurrentTrack = currentAyahRef.current?.id === targetId;
    const effectiveDuration = isCurrentTrack
      ? Number(audio?.duration || duration || currentTime || 0)
      : 0;

    try {
      await api.post('/user/save-progress.php', {
        audio_id: Number(targetId),
        duration_seconds: effectiveDuration,
        mark_complete: true,
      });

      if (isCurrentTrack && audio) {
        const nextDuration = effectiveDuration || audio.duration || 0;
        if (nextDuration > 0) {
          audio.currentTime = nextDuration;
          setCurrentTime(nextDuration);
          setDuration(nextDuration);
        }
        setIsPlaying(false);
      }

      emitProgressUpdated({
        audioId: Number(targetId),
        completed: true,
      });
    } catch {
      // silent
    }
  }, [currentTime, duration]);

  const resetTrackProgress = useCallback(async (audioId?: string | number) => {
    const targetId = audioId ?? currentAyahRef.current?.id;
    if (!targetId) return;

    const audio = audioRef.current;
    const isCurrentTrack = currentAyahRef.current?.id === targetId;
    const effectiveDuration = isCurrentTrack
      ? Number(audio?.duration || duration || 0)
      : 0;

    try {
      await api.post('/user/save-progress.php', {
        audio_id: Number(targetId),
        duration_seconds: effectiveDuration,
        reset: true,
      });

      if (isCurrentTrack && audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }

      emitProgressUpdated({
        audioId: Number(targetId),
        reset: true,
      });
    } catch {
      // silent
    }
  }, [duration]);

  /* ---- Play single track ---- */
  const play = useCallback((ayah: AyahData) => {
    saveProgressNow(); // save current track progress before switching
    const normalizedAyah = {
      ...ayah,
      isPremium: requiresPremiumAccess(ayah),
    };
    const isLocked = normalizedAyah.isPremium && !isPremium;
    setQueue([normalizedAyah]);
    setQueueIndex(0);
    setCurrentAyah(normalizedAyah);
    setIsPlaying(!isLocked);
    setIsMinimized(false);
  }, [isPremium, saveProgressNow]);

  /* ---- Play a queue of tracks ---- */
  const playQueue = useCallback((ayahs: AyahData[], startIndex = 0) => {
    if (ayahs.length === 0) return;
    saveProgressNow();
    const normalizedQueue = ayahs.map((ayah) => ({
      ...ayah,
      isPremium: requiresPremiumAccess(ayah),
    }));
    const startingAyah = normalizedQueue[startIndex];
    const isLocked = requiresPremiumAccess(startingAyah) && !isPremium;
    setQueue(normalizedQueue);
    setQueueIndex(startIndex);
    setCurrentAyah(startingAyah);
    setIsPlaying(!isLocked);
    setIsMinimized(false);
  }, [isPremium, saveProgressNow]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    saveProgressNow();
  }, [saveProgressNow]);

  const togglePlayPause = useCallback(() => {
    if (requiresPremiumAccess(currentAyahRef.current) && !isPremium) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(prev => {
      if (prev) saveProgressNow(); // save when pausing
      return !prev;
    });
  }, [isPremium, saveProgressNow]);

  const setSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  }, []);

  const skipNext = useCallback(() => {
    saveProgressNow();
    setQueueIndex(prev => {
      const next = prev + 1;
      if (next < queue.length) {
        const nextAyah = queue[next];
        setCurrentAyah(nextAyah);
        setIsPlaying(!(requiresPremiumAccess(nextAyah) && !isPremium));
        return next;
      }
      // End of queue
      setIsPlaying(false);
      return prev;
    });
  }, [isPremium, queue, saveProgressNow]);

  const skipPrevious = useCallback(() => {
    const audio = audioRef.current;
    // If more than 3 seconds in, restart current track
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    saveProgressNow();
    setQueueIndex(prev => {
      const prevIdx = prev - 1;
      if (prevIdx >= 0) {
        const previousAyah = queue[prevIdx];
        setCurrentAyah(previousAyah);
        setIsPlaying(!(requiresPremiumAccess(previousAyah) && !isPremium));
        return prevIdx;
      }
      // At start – restart current track
      if (audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      return prev;
    });
  }, [isPremium, queue, saveProgressNow]);

  const minimize = useCallback(() => setIsMinimized(true), []);
  const maximize = useCallback(() => setIsMinimized(false), []);

  const close = useCallback(() => {
    saveProgressNow();
    stopAutoSave();
    setCurrentAyah(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsMinimized(true);
    setQueue([]);
    setQueueIndex(-1);
    setIsFavorite(false);
  }, [saveProgressNow, stopAutoSave]);

  /* ---- Audio element setup ---- */
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Also update duration here as fallback for streams that don't fire loadedmetadata
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onPlaying = () => setIsBuffering(false);

    const onEnded = () => {
      // Save completed progress
      const ayah = currentAyahRef.current;
      if (ayah) {
        saveProgressToServer(ayah.id, audio.duration, audio.duration);
      }
      // Auto-advance queue
      setQueueIndex(prev => {
        const next = prev + 1;
        if (next < queue.length) {
          const nextAyah = queue[next];
          setCurrentAyah(nextAyah);
          setIsPlaying(!(requiresPremiumAccess(nextAyah) && !isPremium));
          return next;
        }
        setIsPlaying(false);
        setCurrentTime(0);
        return prev;
      });
    };

    const onError = async () => {
      const srcUrl = audio.src;
      if (!srcUrl || srcUrl === '' || blobFallbackAttempted.current === srcUrl) return;
      blobFallbackAttempted.current = srcUrl;

      const token = localStorage.getItem('jwt_token');
      if (!token) {
        console.error('[AudioPlayer] No token – cannot retry stream');
        setIsPlaying(false);
        return;
      }

      try {
        console.log('[AudioPlayer] Direct load failed, retrying with fetch + Auth header…');
        const resp = await fetch(srcUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);
        audio.src = blobUrl;
        audio.load();
        audio.play().catch(() => setIsPlaying(false));
      } catch (err) {
        console.error('[AudioPlayer] Fetch fallback also failed:', err);
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('playing', onPlaying);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('playing', onPlaying);
    };
  }, [isPremium, queue]);

  /* ---- Load new track + resume position ---- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAyah) return;

    if (audio.src !== currentAyah.audioUrl) {
      blobFallbackAttempted.current = null;
      audio.src = currentAyah.audioUrl;
      audio.load();

      // Resume from saved position (wait for audio to be ready)
      const resumeFromSaved = async () => {
        const savedPos = await getProgressFromServer(currentAyah.id);
        if (savedPos > 0) {
          // Wait for audio to be seekable
          const trySeek = () => {
            if (audio.readyState >= 1 && audio.duration > 0) {
              audio.currentTime = savedPos;
              setCurrentTime(savedPos);
            } else {
              audio.addEventListener('loadedmetadata', () => {
                audio.currentTime = savedPos;
                setCurrentTime(savedPos);
              }, { once: true });
            }
          };
          trySeek();
        }
      };
      resumeFromSaved();

      // Check favorite status
      checkFavorite(currentAyah.id);
    }
  }, [currentAyah, checkFavorite]);

  /* ---- Playback rate ---- */
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  /* ---- Play/pause control ---- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (currentAyah) {
        audio.play().catch(() => setIsPlaying(false));
        startAutoSave();
      }
    } else {
      audio.pause();
      stopAutoSave();
    }
  }, [isPlaying, currentAyah, startAutoSave, stopAutoSave]);

  /* ---- Cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      saveProgressNow();
      stopAutoSave();
    };
  }, [saveProgressNow, stopAutoSave]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentAyah,
        isPlaying,
        isBuffering,
        currentTime,
        duration,
        playbackSpeed,
        isMinimized,
        queue,
        queueIndex,
        isFavorite,
        play,
        playQueue,
        pause,
        togglePlayPause,
        setSpeed,
        seek,
        skipNext,
        skipPrevious,
        minimize,
        maximize,
        close,
        toggleFavorite,
        markTrackComplete,
        resetTrackProgress,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}
