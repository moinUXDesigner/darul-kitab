import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Loader2,
  AlertTriangle,
  Check,
  IndianRupee,
  Pencil,
  Trash2,
  X,
  Save,
} from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  price: string;
  duration_days: number | null;
  razorpay_plan_id: string | null;
  created_at: string;
  active_subscriptions?: number;
  can_delete?: boolean;
  razorpay_status?: boolean;
  razorpay_name?: string;
  razorpay_amount?: number;
  razorpay_period?: string;
}

export function AdminPlansPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    period: 'monthly',
    interval: 1,
    amount: '',
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ price: '', duration_days: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchPlans = () => {
    setLoading(true);
    api
      .get('/admin/plans.php')
      .then(res => setPlans(res.data.data || []))
      .catch(err => setError(err?.response?.data?.message || 'Failed to load plans'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await api.post('/admin/plans.php', {
        name: form.name,
        period: form.period,
        interval: form.interval,
        amount: Math.round(parseFloat(form.amount) * 100),
        currency: 'INR',
        db_plan_id: form.period === 'monthly' ? 2 : 3,
      });
      setFormSuccess(`Plan created. Razorpay ID: ${res.data.razorpay_plan_id}`);
      setForm({ name: '', period: 'monthly', interval: 1, amount: '' });
      fetchPlans();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Failed to create plan');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (plan: Plan) => {
    setEditingId(plan.id);
    setEditForm({
      price: parseFloat(plan.price).toString(),
      duration_days: plan.duration_days?.toString() ?? '',
    });
    setEditError(null);
    setDeletingId(null);
  };

  const handleEdit = async (planId: number) => {
    setEditLoading(true);
    setEditError(null);
    try {
      await api.put('/admin/plans.php', {
        id: planId,
        price: parseFloat(editForm.price),
        duration_days: editForm.duration_days ? parseInt(editForm.duration_days) : 0,
      });
      setEditingId(null);
      fetchPlans();
    } catch (err: any) {
      setEditError(err?.response?.data?.message || 'Failed to update plan');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (planId: number) => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(`/admin/plans.php?id=${planId}`);
      setDeletingId(null);
      fetchPlans();
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete plan');
    } finally {
      setDeleteLoading(false);
    }
  };

  const selectedDbPlanId = form.period === 'monthly' ? 2 : 3;
  const monthlyCount = plans.filter(plan => (plan.razorpay_period || '').toLowerCase() === 'monthly').length;
  const yearlyCount = plans.filter(plan => (plan.razorpay_period || '').toLowerCase() === 'yearly').length;

  return (
    <div className="space-y-6 pb-32 md:pb-8">
      <div className="flex flex-col gap-4 rounded-[28px] border border-border bg-card p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-3">
          <button onClick={() => onNavigate('admin')} className="rounded-xl p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="mb-1 text-3xl">Razorpay Plans</h1>
            <p className="text-sm text-muted-foreground">
              Manage mobile-friendly monthly and yearly subscriptions without crowding the screen.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(current => !current)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-primary-foreground transition-colors hover:bg-primary/90 md:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{showForm ? 'Hide Form' : 'New Plan'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Total plans</div>
          <div className="mt-1 text-2xl font-semibold">{plans.length}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Monthly</div>
          <div className="mt-1 text-2xl font-semibold">{monthlyCount}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Yearly</div>
          <div className="mt-1 text-2xl font-semibold">{yearlyCount}</div>
        </div>
      </div>

      {showForm && (
        <div className="rounded-[28px] border border-border bg-card p-5 md:p-6">
          <div className="mb-5">
            <h3 className="text-lg">Create New Razorpay Plan</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep creation simple on mobile: name, billing period, amount, then sync it to the matching DB plan.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Plan Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Monthly Premium"
                  className="w-full rounded-2xl border border-border bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Period</label>
                <select
                  value={form.period}
                  onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
                  className="w-full rounded-2xl border border-border bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Amount (Rs)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="e.g. 199"
                  min="1"
                  step="0.01"
                  className="w-full rounded-2xl border border-border bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">DB Plan ID</label>
                <input
                  type="text"
                  value={`${selectedDbPlanId} (${form.period === 'monthly' ? 'Monthly' : 'Yearly'})`}
                  className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-muted-foreground outline-none"
                  disabled
                />
              </div>
            </div>

            <div className="rounded-2xl bg-background px-4 py-3 text-sm text-muted-foreground">
              Only two paid plans are supported here: Monthly maps to DB plan <span className="font-medium text-foreground">2</span>, and Yearly maps to DB plan <span className="font-medium text-foreground">3</span>.
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" /> {formError}
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <Check className="h-4 w-4" /> {formSuccess}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create Plan
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-2xl bg-muted px-4 py-3 transition-colors hover:bg-muted/80"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {plans.map(plan => {
            const displayName = plan.name?.trim() || plan.razorpay_name || `Plan ${plan.id}`;
            const activeSubscriptions = plan.active_subscriptions ?? 0;
            const canDelete = plan.can_delete ?? (plan.id !== 1 && activeSubscriptions === 0);
            const isEditing = editingId === plan.id;
            const isDeleting = deletingId === plan.id;

            return (
              <div key={plan.id} className="rounded-[28px] border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{displayName}</h3>
                      <span className="rounded-full bg-background px-2.5 py-1 text-[11px] text-muted-foreground">ID {plan.id}</span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] ${
                          plan.razorpay_status ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {plan.razorpay_status ? 'Synced' : 'Local only'}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="capitalize">{plan.razorpay_period || 'custom'} plan</span>
                      <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:block" />
                      <span>Created {new Date(plan.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-background px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Price</div>
                    <div className="mt-1 flex items-center gap-1 text-lg font-semibold">
                      <IndianRupee className="h-4 w-4" />
                      {parseFloat(plan.price).toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-background px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Duration</div>
                    <div className="mt-1 text-lg font-semibold">{plan.duration_days ? `${plan.duration_days} days` : 'Unlimited'}</div>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Razorpay ID</span>
                    <span className="max-w-[190px] break-all text-right font-mono text-xs">{plan.razorpay_plan_id || '-'}</span>
                  </div>
                  {plan.razorpay_name && plan.razorpay_name !== displayName && (
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-muted-foreground">Razorpay name</span>
                      <span className="text-right">{plan.razorpay_name}</span>
                    </div>
                  )}
                  {plan.razorpay_period && (
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-muted-foreground">Billing period</span>
                      <span className="capitalize">{plan.razorpay_period}</span>
                    </div>
                  )}
                </div>

                {activeSubscriptions > 0 && (
                  <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
                    In use by {activeSubscriptions} active subscription{activeSubscriptions === 1 ? '' : 's'}. Delete stays disabled until usage reaches zero.
                  </div>
                )}

                {isDeleting && (
                  <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">Delete this plan?</p>
                    {deleteError && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" /> {deleteError}
                      </p>
                    )}
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => handleDelete(plan.id)}
                        disabled={deleteLoading}
                        className="flex items-center justify-center gap-1 rounded-xl bg-destructive px-3 py-2 text-sm text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                      >
                        {deleteLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        Delete
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="rounded-xl bg-muted px-3 py-2 text-sm hover:bg-muted/80"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {isEditing ? (
                  <div className="mt-4 space-y-3 rounded-2xl border border-border bg-background p-4">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Price (Rs)</label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                        min="0"
                        step="0.01"
                        className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Duration (days)</label>
                      <input
                        type="number"
                        value={editForm.duration_days}
                        onChange={e => setEditForm(f => ({ ...f, duration_days: e.target.value }))}
                        min="0"
                        placeholder="0 for unlimited"
                        className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    {editError && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" /> {editError}
                      </p>
                    )}
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => handleEdit(plan.id)}
                        disabled={editLoading}
                        className="flex items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                      >
                        {editLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center justify-center gap-1 rounded-xl bg-muted px-3 py-2 text-sm hover:bg-muted/80"
                      >
                        <X className="h-3 w-3" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => startEdit(plan)}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm transition-colors hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" /> Edit Plan
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => {
                          setDeletingId(plan.id);
                          setDeleteError(null);
                          setEditingId(null);
                        }}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" /> Delete Plan
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {plans.length === 0 && (
            <div className="col-span-full rounded-[28px] border border-border bg-card p-10 text-center text-muted-foreground">
              No plans found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
