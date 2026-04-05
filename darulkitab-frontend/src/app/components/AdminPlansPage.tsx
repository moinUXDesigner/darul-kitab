import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ArrowLeft, CreditCard, Plus, Loader2, AlertTriangle, Check, IndianRupee, Pencil, Trash2, X, Save } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  price: string;
  duration_days: number | null;
  razorpay_plan_id: string | null;
  created_at: string;
  razorpay_status?: boolean;
  razorpay_name?: string;
  razorpay_amount?: number;
  razorpay_period?: string;
}

export function AdminPlansPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create plan form
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    period: 'monthly',
    interval: 1,
    amount: '',
    db_plan_id: '',
  });

  // Edit plan
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ price: '', duration_days: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete plan
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchPlans = () => {
    setLoading(true);
    api.get('/admin/plans.php')
      .then(res => setPlans(res.data.data || []))
      .catch(err => setError(err?.response?.data?.message || 'Failed to load plans'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlans(); }, []);

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
        amount: Math.round(parseFloat(form.amount) * 100), // Convert rupees to paise
        currency: 'INR',
        db_plan_id: parseInt(form.db_plan_id),
      });
      setFormSuccess(`Plan created! Razorpay ID: ${res.data.razorpay_plan_id}`);
      setForm({ name: '', period: 'monthly', interval: 1, amount: '', db_plan_id: '' });
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

  return (
    <div className="pb-32 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('admin')} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl mb-1">Razorpay Plans</h1>
            <p className="text-muted-foreground">Manage subscription plans</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Plan</span>
        </button>
      </div>

      {/* Create Plan Form */}
      {showForm && (
        <div className="bg-card p-6 rounded-2xl border border-border mb-6">
          <h3 className="text-lg mb-4">Create New Razorpay Plan</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Plan Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Monthly Premium"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Period</label>
                <select
                  value={form.period}
                  onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="e.g. 199"
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">DB Plan ID</label>
                <input
                  type="number"
                  value={form.db_plan_id}
                  onChange={e => setForm(f => ({ ...f, db_plan_id: e.target.value }))}
                  placeholder="e.g. 2 for Monthly, 3 for Yearly"
                  min="1"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="w-4 h-4" /> {formError}
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <Check className="w-4 h-4" /> {formSuccess}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Plan
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

      {/* Plans List */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="bg-card p-5 rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">ID: {plan.id}</p>
                </div>
                {editingId !== plan.id && deletingId !== plan.id && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(plan)}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      title="Edit plan"
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {plan.id !== 1 && (
                      <button
                        onClick={() => { setDeletingId(plan.id); setDeleteError(null); }}
                        className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete plan"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Delete confirmation */}
              {deletingId === plan.id && (
                <div className="mb-3 p-3 bg-destructive/10 rounded-xl border border-destructive/20">
                  <p className="text-sm text-destructive mb-2">Delete this plan?</p>
                  {deleteError && (
                    <p className="text-xs text-destructive mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {deleteError}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(plan.id)}
                      disabled={deleteLoading}
                      className="flex items-center gap-1 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-sm hover:bg-destructive/90 disabled:opacity-50"
                    >
                      {deleteLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      Delete
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-3 py-1.5 bg-muted rounded-lg text-sm hover:bg-muted/80"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Edit form */}
              {editingId === plan.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Duration (days)</label>
                    <input
                      type="number"
                      value={editForm.duration_days}
                      onChange={e => setEditForm(f => ({ ...f, duration_days: e.target.value }))}
                      min="0"
                      placeholder="0 for unlimited"
                      className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  {editError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {editError}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(plan.id)}
                      disabled={editLoading}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50"
                    >
                      {editLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg text-sm hover:bg-muted/80"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {parseFloat(plan.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{plan.duration_days ? `${plan.duration_days} days` : 'Unlimited'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Razorpay ID</span>
                    <span className="text-xs font-mono truncate max-w-[140px]">
                      {plan.razorpay_plan_id || '—'}
                    </span>
                  </div>
                  {plan.razorpay_period && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Period</span>
                      <span className="capitalize">{plan.razorpay_period}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {plans.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-8">No plans found</p>
          )}
        </div>
      )}
    </div>
  );
}
