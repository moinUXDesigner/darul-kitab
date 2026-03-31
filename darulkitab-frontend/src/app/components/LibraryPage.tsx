import React from 'react';
import { BookmarkCheck, Download, ListMusic, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LibraryPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { isPremium } = useAuth();

  const libraryItems = [
    {
      icon: ListMusic,
      title: 'Playlists',
      count: isPremium ? 5 : 2,
      description: 'Your custom playlists',
      locked: false
    },
    {
      icon: Download,
      title: 'Downloads',
      count: isPremium ? 24 : 0,
      description: 'Offline content',
      locked: !isPremium
    },
    {
      icon: BookmarkCheck,
      title: 'Bookmarks',
      count: 12,
      description: 'Saved ayahs',
      locked: false
    }
  ];

  return (
    <div className="pb-32 md:pb-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Library</h1>
        <p className="text-muted-foreground">Your saved content and playlists</p>
      </div>

      {!isPremium && (
        <div className="bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 p-6 rounded-2xl mb-6">
          <div className="flex items-start gap-4">
            <Crown className="w-8 h-8 text-accent flex-shrink-0" />
            <div className="flex-1">
              <h3 className="mb-2">Upgrade to Premium</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download surahs for offline listening and create unlimited playlists
              </p>
              <button
                onClick={() => onNavigate('subscription')}
                className="px-6 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {libraryItems.map((item, index) => (
          <div
            key={index}
            className={`bg-card p-6 rounded-2xl border border-border hover:border-primary transition-colors ${
              item.locked ? 'opacity-60' : 'cursor-pointer'
            }`}
            onClick={() => {
              if (item.locked) {
                onNavigate('subscription');
              }
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3>{item.title}</h3>
                  {item.locked && <Crown className="w-4 h-4 text-accent" />}
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl mb-1">{item.count}</div>
                <div className="text-xs text-muted-foreground">items</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sample Playlists */}
      <div className="mt-8">
        <h3 className="text-xl mb-4">Recent Playlists</h3>
        <div className="space-y-3">
          {[
            { name: 'Morning Recitation', count: 5, color: 'from-primary to-secondary' },
            { name: 'Favorite Surahs', count: 8, color: 'from-secondary to-primary' }
          ].map((playlist, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r ${playlist.color} p-5 rounded-2xl text-white cursor-pointer hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="mb-1">{playlist.name}</h4>
                  <p className="text-sm text-white/80">{playlist.count} ayahs</p>
                </div>
                <ListMusic className="w-8 h-8 opacity-80" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isPremium && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Downloads are available for Premium members only
          </p>
        </div>
      )}
    </div>
  );
}
