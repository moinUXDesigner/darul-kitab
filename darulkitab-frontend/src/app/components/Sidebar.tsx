import React from 'react';
import { Home, Search, Library, Crown, Settings, Book } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { isPremium } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'darulkitab', label: 'Darul Kitab', icon: Book },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-xl text-primary-foreground">د</span>
          </div>
          <div>
            <h2 className="text-lg">Darul Kitab</h2>
            <p className="text-xs text-sidebar-foreground/60">Audio</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.id === 'subscription' && isPremium && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                      Pro
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Premium Banner */}
      {!isPremium && (
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30">
          <Crown className="w-8 h-8 text-accent mb-2" />
          <h3 className="text-sm mb-1">Go Premium</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Unlock all reciters and offline downloads
          </p>
          <button
            onClick={() => onNavigate('subscription')}
            className="w-full py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm"
          >
            Upgrade Now
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60 text-center">
        <p>© 2026 Darul Kitab Audio</p>
      </div>
    </aside>
  );
}
