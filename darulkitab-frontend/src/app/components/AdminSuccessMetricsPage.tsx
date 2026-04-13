import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { Activity, ArrowLeft, BarChart3, Clock3, Loader2, RefreshCw, Repeat2, Target, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RetentionMetric {
  rate: number;
  cohort_size: number;
  retained_users: number;
}

interface TrendPoint {
  date: string;
  daily_active_users: number;
  listening_minutes: number;
  subscription_conversions: number;
  playback_completion_rate: number;
}

interface SuccessMetricsResponse {
  daily_active_users: number;
  weekly_active_users: number;
  average_session_minutes_7d: number;
  subscription_conversion_overall: number;
  subscription_conversion_30d: number;
  retention_d7: RetentionMetric;
  retention_d30: RetentionMetric;
  playback_completion_rate_30d: number;
  engaged_tracks_30d: number;
  completed_tracks_30d: number;
  audit_trail_events_30d: number;
  notifications_sent_30d: number;
  feedback_submissions_30d: number;
  trend: TrendPoint[];
}

const numberFormatter = new Intl.NumberFormat();

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function AdminSuccessMetricsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [metrics, setMetrics] = useState<SuccessMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await api.get('/admin/success-metrics.php');
      setMetrics(res.data?.data ?? null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load success metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const maxDau = useMemo(
    () => Math.max(1, ...(metrics?.trend ?? []).map((item) => item.daily_active_users)),
    [metrics],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="py-20 text-center">
        <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-destructive" />
        <p className="text-destructive">{error || 'Unable to load metrics right now'}</p>
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Daily Active Users',
      value: numberFormatter.format(metrics.daily_active_users),
      hint: `${numberFormatter.format(metrics.weekly_active_users)} active in the last 7 days`,
      icon: Activity,
      iconClass: 'text-emerald-600',
      bgClass: 'bg-emerald-500/10',
    },
    {
      label: 'Average Session Time',
      value: `${metrics.average_session_minutes_7d.toFixed(1)} min`,
      hint: 'Average listening time per captured playback session over 7 days',
      icon: Clock3,
      iconClass: 'text-sky-600',
      bgClass: 'bg-sky-500/10',
    },
    {
      label: 'Subscription Conversion',
      value: formatPercent(metrics.subscription_conversion_overall),
      hint: `${formatPercent(metrics.subscription_conversion_30d)} for users created in the last 30 days`,
      icon: Target,
      iconClass: 'text-amber-600',
      bgClass: 'bg-amber-500/10',
    },
    {
      label: 'Retention Rate',
      value: formatPercent(metrics.retention_d7.rate),
      hint: `${formatPercent(metrics.retention_d30.rate)} D30 retention`,
      icon: Repeat2,
      iconClass: 'text-violet-600',
      bgClass: 'bg-violet-500/10',
    },
    {
      label: 'Playback Completion',
      value: formatPercent(metrics.playback_completion_rate_30d),
      hint: `${numberFormatter.format(metrics.completed_tracks_30d)} completed from ${numberFormatter.format(metrics.engaged_tracks_30d)} engaged tracks`,
      icon: BarChart3,
      iconClass: 'text-primary',
      bgClass: 'bg-primary/10',
    },
    {
      label: 'Audit Trail Events',
      value: numberFormatter.format(metrics.audit_trail_events_30d),
      hint: `${numberFormatter.format(metrics.notifications_sent_30d)} notifications and ${numberFormatter.format(metrics.feedback_submissions_30d)} feedback entries in the last 30 days`,
      icon: ShieldCheck,
      iconClass: 'text-rose-600',
      bgClass: 'bg-rose-500/10',
    },
  ];

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
            <h1 className="text-3xl mb-1">Success Metrics</h1>
            <p className="text-muted-foreground">Track product growth, listening quality, and subscription health</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchMetrics(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mb-8">
        {metricCards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-border bg-card p-5">
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${card.bgClass}`}>
              <card.icon className={`h-5 w-5 ${card.iconClass}`} />
            </div>
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4">
            <h2 className="text-xl font-medium">14-Day Trend</h2>
            <p className="text-sm text-muted-foreground">Daily active users, listening time, conversions, and playback quality</p>
          </div>
          <div className="space-y-3">
            {metrics.trend.map((point) => (
              <div key={point.date} className="rounded-2xl border border-border/70 bg-background px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{new Date(point.date).toLocaleDateString()}</div>
                    <div className="mt-1 h-2.5 w-48 max-w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.max(6, (point.daily_active_users / maxDau) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground sm:grid-cols-4">
                    <span>DAU: {numberFormatter.format(point.daily_active_users)}</span>
                    <span>Minutes: {point.listening_minutes.toFixed(1)}</span>
                    <span>Conversions: {numberFormatter.format(point.subscription_conversions)}</span>
                    <span>Completion: {formatPercent(point.playback_completion_rate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl font-medium">Retention Cohorts</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-violet-500/5 p-4">
                <div className="text-sm text-muted-foreground">D7 Retention</div>
                <div className="mt-2 text-3xl font-semibold">{formatPercent(metrics.retention_d7.rate)}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {numberFormatter.format(metrics.retention_d7.retained_users)} retained from a cohort of {numberFormatter.format(metrics.retention_d7.cohort_size)} users
                </div>
              </div>
              <div className="rounded-2xl bg-primary/5 p-4">
                <div className="text-sm text-muted-foreground">D30 Retention</div>
                <div className="mt-2 text-3xl font-semibold">{formatPercent(metrics.retention_d30.rate)}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {numberFormatter.format(metrics.retention_d30.retained_users)} retained from a cohort of {numberFormatter.format(metrics.retention_d30.cohort_size)} users
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl font-medium">Operational Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                <span>Notifications sent in 30 days</span>
                <span className="font-medium text-foreground">{numberFormatter.format(metrics.notifications_sent_30d)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                <span>Feedback submissions in 30 days</span>
                <span className="font-medium text-foreground">{numberFormatter.format(metrics.feedback_submissions_30d)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                <span>Audit records in 30 days</span>
                <span className="font-medium text-foreground">{numberFormatter.format(metrics.audit_trail_events_30d)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('admin-audit-trails')}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open Audit Trails
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
