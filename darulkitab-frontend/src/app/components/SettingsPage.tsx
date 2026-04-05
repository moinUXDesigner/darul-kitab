import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Moon, Sun, Volume2, Globe, Crown, LogOut, User, Bell, Shield, HelpCircle, Loader2 } from 'lucide-react';

export function SettingsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user, logout, isPremium, isAdmin } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [audioQuality, setAudioQuality] = useState(isPremium ? 'high' : 'standard');
  const [language, setLanguage] = useState('english');
  const { isSupported: pushSupported, isSubscribed: pushSubscribed, loading: pushLoading, toggle: togglePush, permission: pushPermission } = usePushNotifications();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      onNavigate('login');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="pb-32 md:pb-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-card p-6 rounded-2xl border border-border mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl">
            {user?.user_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="mb-1">{user?.user_name}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {isPremium ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">
                  <Crown className="w-3 h-3" />
                  Premium Member
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                  Free Plan
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel Access */}
      {isAdmin && (
        <section className="mb-6">
          <h3 className="text-lg mb-3">Administration</h3>
          <div className="bg-card rounded-2xl border border-violet-500/30 overflow-hidden">
            <button
              onClick={() => onNavigate('admin')}
              className="w-full p-4 flex items-center gap-3 hover:bg-violet-500/5 transition-colors"
            >
              <Shield className="w-5 h-5 text-violet-500" />
              <span className="flex-1 text-left">Admin Dashboard</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500">Admin</span>
            </button>
          </div>
        </section>
      )}

      {/* Account Settings */}
      <section className="mb-6">
        <h3 className="text-lg mb-3">Account</h3>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <button className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors border-b border-border">
            <User className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left">Edit Profile</span>
          </button>
          <button className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors">
            <Shield className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left">Privacy & Security</span>
          </button>
        </div>
      </section>

      {/* Push Notifications */}
      {pushSupported && (
        <section className="mb-6">
          <h3 className="text-lg mb-3">Notifications</h3>
          <div className="bg-card p-4 rounded-2xl border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <span>Push Notifications</span>
                  <p className="text-xs text-muted-foreground">
                    {pushPermission === 'denied'
                      ? 'Blocked in browser settings'
                      : pushSubscribed
                        ? 'Receiving notifications'
                        : 'Get updates about new content'}
                  </p>
                </div>
              </div>
              <button
                onClick={togglePush}
                disabled={pushLoading || pushPermission === 'denied'}
                className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 ${
                  pushSubscribed ? 'bg-primary' : 'bg-muted'
                }`}
              >
                {pushLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin absolute top-1 left-4" />
                ) : (
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      pushSubscribed ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Appearance */}
      <section className="mb-6">
        <h3 className="text-lg mb-3">Appearance</h3>
        <div className="bg-card p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
              <span>Dark Mode</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Audio Settings */}
      <section className="mb-6">
        <h3 className="text-lg mb-3">Audio</h3>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-primary" />
                <span>Audio Quality</span>
              </div>
              {audioQuality === 'high' && !isPremium && (
                <Crown className="w-4 h-4 text-accent" />
              )}
            </div>
            <select
              value={audioQuality}
              onChange={(e) => {
                if (e.target.value === 'high' && !isPremium) {
                  onNavigate('subscription');
                  return;
                }
                setAudioQuality(e.target.value);
              }}
              className="w-full mt-2 px-3 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low (64 kbps)</option>
              <option value="standard">Standard (128 kbps)</option>
              <option value="high" disabled={!isPremium}>
                High (320 kbps) {!isPremium ? '- Premium only' : ''}
              </option>
            </select>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <span>Translation Language</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="english">English</option>
              <option value="urdu">Urdu</option>
              <option value="hindi">Hindi</option>
              <option value="arabic">Arabic</option>
            </select>
          </div>
        </div>
      </section>

      {/* Subscription */}
      {!isPremium && (
        <section className="mb-6">
          <div className="bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <Crown className="w-8 h-8 text-accent flex-shrink-0" />
              <div className="flex-1">
                <h3 className="mb-2">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Unlock all features and support Islamic audio content
                </p>
                <button
                  onClick={() => onNavigate('subscription')}
                  className="px-6 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors"
                >
                  View Plans
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {isPremium && (
        <section className="mb-6">
          <h3 className="text-lg mb-3">Subscription</h3>
          <div className="bg-card p-4 rounded-2xl border border-border">
            <button
              onClick={() => onNavigate('subscription')}
              className="w-full flex items-center gap-3 hover:bg-muted transition-colors p-2 rounded-xl"
            >
              <Crown className="w-5 h-5 text-accent" />
              <span className="flex-1 text-left">Manage Subscription</span>
            </button>
          </div>
        </section>
      )}

      {/* Help & Support */}
      <section className="mb-6">
        <h3 className="text-lg mb-3">Help & Support</h3>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <button className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors border-b border-border">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left">Help Center</span>
          </button>
          <button className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left">About Darul Kitab</span>
          </button>
        </div>
      </section>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full p-4 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Version 1.0.0</p>
        <p className="mt-1">© 2026 Darul Kitab Audio</p>
      </div>
    </div>
  );
}
