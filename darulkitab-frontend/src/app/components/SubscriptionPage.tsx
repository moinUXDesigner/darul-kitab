import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '../data/mock-data';
import { Crown, Check, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface SubscriptionInfo {
  is_premium: boolean;
  subscription: {
    id: number;
    plan_id: number;
    plan_name: string;
    status: string;
    razorpay_subscription_id: string;
    start_date: string;
    end_date: string | null;
  } | null;
}

export function SubscriptionPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user, isPremium, refreshPremiumStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subInfo, setSubInfo] = useState<SubscriptionInfo | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Fetch current subscription status
  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await api.get('/razorpay/subscription_status.php');
      setSubInfo(res.data);
      if (res.data?.is_premium === true) {
        await refreshPremiumStatus();
      }
    } catch {
      // Not subscribed — that's fine
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return;

    const dbPlanId = planId === 'monthly' ? 2 : 3;

    setLoading(true);
    setError(null);

    try {
      // 1. Create subscription on backend
      const res = await api.post('/razorpay/create_subscription.php', {
        plan_id: dbPlanId
      });

      const { subscription_id, razorpay_key } = res.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: razorpay_key,
        subscription_id: subscription_id,
        name: 'Darul Kitab',
        description: planId === 'monthly' ? 'Premium Monthly' : 'Premium Yearly',
        handler: async (response: any) => {
          // 3. Verify on backend
          try {
            await api.post('/razorpay/verify_subscription.php', {
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // 4. Refresh premium status in auth context
            await refreshPremiumStatus();
            await fetchSubscriptionStatus();
          } catch {
            setError('Payment received but verification failed. It will be activated shortly via webhook.');
          }
        },
        prefill: {
          name: user?.user_name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#10b981'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setError(response.error?.description || 'Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.details ||
        'Failed to create subscription. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subInfo?.subscription?.razorpay_subscription_id) return;
    if (!confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) return;

    setCancelling(true);
    setError(null);

    try {
      await api.post('/razorpay/cancel_subscription.php', {
        cancel_at_cycle_end: true
      });
      await refreshPremiumStatus();
      await fetchSubscriptionStatus();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to cancel subscription.');
    } finally {
      setCancelling(false);
    }
  };

  // Active subscription view
  if (subInfo?.is_premium && subInfo.subscription) {
    const sub = subInfo.subscription;
    return (
      <div className="pb-32 md:pb-8">
        <div className="text-center mb-8">
          <Crown className="w-16 h-16 text-accent mx-auto mb-4" />
          <h1 className="text-3xl mb-2">Premium Active</h1>
          <p className="text-muted-foreground">You have full access to all content</p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-card p-6 rounded-2xl border border-accent/30 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span>{sub.plan_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-green-500 capitalize">{sub.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started</span>
              <span>{new Date(sub.start_date).toLocaleDateString()}</span>
            </div>
            {sub.end_date && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Renews</span>
                <span>{new Date(sub.end_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {sub.status === 'active' && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full mt-6 py-3 rounded-2xl border border-destructive text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          )}

          {sub.status === 'cancelled' && (
            <p className="text-center text-muted-foreground mt-6 text-sm">
              Your subscription is cancelled and will expire at the end of your billing period.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 md:pb-8">
      <div className="text-center mb-8">
        <Crown className="w-16 h-16 text-accent mx-auto mb-4" />
        <h1 className="text-3xl mb-2">Upgrade to Premium</h1>
        <p className="text-muted-foreground">
          Unlock all reciters and download for offline listening
        </p>
      </div>

      {error && (
        <div className="max-w-lg mx-auto mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-card rounded-3xl border-2 transition-all ${
              plan.popular
                ? 'border-accent shadow-lg shadow-accent/20 scale-105'
                : 'border-border hover:border-primary'
            } ${plan.isFree ? 'opacity-75' : ''}`}
          >
            {plan.popular && (
              <div className="bg-accent text-accent-foreground text-sm py-2 px-4 rounded-t-3xl text-center">
                Most Popular
              </div>
            )}

            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl mb-2">{plan.name}</h3>
                {plan.isFree ? (
                  <div className="text-3xl">Free</div>
                ) : (
                  <div>
                    <span className="text-4xl">₹{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {!plan.isFree && (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading || loadingStatus}
                  className={`w-full py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  } disabled:opacity-50`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <h3 className="text-xl mb-4 text-center">Why Go Premium?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Crown, title: 'All Reciters', desc: 'Access to 100+ world-renowned reciters' },
            { icon: Crown, title: 'Ad-Free', desc: 'Uninterrupted listening experience' },
            { icon: Crown, title: 'Offline Mode', desc: 'Download and listen anywhere' },
            { icon: Check, title: 'HD Audio', desc: 'Crystal clear 320kbps quality' }
          ].map((item, idx) => (
            <div key={idx} className="bg-card p-4 rounded-2xl border border-border">
              <item.icon className="w-8 h-8 text-primary mb-3" />
              <h4 className="mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8">
        Secure payment powered by Razorpay. Your payment information is encrypted.
      </p>
    </div>
  );
}
