import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { HomePage } from './components/HomePage';
import { SearchPage } from './components/SearchPage';
import { SurahListPage } from './components/SurahListPage';
import { SurahDetailPage } from './components/SurahDetailPage';
import { LibraryPage } from './components/LibraryPage';
import { SubscriptionPage } from './components/SubscriptionPage';
import { SettingsPage } from './components/SettingsPage';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayer } from './components/FullPlayer';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import QuranAudioList from './components/QuranAudioList';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>(isAuthenticated ? 'home' : 'login');
  const [pageData, setPageData] = useState<any>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
    window.scrollTo(0, 0);
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'forgot-password') {
      setCurrentPage('login');
    }
  }, [isAuthenticated, currentPage]);

  // Auth Pages
  if (!isAuthenticated) {
    if (currentPage === 'signup') {
      return <SignupPage onNavigate={handleNavigate} />;
    }
    if (currentPage === 'forgot-password') {
      return <ForgotPasswordPage onNavigate={handleNavigate} />;
    }
    return <LoginPage onNavigate={handleNavigate} />;
  }

  // Main App Layout
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar activePage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'search' && <SearchPage onNavigate={handleNavigate} />}
          {currentPage === 'surah-list' && <SurahListPage onNavigate={handleNavigate} />}
          {currentPage === 'surah-detail' && pageData && (
            <SurahDetailPage surah={pageData} onNavigate={handleNavigate} />
          )}
          {currentPage === 'library' && <LibraryPage onNavigate={handleNavigate} />}
          {currentPage === 'darulkitab' && <QuranAudioList onNavigate={handleNavigate} />}
          {currentPage === 'subscription' && <SubscriptionPage onNavigate={handleNavigate} />}
          {currentPage === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav activePage={currentPage} onNavigate={handleNavigate} />

        {/* Mini Player */}
        <MiniPlayer onNavigate={handleNavigate} />

        {/* Full Player */}
        <FullPlayer onNavigate={handleNavigate} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AudioPlayerProvider>
        <AppContent />
      </AudioPlayerProvider>
    </AuthProvider>
  );
}