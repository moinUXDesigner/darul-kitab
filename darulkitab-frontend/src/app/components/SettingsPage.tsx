import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useLibraryFeature } from '../hooks/useLibraryFeature';
import api from '../api/axios';
import { Moon, Sun, Volume2, Globe, Crown, LogOut, User, Bell, Shield, HelpCircle, Loader2, MessageSquare, Send, CheckCircle2, X, ExternalLink, FileText, Mail, Lock, BookOpen } from 'lucide-react';

export function SettingsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user, logout, isPremium, isAdmin } = useAuth();
  const { isLibraryEnabled, setLibraryFeatureEnabled } = useLibraryFeature();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [audioQuality, setAudioQuality] = useState(isPremium ? 'high' : 'standard');
  const [language, setLanguage] = useState('english');
  const {
    isSupported: pushSupported,
    isSubscribed: pushSubscribed,
    loading: pushLoading,
    toggle: togglePush,
    permission: pushPermission,
    statusMessage: pushStatusMessage,
    supportHint: pushSupportHint,
  } = usePushNotifications();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const legalLinks = [
    { label: 'Terms & Conditions', href: '/terms-and-conditions.html', icon: FileText },
    { label: 'Privacy Policy', href: '/privacy-policy.html', icon: Shield },
    { label: 'Cancellation & Refund', href: '/cancellation-and-refund.html', icon: FileText },
    { label: 'Shipping & Exchange', href: '/shipping-and-exchange.html', icon: FileText },
    { label: 'Contact Us', href: '/contact-us.html', icon: Mail },
  ];
  const membershipCards = [
    {
      title: 'Free',
      active: !isPremium,
      accentClass: 'border-border bg-background',
      items: ['3 reciters', 'Streaming only', 'Standard audio', 'Ads supported'],
    },
    {
      title: 'Premium',
      active: isPremium,
      accentClass: 'border-accent/30 bg-accent/10',
      items: ['All reciters unlocked', 'Offline downloads', '320kbps audio', 'No ads'],
    },
  ];

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;
    setFeedbackLoading(true);
    setFeedbackError('');
    try {
      await api.post('user/feedback.php', { query: feedbackText.trim() });
      setFeedbackSent(true);
      setFeedbackText('');
      setTimeout(() => { setFeedbackSent(false); setFeedbackOpen(false); }, 2000);
    } catch (err: any) {
      setFeedbackError(err.response?.data?.message || 'Failed to send feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

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
            <div className="border-t border-violet-500/20 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-violet-500" />
                    <span>Show Library menu</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Control whether the `Library` menu item is visible in desktop and mobile navigation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setLibraryFeatureEnabled(!isLibraryEnabled)}
                  className={`relative h-6 w-12 rounded-full transition-colors ${
                    isLibraryEnabled ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-label={isLibraryEnabled ? 'Hide Library menu' : 'Show Library menu'}
                  aria-pressed={isLibraryEnabled}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      isLibraryEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
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
          <button
            onClick={() => onNavigate('change-password')}
            className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors border-b border-border"
          >
            <Lock className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left">Change Password</span>
          </button>
          <button className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors">
            <Shield className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left">Privacy & Security</span>
          </button>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg mb-3">Membership Snapshot</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {membershipCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-2xl border p-5 ${card.accentClass}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {card.title === 'Premium' ? (
                    <Crown className="w-5 h-5 text-accent" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                  <span>{card.title}</span>
                </div>
                {card.active && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    Current
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {card.items.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Push Notifications */}
      <section className="mb-6">
        <h3 className="text-lg mb-3">Notifications</h3>
        <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${pushSubscribed ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>Allow Push Notifications</span>
                  {pushSubscribed && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] text-primary">
                      Enabled
                    </span>
                  )}
                  {!pushSupported && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                      Unsupported here
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pushStatusMessage}
                </p>
                {!!pushSupportHint && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {pushSupportHint}
                  </p>
                )}
                {pushPermission === 'denied' && (
                  <p className="mt-2 text-xs text-amber-600">
                    Notifications were blocked by the browser. Re-enable them in site settings to receive admin alerts.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={togglePush}
              disabled={pushLoading || !pushSupported || pushPermission === 'denied'}
              className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                pushSubscribed ? 'bg-primary' : 'bg-muted'
              }`}
              aria-label={pushSubscribed ? 'Disable push notifications' : 'Enable push notifications'}
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

          <div className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            New recitations, premium updates, and admin announcements will appear in your notifications inbox even if push is turned off.
          </div>

          {!pushSupported && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-700">
              Push opt-in is unavailable on this page because the browser only allows it on secure origins such as your live HTTPS domain.
            </div>
          )}

          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <Bell className="w-4 h-4" />
            Open Notifications Page
          </button>
        </div>
      </section>

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
          <button
            onClick={() => { setFeedbackOpen(!feedbackOpen); setFeedbackSent(false); setFeedbackError(''); }}
            className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors border-b border-border"
          >
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left">Send Feedback</span>
            {feedbackOpen ? <X className="w-4 h-4 text-muted-foreground" /> : null}
          </button>

          {feedbackOpen && (
            <div className="p-4 border-b border-border">
              {feedbackSent ? (
                <div className="flex items-center gap-2 text-green-600 py-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Thank you for your feedback!</span>
                </div>
              ) : (
                <>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you think, report a bug, or suggest a feature..."
                    maxLength={2000}
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{feedbackText.length}/2000</span>
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={feedbackLoading || !feedbackText.trim()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {feedbackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit
                    </button>
                  </div>
                  {feedbackError && <p className="text-xs text-destructive mt-2">{feedbackError}</p>}
                </>
              )}
            </div>
          )}

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

      <section className="mb-6">
        <h3 className="text-lg mb-3">Legal</h3>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {legalLinks.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors ${index !== legalLinks.length - 1 ? 'border-b border-border' : ''}`}
            >
              <item.icon className="w-5 h-5 text-primary" />
              <span className="flex-1 text-left">{item.label}</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          ))}
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
        <p className="mt-1">© {new Date().getFullYear()} Quran Fahmi Audio</p>
      </div>
    </div>
  );
}
