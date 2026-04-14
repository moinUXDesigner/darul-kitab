import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { Award, Bell, BookOpen, Crown, ExternalLink, Settings, Target, User } from 'lucide-react';

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

export function ProfilePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user, isPremium } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showLevelsTimeline, setShowLevelsTimeline] = useState(false);

  useEffect(() => {
    api
      .get('/user/stats.php')
      .then((res) => {
        if (res.data && res.data.level) setStats(res.data);
      })
      .catch(() => {});
  }, []);

  const overallPercent = Math.min(100, Math.max(0, stats?.overall_percent ?? 0));
  const currentLevelStart = stats?.level.min ?? 0;
  const nextLevelStart = stats?.next_level?.min ?? 100;
  const currentLevelSpan = Math.max(1, nextLevelStart - currentLevelStart);
  const levelCompletedPercent = stats
    ? Math.min(100, Math.max(0, Math.round(((overallPercent - currentLevelStart) / currentLevelSpan) * 100)))
    : 0;
  const nextLevelGap = stats?.next_level ? Math.max(0, stats.next_level.min - overallPercent) : 0;
  const levels = stats?.levels ?? [];
  const initials = user?.user_name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="space-y-6 pb-32 md:pb-8">
      <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl">{user?.user_name || 'User'}</h1>
              <span className={`rounded-full px-3 py-1 text-xs ${isPremium ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}`}>
                {isPremium ? 'Premium Member' : 'Free Plan'}
              </span>
            </div>
            <p className="mt-1 break-all text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-primary" />
              <span>Open Settings</span>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => onNavigate('notifications')}
            className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <span>Notifications</span>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => onNavigate(isPremium ? 'settings' : 'subscription')}
            className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              {isPremium ? <User className="h-5 w-5 text-primary" /> : <Crown className="h-5 w-5 text-accent" />}
              <span>{isPremium ? 'Manage Account' : 'View Premium'}</span>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

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

            <div className="grid grid-cols-2 gap-3 text-center md:grid-cols-4">
              <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3">
                <div className="text-lg font-semibold">{stats.completed_tracks}</div>
                <div className="text-[11px] text-white/60">Completed Tracks</div>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3">
                <div className="text-lg font-semibold">{stats.completed_surahs}</div>
                <div className="text-[11px] text-white/60">Completed Surahs</div>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3">
                <div className="text-lg font-semibold">{stats.total_listening_hours}h</div>
                <div className="text-[11px] text-white/60">Hours Listened</div>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3">
                <div className="text-lg font-semibold">{stats.favorites_count}</div>
                <div className="text-[11px] text-white/60">Favorites Saved</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
