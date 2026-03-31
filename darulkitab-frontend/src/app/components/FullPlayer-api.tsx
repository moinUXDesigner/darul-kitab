import React, { useState } from "react";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  ChevronDown,
  Heart,
  Share2,
  Download,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";

export function FullPlayer({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    togglePlayPause,
    setSpeed,
    minimize,
    isMinimized,
  } = useAudioPlayer();

  const { isPremium } = useAuth();
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  if (!currentTrack || isMinimized) return null;

  const speeds = [0.5, 0.75, 1, 1.25, 1.5];

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-background z-50"
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button
            onClick={minimize}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center"
          >
            <ChevronDown className="w-6 h-6" />
          </button>

          <div className="text-center flex-1">
            <h3 className="text-sm">Now Playing</h3>
            <p className="text-xs text-muted-foreground">
              {currentTrack.reciter || "Unknown Reciter"}
            </p>
          </div>

          <button className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-6 max-w-3xl mx-auto w-full">
          {/* Artwork */}
          <div className="mb-8">
            <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary flex flex-col items-center justify-center text-white">
              <div className="text-6xl mb-2">
                {currentTrack.surah_no}
              </div>
              <div className="text-lg">
                Ayah{" "}
                {currentTrack.ayah_start}
                {currentTrack.ayah_end
                  ? `–${currentTrack.ayah_end}`
                  : ""}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div
                className="absolute h-full bg-primary"
                style={{
                  width: duration
                    ? `${(currentTime / duration) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Shuffle className="w-5 h-5 text-muted-foreground" />

            <SkipBack className="w-6 h-6 text-muted-foreground" />

            <button
              onClick={togglePlayPause}
              className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>

            <SkipForward className="w-6 h-6 text-muted-foreground" />

            <Repeat className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            {/* Speed */}
            <div className="relative">
              <button onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-xl shadow p-2">
                  {speeds.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSpeed(s);
                        setShowSpeedMenu(false);
                      }}
                      className={`block w-full px-3 py-2 text-sm rounded ${
                        playbackSpeed === s
                          ? "text-primary"
                          : ""
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Heart className="w-5 h-5" />
            <Download
              className={`w-5 h-5 ${
                !isPremium ? "opacity-40" : ""
              }`}
            />
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
