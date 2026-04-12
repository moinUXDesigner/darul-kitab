import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, MessageSquare, Send, X } from 'lucide-react';
import api from '../api/axios';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackDialog({ isOpen, onClose }: FeedbackDialogProps) {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setFeedbackText('');
      setFeedbackLoading(false);
      setFeedbackSent(false);
      setFeedbackError('');
    }
  }, [isOpen]);

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;

    setFeedbackLoading(true);
    setFeedbackError('');

    try {
      await api.post('user/feedback.php', { query: feedbackText.trim() });
      setFeedbackSent(true);
      setFeedbackText('');
    } catch (error: any) {
      setFeedbackError(error?.response?.data?.message || 'Failed to send feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-4 md:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-[2rem] border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-medium">Send Feedback</h3>
              <p className="text-xs text-muted-foreground">Share bugs, ideas, or anything we should improve.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close feedback form"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          {feedbackSent ? (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-5 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-green-600" />
              <p className="font-medium text-green-700">Thank you for your feedback!</p>
              <p className="mt-1 text-sm text-muted-foreground">Your message has been sent successfully.</p>
            </div>
          ) : (
            <>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what is working well, what feels confusing, or what feature you would love next..."
                maxLength={2000}
                rows={5}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{feedbackText.length}/2000</span>
                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  disabled={feedbackLoading || !feedbackText.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {feedbackLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Submit
                </button>
              </div>
              {feedbackError && <p className="mt-2 text-xs text-destructive">{feedbackError}</p>}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            {feedbackSent ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
