import React, { useEffect, useState } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import api from '../api/axios';
import { ChevronLeft, Play, Heart, Trash2, Loader2 } from 'lucide-react';

interface FavoriteItem {
  audio_id: number;
  created_at: string;
  filename: string;
  surah_no: number;
  ayah_start: number | null;
  ayah_end: number | null;
  reciter: string | null;
  arabic_name: string;
  english_name: string;
}

export function FavoritesPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { play } = useAudioPlayer();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/user/favorites.php');
      if (Array.isArray(res.data)) {
        setFavorites(res.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handlePlay = (item: FavoriteItem) => {
    const token = localStorage.getItem('jwt_token') || '';
    play({
      id: item.audio_id,
      surahNumber: item.surah_no,
      surahName: item.english_name,
      surahNameArabic: item.arabic_name,
      ayahNumber: item.ayah_start || undefined,
      ayahEnd: item.ayah_end || undefined,
      reciter: item.reciter || 'Unknown',
      title: `${item.english_name} (${item.ayah_start || ''}${item.ayah_end ? '-' + item.ayah_end : ''})`,
      audioUrl: `${api.defaults.baseURL}quran/stream.php?id=${item.audio_id}&token=${encodeURIComponent(token)}`,
    });
  };

  const handleRemove = async (audioId: number) => {
    setRemovingId(audioId);
    try {
      await api.delete(`/user/favorites.php?audio_id=${audioId}`);
      setFavorites(prev => prev.filter(f => f.audio_id !== audioId));
    } catch {
      // silent
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="pb-32 md:pb-8">
      {/* Back */}
      <button
        onClick={() => onNavigate('library')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Library
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-7 h-7 text-red-500 fill-red-500" />
          <h1 className="text-3xl">Favorites</h1>
        </div>
        <p className="text-muted-foreground">
          {favorites.length} saved {favorites.length === 1 ? 'track' : 'tracks'}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg mb-2">No favorites yet</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Tap the heart icon while playing to save your favorite tracks
          </p>
          <button
            onClick={() => onNavigate('surah-list')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Browse Surahs
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((item) => (
            <div
              key={item.audio_id}
              className="bg-card p-4 rounded-2xl border border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-4">
                {/* Play button */}
                <button
                  onClick={() => handlePlay(item)}
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                >
                  <Play className="w-5 h-5 text-primary" />
                </button>

                {/* Info */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => handlePlay(item)}
                >
                  <h4 className="truncate">{item.english_name}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    Ayah {item.ayah_start}{item.ayah_end ? `–${item.ayah_end}` : ''} • {item.reciter || 'Unknown'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: 'var(--font-family-arabic)' }}>
                    {item.arabic_name}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item.audio_id)}
                  disabled={removingId === item.audio_id}
                  className="w-10 h-10 rounded-full hover:bg-destructive/10 flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  {removingId === item.audio_id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
