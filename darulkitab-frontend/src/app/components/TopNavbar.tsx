import React from 'react';
import { Sun, Moon, PanelLeftClose, PanelLeftOpen, MessageSquare, Bell, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FeedbackDialog } from './FeedbackDialog';
import { useNotificationsSummary } from '../hooks/useNotifications';

interface TopNavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (page: string) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function TopNavbar({
  theme,
  onToggleTheme,
  onNavigate,
  isSidebarCollapsed,
  onToggleSidebar,
}: TopNavbarProps) {
  const { user, isPremium } = useAuth();
  const initials = user?.user_name?.charAt(0).toUpperCase() || 'U';
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const { unreadCount } = useNotificationsSummary();

  return (
    <>
      <header className="hidden md:flex items-center justify-between h-14 px-6 border-b border-border bg-card sticky top-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('subscription')}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors ${
              isPremium
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15'
                : 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/15'
            }`}
            aria-label="Open premium subscription page"
            title="Open premium subscription page"
          >
            <Crown className="w-4 h-4" />
            <span className="font-medium">{isPremium ? 'Premium Active' : 'Go Premium'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Open notifications"
            title="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[10px] font-semibold text-primary-foreground">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Send feedback"
            title="Send feedback"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden lg:inline">Feedback</span>
          </button>

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

          <button
            onClick={() => onNavigate('profile')}
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

      <FeedbackDialog isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}
