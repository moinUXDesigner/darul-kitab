import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SURAHS, RECITERS, SAMPLE_AYAHS } from '../data/mock-data';
import { Search as SearchIcon, X, Crown, BookOpen, Headphones, FileText } from 'lucide-react';

export function SearchPage({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) {
  const { isPremium } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'surah' | 'reciter' | 'ayah'>('all');

  const filteredSurahs = SURAHS.filter(surah =>
    (activeFilter === 'all' || activeFilter === 'surah') &&
    (surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     surah.nameArabic.includes(searchQuery) ||
     surah.translation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredReciters = RECITERS.filter(reciter =>
    (activeFilter === 'all' || activeFilter === 'reciter') &&
    reciter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAyahs = SAMPLE_AYAHS.filter(ayah =>
    (activeFilter === 'all' || activeFilter === 'ayah') &&
    (ayah.arabicText.includes(searchQuery) ||
     ayah.translation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const hasResults = filteredSurahs.length > 0 || filteredReciters.length > 0 || filteredAyahs.length > 0;

  return (
    <div className="pb-32 md:pb-8">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-4 -mt-2 pt-2">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search surahs, reciters, ayahs..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'all', label: 'All', icon: SearchIcon },
            { id: 'surah', label: 'Surahs', icon: BookOpen },
            { id: 'reciter', label: 'Reciters', icon: Headphones },
            { id: 'ayah', label: 'Ayahs', icon: FileText }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {!searchQuery ? (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl mb-2">Search Darul Kitab</h3>
          <p className="text-muted-foreground">Find your favorite surahs, reciters, and ayahs</p>
        </div>
      ) : !hasResults ? (
        <div className="text-center py-12">
          <X className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl mb-2">No results found</h3>
          <p className="text-muted-foreground">Try different keywords or filters</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Surahs Results */}
          {filteredSurahs.length > 0 && (
            <section>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Surahs ({filteredSurahs.length})
              </h3>
              <div className="space-y-2">
                {filteredSurahs.map((surah) => (
                  <div
                    key={surah.number}
                    onClick={() => onNavigate('surah-detail', surah)}
                    className="bg-card p-4 rounded-2xl border border-border hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary">{surah.number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="truncate">{surah.name}</h4>
                          <span style={{ fontFamily: 'var(--font-family-arabic)' }} className="text-lg">
                            {surah.nameArabic}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {surah.verses} verses • {surah.type}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reciters Results */}
          {filteredReciters.length > 0 && (
            <section>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-primary" />
                Reciters ({filteredReciters.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredReciters.map((reciter) => (
                  <div
                    key={reciter.id}
                    className="bg-card p-4 rounded-2xl border border-border hover:border-primary transition-colors cursor-pointer text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-3 flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <h4 className="text-sm truncate">{reciter.name}</h4>
                      {reciter.isPremium && !isPremium && (
                        <Crown className="w-3 h-3 text-accent flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{reciter.country}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ayahs Results */}
          {filteredAyahs.length > 0 && (
            <section>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Ayahs ({filteredAyahs.length})
              </h3>
              <div className="space-y-4">
                {filteredAyahs.map((ayah) => (
                  <div
                    key={ayah.id}
                    className="bg-card p-4 rounded-2xl border border-border hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="mb-3" style={{ fontFamily: 'var(--font-family-arabic)', lineHeight: 1.8 }}>
                      <p className="text-xl">{ayah.arabicText}</p>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2 italic">"{ayah.translation}"</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {ayah.surahName} - Ayah {ayah.ayahNumber}
                      </span>
                      {ayah.isPremium && !isPremium && (
                        <span className="flex items-center gap-1 text-accent">
                          <Crown className="w-3 h-3" />
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
