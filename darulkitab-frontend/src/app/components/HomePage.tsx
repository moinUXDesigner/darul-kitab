import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import api from '../api/axios';
import { RECITERS, SAMPLE_AYAHS } from '../data/mock-data';
import { Play, Crown, BookOpen, Headphones, CheckCircle2, RotateCcw, Clock, Sparkles, ArrowRight } from 'lucide-react';

const DEFAULT_RECITER_NAME = 'Moula Muft Amir Khan Quasmi';

interface ContinueItem {
  audio_id: number;
  surah_no: number;
  position_seconds: number;
  duration_seconds: number;
  completed: number;
  updated_at: string;
  filename: string;
  ayah_start: number | null;
  ayah_end: number | null;
  reciter: string | null;
  arabic_name: string;
  english_name: string;
}

export function HomePage({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) {
  const { isPremium } = useAuth();
  const { play, isPlaying, currentAyah, currentTime, duration, markTrackComplete, resetTrackProgress } = useAudioPlayer();
  const [continueItems, setContinueItems] = useState<ContinueItem[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const wasPlayingRef = React.useRef(false);

  const fetchData = React.useCallback(() => {
    api.get('/user/get-progress.php').then((res) => {
      if (Array.isArray(res.data)) setContinueItems(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const handleProgressUpdated = () => {
      fetchData();
    };

    window.addEventListener('darulkitab-progress-updated', handleProgressUpdated);
    return () => window.removeEventListener('darulkitab-progress-updated', handleProgressUpdated);
  }, [fetchData]);

  useEffect(() => {
    if (wasPlayingRef.current && !isPlaying) {
      const timeoutId = setTimeout(fetchData, 1000);
      return () => clearTimeout(timeoutId);
    }

    wasPlayingRef.current = isPlaying;
  }, [fetchData, isPlaying]);

  const handlePlayAyah = (ayah: typeof SAMPLE_AYAHS[0]) => {
    if (ayah.isPremium && !isPremium) {
      onNavigate('subscription');
      return;
    }

    const token = localStorage.getItem('jwt_token') || '';
    const audioUrl = ayah.streamId
      ? `${api.defaults.baseURL}quran/stream.php?id=${ayah.streamId}&token=${encodeURIComponent(token)}`
      : '#';

    play({
      ...ayah,
      audioUrl,
      title: `${ayah.surahName} - Ayah ${ayah.ayahNumber}`,
    });
  };
  const liveContinueItem = currentAyah && currentTime > 0 && !(duration > 0 && currentTime >= duration * 0.95)
    ? {
        audio_id: Number(currentAyah.id),
        surah_no: currentAyah.surahNumber || 0,
        position_seconds: currentTime,
        duration_seconds: duration,
        completed: 0,
        updated_at: '',
        filename: currentAyah.title || currentAyah.surahName || 'Current Track',
        ayah_start: currentAyah.ayahNumber ?? null,
        ayah_end: currentAyah.ayahEnd ?? null,
        reciter: currentAyah.reciter || null,
        arabic_name: currentAyah.surahNameArabic || '',
        english_name: currentAyah.surahName || currentAyah.title || 'Current Track',
      }
    : null;

  const displayedContinueItems = React.useMemo(() => {
    const items = [...continueItems];

    if (liveContinueItem) {
      const existingIndex = items.findIndex((item) => Number(item.audio_id) === Number(liveContinueItem.audio_id));
      if (existingIndex >= 0) {
        items[existingIndex] = {
          ...items[existingIndex],
          ...liveContinueItem,
        };
      } else {
        items.unshift(liveContinueItem);
      }
    }

    return items;
  }, [continueItems, liveContinueItem]);

  const hasContinueItems = displayedContinueItems.length > 0;

  const playContinueTrack = (item: ContinueItem) => {
    const token = localStorage.getItem('jwt_token') || '';
    play({
      id: item.audio_id,
      surahNumber: item.surah_no,
      surahName: item.english_name,
      surahNameArabic: item.arabic_name,
      ayahNumber: item.ayah_start || undefined,
      ayahEnd: item.ayah_end || undefined,
      reciter: item.reciter || DEFAULT_RECITER_NAME,
      title: `${item.english_name} (${item.ayah_start || ''}${item.ayah_end ? `-${item.ayah_end}` : ''})`,
      audioUrl: `${api.defaults.baseURL}quran/stream.php?id=${item.audio_id}&token=${encodeURIComponent(token)}`,
    });
  };

  const handleContinueAction = async (audioId: number, action: 'complete' | 'reset') => {
    setActionLoadingId(audioId);

    try {
      if (action === 'complete') {
        await markTrackComplete(audioId);
      } else {
        await resetTrackProgress(audioId);
      }

      setContinueItems((previousItems) => previousItems.filter((item) => Number(item.audio_id) !== Number(audioId)));
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatPosition = (seconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={hasContinueItems ? 'space-y-8 pb-32 md:pb-10' : 'pb-0 md:pb-10'}>
      {hasContinueItems ? (
        <section className="space-y-4">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl">
                <BookOpen className="h-5 w-5 text-primary" />
                Continue Listening
              </h3>
              <button onClick={() => onNavigate('surah-list')} className="text-sm text-primary hover:underline">
                View All
              </button>
            </div>
          </div>

          {!isPremium && (
            <button
              type="button"
              onClick={() => onNavigate('subscription')}
              className="flex w-full items-center gap-3 rounded-2xl border border-accent/20 bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-left text-white shadow-[0_18px_35px_-20px_rgba(16,185,129,0.55)] transition-transform hover:scale-[1.01]"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">Subscribe for Premium Access</div>
                <div className="truncate text-xs text-white/85">Unlock all reciters, offline listening, and ad-free playback.</div>
              </div>
              <ArrowRight className="h-5 w-5 flex-shrink-0 text-white/90" />
            </button>
          )}

          <div className="overflow-hidden border border-border bg-background">
            {displayedContinueItems.map((item) => {
              const isCurrentTrack = Number(currentAyah?.id) === Number(item.audio_id);
              const effectiveDuration = isCurrentTrack
                ? Number(duration || item.duration_seconds || 0)
                : Number(item.duration_seconds || 0);
              const effectivePosition = isCurrentTrack
                ? Math.min(
                    Number(currentTime || item.position_seconds || 0),
                    effectiveDuration || Number(currentTime || item.position_seconds || 0),
                  )
                : Number(item.position_seconds || 0);
              const progressPct = effectiveDuration > 0
                ? Math.round((effectivePosition / effectiveDuration) * 100)
                : 0;
              const showReset = effectivePosition > 0 || item.completed === 1;
              const ayahLabel = item.ayah_start
                ? `Ayah ${item.ayah_start}${item.ayah_end ? `-${item.ayah_end}` : ''}`
                : 'Track progress';

              return (
                <div
                  key={item.audio_id}
                  className="border-b border-border last:border-b-0"
                >
                  <div className="p-4 md:p-5">
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => playContinueTrack(item)}
                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                        aria-label={`Play ${item.english_name}`}
                      >
                        <Play className="ml-0.5 h-5 w-5" />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="truncate text-base font-medium">{item.english_name}</h4>
                              {isCurrentTrack && (
                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                                  Live now
                                </span>
                              )}
                            </div>

                            <p className="mt-1 truncate text-sm text-muted-foreground">
                              {ayahLabel} · {item.reciter || DEFAULT_RECITER_NAME}
                            </p>
                          </div>

                          {showReset && (
                            <button
                              type="button"
                              onClick={() => handleContinueAction(item.audio_id, 'reset')}
                              disabled={actionLoadingId === item.audio_id}
                              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
                              aria-label="Reset track"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden bg-muted">
                        <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
                      </div>
                      <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">{progressPct}%</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatPosition(effectivePosition)}
                        </span>
                        <span>{effectiveDuration > 0 ? `${formatPosition(effectiveDuration)} total` : 'In progress'}</span>
                        {item.completed === 1 && (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Completed
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleContinueAction(item.audio_id, 'complete')}
                        disabled={actionLoadingId === item.audio_id || item.completed === 1}
                        className="inline-flex items-center gap-2 border border-green-500/25 bg-green-500/8 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-500/14 disabled:opacity-60"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as complete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="grid min-h-[calc(100dvh-11rem)] place-items-center md:flex md:min-h-0 md:justify-start">
          <button
            onClick={() => onNavigate('surah-list')}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <BookOpen className="h-4 w-4" />
            Start your journey
          </button>
        </div>
      )}

      <section className="mb-8 hidden">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl">
            <Headphones className="h-5 w-5 text-primary" />
            Popular Reciters
          </h3>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {RECITERS.slice(0, 4).map((reciter) => (
            <div
              key={reciter.id}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-4 text-center transition-colors hover:border-primary"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <div className="mb-1 flex items-center justify-center gap-1">
                <h4 className="truncate text-sm">{reciter.name.split(' ')[0]}</h4>
                {reciter.isPremium && !isPremium && <Crown className="h-3 w-3 flex-shrink-0 text-accent" />}
              </div>
              <p className="text-xs text-muted-foreground">{reciter.country}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 hidden">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-primary" />
            Surah Collections
          </h3>
          <button onClick={() => onNavigate('surah-list')} className="text-sm text-primary hover:underline">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { title: 'Short Surahs', desc: 'Perfect for daily recitation', color: 'from-primary to-secondary' },
            { title: 'Popular Surahs', desc: 'Most listened', color: 'from-secondary to-primary' },
            { title: 'Juz Collections', desc: 'Organized by Juz', color: 'from-primary/80 to-secondary/80' },
          ].map((collection, idx) => (
            <div
              key={idx}
              className={`cursor-pointer rounded-2xl bg-gradient-to-br ${collection.color} p-6 text-white transition-transform hover:scale-105`}
              onClick={() => onNavigate('surah-list')}
            >
              <BookOpen className="mb-3 h-8 w-8 opacity-80" />
              <h4 className="mb-1">{collection.title}</h4>
              <p className="text-sm opacity-80">{collection.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hidden">
        <h3 className="mb-4 text-xl">Daily Ayah</h3>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 text-center" style={{ fontFamily: 'var(--font-family-arabic)', lineHeight: 1.8 }}>
            <p className="mb-4 text-2xl md:text-3xl">{SAMPLE_AYAHS[0].arabicText}</p>
          </div>
          <p className="mb-4 text-center italic text-muted-foreground">
            "{SAMPLE_AYAHS[0].translation}"
          </p>
          <div className="text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              {SAMPLE_AYAHS[0].surahName} - Ayah {SAMPLE_AYAHS[0].ayahNumber}
            </p>
            <button
              onClick={() => handlePlayAyah(SAMPLE_AYAHS[0])}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Play className="h-4 w-4" />
              Listen Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

