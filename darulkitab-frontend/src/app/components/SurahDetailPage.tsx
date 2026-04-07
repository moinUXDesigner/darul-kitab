// import React, { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { useAudioPlayer } from "../contexts/AudioPlayerContext";
// import { RECITERS } from "../data/mock-data";
// import { Play, Crown, ChevronLeft, BookOpen } from "lucide-react";

// interface Surah {
//   number: number;
//   name: string;
//   nameArabic: string;
//   translation: string;
//   verses: number;
//   type: string;
// }

// export function SurahDetailPage({
//   surah,
//   onNavigate,
// }: {
//   surah: Surah;
//   onNavigate: (page: string, data?: any) => void;
// }) {
//   const { isPremium } = useAuth();
//   const { play } = useAudioPlayer();
//   const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);

//   // Generate mock ayahs for this surah
//   const ayahs = Array.from({ length: Math.min(surah.verses, 10) }, (_, i) => ({
//     id: `${surah.number}-${i + 1}`,
//     surahNumber: surah.number,
//     surahName: surah.name,
//     surahNameArabic: surah.nameArabic,
//     ayahNumber: i + 1,
//     arabicText:
//       i === 0
//         ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
//         : `آية رقم ${i + 1} من سورة ${surah.nameArabic}`,
//     translation: `Ayah ${i + 1} translation from ${
//       surah.name
//     }. This is a sample translation text.`,
//     reciter: selectedReciter.name,
//     audioUrl: "#",
//     isPremium: selectedReciter.isPremium,
//   }));

//   const handlePlayAyah = (ayah: (typeof ayahs)[0]) => {
//     if (ayah.isPremium && !isPremium) {
//       onNavigate("subscription");
//       return;
//     }
//     play(ayah);
//   };

//   const handlePlayAll = () => {
//     if (selectedReciter.isPremium && !isPremium) {
//       onNavigate("subscription");
//       return;
//     }
//     play(ayahs[0]);
//   };

//   return (
//     <div className="pb-32 md:pb-8">
//       {/* Header */}
//       <button
//         onClick={() => onNavigate("surah-list")}
//         className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
//       >
//         <ChevronLeft className="w-5 h-5" />
//         Back to Surahs
//       </button>

//       {/* Surah Header Card */}
//       <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-3xl text-white text-center mb-6">
//         <div className="mb-4">
//           <BookOpen className="w-12 h-12 mx-auto opacity-80" />
//         </div>
//         <h1 className="text-3xl mb-2">{surah.name}</h1>
//         <p
//           style={{ fontFamily: "var(--font-family-arabic)" }}
//           className="text-4xl mb-3"
//         >
//           {surah.nameArabic}
//         </p>
//         <p className="text-white/80 mb-2">{surah.translation}</p>
//         <p className="text-white/60 text-sm">
//           {surah.verses} verses • {surah.type}
//         </p>
//       </div>

//       {/* Reciter Selector */}
//       <div className="mb-6">
//         <label className="block mb-3">Select Reciter</label>
//         <div className="relative">
//           <select
//             value={selectedReciter.id}
//             onChange={(e) => {
//               const reciter = RECITERS.find((r) => r.id === e.target.value);
//               if (reciter) setSelectedReciter(reciter);
//             }}
//             className="w-full px-4 py-3 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-10"
//           >
//             {RECITERS.map((reciter) => (
//               <option key={reciter.id} value={reciter.id}>
//                 {reciter.name} {reciter.isPremium && !isPremium ? "👑" : ""}
//               </option>
//             ))}
//           </select>
//           <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground rotate-[-90deg] pointer-events-none" />
//         </div>
//         {selectedReciter.isPremium && !isPremium && (
//           <p className="text-sm text-accent mt-2 flex items-center gap-1">
//             <Crown className="w-4 h-4" />
//             Premium reciter - Upgrade to unlock
//           </p>
//         )}
//       </div>

//       {/* Play All Button */}
//       <button
//         onClick={handlePlayAll}
//         className="w-full py-4 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-6 flex items-center justify-center gap-2"
//       >
//         <Play className="w-5 h-5" />
//         Play All ({surah.verses} verses)
//       </button>

//       {/* Ayah List */}
//       <div className="space-y-4">
//         <h3 className="text-lg mb-3">Ayahs</h3>
//         {ayahs.map((ayah) => (
//           <div
//             key={ayah.id}
//             className="bg-card p-5 rounded-2xl border border-border hover:border-primary transition-colors cursor-pointer group"
//             onClick={() => handlePlayAyah(ayah)}
//           >
//             <div className="flex items-start gap-4">
//               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
//                 <span className="text-sm text-primary">{ayah.ayahNumber}</span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div
//                   className="mb-3"
//                   style={{
//                     fontFamily: "var(--font-family-arabic)",
//                     lineHeight: 1.8,
//                   }}
//                 >
//                   <p className="text-xl leading-loose">{ayah.arabicText}</p>
//                 </div>
//                 <p className="text-muted-foreground text-sm mb-3 italic">
//                   "{ayah.translation}"
//                 </p>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Play className="w-4 h-4 text-primary" />
//                     <span className="text-sm text-muted-foreground">
//                       {selectedReciter.name}
//                     </span>
//                   </div>
//                   {ayah.isPremium && !isPremium && (
//                     <span className="flex items-center gap-1 text-sm text-accent">
//                       <Crown className="w-4 h-4" />
//                       Premium
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//         {surah.verses > 10 && (
//           <div className="text-center py-4">
//             <p className="text-muted-foreground text-sm">
//               Showing 10 of {surah.verses} verses
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useAudioPlayer, AyahData } from "../contexts/AudioPlayerContext";
import { ChevronLeft, Play, BookOpen, CheckCircle2, Clock, RotateCcw, CircleCheck } from "lucide-react";

/* ================================
   TYPES (MATCH DB)
================================ */

interface Surah {
  id: number;               // surah number
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

/* ================================
   COMPONENT
================================ */

export function SurahDetailPage({
  surah,
  onNavigate,
}: {
  surah: Surah;
  onNavigate: (page: string, data?: any) => void;
}) {
  const { play, playQueue, isPlaying, currentAyah, currentTime, duration } = useAudioPlayer();

  const [ayahAudios, setAyahAudios] = useState<AyahAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progressMap, setProgressMap] = useState<Record<number, { position: number; duration: number; completed: boolean }>>({});
  const [confirmAction, setConfirmAction] = useState<{ audioId: number; type: 'complete' | 'reset' } | null>(null);
  const wasPlayingRef = useRef(false);

  const fetchProgress = useCallback(() => {
    api.get(`/user/get-progress.php?surah_no=${surah.id}`).then(res => {
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
        const res = await api.get(
          `/quran/surah-audio.php?surah_no=${surah.id}`
        );
        setAyahAudios(res.data);
      } catch {
        setError("Failed to load ayahs");
      } finally {
        setLoading(false);
      }
    };

    fetchAyahs();
  }, [surah.id]);

  // Fetch progress for this surah
  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    if (wasPlayingRef.current && !isPlaying) {
      const timeoutId = setTimeout(fetchProgress, 1000);
      return () => clearTimeout(timeoutId);
    }

    wasPlayingRef.current = isPlaying;
  }, [fetchProgress, isPlaying]);

  const handleMarkComplete = async (audioId: number) => {
    try {
      await api.post('/user/save-progress.php', { audio_id: audioId, mark_complete: true });
      setProgressMap(prev => ({
        ...prev,
        [audioId]: { position: prev[audioId]?.duration || 0, duration: prev[audioId]?.duration || 0, completed: true },
      }));
    } catch { /* silent */ }
    setConfirmAction(null);
  };

  const handleReset = async (audioId: number) => {
    try {
      await api.post('/user/save-progress.php', { audio_id: audioId, reset: true });
      setProgressMap(prev => {
        const next = { ...prev };
        delete next[audioId];
        return next;
      });
    } catch { /* silent */ }
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
      title: `Surah ${surah.english_name} (${audio.ayah_start}${audio.ayah_end ? "-" + audio.ayah_end : ""})`,
      reciter: audio.reciter || "Unknown",
      audioUrl: `${api.defaults.baseURL}quran/stream.php?id=${audio.id}&token=${encodeURIComponent(token)}`,
      isPremium: false,
    };
  };

  const playAyah = (audio: AyahAudio) => {
    play(buildAyahData(audio));
  };

  const playAll = () => {
    if (ayahAudios.length > 0) {
      const queueData = ayahAudios.map(a => buildAyahData(a));
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
    const effectivePosition = liveDuration > 0
      ? Math.min(livePosition, liveDuration)
      : livePosition;

    return {
      position: Math.max(saved?.position || 0, effectivePosition),
      duration: liveDuration,
      completed: saved?.completed || (liveDuration > 0 && effectivePosition >= liveDuration * 0.95) || false,
    };
  };

  // Calculate surah-level progress
  const totalTracks = ayahAudios.length;
  const completedTracks = ayahAudios.filter(audio => getEffectiveProgress(audio)?.completed).length;
  const totalDuration = ayahAudios.reduce((sum, audio) => sum + Number(audio.duration_seconds || 0), 0);
  const listenedDuration = ayahAudios.reduce((sum, audio) => {
    const prog = getEffectiveProgress(audio);
    const trackDuration = Number(audio.duration_seconds || prog?.duration || 0);
    if (!prog) return sum;
    if (prog.completed) return sum + trackDuration;
    return sum + Math.min(Number(prog.position || 0), trackDuration);
  }, 0);
  const surahProgressPct = totalDuration > 0
    ? Math.round((Math.min(listenedDuration, totalDuration) / totalDuration) * 100)
    : 0;

  if (loading) {
    return <div className="text-center py-20">Loading ayahs…</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="pb-32 md:pb-8">
      {/* Back */}
      <button
        onClick={() => onNavigate("surah-list")}
        className="flex items-center gap-2 text-muted-foreground mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Surahs
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-3xl text-white text-center mb-6">
        <BookOpen className="w-12 h-12 mx-auto opacity-80 mb-4" />
        <h1 className="text-3xl mb-2">{surah.english_name}</h1>
        <p
          style={{ fontFamily: "var(--font-family-arabic)" }}
          className="text-4xl mb-3"
        >
          {surah.arabic_name}
        </p>
        <p className="text-white/60 text-sm mb-3">
          {surah.ayah_count} verses • {surah.revelation_type}
        </p>
        {totalTracks > 0 && (
          <div className="mt-2 max-w-xs mx-auto">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${surahProgressPct}%` }}
              />
            </div>
            <p className="text-white/80 text-xs mt-1">
              {completedTracks}/{totalTracks} tracks • {surahProgressPct}% complete
            </p>
          </div>
        )}
      </div>

      {/* Play All */}
      <button
        onClick={playAll}
        className="w-full py-4 rounded-2xl bg-primary text-primary-foreground mb-6 flex items-center justify-center gap-2"
      >
        <Play className="w-5 h-5" />
        Play All
      </button>

      {/* Ayah Audio List */}
      <div className="space-y-3">
        {ayahAudios.map((audio) => {
          const prog = getEffectiveProgress(audio);
          const trackPct = prog && prog.duration > 0
            ? Math.round((prog.position / prog.duration) * 100)
            : 0;

          return (
            <div
              key={audio.id}
              onClick={() => playAyah(audio)}
              className="bg-card p-4 rounded-2xl border border-border hover:border-primary cursor-pointer flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    Ayah {audio.ayah_start}
                    {audio.ayah_end ? `–${audio.ayah_end}` : ""}
                  </span>
                  {prog?.completed && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Reciter: {audio.reciter || "Unknown"}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${trackPct}%` }}
                    />
                  </div>
                  {prog && prog.position > 0 && !prog.completed && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {Math.floor(prog.position / 60)}:{Math.floor(prog.position % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                  {prog?.completed && (
                    <span className="text-xs text-green-500 whitespace-nowrap">Done</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {!prog?.completed && (
                  <button
                    title="Mark as complete"
                    onClick={(e) => { e.stopPropagation(); setConfirmAction({ audioId: audio.id, type: 'complete' }); }}
                    className="p-1.5 rounded-lg hover:bg-green-500/10 text-muted-foreground hover:text-green-500 transition-colors"
                  >
                    <CircleCheck className="w-4 h-4" />
                  </button>
                )}
                {prog && (prog.position > 0 || prog.completed) && (
                  <button
                    title="Reset progress"
                    onClick={(e) => { e.stopPropagation(); setConfirmAction({ audioId: audio.id, type: 'reset' }); }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <Play className="w-4 h-4 text-primary" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setConfirmAction(null)}>
          <div className="bg-card rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl border border-border" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-2">
              {confirmAction.type === 'complete' ? 'Mark as Complete?' : 'Reset Progress?'}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              {confirmAction.type === 'complete'
                ? 'This will mark this track as fully listened.'
                : 'This will reset all listening progress for this track to zero.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmAction.type === 'complete'
                  ? handleMarkComplete(confirmAction.audioId)
                  : handleReset(confirmAction.audioId)
                }
                className={`px-4 py-2 rounded-xl text-white text-sm transition-colors ${
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
