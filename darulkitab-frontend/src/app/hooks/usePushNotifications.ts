import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

/**
 * Convert a base64url VAPID public key to a Uint8Array for PushManager.subscribe()
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [supportHint, setSupportHint] = useState('');

  useEffect(() => {
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasPushManager = 'PushManager' in window;
    const hasNotificationApi = 'Notification' in window;
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
    const hasSecureContext = window.isSecureContext || isLocalhost;
    const supported = hasServiceWorker && hasPushManager && hasNotificationApi && hasSecureContext;
    setIsSupported(supported);
    setSupportHint('');

    if (!hasNotificationApi || !hasServiceWorker || !hasPushManager) {
      setStatusMessage('Push notifications are not available in this browser.');
      setSupportHint('Use a modern browser with service worker and push support enabled.');
      return;
    }

    if (!hasSecureContext) {
      setStatusMessage('Push notifications require a secure HTTPS connection before they can be enabled.');
      setSupportHint(`You are currently on ${window.location.origin}. Open the app on your HTTPS domain, or use http://localhost for local testing.`);
      return;
    }

    setStatusMessage('Get alerts for new content and important updates.');

    if (supported) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
      setStatusMessage(
        sub
          ? 'Push notifications are enabled on this device.'
          : Notification.permission === 'denied'
            ? 'Notifications are blocked in your browser settings.'
            : 'Push notifications are available but not enabled yet.',
      );
    } catch {
      setIsSubscribed(false);
      setStatusMessage('Push notifications are available but this device is not subscribed yet.');
    }
  };

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setStatusMessage('Push notifications are unavailable in this browser or context.');
      return false;
    }
    setLoading(true);

    try {
      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        setStatusMessage(
          perm === 'denied'
            ? 'Notifications are blocked. Enable them in your browser settings to receive alerts.'
            : 'Notification permission was not granted.',
        );
        setLoading(false);
        return false;
      }

      // Get VAPID public key from server
      const keyRes = await api.get('/notifications/vapid-public-key.php');
      const vapidPublicKey = keyRes.data.public_key;

      // Subscribe via Push API
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey).buffer as ArrayBuffer,
      });

      // Save subscription on server
      const subJson = subscription.toJSON();
      await api.post('/notifications/subscribe.php', {
        endpoint: subJson.endpoint,
        p256dh: subJson.keys?.p256dh,
        auth: subJson.keys?.auth,
      });

      setIsSubscribed(true);
      setStatusMessage('Push notifications are enabled on this device.');
      return true;
    } catch (err) {
      console.error('[Push] Subscribe failed:', err);
      setStatusMessage('We could not enable push notifications right now. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (sub) {
        const subJson = sub.toJSON();
        await sub.unsubscribe();
        await api.post('/notifications/unsubscribe.php', {
          endpoint: subJson.endpoint,
        });
      }

      setIsSubscribed(false);
      setStatusMessage('Push notifications are turned off on this device.');
      return true;
    } catch (err) {
      console.error('[Push] Unsubscribe failed:', err);
      setStatusMessage('We could not turn off push notifications right now. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (isSubscribed) return unsubscribe();
    return subscribe();
  }, [isSubscribed, subscribe, unsubscribe]);

  return {
    isSupported,
    isSubscribed,
    permission,
    loading,
    statusMessage,
    supportHint,
    subscribe,
    unsubscribe,
    toggle,
  };
}
