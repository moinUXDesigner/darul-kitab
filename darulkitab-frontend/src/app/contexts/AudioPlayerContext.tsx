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

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentAyah) {
      if (audio.src !== currentAyah.audioUrl) {
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
