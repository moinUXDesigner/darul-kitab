import React from 'react';
import { Home, Search, Library, Crown, Settings, BookOpen, LayoutGrid, Shield, Users, CreditCard, MessageSquare, IndianRupee, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Icon from '/public/icon.png';
import QuranFahmi from '/public/quran-fahmi.svg';
import Logo from '/public/logo.png';
import Book from '/public/icons/book.svg';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { isPremium, isAdmin } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'surah-list', label: 'Surahs', icon: BookOpen },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Saved', icon: Library },
    { id: 'subscription', label: 'Premium', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const adminItems = [
    { id: 'admin', label: 'Dashboard', icon: LayoutGrid },
    { id: 'admin-users', label: 'Users', icon: Users },
    { id: 'admin-plans', label: 'Plans', icon: CreditCard },
    { id: 'admin-feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'admin-settlements', label: 'Payouts', icon: IndianRupee },
    { id: 'admin-notifications', label: 'Alerts', icon: Bell },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-xl text-primary-foreground">د</span>
          </div> */}

          <div className="rounded-xl bg-primary flex items-center justify-center">
            <img src={Logo} alt="Quran Fahmi Logo" className="w-30 h-30 object-cover " />        
          </div>
          
          
          
          <div>

            <h2 className="text-lg">Quran Fahmi</h2>
            <p className="text-xs text-sidebar-foreground/60">Audio</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
          Explore
        </div>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                    className={`group w-full flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                      isActive
                        ? 'border-primary/10 bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                        : 'border-sidebar-border/60 bg-sidebar-accent/30 text-sidebar-foreground/70 group-hover:border-transparent group-hover:bg-sidebar-accent group-hover:text-sidebar-foreground'
                    }`}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="text-[15px] font-medium tracking-tight">{item.label}</span>
                  {item.id === 'subscription' && isPremium && (
                    <span className="ml-auto text-[11px] px-2.5 py-1 rounded-full bg-accent/15 text-accent font-semibold">
                      Pro
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="my-5 border-t border-sidebar-border" />
            <div className="flex items-center gap-2 px-3 mb-3">
              <Shield className="w-4 h-4 text-violet-500" />
              <span className="text-[11px] font-semibold text-sidebar-foreground/45 uppercase tracking-[0.18em]">Admin</span>
            </div>
            <ul className="space-y-0.5">
              {adminItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={`group w-full flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all text-sm ${
                        isActive
                          ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                          isActive
                            ? 'border-violet-500/20 bg-violet-500 text-white shadow-sm shadow-violet-500/20'
                            : 'border-sidebar-border/60 bg-sidebar-accent/30 text-sidebar-foreground/70 group-hover:border-transparent group-hover:bg-sidebar-accent group-hover:text-sidebar-foreground'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                      </span>
                      <span className="font-medium tracking-tight">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      {/* Premium Banner */}
      {!isPremium && (
        <div className="p-4 m-4 rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/25 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mb-3">
            <Crown className="w-5 h-5" />
          </div>
          <h3 className="text-sm mb-1.5">Go Premium</h3>
          <p className="text-xs leading-5 text-muted-foreground mb-3">
            Unlock all reciters and offline downloads
          </p>
          <button
            onClick={() => onNavigate('subscription')}
            className="w-full py-2.5 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-colors text-sm font-medium"
          >
            View Premium
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60 text-center">
        <p>© {new Date().getFullYear()} Quran Fahmi Audio</p>
      </div>
    </aside>
  );
}
