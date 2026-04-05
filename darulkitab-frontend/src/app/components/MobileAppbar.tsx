import React, { useState } from 'react';
import { Menu, Sun, Moon, Settings, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MobileAppbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (page: string) => void;
}

export function MobileAppbar({ theme, onToggleTheme, onNavigate }: MobileAppbarProps) {
  const { user } = useAuth();
  const initials = user?.user_name?.charAt(0).toUpperCase() || 'U';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex md:hidden items-center justify-between h-14 px-4 border-b border-border bg-card sticky top-0 z-30">
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(true)} className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Profile avatar */}
          <button
            onClick={() => onNavigate('settings')}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium"
          >
            {initials}
          </button>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-lg text-primary-foreground">د</span>
                </div>
                <span className="font-medium">Quran Fahmi</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {[
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="pt-4 border-t border-border text-xs text-muted-foreground text-center">
              © 2026 Darul Kitab Audio
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
