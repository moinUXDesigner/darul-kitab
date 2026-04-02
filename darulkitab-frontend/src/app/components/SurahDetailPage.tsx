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


import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { ChevronLeft, Play, BookOpen } from "lucide-react";

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
  const { play } = useAudioPlayer();

  const [ayahAudios, setAyahAudios] = useState<AyahAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const playAyah = (audio: AyahAudio) => {
    const token = localStorage.getItem('jwt_token') || '';
    play({
      id: audio.id,
      surahNumber: surah.id,
      surahName: surah.english_name,
      surahNameArabic: surah.arabic_name,
      ayahNumber: audio.ayah_start || 0,
      title: `Surah ${surah.english_name} (${audio.ayah_start}${
        audio.ayah_end ? "-" + audio.ayah_end : ""
      })`,
      reciter: audio.reciter || "Unknown",
      audioUrl: `${api.defaults.baseURL}/quran/stream.php?id=${audio.id}&token=${encodeURIComponent(token)}`,
      isPremium: false,
    });
  };

  const playAll = () => {
    if (ayahAudios.length > 0) {
      playAyah(ayahAudios[0]);
    }
  };

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
        <p className="text-white/60 text-sm">
          {surah.ayah_count} verses • {surah.revelation_type}
        </p>
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
        {ayahAudios.map((audio) => (
          <div
            key={audio.id}
            onClick={() => playAyah(audio)}
            className="bg-card p-4 rounded-2xl border border-border hover:border-primary cursor-pointer flex items-center justify-between"
          >
            <div>
              <div className="font-medium">
                Ayah {audio.ayah_start}
                {audio.ayah_end ? `–${audio.ayah_end}` : ""}
              </div>
              <div className="text-sm text-muted-foreground">
                Reciter: {audio.reciter || "Unknown"}
              </div>
            </div>
            <Play className="w-4 h-4 text-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}
