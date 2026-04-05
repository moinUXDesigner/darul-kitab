import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ArrowLeft, MessageSquare, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

interface FeedbackItem {
  name: string;
  email: string;
  mobile: string;
  query: string;
}

export function AdminFeedbackPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  const fetchFeedback = (p: number) => {
    setLoading(true);
    api.get(`/admin/feedback.php?page=${p}&limit=${limit}`)
      .then(res => {
        setFeedback(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .catch(err => setError(err?.response?.data?.message || 'Failed to load feedback'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFeedback(page); }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pb-32 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('admin')} className="p-2 hover:bg-muted rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl mb-1">User Feedback</h1>
          <p className="text-muted-foreground">{total} total submissions</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-3" />
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {feedback.map((item, idx) => (
              <div key={idx} className="bg-card p-4 rounded-2xl border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="text-xs text-muted-foreground">{item.email}</span>
                      {item.mobile && (
                        <span className="text-xs text-muted-foreground">| {item.mobile}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.query}</p>
                  </div>
                </div>
              </div>
            ))}
            {feedback.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No feedback yet</p>
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
