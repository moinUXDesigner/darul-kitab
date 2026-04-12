import React, { useState } from 'react';
import { Menu, Sun, Moon, Settings, X, Library, MessageSquare, Home, Search, BookOpen, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FeedbackDialog } from './FeedbackDialog';
import { useNotificationsSummary } from '../hooks/useNotifications';

interface MobileAppbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (page: string) => void;
}

export function MobileAppbar({ theme, onToggleTheme, onNavigate }: MobileAppbarProps) {
  const { user } = useAuth();
  const initials = user?.user_name?.charAt(0).toUpperCase() || 'U';
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { unreadCount } = useNotificationsSummary();

  const drawerItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'surah-list', label: 'All Suras', icon: BookOpen },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <header className="flex md:hidden items-center justify-between h-14 px-4 border-b border-border bg-card sticky top-0 z-30">
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(true)} className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('notifications')}
            className="relative p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Open notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[10px] font-semibold text-primary-foreground">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFeedbackOpen(true)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Open feedback form"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

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
              {drawerItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <span className="ml-auto min-w-6 rounded-full bg-primary px-2 py-0.5 text-center text-[11px] font-semibold text-primary-foreground">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="pt-4 border-t border-border text-xs text-muted-foreground text-center">
              © 2026 Darul Kitab Audio
            </div>
          </aside>
        </div>
      )}

      <FeedbackDialog isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}
