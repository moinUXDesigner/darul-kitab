// components/SurahListPage.tsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

/* ================================
   TYPES
================================ */

// interface Surah {
//   number: number;
//   name: string;
//   nameArabic: string;
//   translation: string;
//   verses: number;
//   type: string;
// }
interface Surah {
  id: number;
  arabic_name: string;
  english_name: string;
  ayah_count: number;
  revelation_type: string;
}

/* ================================
   COMPONENT
================================ */

export function SurahListPage({
  onNavigate,
}: {
  onNavigate: (page: string, data?: any) => void;
}) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressMap, setProgressMap] = useState<Record<number, { total: number; completed: number; inProgress: number }>>({});

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await api.get('/quran/surah-list.php');
        setSurahs(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            'Failed to load Surah list'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();

    // Fetch per-surah progress
    const token = localStorage.getItem('jwt_token');
    if (token) {
      api.get('/user/stats.php').then(res => {
        if (res.data?.surah_progress) {
          const map: Record<number, { total: number; completed: number; inProgress: number }> = {};
          for (const s of res.data.surah_progress) {
            map[Number(s.surah_no)] = {
              total: Number(s.total_tracks),
              completed: Number(s.completed_tracks),
              inProgress: Number(s.in_progress_tracks || 0),
            };
          }
          setProgressMap(map);
        }
      }).catch(() => {});
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Loading Surahs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="pb-32 md:pb-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">All Surahs</h1>
        <p className="text-muted-foreground">
          Complete list of Quran chapters
        </p>
      </div>

      <div className="space-y-2 max-h-[70vh] overflow-y-auto">
        {/* {surahs.map((surah) => (
          <div
            key={surah.number}
            onClick={() => onNavigate('surah-detail', surah)}
            className="bg-card p-4 rounded-2xl border border-border hover:border-primary transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary">
                  {surah.number}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="mb-0.5">{surah.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {surah.translation}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      style={{
                        fontFamily:
                          'var(--font-family-arabic)',
                      }}
                      className="text-xl mb-0.5"
                    >
                      {surah.nameArabic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {surah.verses} verses • {surah.type}
                  </span>
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        ))} */}

        {surahs.map((surah) => {
  const prog = progressMap[surah.id];
  const pct = prog && prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
  const isComplete = prog && prog.total > 0 && prog.completed === prog.total;
  const isInProgress = prog && (prog.completed > 0 || prog.inProgress > 0);

  return (
  <div
    key={surah.id}
    onClick={() => onNavigate('surah-detail', surah)}
    className="bg-card p-4 rounded-2xl border border-border hover:border-primary transition-all cursor-pointer group"
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isComplete ? 'bg-green-500/10' : 'bg-primary/10'
      }`}>
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <span className="text-primary">{surah.id}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 className="mb-0.5">{surah.english_name}</h3>
            <p className="text-sm text-muted-foreground">
              {surah.ayah_count} verses • {surah.revelation_type}
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <p
              style={{ fontFamily: 'var(--font-family-arabic)' }}
              className="text-xl mb-0.5"
            >
              {surah.arabic_name}
            </p>
            {isComplete && (
              <span className="text-xs text-green-500 font-medium">Complete</span>
            )}
            {!isComplete && isInProgress && (
              <span className="text-xs text-primary font-medium">{pct}%</span>
            )}
            {!isInProgress && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Not started</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
          <div
            className={`h-full rounded-full transition-all ${
              isComplete ? 'bg-green-500' : 'bg-primary'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  </div>
  );
})}

      </div>
    </div>
  );
}
