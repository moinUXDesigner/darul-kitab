import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '../data/mock-data';
import { Crown, Check, X, CreditCard, Smartphone } from 'lucide-react';

export function SubscriptionPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { isPremium } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') return;
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  if (showPayment && selectedPlan) {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);
    
    return (
      <div className="pb-32 md:pb-8">
        <button
          onClick={() => setShowPayment(false)}
          className="mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Plans
        </button>

        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <Crown className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-3xl mb-2">Complete Payment</h1>
            <p className="text-muted-foreground">Subscribe to {plan?.name}</p>
          </div>

          {/* Plan Summary */}
          <div className="bg-card p-6 rounded-2xl border border-border mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Plan</span>
              <span>{plan?.name}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span>Total Amount</span>
              <span className="text-2xl text-primary">₹{plan?.price}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg">Select Payment Method</h3>
            
            <button className="w-full p-4 rounded-2xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors flex items-center gap-4">
              <Smartphone className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div>UPI Payment</div>
                <div className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</div>
              </div>
            </button>

            <button className="w-full p-4 rounded-2xl border border-border hover:border-primary hover:bg-card transition-colors flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div>Credit/Debit Card</div>
                <div className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</div>
              </div>
            </button>

            <button className="w-full p-4 rounded-2xl border border-border hover:border-primary hover:bg-card transition-colors flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div>Net Banking</div>
                <div className="text-sm text-muted-foreground">All major banks</div>
              </div>
            </button>
          </div>

          <button
            onClick={() => {
              // Mock payment success
              alert('Payment processed successfully! You are now a Premium member.');
              onNavigate('home');
            }}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Pay ₹{plan?.price}
          </button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Secure payment powered by Razorpay. Your payment information is encrypted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 md:pb-8">
      <div className="text-center mb-8">
        <Crown className="w-16 h-16 text-accent mx-auto mb-4" />
        <h1 className="text-3xl mb-2">
          {isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}
        </h1>
        <p className="text-muted-foreground">
          {isPremium 
            ? 'You are currently on a Premium plan'
            : 'Unlock all reciters and download for offline listening'}
        </p>
      </div>

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
                  disabled={isPremium}
                  className={`w-full py-3 rounded-2xl transition-colors ${
                    isPremium
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : plan.popular
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {isPremium ? 'Current Plan' : 'Subscribe Now'}
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
            { icon: CreditCard, title: 'Ad-Free', desc: 'Uninterrupted listening experience' },
            { icon: Smartphone, title: 'Offline Mode', desc: 'Download and listen anywhere' },
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
    </div>
  );
}
