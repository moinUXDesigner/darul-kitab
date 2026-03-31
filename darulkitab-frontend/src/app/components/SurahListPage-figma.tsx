import React from 'react';
import { SURAHS } from '../data/mock-data';
import { BookOpen, ChevronRight } from 'lucide-react';

export function SurahListPage({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) {
  return (
    <div className="pb-32 md:pb-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">All Surahs</h1>
        <p className="text-muted-foreground">Complete list of Quran chapters</p>
      </div>

      <div className="space-y-2">
        {SURAHS.map((surah) => (
          <div
            key={surah.number}
            onClick={() => onNavigate('surah-detail', surah)}
            className="bg-card p-4 rounded-2xl border border-border hover:border-primary transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary">{surah.number}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="mb-0.5">{surah.name}</h3>
                    <p className="text-sm text-muted-foreground">{surah.translation}</p>
                  </div>
                  <div className="text-right">
                    <p style={{ fontFamily: 'var(--font-family-arabic)' }} className="text-xl mb-0.5">
                      {surah.nameArabic}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{surah.verses} verses • {surah.type}</span>
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
