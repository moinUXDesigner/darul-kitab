import React, { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { useAudioPlayer, AyahData } from '../contexts/AudioPlayerContext';
import { ChevronLeft, Play, BookOpen, CheckCircle2, Clock, RotateCcw, CircleCheck } from 'lucide-react';

interface Surah {
  id: number;
  arabic_name: string;
  english_name: string;
  ayah_count: number;
  revelation_type: string;
}

interface AyahAudio {
  id: number;
  surah_no: number;
  ayah_start: number | null;
  ayah_end: number | null;
  reciter: string | null;
  duration_seconds: number | null;
}

export function SurahDetailPage({
  surah,
  onNavigate,
}: {
  surah: Surah;
  onNavigate: (page: string, data?: any) => void;
}) {
  const { play, playQueue, isPlaying, currentAyah, currentTime, duration, markTrackComplete, resetTrackProgress } = useAudioPlayer();

  const [ayahAudios, setAyahAudios] = useState<AyahAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressMap, setProgressMap] = useState<Record<number, { position: number; duration: number; completed: boolean }>>({});
  const [confirmAction, setConfirmAction] = useState<{ audioId: number; type: 'complete' | 'reset' } | null>(null);
  const wasPlayingRef = useRef(false);

  const fetchProgress = useCallback(() => {
    api.get(`/user/get-progress.php?surah_no=${surah.id}`).then((res) => {
      if (Array.isArray(res.data)) {
        const map: Record<number, { position: number; duration: number; completed: boolean }> = {};
        for (const p of res.data) {
          map[p.audio_id] = {
            position: Number(p.position_seconds),
            duration: Number(p.duration_seconds),
            completed: !!p.completed,
          };
        }
        setProgressMap(map);
      }
    }).catch(() => {});
  }, [surah.id]);

  useEffect(() => {
    const fetchAyahs = async () => {
      try {
        const res = await api.get(`/quran/surah-audio.php?surah_no=${surah.id}`);
        setAyahAudios(res.data);
      } catch {
        setError('Failed to load ayahs');
      } finally {
        setLoading(false);
      }
    };

    fetchAyahs();
  }, [surah.id]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    const handleProgressUpdated = () => fetchProgress();
    window.addEventListener('darulkitab-progress-updated', handleProgressUpdated);
    return () => window.removeEventListener('darulkitab-progress-updated', handleProgressUpdated);
  }, [fetchProgress]);

  useEffect(() => {
    if (wasPlayingRef.current && !isPlaying) {
      const timeoutId = setTimeout(fetchProgress, 1000);
      return () => clearTimeout(timeoutId);
    }

    wasPlayingRef.current = isPlaying;
  }, [fetchProgress, isPlaying]);

  const handleMarkComplete = async (audioId: number) => {
    await markTrackComplete(audioId);
    setProgressMap((prev) => ({
      ...prev,
      [audioId]: { position: prev[audioId]?.duration || 0, duration: prev[audioId]?.duration || 0, completed: true },
    }));
    setConfirmAction(null);
  };

  const handleReset = async (audioId: number) => {
    await resetTrackProgress(audioId);
    setProgressMap((prev) => {
      const next = { ...prev };
      delete next[audioId];
      return next;
    });
    setConfirmAction(null);
  };

  const buildAyahData = (audio: AyahAudio): AyahData => {
    const token = localStorage.getItem('jwt_token') || '';
    return {
      id: audio.id,
      surahNumber: surah.id,
      surahName: surah.english_name,
      surahNameArabic: surah.arabic_name,
      ayahNumber: audio.ayah_start || 0,
      ayahEnd: audio.ayah_end || undefined,
      title: `Surah ${surah.english_name} (${audio.ayah_start}${audio.ayah_end ? `-${audio.ayah_end}` : ''})`,
      reciter: audio.reciter || 'Unknown',
      audioUrl: `${api.defaults.baseURL}quran/stream.php?id=${audio.id}&token=${encodeURIComponent(token)}`,
      isPremium: false,
    };
  };

  const playAyah = (audio: AyahAudio) => {
    play(buildAyahData(audio));
  };

  const playAll = () => {
    if (ayahAudios.length > 0) {
      const queueData = ayahAudios.map((audio) => buildAyahData(audio));
      playQueue(queueData, 0);
    }
  };

  const getEffectiveProgress = (audio: AyahAudio) => {
    const saved = progressMap[audio.id];
    const isCurrentTrack = currentAyah?.id === audio.id && currentAyah?.surahNumber === surah.id;

    if (!isCurrentTrack) {
      return saved;
    }

    const liveDuration = Number(duration || audio.duration_seconds || saved?.duration || 0);
    const livePosition = Number(currentTime || saved?.position || 0);
    const effectivePosition = liveDuration > 0 ? Math.min(livePosition, liveDuration) : livePosition;

    return {
      position: Math.max(saved?.position || 0, effectivePosition),
      duration: liveDuration,
      completed: saved?.completed || (liveDuration > 0 && effectivePosition >= liveDuration * 0.95) || false,
    };
  };

  const totalTracks = ayahAudios.length;
  const completedTracks = ayahAudios.filter((audio) => getEffectiveProgress(audio)?.completed).length;
  const totalDuration = ayahAudios.reduce((sum, audio) => sum + Number(audio.duration_seconds || 0), 0);
  const listenedDuration = ayahAudios.reduce((sum, audio) => {
    const progress = getEffectiveProgress(audio);
    const trackDuration = Number(audio.duration_seconds || progress?.duration || 0);
    if (!progress) return sum;
    if (progress.completed) return sum + trackDuration;
    return sum + Math.min(Number(progress.position || 0), trackDuration);
  }, 0);
  const surahProgressPct = totalDuration > 0
    ? Math.round((Math.min(listenedDuration, totalDuration) / totalDuration) * 100)
    : 0;

  if (loading) {
    return <div className="py-20 text-center">Loading ayahs...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="pb-32 md:pb-8">
      <button onClick={() => onNavigate('surah-list')} className="mb-6 flex items-center gap-2 text-muted-foreground">
        <ChevronLeft className="h-5 w-5" />
        Back to Surahs
      </button>

      <div className="mb-6 rounded-3xl bg-gradient-to-br from-primary to-secondary p-8 text-center text-white">
        <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-80" />
        <h1 className="mb-2 text-3xl">{surah.english_name}</h1>
        <p style={{ fontFamily: 'var(--font-family-arabic)' }} className="mb-3 text-4xl">
          {surah.arabic_name}
        </p>
        <p className="mb-3 text-sm text-white/60">
          {surah.ayah_count} verses • {surah.revelation_type}
        </p>
        {totalTracks > 0 && (
          <div className="mx-auto mt-2 max-w-xs">
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${surahProgressPct}%` }} />
            </div>
            <p className="mt-1 text-xs text-white/80">
              {completedTracks}/{totalTracks} tracks • {surahProgressPct}% complete
            </p>
          </div>
        )}
      </div>

      <button
        onClick={playAll}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-primary-foreground"
      >
        <Play className="h-5 w-5" />
        Play All
      </button>

      <div className="space-y-4">
        {ayahAudios.map((audio) => {
          const progress = getEffectiveProgress(audio);
          const trackPct = progress && progress.duration > 0
            ? Math.round((progress.position / progress.duration) * 100)
            : 0;

          return (
            <div key={audio.id} className="rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => playAyah(audio)}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                  aria-label={`Play ayah ${audio.ayah_start}`}
                >
                  <Play className="ml-0.5 h-4 w-4" />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      Ayah {audio.ayah_start}
                      {audio.ayah_end ? `-${audio.ayah_end}` : ''}
                    </span>
                    {progress?.completed && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />}
                    {currentAyah?.id === audio.id && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                        Playing now
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-sm text-muted-foreground">
                    Reciter: {audio.reciter || 'Unknown'}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${trackPct}%` }} />
                    </div>
                    {progress && progress.position > 0 && !progress.completed && (
                      <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {Math.floor(progress.position / 60)}:{Math.floor(progress.position % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                    {progress?.completed && <span className="whitespace-nowrap text-xs text-green-500">Done</span>}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {!progress?.completed && (
                  <button
                    type="button"
                    onClick={() => setConfirmAction({ audioId: audio.id, type: 'complete' })}
                    className="inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/8 px-4 py-2 text-sm text-green-700 transition-colors hover:bg-green-500/14"
                  >
                    <CircleCheck className="h-4 w-4" />
                    Mark as complete
                  </button>
                )}

                {progress && (progress.position > 0 || progress.completed) && (
                  <button
                    type="button"
                    onClick={() => setConfirmAction({ audioId: audio.id, type: 'reset' })}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Track
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setConfirmAction(null)}>
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-lg font-medium">
              {confirmAction.type === 'complete' ? 'Mark as Complete?' : 'Reset Progress?'}
            </h3>
            <p className="mb-5 text-sm text-muted-foreground">
              {confirmAction.type === 'complete'
                ? 'This will mark this track as fully listened.'
                : 'This will reset all listening progress for this track to zero.'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmAction.type === 'complete'
                  ? handleMarkComplete(confirmAction.audioId)
                  : handleReset(confirmAction.audioId)
                }
                className={`rounded-xl px-4 py-2 text-sm text-white transition-colors ${
                  confirmAction.type === 'complete'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirmAction.type === 'complete' ? 'Mark Complete' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
