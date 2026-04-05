import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ArrowLeft, IndianRupee, AlertTriangle, Building2 } from 'lucide-react';

interface Settlement {
  id: string;
  entity: string;
  amount: number;
  status: string;
  fees: number;
  tax: number;
  utr: string;
  created_at: number;
}

export function AdminSettlementsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/settlements.php')
      .then(res => setSettlements(res.data.data || []))
      .catch(err => setError(err?.response?.data?.message || 'Failed to load settlements'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (ts: number) => new Date(ts * 1000).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const statusColor = (s: string) => {
    switch (s) {
      case 'processed': return 'bg-emerald-500/10 text-emerald-600';
      case 'created': return 'bg-blue-500/10 text-blue-600';
      case 'failed': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="pb-32 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('admin')} className="p-2 hover:bg-muted rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl mb-1">Bank Settlements</h1>
          <p className="text-muted-foreground">Razorpay bank credit status</p>
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
          <p className="text-sm text-muted-foreground mt-2">
            Note: Settlements API may not be available in Test mode.
          </p>
        </div>
      ) : settlements.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No settlements found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Settlements appear after Razorpay processes bank transfers.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">Amount</th>
                <th className="text-left p-3 font-medium">Fees</th>
                <th className="text-left p-3 font-medium">Tax</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">UTR</th>
                <th className="text-left p-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map(s => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{s.id}</td>
                  <td className="p-3 font-medium">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {(s.amount / 100).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">₹{(s.fees / 100).toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground">₹{(s.tax / 100).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${statusColor(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground font-mono text-xs hidden md:table-cell">
                    {s.utr || '—'}
                  </td>
                  <td className="p-3 text-muted-foreground">{formatDate(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
