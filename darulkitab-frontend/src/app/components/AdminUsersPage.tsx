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
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('admin')} className="p-2 hover:bg-muted rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl mb-1">Users</h1>
          <p className="text-muted-foreground">{total} total</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => handleFilterChange(opt.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${
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
      <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 mb-4">
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
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Phone</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Plan</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Sub Ends</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Joined</th>
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
                            <span className="text-xs px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500">Admin</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{u.phone || '—'}</td>
                    <td className="p-3">
                      {u.is_premium ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-600">
                          <Crown className="w-3 h-3" /> Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{u.plan_name || '—'}</td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">
                      {u.sub_end_date ? new Date(u.sub_end_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
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
