import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  Users, Crown, UserCheck, UserX, AlertTriangle, ArrowLeft,
  Search, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';

type UserFilter = 'all' | 'active' | 'free' | 'expiring' | 'expired';

interface UserRecord {
  id: number;
  user_name: string;
  email: string;
  phone: string | null;
  user_role: string;
  is_premium: number;
  created_at: string;
  sub_status: string | null;
  sub_end_date: string | null;
  plan_name: string | null;
}

const FILTER_OPTIONS: { id: UserFilter; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'all', label: 'All Users', icon: Users, color: 'text-blue-500' },
  { id: 'active', label: 'Active (Premium)', icon: Crown, color: 'text-amber-500' },
  { id: 'free', label: 'Free Users', icon: UserCheck, color: 'text-emerald-500' },
  { id: 'expiring', label: 'Expiring Soon', icon: AlertTriangle, color: 'text-orange-500' },
  { id: 'expired', label: 'Expired', icon: UserX, color: 'text-red-500' },
];

export function AdminUsersPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<UserFilter>('all');
  const [days, setDays] = useState(7);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 50;

  const fetchUsers = (f: UserFilter, p: number, d: number) => {
    setLoading(true);
    const params = new URLSearchParams({ filter: f, page: String(p), limit: String(limit) });
    if (f === 'expiring') params.set('days', String(d));

    api.get(`/admin/users.php?${params}`)
      .then(res => {
        setUsers(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(filter, page, days);
  }, [filter, page, days]);

  const handleFilterChange = (f: UserFilter) => {
    setFilter(f);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  const filtered = searchQuery
    ? users.filter(u =>
        u.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <div className="pb-32 md:pb-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <button onClick={() => onNavigate('admin')} className="rounded-xl p-2 transition-colors hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl mb-1">Users</h1>
          <p className="text-muted-foreground">{total} total</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleFilterChange(opt.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                filter === opt.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:bg-muted'
              }`}
            >
              <opt.icon className={`w-4 h-4 ${filter === opt.id ? '' : opt.color}`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expiring Days Filter */}
      {filter === 'expiring' && (
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Expiring within</span>
          {[3, 7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => { setDays(d); setPage(1); }}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                days === d ? 'bg-orange-500 text-white' : 'bg-card border border-border hover:bg-muted'
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {filtered.map(u => {
              const statusLabel = u.is_premium ? 'Premium' : 'Free';
              const planLabel = u.plan_name || (u.is_premium ? 'Premium plan' : 'Free plan');
              const subscriptionEnds = u.sub_end_date ? new Date(u.sub_end_date).toLocaleDateString() : null;
              const joinedOn = new Date(u.created_at).toLocaleDateString();

              return (
                <div key={u.id} className="rounded-3xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-medium text-primary">
                      {u.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">{u.user_name}</h3>
                        {u.user_role === 'admin' && (
                          <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] text-violet-500">Admin</span>
                        )}
                        <span className={`rounded-full px-2.5 py-1 text-[11px] ${
                          u.is_premium ? 'bg-amber-500/10 text-amber-600' : 'bg-muted text-muted-foreground'
                        }`}>
                          {statusLabel}
                        </span>
                      </div>

                      <p className="mt-1 break-all text-sm text-muted-foreground">{u.email}</p>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-background px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Plan</div>
                          <div className="mt-1 text-sm font-medium">{planLabel}</div>
                        </div>
                        <div className="rounded-2xl bg-background px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Subscription</div>
                          <div className="mt-1 text-sm font-medium capitalize">{u.sub_status || 'Not active'}</div>
                        </div>
                        <div className="rounded-2xl bg-background px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Phone</div>
                          <div className="mt-1 text-sm font-medium">{u.phone || 'Not provided'}</div>
                        </div>
                        <div className="rounded-2xl bg-background px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Joined</div>
                          <div className="mt-1 text-sm font-medium">{joinedOn}</div>
                        </div>
                      </div>

                      {subscriptionEnds && (
                        <div className="mt-3 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                          Subscription ends on <span className="font-medium text-foreground">{subscriptionEnds}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
                No users found
              </div>
            )}
          </div>

          <div className="hidden overflow-x-auto rounded-2xl border border-border lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Phone</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Plan</th>
                  <th className="text-left p-3 font-medium">Sub Ends</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {u.user_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{u.user_name}</p>
                          {u.user_role === 'admin' && (
                            <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-xs text-violet-500">Admin</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3 text-muted-foreground">{u.phone || '-'}</td>
                    <td className="p-3">
                      {u.is_premium ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">
                          <Crown className="h-3 w-3" /> Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">{u.plan_name || '-'}</td>
                    <td className="p-3 text-muted-foreground">
                      {u.sub_end_date ? new Date(u.sub_end_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg bg-card border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg bg-card border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
