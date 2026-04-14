import { useEffect, useState } from 'react';

const LIBRARY_FEATURE_STORAGE_KEY = 'feature_library_enabled';
const LIBRARY_FEATURE_EVENT = 'darulkitab-library-feature-updated';

function readLibraryFeatureState() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(LIBRARY_FEATURE_STORAGE_KEY) === 'true';
}

function notifyLibraryFeatureUpdated(enabled: boolean) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(LIBRARY_FEATURE_EVENT, { detail: { enabled } }));
}

export function setLibraryFeatureEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LIBRARY_FEATURE_STORAGE_KEY, String(enabled));
  notifyLibraryFeatureUpdated(enabled);
}

export function useLibraryFeature() {
  const [isLibraryEnabled, setIsLibraryEnabled] = useState(readLibraryFeatureState);

  useEffect(() => {
    const syncState = () => {
      setIsLibraryEnabled(readLibraryFeatureState());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LIBRARY_FEATURE_STORAGE_KEY) {
        syncState();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(LIBRARY_FEATURE_EVENT, syncState as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(LIBRARY_FEATURE_EVENT, syncState as EventListener);
    };
  }, []);

  const updateLibraryFeature = (enabled: boolean) => {
    setIsLibraryEnabled(enabled);
    setLibraryFeatureEnabled(enabled);
  };

  return {
    isLibraryEnabled,
    setLibraryFeatureEnabled: updateLibraryFeature,
  };
}
