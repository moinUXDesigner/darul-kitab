import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import api from '../api/axios';
import { SURAHS, RECITERS, SAMPLE_AYAHS } from '../data/mock-data';
import { Play, Crown, BookOpen, Headphones, Sparkles } from 'lucide-react';

export function HomePage({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) {
  const { user, isPremium } = useAuth();
  const { play } = useAudioPlayer();

  console.log(user);

  const handlePlayAyah = (ayah: typeof SAMPLE_AYAHS[0]) => {
    if (ayah.isPremium && !isPremium) {
      onNavigate('subscription');
      return;
    }

    const token = localStorage.getItem('jwt_token') || '';
    const audioUrl = ayah.streamId
      ? `${api.defaults.baseURL}quran/stream.php?id=${ayah.streamId}&token=${encodeURIComponent(token)}`
      : ayah.audioUrl || '#';

    play({
      ...ayah,
      audioUrl,
      title: `${ayah.surahName} - Ayah ${ayah.ayahNumber}`,
      isPlaying: true
    });
  };

  return (
    <div className="pb-32 md:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary p-6 md:p-8 rounded-3xl mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl mb-1">{user?.user_name || 'User'}</h2>
            <p className="text-white/80">Continue your spiritual journey</p>
          </div>
          {!isPremium && (
            <button
              onClick={() => onNavigate('subscription')}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors"
            >
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Upgrade</span>
            </button>
          )}
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <div className="opacity-80">Plan</div>
            <div>{isPremium ? 'Premium' : 'Free'}</div>
          </div>
          <div>
            <div className="opacity-80">Reciters</div>
            <div>{isPremium ? 'All' : '3'}</div>
          </div>
        </div>
      </div>

      {/* Continue Listening */}
      <section className="mb-8">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Continue Listening
        </h3>
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
      </section>

      {/* Popular Reciters */}
      <section className="mb-8">
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
      <section className="mb-8">
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
      <section>
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
