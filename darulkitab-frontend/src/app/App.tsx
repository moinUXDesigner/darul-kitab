import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import { AuthLoginPage as LoginPage } from './components/AuthLoginPage';
import { AuthSignupPage as SignupPage } from './components/AuthSignupPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { HomePage } from './components/HomePage';
import { SearchPage } from './components/SearchPage';
import { SurahListPage } from './components/SurahListPage';
import { SurahDetailPage } from './components/SurahDetailPage';
import { LibraryPage } from './components/LibraryPage';
import { FavoritesPage } from './components/FavoritesPage';
import { SubscriptionPage } from './components/SubscriptionPage';
import { NotificationsPage } from './components/NotificationsPage';
import { SettingsPage } from './components/SettingsPage';
import { ChangePasswordPage } from './components/ChangePasswordPage';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayer } from './components/FullPlayer';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { MobileAppbar } from './components/MobileAppbar';
import { InstallPrompt, UpdatePrompt } from './components/PwaPrompts';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { AdminUsersPage } from './components/AdminUsersPage';
import { AdminPlansPage } from './components/AdminPlansPage';
import { AdminFeedbackPage } from './components/AdminFeedbackPage';
import { AdminSettlementsPage } from './components/AdminSettlementsPage';
import { AdminNotificationsPage } from './components/AdminNotificationsPage';
import { useTheme } from './hooks/useTheme';

function clearAuthQueryParams() {
  const url = new URL(window.location.href);
  let changed = false;

  ['page', 'token'].forEach((key) => {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  });

  if (changed) {
    const search = url.searchParams.toString();
    const nextUrl = `${url.pathname}${search ? `?${search}` : ''}${url.hash}`;
    window.history.replaceState({}, '', nextUrl);
  }
}

function getInitialPage() {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('jwt_token');

  if (storedUser && storedToken) {
    clearAuthQueryParams();
    return 'home';
  }

  const query = new URLSearchParams(window.location.search);
  const requestedPage = query.get('page');
  const token = query.get('token');

  if (requestedPage === 'reset-password' && token) {
    return 'reset-password';
  }

  if (requestedPage === 'signup') {
    return 'signup';
  }

  if (requestedPage === 'forgot-password') {
    return 'forgot-password';
  }

  return 'login';
}

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);
  const [pageData, setPageData] = useState<any>(null);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('desktop_sidebar_collapsed') === 'true';
  });

  console.log('Window Width:', window.innerWidth);
  console.log("Window Height:", window.innerHeight);

  const handleNavigate = (page: string, data?: any) => {
    if (page !== 'reset-password') {
      clearAuthQueryParams();
    }
    setCurrentPage(page);
    setPageData(data);
    window.scrollTo(0, 0);
  };

  const handleToggleDesktopSidebar = () => {
    setIsDesktopSidebarCollapsed((previousState) => !previousState);
  };

  // Redirect to login if not authenticated, or to home if authenticated on auth pages
  React.useEffect(() => {
    if (!isAuthenticated && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'forgot-password' && currentPage !== 'reset-password') {
      setCurrentPage('login');
    }
    if (isAuthenticated && (currentPage === 'login' || currentPage === 'signup' || currentPage === 'forgot-password' || currentPage === 'reset-password')) {
      clearAuthQueryParams();
      setCurrentPage('home');
    }
  }, [isAuthenticated, currentPage]);

  React.useEffect(() => {
    localStorage.setItem('desktop_sidebar_collapsed', String(isDesktopSidebarCollapsed));
  }, [isDesktopSidebarCollapsed]);

  // Auth Pages
  if (!isAuthenticated) {
    if (currentPage === 'signup') {
      return <SignupPage onNavigate={handleNavigate} />;
    }
    if (currentPage === 'forgot-password') {
      return <ForgotPasswordPage onNavigate={handleNavigate} />;
    }
    if (currentPage === 'reset-password') {
      return <ResetPasswordPage onNavigate={handleNavigate} />;
    }
    return <LoginPage onNavigate={handleNavigate} />;
  }

  // Main App Layout
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar
        activePage={currentPage}
        onNavigate={handleNavigate}
        isCollapsed={isDesktopSidebarCollapsed}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Desktop Top Navbar */}
        <TopNavbar
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={handleNavigate}
          isSidebarCollapsed={isDesktopSidebarCollapsed}
          onToggleSidebar={handleToggleDesktopSidebar}
        />

        {/* Mobile Appbar */}
        <MobileAppbar theme={theme} onToggleTheme={toggleTheme} onNavigate={handleNavigate} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'search' && <SearchPage onNavigate={handleNavigate} />}
          {currentPage === 'surah-list' && <SurahListPage onNavigate={handleNavigate} />}
          {currentPage === 'surah-detail' && pageData && (
            <SurahDetailPage surah={pageData} onNavigate={handleNavigate} />
          )}
          {currentPage === 'library' && <LibraryPage onNavigate={handleNavigate} />}
          {currentPage === 'favorites' && <FavoritesPage onNavigate={handleNavigate} />}
          {currentPage === 'subscription' && <SubscriptionPage onNavigate={handleNavigate} />}
          {currentPage === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
          {currentPage === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
          {currentPage === 'change-password' && <ChangePasswordPage onNavigate={handleNavigate} />}
          {/* Admin Pages (only rendered for admin role) */}
          {isAdmin && currentPage === 'admin' && <AdminDashboardPage onNavigate={handleNavigate} />}
          {isAdmin && currentPage === 'admin-users' && <AdminUsersPage onNavigate={handleNavigate} />}
          {isAdmin && currentPage === 'admin-plans' && <AdminPlansPage onNavigate={handleNavigate} />}
          {isAdmin && currentPage === 'admin-feedback' && <AdminFeedbackPage onNavigate={handleNavigate} />}
          {isAdmin && currentPage === 'admin-settlements' && <AdminSettlementsPage onNavigate={handleNavigate} />}
          {isAdmin && currentPage === 'admin-notifications' && <AdminNotificationsPage onNavigate={handleNavigate} />}
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav activePage={currentPage} onNavigate={handleNavigate} />

        {/* Mini Player */}
        <MiniPlayer onNavigate={handleNavigate} />

        {/* Full Player */}
        <FullPlayer onNavigate={handleNavigate} />

        {/* PWA Prompts */}
        <InstallPrompt />
        <UpdatePrompt />
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
