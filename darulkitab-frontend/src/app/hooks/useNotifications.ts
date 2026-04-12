import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

const NOTIFICATIONS_UPDATED_EVENT = 'darulkitab-notifications-updated';

export function emitNotificationsUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
  }
}

export function useNotificationsSummary() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get('/user/notifications.php?summary=1');
      setUnreadCount(Number(res.data?.unread_count ?? 0));
    } catch {
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handleUpdated = () => {
      refresh();
    };

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdated);
    return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdated);
  }, [refresh]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };

    const handleFocus = () => {
      refresh();
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    }, 60000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refresh]);

  return {
    unreadCount,
    loading,
    refresh,
  };
}
