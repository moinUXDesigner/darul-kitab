import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import {
  Users, Crown, CreditCard, MessageSquare, TrendingUp,
  UserCheck, UserX, AlertTriangle, IndianRupee, ArrowRight, Bell
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
    api.get('/admin/dashboard.php')
      .then(res => setStats(res.data.data))
      .catch(err => setError(err?.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-3" />
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
    { label: 'Total Revenue', value: `₹${stats.total_revenue.toLocaleString()}`, icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-500/10', page: 'admin-settlements' },
    { label: 'Feedback', value: stats.feedback_count, icon: MessageSquare, color: 'text-pink-500', bg: 'bg-pink-500/10', page: 'admin-feedback' },
  ];

  return (
    <div className="pb-32 md:pb-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.user_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => onNavigate(card.page)}
            className="bg-card p-4 rounded-2xl border border-border hover:border-primary/30 transition-all text-left group"
          >
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-semibold">{card.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('admin-plans')}
            className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all"
          >
            <CreditCard className="w-5 h-5 text-primary" />
            <span>Manage Razorpay Plans</span>
          </button>
          <button
            onClick={() => onNavigate('admin-users')}
            className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all"
          >
            <Users className="w-5 h-5 text-primary" />
            <span>View All Users</span>
          </button>
          <button
            onClick={() => onNavigate('admin-settlements')}
            className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all"
          >
            <IndianRupee className="w-5 h-5 text-primary" />
            <span>Razorpay Settlements</span>
          </button>
          <button
            onClick={() => onNavigate('admin-notifications')}
            className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all"
          >
            <Bell className="w-5 h-5 text-primary" />
            <span>Send Notifications</span>
          </button>
        </div>
      </div>
    </div>
  );
}
