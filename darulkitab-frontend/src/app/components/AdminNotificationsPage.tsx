import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  ArrowLeft, Bell, Send, Loader2, AlertTriangle, Check,
  Users, ChevronLeft, ChevronRight
} from 'lucide-react';

interface NotificationRecord {
  id: number;
  title: string;
  body: string;
  url: string;
  sent_by_name: string | null;
  total_sent: number;
  total_failed: number;
  sent_at: string;
}

export function AdminNotificationsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Send form
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({ title: '', body: '', url: '/' });

  const fetchNotifications = (p: number) => {
    setLoading(true);
    api.get(`/admin/notifications.php?page=${p}&limit=${limit}`)
      .then(res => {
        setNotifications(res.data.data || []);
        setTotal(res.data.total || 0);
        setSubscribers(res.data.subscribers || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(page); }, [page]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFormMsg(null);

    try {
      const res = await api.post('/admin/notifications.php', {
        title: form.title,
        body: form.body,
        url: form.url || '/',
      });
      setFormMsg({
        type: 'success',
        text: `Sent to ${res.data.sent} subscriber(s). ${res.data.failed > 0 ? `${res.data.failed} failed.` : ''}`,
      });
      setForm({ title: '', body: '', url: '/' });
      fetchNotifications(1);
      setPage(1);
    } catch (err: any) {
      setFormMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to send notification' });
    } finally {
      setSending(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pb-32 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('admin')} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl mb-1">Notifications</h1>
            <p className="text-muted-foreground">
              <Users className="w-4 h-4 inline mr-1" />
              {subscribers} subscriber(s)
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send New</span>
        </button>
      </div>

      {/* Send Form */}
      {showForm && (
        <div className="bg-card p-6 rounded-2xl border border-border mb-6">
          <h3 className="text-lg mb-4">Send Push Notification</h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. New Reciter Added!"
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/50"
                required
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Body</label>
              <textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Notification message..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                maxLength={500}
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">URL (on click)</label>
              <input
                type="text"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="/"
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {formMsg && (
              <div className={`flex items-center gap-2 text-sm ${formMsg.type === 'success' ? 'text-emerald-600' : 'text-destructive'}`}>
                {formMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {formMsg.text}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send to All ({subscribers})
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications History */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="bg-card p-4 rounded-2xl border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{n.title}</h4>
                    {n.body && <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="text-emerald-600">{n.total_sent} sent</span>
                      {n.total_failed > 0 && <span className="text-red-500">{n.total_failed} failed</span>}
                      <span>{new Date(n.sent_at).toLocaleString()}</span>
                      {n.sent_by_name && <span>by {n.sent_by_name}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No notifications sent yet</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
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
