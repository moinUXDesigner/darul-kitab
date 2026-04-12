import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import api from '../api/axios';
import { RECITERS, SAMPLE_AYAHS } from '../data/mock-data';
import { Play, Crown, BookOpen, Headphones, Award, Target, CheckCircle2, RotateCcw, Clock } from 'lucide-react';

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

interface UserStats {
  total_tracks: number;
  completed_tracks: number;
  in_progress_tracks: number;
  total_listening_hours: number;
  overall_percent: number;
  completed_surahs: number;
  favorites_count: number;
  level: { name: string; name_ar: string; min: number };
  next_level: { name: string; name_ar: string; min: number } | null;
  levels: Array<{ name: string; name_ar: string; min: number }>;
}

export function HomePage({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) {
  const { user, isPremium } = useAuth();
  const { play, isPlaying, currentAyah, currentTime, duration, markTrackComplete, resetTrackProgress } = useAudioPlayer();
  const [continueItems, setContinueItems] = useState<ContinueItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showLevelsTimeline, setShowLevelsTimeline] = useState(false);
  const [swipedItemId, setSwipedItemId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const wasPlayingRef = React.useRef(false);
  const touchStartXRef = React.useRef<number | null>(null);

  const fetchData = React.useCallback(() => {
    api.get('/user/get-progress.php').then((res) => {
      if (Array.isArray(res.data)) setContinueItems(res.data);
    }).catch(() => {});

    api.get('/user/stats.php').then((res) => {
      if (res.data && res.data.level) setStats(res.data);
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

  const overallPercent = Math.min(100, Math.max(0, stats?.overall_percent ?? 0));
  const currentLevelStart = stats?.level.min ?? 0;
  const nextLevelStart = stats?.next_level?.min ?? 100;
  const currentLevelSpan = Math.max(1, nextLevelStart - currentLevelStart);
  const levelCompletedPercent = stats
    ? Math.min(100, Math.max(0, Math.round(((overallPercent - currentLevelStart) / currentLevelSpan) * 100)))
    : 0;
  const nextLevelGap = stats?.next_level ? Math.max(0, stats.next_level.min - overallPercent) : 0;
  const levels = stats?.levels ?? [];
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
      reciter: item.reciter || 'Unknown',
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
      setSwipedItemId(null);
      setActionLoadingId(null);
    }
  };

  const handleCardTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768) return;
    touchStartXRef.current = e.changedTouches[0]?.clientX ?? null;
  };

  const handleCardTouchEnd = (audioId: number, e: React.TouchEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768 || touchStartXRef.current === null) return;

    const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartXRef.current;

    if (deltaX <= -48) {
      setSwipedItemId(audioId);
    } else if (deltaX >= 36 && swipedItemId === audioId) {
      setSwipedItemId(null);
    }

    touchStartXRef.current = null;
  };

  const formatPosition = (seconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-32 md:pb-10">
      <div className="rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-6 text-white md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]">
                {isPremium ? 'Premium listener' : 'Daily progress'}
              </span>
              <span className="text-sm text-white/70">{isPremium ? 'Pro Plan' : 'Free Plan'}</span>
            </div>
            <h2 className="mb-2 text-2xl md:text-4xl">{user?.user_name || 'User'}</h2>
            <p className="text-sm text-white/78 md:text-base">
              Continue your Quran journey with a clear view of your listening progress and next milestone.
            </p>
          </div>

          {!isPremium ? (
            <button
              onClick={() => onNavigate('subscription')}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-accent px-5 py-2.5 text-sm text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <Crown className="h-4 w-4" />
              Upgrade
            </button>
          ) : (
            <span className="self-start rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">Pro Active</span>
          )}
        </div>

        <div className="mt-6 rounded-3xl border border-white/14 bg-white/10 p-4 backdrop-blur-sm md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
                {isPremium ? 'Premium membership active' : 'Premium access'}
              </p>
              <h3 className="text-lg font-medium md:text-xl">
                {isPremium ? 'You have full listening access unlocked.' : 'Unlock every reciter, surah, and uninterrupted resume tracking.'}
              </h3>
              <p className="mt-1 text-sm text-white/72">
                {isPremium
                  ? 'Enjoy premium recitations, smoother progress sync, and your full library across devices.'
                  : 'Upgrade once to access the full Quran library, premium reciters, and a more seamless listening journey.'}
              </p>
            </div>

            {!isPremium ? (
              <button
                type="button"
                onClick={() => onNavigate('subscription')}
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-sm text-primary transition-colors hover:bg-white/92"
              >
                <Crown className="h-4 w-4" />
                View Premium
              </button>
            ) : (
              <div className="self-start rounded-full border border-white/15 bg-white/12 px-4 py-2 text-sm text-white/90">
                Premium benefits enabled
              </div>
            )}
          </div>
        </div>

        {stats && (
          <>
            <div className="mb-5 mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/72">
                  <BookOpen className="h-4 w-4" />
                  Total Quran Listened %
                </div>
                <div className="text-3xl font-semibold">{overallPercent}%</div>
                <p className="mt-1 text-xs text-white/68">
                  Overall listening completion across your Quran progress.
                </p>
              </div>

              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/72">
                  <Award className="h-4 w-4" />
                  {stats.level.name} Level Badge
                </div>
                <div className="text-3xl font-semibold">{levelCompletedPercent}%</div>
                <p className="mt-1 text-xs text-white/68">
                  Completed within your current badge level.
                </p>
              </div>

              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/72">
                  <Target className="h-4 w-4" />
                  Next Level
                </div>
                <div className="text-2xl font-semibold">
                  {stats.next_level ? stats.next_level.name : 'Max level'}
                </div>
                <p className="mt-1 text-xs text-white/68">
                  {stats.next_level
                    ? `${nextLevelGap}% more to unlock ${stats.next_level.name}.`
                    : 'You have already reached the highest level.'}
                </p>
              </div>
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Award className="h-4 w-4 text-white/80" />
              <span className="text-sm font-medium">{stats.level.name}</span>
              <span className="text-xs text-white/60" style={{ fontFamily: 'var(--font-family-arabic)' }}>
                {stats.level.name_ar}
              </span>
              <span className="ml-auto text-xs text-white/70">
                Current badge: {levelCompletedPercent}% complete
                {stats.next_level && ` · Next Level: ${stats.next_level.name}`}
              </span>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${levelCompletedPercent}%` }} />
            </div>

            <div className="mb-5">
              <button
                type="button"
                onClick={() => setShowLevelsTimeline((previousValue) => !previousValue)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/16"
              >
                <Award className="h-4 w-4" />
                {showLevelsTimeline ? 'Hide all Levels' : 'View all Levels'}
              </button>
            </div>

            {showLevelsTimeline && levels.length > 0 && (
              <div className="mb-5 rounded-2xl border border-white/12 bg-white/8 p-4 md:p-5">
                <div className="mb-4">
                  <h3 className="text-base font-medium">All Levels Timeline</h3>
                  <p className="mt-1 text-xs text-white/70">
                    Your current level is highlighted, and completed levels stay marked above it.
                  </p>
                </div>

                <div className="space-y-0">
                  {levels.map((level, index) => {
                    const isCurrent = stats.level.name === level.name && stats.level.min === level.min;
                    const isCompleted = overallPercent >= level.min;
                    const isLast = index === levels.length - 1;

                    return (
                      <div key={`${level.name}-${level.min}`} className="flex gap-4">
                        <div className="flex w-6 flex-col items-center">
                          <div
                            className={`mt-1 h-4 w-4 rounded-full border-2 ${
                              isCurrent
                                ? 'border-white bg-accent shadow-[0_0_0_4px_rgba(255,255,255,0.12)]'
                                : isCompleted
                                  ? 'border-white bg-white'
                                  : 'border-white/35 bg-transparent'
                            }`}
                          />
                          {!isLast && (
                            <div className={`mt-2 w-px flex-1 ${isCompleted ? 'bg-white/60' : 'bg-white/20'}`} />
                          )}
                        </div>

                        <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
                          <div
                            className={`rounded-2xl border px-4 py-3 ${
                              isCurrent
                                ? 'border-accent/50 bg-accent/15'
                                : isCompleted
                                  ? 'border-white/12 bg-white/10'
                                  : 'border-white/10 bg-white/5'
                            }`}
                          >
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{level.name}</span>
                                  <span className="text-xs text-white/65" style={{ fontFamily: 'var(--font-family-arabic)' }}>
                                    {level.name_ar}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-white/70">
                                  Unlocks at {level.min}% total Quran listened.
                                </p>
                              </div>

                              <div className="flex items-center gap-2 text-xs">
                                {isCurrent && <span className="rounded-full bg-white/14 px-2.5 py-1 text-white">Current Level</span>}
                                {!isCurrent && isCompleted && <span className="rounded-full bg-white/12 px-2.5 py-1 text-white/90">Completed</span>}
                                {!isCompleted && <span className="rounded-full bg-white/8 px-2.5 py-1 text-white/70">Locked</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-lg font-semibold">{stats.completed_tracks}</div>
                <div className="text-[11px] text-white/60">Completed Tracks</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{stats.completed_surahs}</div>
                <div className="text-[11px] text-white/60">Completed Surahs</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{stats.total_listening_hours}h</div>
                <div className="text-[11px] text-white/60">Hours Listened</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{stats.favorites_count}</div>
                <div className="text-[11px] text-white/60">Favorites Saved</div>
              </div>
            </div>
          </>
        )}
      </div>

      {hasContinueItems ? (
        <section className="rounded-3xl border border-border/70 bg-card/60 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              Continue Listening
            </h3>
            <button onClick={() => onNavigate('surah-list')} className="text-sm text-primary hover:underline">
              View All
            </button>
          </div>

          <p className="mb-5 text-sm text-muted-foreground">
            Pick up exactly where you left off. Use the play button to reopen the full player, or manage progress directly from each card.
          </p>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
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
              const isSwipeOpen = swipedItemId === item.audio_id;
              const ayahLabel = item.ayah_start
                ? `Ayah ${item.ayah_start}${item.ayah_end ? `-${item.ayah_end}` : ''}`
                : 'Track progress';

              return (
                <div
                  key={item.audio_id}
                  className="overflow-hidden rounded-3xl border border-border bg-background/80 shadow-sm transition-colors hover:border-primary/40"
                >
                  <div
                    className="p-4 md:p-5"
                    onTouchStart={handleCardTouchStart}
                    onTouchEnd={(e) => handleCardTouchEnd(item.audio_id, e)}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => playContinueTrack(item)}
                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                        aria-label={`Play ${item.english_name}`}
                      >
                        <Play className="ml-0.5 h-5 w-5" />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="truncate text-base font-medium">{item.english_name}</h4>
                          {isCurrentTrack && (
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                              Live now
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {ayahLabel} · {item.reciter || 'Unknown'}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
                          </div>
                          <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">{progressPct}%</span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                      </div>
                    </div>

                    <div className="mt-4 hidden flex-wrap items-center gap-3 md:flex">
                      <button
                        type="button"
                        onClick={() => handleContinueAction(item.audio_id, 'complete')}
                        disabled={actionLoadingId === item.audio_id}
                        className="inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/8 px-4 py-2 text-sm text-green-700 transition-colors hover:bg-green-500/14 disabled:opacity-60"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as complete
                      </button>

                      {showReset && (
                        <button
                          type="button"
                          onClick={() => handleContinueAction(item.audio_id, 'reset')}
                          disabled={actionLoadingId === item.audio_id}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reset Track
                        </button>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 md:hidden">
                      <span className="text-xs text-muted-foreground">Swipe left for actions</span>
                      <button
                        type="button"
                        onClick={() => setSwipedItemId((previousId) => previousId === item.audio_id ? null : item.audio_id)}
                        className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                      >
                        {isSwipeOpen ? 'Hide actions' : 'Actions'}
                      </button>
                    </div>
                  </div>

                  {isSwipeOpen && (
                    <div className="border-t border-border bg-muted/35 p-3 md:hidden">
                      <div className="grid gap-2">
                        <button
                          type="button"
                          onClick={() => handleContinueAction(item.audio_id, 'complete')}
                          disabled={actionLoadingId === item.audio_id}
                          className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                        >
                          Mark as complete
                        </button>
                        {showReset && (
                          <button
                            type="button"
                            onClick={() => handleContinueAction(item.audio_id, 'reset')}
                            disabled={actionLoadingId === item.audio_id}
                            className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                          >
                            Reset Track
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSwipedItemId(null)}
                          className="rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-background"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div>
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
