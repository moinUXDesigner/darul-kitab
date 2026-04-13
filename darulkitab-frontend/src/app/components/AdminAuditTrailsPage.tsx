import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, Loader2, RefreshCw, Search, ShieldCheck } from 'lucide-react';

interface AuditTrailItem {
  id: number;
  actor_user_id: number | null;
  actor_role: string | null;
  actor_name?: string | null;
  actor_email?: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string | null;
  metadata: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}

const actionOptions = [
  { value: '', label: 'All actions' },
  { value: 'login', label: 'Logins' },
  { value: 'signup', label: 'Signups' },
  { value: 'subscription_started', label: 'Subscription starts' },
  { value: 'subscription_activated', label: 'Subscription activations' },
  { value: 'subscription_cancelled', label: 'Subscription cancellations' },
  { value: 'feedback_submitted', label: 'Feedback' },
  { value: 'notification_sent', label: 'Notifications' },
];

export function AdminAuditTrailsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [items, setItems] = useState<AuditTrailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [action, setAction] = useState('');
  const [search, setSearch] = useState('');
  const limit = 20;

  const fetchTrails = async (nextPage: number, silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(limit),
      });

      if (action) params.set('action', action);
      if (search.trim()) params.set('search', search.trim());

      const res = await api.get(`/admin/audit-trails.php?${params.toString()}`);
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
      setTotal(Number(res.data?.total ?? 0));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load audit trails');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrails(page);
  }, [page, action]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="pb-32 md:pb-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin')}
            className="rounded-xl p-2 transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl mb-1">Audit Trails</h1>
            <p className="text-muted-foreground">Trace key user and admin actions across auth, subscriptions, feedback, and notifications</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchTrails(page, true)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-[220px_minmax(0,1fr)_auto]">
        <select
          value={action}
          onChange={(event) => {
            setPage(1);
            setAction(event.target.value);
          }}
          className="rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        >
          {actionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by actor, entity, description, or email"
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </label>

        <button
          type="button"
          onClick={() => {
            setPage(1);
            fetchTrails(1, true);
          }}
          className="rounded-2xl bg-primary px-5 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Apply
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-600">
                        {item.action.replace(/_/g, ' ')}
                      </span>
                      {item.entity_type && (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                          {item.entity_type}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</span>
                    </div>

                    <h3 className="mt-3 font-medium">{item.description || 'Audit event recorded'}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>Actor: {item.actor_name || item.actor_email || 'System'}</span>
                      {item.actor_role && <span>Role: {item.actor_role}</span>}
                      {item.entity_id && <span>Entity ID: {item.entity_id}</span>}
                      {item.ip_address && <span>IP: {item.ip_address}</span>}
                    </div>

                    {item.metadata && Object.keys(item.metadata).length > 0 && (
                      <pre className="mt-3 overflow-x-auto rounded-2xl bg-background px-4 py-3 text-xs text-muted-foreground">
                        {JSON.stringify(item.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
                No audit events match the current filter.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                  disabled={page <= 1}
                  className="rounded-xl border border-border bg-card p-2 transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                  disabled={page >= totalPages}
                  className="rounded-xl border border-border bg-card p-2 transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
