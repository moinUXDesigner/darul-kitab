import React from 'react';
import { Sun, Moon, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TopNavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (page: string) => void;
}

export function TopNavbar({ theme, onToggleTheme, onNavigate }: TopNavbarProps) {
  const { user } = useAuth();
  const initials = user?.user_name?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="hidden md:flex items-center justify-between h-14 px-6 border-b border-border bg-card sticky top-0 z-20">
      {/* Search (placeholder) */}
      <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 w-72">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search surahs, reciters..."
          className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
          onFocus={() => onNavigate('search')}
          readOnly
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Theme toggle pills */}
        <div className="flex items-center gap-1 bg-muted rounded-full p-1">
          <button
            onClick={theme === 'light' ? undefined : onToggleTheme}
            className={`p-1.5 rounded-full transition-colors ${
              theme === 'light' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
            }`}
            aria-label="Light mode"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={theme === 'dark' ? undefined : onToggleTheme}
            className={`p-1.5 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
            }`}
            aria-label="Dark mode"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Profile */}
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 hover:bg-muted rounded-xl px-2 py-1.5 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {initials}
          </div>
          <div className="text-left hidden lg:block">
            <div className="text-sm font-medium leading-tight">{user?.user_name || 'User'}</div>
            <div className="text-xs text-muted-foreground leading-tight">{user?.email}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
