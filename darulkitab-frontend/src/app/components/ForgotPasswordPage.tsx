import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

export function ForgotPasswordPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/request-password-reset.php', { email });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl mb-2">Forgot Password?</h1>
          <p className="text-muted-foreground">
            {submitted
              ? 'If your email is registered, a reset link is on the way'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl text-center">
            <p className="mb-4">If an account exists for this email, we have sent a reset link:</p>
            <p className="text-primary mb-6">{email}</p>
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
