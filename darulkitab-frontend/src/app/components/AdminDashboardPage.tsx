import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import {
  Users,
  Crown,
  CreditCard,
  MessageSquare,
  TrendingUp,
  UserCheck,
  UserX,
  AlertTriangle,
  IndianRupee,
  ArrowRight,
  Bell,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

interface DashboardStats {
  total_users: number;
  premium_users: number;
  free_users: number;
  active_subscriptions: number;
  expiring_soon: number;
  expired_subscriptions: number;
  cancelled_subscriptions: number;
  total_revenue: number;
  new_users_30d: number;
  feedback_count: number;
}

export function AdminDashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/admin/dashboard.php')
      .then(res => setStats(res.data.data))
      .catch(err => setError(err?.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-destructive" />
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', page: 'admin-users' },
    { label: 'Premium Users', value: stats.premium_users, icon: Crown, color: 'text-amber-500', bg: 'bg-amber-500/10', page: 'admin-users' },
    { label: 'Free Users', value: stats.free_users, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', page: 'admin-users' },
    { label: 'Expiring Soon', value: stats.expiring_soon, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', page: 'admin-users' },
    { label: 'Expired Subs', value: stats.expired_subscriptions, icon: UserX, color: 'text-red-500', bg: 'bg-red-500/10', page: 'admin-users' },
    { label: 'New (30 days)', value: stats.new_users_30d, icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-500/10', page: 'admin-users' },
    { label: 'Total Revenue', value: `Rs ${stats.total_revenue.toLocaleString()}`, icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-500/10', page: 'admin-settlements' },
    { label: 'Feedback', value: stats.feedback_count, icon: MessageSquare, color: 'text-pink-500', bg: 'bg-pink-500/10', page: 'admin-feedback' },
  ];

  const primaryCards = [cards[0], cards[1], cards[6]];
  const secondaryCards = cards.filter(card => !primaryCards.includes(card));
  const quickActions = [
    { label: 'Manage Razorpay Plans', icon: CreditCard, page: 'admin-plans' },
    { label: 'View All Users', icon: Users, page: 'admin-users' },
    { label: 'Razorpay Settlements', icon: IndianRupee, page: 'admin-settlements' },
    { label: 'Send Notifications', icon: Bell, page: 'admin-notifications' },
    { label: 'View Success Metrics', icon: BarChart3, page: 'admin-metrics' },
    { label: 'Open Audit Trails', icon: ShieldCheck, page: 'admin-audit-trails' },
  ];

  return (
    <div className="space-y-6 pb-32 md:pb-8">
      <div className="rounded-[28px] border border-border bg-card p-5 md:p-6">
        <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Admin overview
        </div>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-1 text-3xl">Admin Dashboard</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Welcome back, {user?.user_name}. Start with the key business signals, then jump into the next admin action.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:min-w-[340px]">
            <div className="rounded-2xl bg-background px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Active subs</div>
              <div className="mt-1 text-lg font-semibold">{stats.active_subscriptions}</div>
            </div>
            <div className="rounded-2xl bg-background px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Cancelled</div>
              <div className="mt-1 text-lg font-semibold">{stats.cancelled_subscriptions}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg">Top Metrics</h2>
          <span className="text-sm text-muted-foreground">Most-used admin views</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {primaryCards.map(card => (
            <button
              key={card.label}
              onClick={() => onNavigate(card.page)}
              className="group rounded-[28px] border border-border bg-card p-5 text-left transition-all hover:border-primary/30"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <p className="text-3xl font-semibold">{card.value}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg">More Signals</h2>
          <span className="text-sm text-muted-foreground">Secondary health checks</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {secondaryCards.map(card => (
            <button
              key={card.label}
              onClick={() => onNavigate(card.page)}
              className="group rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-4 text-2xl font-semibold">{card.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3">
          <h2 className="text-lg">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">Large, tap-friendly shortcuts for the jobs you do most often.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <span>{action.label}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
