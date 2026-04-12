import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { emitNotificationsUpdated } from '../hooks/useNotifications';
import { ArrowLeft, Bell, BookOpen, ChevronLeft, ChevronRight, Crown, Info, Loader2, Sparkles } from 'lucide-react';

interface NotificationItem {
  id: number;
  title: string;
  body: string;
  url: string;
  sent_at: string;
  is_read: number;
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

function getNotificationMeta(item: NotificationItem) {
  const text = `${item.title} ${item.body} ${item.url}`.toLowerCase();

  if (text.includes('premium') || text.includes('plan') || text.includes('subscription')) {
    return {
      icon: Crown,
      iconClass: 'text-amber-500',
      bgClass: 'bg-amber-500/10',
    };
  }

  if (text.includes('surah') || text.includes('reciter') || text.includes('content') || text.includes('new')) {
    return {
      icon: BookOpen,
      iconClass: 'text-emerald-600',
      bgClass: 'bg-emerald-500/10',
    };
  }

  if (text.includes('alert') || text.includes('update')) {
    return {
      icon: Sparkles,
      iconClass: 'text-violet-500',
      bgClass: 'bg-violet-500/10',
    };
  }

  return {
    icon: Bell,
    iconClass: 'text-primary',
    bgClass: 'bg-primary/10',
  };
}

export function NotificationsPage({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<number | 'all' | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const limit = 20;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchNotifications = async (nextPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/user/notifications.php?page=${nextPage}&limit=${limit}`);
      const items = Array.isArray(res.data?.data) ? res.data.data : [];
      setNotifications(items);
      setTotal(Number(res.data?.total ?? items.length));
      setUnreadCount(Number(res.data?.unread_count ?? 0));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const unreadItemsOnPage = useMemo(
    () => notifications.filter((item) => Number(item.is_read) !== 1).length,
    [notifications],
  );

  const handleMarkRead = async (notificationId: number) => {
    setMarkingId(notificationId);

    try {
      const res = await api.post('/user/notifications.php', {
        notification_id: notificationId,
      });

      setNotifications((previousItems) =>
        previousItems.map((item) =>
          item.id === notificationId
            ? { ...item, is_read: 1 }
            : item,
        ),
      );
      setUnreadCount(Number(res.data?.unread_count ?? Math.max(0, unreadCount - 1)));
      emitNotificationsUpdated();
    } catch {
      // Keep the current state when marking fails.
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingId('all');

    try {
      const res = await api.post('/user/notifications.php', {
        mark_all_read: true,
      });
      setNotifications((previousItems) => previousItems.map((item) => ({ ...item, is_read: 1 })));
      setUnreadCount(Number(res.data?.unread_count ?? 0));
      emitNotificationsUpdated();
    } catch {
      // Keep the current state when marking fails.
    } finally {
      setMarkingId(null);
    }
  };

  const handleOpenNotification = async (item: NotificationItem) => {
    if (Number(item.is_read) !== 1) {
      await handleMarkRead(item.id);
    }

    if (!item.url) return;

    const normalizedUrl = item.url.replace(/^\//, '');
    if (normalizedUrl === '' || normalizedUrl === 'home') {
      onNavigate('home');
      return;
    }

    onNavigate(normalizedUrl);
  };

  return (
    <div className="pb-32 md:pb-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="rounded-xl p-2 transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl mb-1">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}` : 'All caught up'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={markingId === 'all' || unreadCount === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          {markingId === 'all' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Info className="h-4 w-4" />}
          Mark all read
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bell className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-medium">No notifications yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            New content alerts and important updates will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {notifications.map((item) => {
              const { icon: Icon, iconClass, bgClass } = getNotificationMeta(item);
              const isUnread = Number(item.is_read) !== 1;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 transition-colors ${
                    isUnread
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${bgClass}`}>
                      <Icon className={`h-5 w-5 ${iconClass}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">{item.title}</h3>
                        {isUnread && (
                          <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                        {item.body || 'You have a new notification.'}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatRelativeTime(item.sent_at)}</span>
                        <span>{new Date(item.sent_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {isUnread && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(item.id)}
                        disabled={markingId === item.id}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
                      >
                        {markingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                        Mark read
                      </button>
                    )}

                    {!!item.url && (
                      <button
                        type="button"
                        onClick={() => handleOpenNotification(item)}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Open
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} • {unreadItemsOnPage} unread on this page
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((previousPage) => Math.max(1, previousPage - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-border bg-card p-2 transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((previousPage) => Math.min(totalPages, previousPage + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-border bg-card p-2 transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
