import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface AudioPlayerContextType {
  currentAyah: AyahData | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  isMinimized: boolean;
  play: (ayah: AyahData) => void;
  pause: () => void;
  togglePlayPause: () => void;
  setSpeed: (speed: number) => void;
  seek: (time: number) => void;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

export interface AyahData {
  id: string;
  surahNumber?: number;
  surahName?: string;
  surahNameArabic?: string;
  ayahNumber?: number;
  arabicText?: string;
  translation?: string;
  reciter?: string; 
  title?: string;
  audioUrl: string;
  isPremium?: boolean;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentAyah, setCurrentAyah] = useState<AyahData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMinimized, setIsMinimized] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (ayah: AyahData) => {
    setCurrentAyah(ayah);
    setIsPlaying(true);
    setIsMinimized(false);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const setSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const minimize = () => {
    setIsMinimized(true);
  };

  const maximize = () => {
    setIsMinimized(false);
  };

  const close = () => {
    setCurrentAyah(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setIsMinimized(true);
  };

  // Ref to track which URL we already attempted blob-fallback for
  const blobFallbackAttempted = useRef<string | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onError = async () => {
      // If the <audio> element gets a network error (e.g. 401),
      // retry via fetch() which CAN send Authorization headers.
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
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentAyah) {
      if (audio.src !== currentAyah.audioUrl) {
        blobFallbackAttempted.current = null; // reset fallback for new track
        audio.src = currentAyah.audioUrl;
        audio.load();
      }
    }
  }, [currentAyah]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (currentAyah) {
        audio.play().catch(() => {
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentAyah]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentAyah,
        isPlaying,
        currentTime,
        duration,
        playbackSpeed,
        isMinimized,
        play,
        pause,
        togglePlayPause,
        setSpeed,
        seek,
        minimize,
        maximize,
        close
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
