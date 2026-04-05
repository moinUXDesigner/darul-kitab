import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import api from '../api/axios';
import { SURAHS, RECITERS, SAMPLE_AYAHS } from '../data/mock-data';
import { Play, Crown, BookOpen, Headphones, Sparkles, Award, Clock, Heart, TrendingUp } from 'lucide-react';

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
}

export function HomePage({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) {
  const { user, isPremium } = useAuth();
  const { play, isPlaying } = useAudioPlayer();
  const [continueItems, setContinueItems] = useState<ContinueItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const wasPlayingRef = React.useRef(false);

  const fetchData = React.useCallback(() => {
    api.get('/user/get-progress.php').then(res => {
      if (Array.isArray(res.data)) setContinueItems(res.data);
    }).catch(() => {});

    api.get('/user/stats.php').then(res => {
      if (res.data && res.data.level) setStats(res.data);
    }).catch(() => {});
  }, []);

  // Fetch on mount
  useEffect(() => { fetchData(); }, [fetchData]);

  // Re-fetch when audio pauses (progress was just saved)
  useEffect(() => {
    if (wasPlayingRef.current && !isPlaying) {
      // Small delay to let save-progress complete
      const t = setTimeout(fetchData, 1000);
      return () => clearTimeout(t);
    }
    wasPlayingRef.current = isPlaying;
  }, [isPlaying, fetchData]);

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

  return (
    <div className="pb-32 md:pb-8">
      {/* Hero + Stats Card */}
      <div className="bg-gradient-to-br from-primary to-secondary p-6 md:p-8 rounded-3xl mb-6 text-white">
        {/* Top row: name + upgrade/plan badge */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl mb-0.5">{user?.user_name || 'User'}</h2>
            <span className="text-sm text-white/70">
              {isPremium ? 'Premium' : 'Free'} Plan
            </span>
          </div>
          {!isPremium ? (
            <button
              onClick={() => onNavigate('subscription')}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors text-sm"
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </button>
          ) : (
            <span className="px-3 py-1 bg-white/15 rounded-full text-xs font-medium">Pro</span>
          )}
        </div>

        {/* Level + progress */}
        {stats && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-white/80" />
              <span className="text-sm font-medium">{stats.level.name}</span>
              <span className="text-xs text-white/60" style={{ fontFamily: 'var(--font-family-arabic)' }}>
                {stats.level.name_ar}
              </span>
              <span className="text-xs text-white/60 ml-auto">
                {stats.overall_percent}%
                {stats.next_level && ` · ${stats.next_level.name} at ${stats.next_level.min}%`}
              </span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min(100, stats.overall_percent)}%` }}
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-lg font-semibold">{stats.completed_tracks}</div>
                <div className="text-[11px] text-white/60">Completed</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{stats.completed_surahs}</div>
                <div className="text-[11px] text-white/60">Surahs</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{stats.total_listening_hours}h</div>
                <div className="text-[11px] text-white/60">Listened</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{stats.favorites_count}</div>
                <div className="text-[11px] text-white/60">Favorites</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Continue Listening — real data from API */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          
          <h3 className="text-xl mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Continue Listening
        </h3>
          <button
            onClick={() => onNavigate('surah-list')}
            className="text-sm text-primary hover:underline"
          >
            View All
          </button>
        </div>
        {continueItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {continueItems.map((item) => {
              const progressPct = item.duration_seconds > 0
                ? Math.round((item.position_seconds / item.duration_seconds) * 100)
                : 0;
              const formatPos = (sec: number) => {
                const m = Math.floor(sec / 60);
                const s = Math.floor(sec % 60);
                return `${m}:${s.toString().padStart(2, '0')}`;
              };

              return (
                <div
                  key={item.audio_id}
                  className="bg-card p-4 rounded-2xl border border-border hover:border-primary transition-colors cursor-pointer group"
                  onClick={() => {
                    const token = localStorage.getItem('jwt_token') || '';
                    play({
                      id: item.audio_id,
                      surahNumber: item.surah_no,
                      surahName: item.english_name,
                      surahNameArabic: item.arabic_name,
                      ayahNumber: item.ayah_start || undefined,
                      reciter: item.reciter || 'Unknown',
                      title: `${item.english_name} (${item.ayah_start || ''}${item.ayah_end ? '-' + item.ayah_end : ''})`,
                      audioUrl: `${api.defaults.baseURL}quran/stream.php?id=${item.audio_id}&token=${encodeURIComponent(token)}`,
                    });
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate">{item.english_name}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        Ayah {item.ayah_start}{item.ayah_end ? `–${item.ayah_end}` : ''} • {item.reciter || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatPos(item.position_seconds)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_AYAHS.slice(0, 2).map((ayah) => (
              <div
                key={ayah.id}
                className="bg-card p-4 rounded-2xl border border-border hover:border-primary transition-colors cursor-pointer group"
                onClick={() => handlePlayAyah(ayah)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="truncate">{ayah.surahName}</h4>
                      {ayah.isPremium && !isPremium && (
                        <Crown className="w-4 h-4 text-accent flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      Ayah {ayah.ayahNumber} • {ayah.reciter}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Reciters */}
      <section className="mb-8 hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" />
            Popular Reciters
          </h3>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RECITERS.slice(0, 4).map((reciter) => (
            <div
              key={reciter.id}
              className="bg-card p-4 rounded-2xl border border-border hover:border-primary transition-colors cursor-pointer group text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-3 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <h4 className="text-sm truncate">{reciter.name.split(' ')[0]}</h4>
                {reciter.isPremium && !isPremium && (
                  <Crown className="w-3 h-3 text-accent flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{reciter.country}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Surah Collections */}
      <section className="mb-8 hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Surah Collections
          </h3>
          <button
            onClick={() => onNavigate('surah-list')}
            className="text-sm text-primary hover:underline"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Short Surahs', desc: 'Perfect for daily recitation', color: 'from-primary to-secondary' },
            { title: 'Popular Surahs', desc: 'Most listened', color: 'from-secondary to-primary' },
            { title: 'Juz Collections', desc: 'Organized by Juz', color: 'from-primary/80 to-secondary/80' }
          ].map((collection, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${collection.color} p-6 rounded-2xl text-white cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => onNavigate('surah-list')}
            >
              <BookOpen className="w-8 h-8 mb-3 opacity-80" />
              <h4 className="mb-1">{collection.title}</h4>
              <p className="text-sm opacity-80">{collection.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Ayah */}
      <section className='hidden'>
        <h3 className="text-xl mb-4">Daily Ayah</h3>
        <div className="bg-card p-6 rounded-2xl border border-border">
          <div className="text-center mb-4" style={{ fontFamily: 'var(--font-family-arabic)', lineHeight: 1.8 }}>
            <p className="text-2xl md:text-3xl mb-4">{SAMPLE_AYAHS[0].arabicText}</p>
          </div>
          <p className="text-muted-foreground text-center mb-4 italic">
            "{SAMPLE_AYAHS[0].translation}"
          </p>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              {SAMPLE_AYAHS[0].surahName} - Ayah {SAMPLE_AYAHS[0].ayahNumber}
            </p>
            <button
              onClick={() => handlePlayAyah(SAMPLE_AYAHS[0])}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              <Play className="w-4 h-4" />
              Listen Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
