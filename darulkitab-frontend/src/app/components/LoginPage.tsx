import React, { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Crown, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthLoginPage } from './AuthLoginPage';

type FieldErrors = {
  email?: string;
  password?: string;
  form?: string;
  google?: string;
};

const freeBenefits = ['3 reciters included', 'Streaming access', 'Standard quality audio'];
const premiumBenefits = ['All reciters unlocked', 'Offline downloads', '320kbps HD audio', 'No ads'];

export function LoginPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return <AuthLoginPage onNavigate={onNavigate} />;

  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const error = fieldErrors.form ?? '';

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [field]: '',
      form: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      await login(trimmedEmail, password);
      onNavigate('home');
    } catch (err: any) {
      setFieldErrors({
        form: err?.message || 'Invalid email or password.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setGoogleLoading(true);
    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      google: '',
      form: '',
    }));

    try {
      await loginWithGoogle(credential);
      onNavigate('home');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <section className="rounded-[32px] border border-primary/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.85)] md:p-8">
            <div className="mb-8 flex items-center gap-3">
            <span className="text-2xl text-primary-foreground">د</span>
          </div>
          <h1 className="text-3xl mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue listening</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2">Email or Phone</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
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
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-primary hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-primary hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
