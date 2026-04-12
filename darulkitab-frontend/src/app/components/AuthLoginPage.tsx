import React, { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Crown, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthButton } from './GoogleAuthButton';

type FieldErrors = {
  email?: string;
  password?: string;
  form?: string;
  google?: string;
};

const freeBenefits = ['3 reciters included', 'Streaming access', 'Standard quality audio'];
const premiumBenefits = ['All reciters unlocked', 'Offline downloads', '320kbps HD audio', 'No ads'];

export function AuthLoginPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl text-white">
                D
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-200/80">Darul Kitab Audio</p>
                <p className="text-sm text-slate-300">Faithful listening, beautifully organized</p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs text-emerald-100">
                <ShieldCheck className="h-4 w-4" />
                Secure sign-in with email or Google
              </div>
              <h1 className="mb-4 text-4xl leading-tight md:text-5xl">
                Return to your daily listening with a calmer, cleaner sign-in flow.
              </h1>
              <p className="max-w-lg text-sm leading-7 text-slate-300 md:text-base">
                Pick up where you left off, keep your saved favorites, and move between free listening and premium
                access without friction.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-100">
                  <BookOpen className="h-4 w-4 text-emerald-300" />
                  Free plan
                </div>
                <div className="space-y-3">
                  {freeBenefits.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-amber-300/25 bg-amber-300/10 p-5 backdrop-blur">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-100">
                  <Crown className="h-4 w-4 text-amber-300" />
                  Premium plan
                </div>
                <div className="space-y-3">
                  {premiumBenefits.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-amber-50">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-300" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { value: '100+', label: 'Reciters available' },
                { value: '320kbps', label: 'Premium audio quality' },
                { value: '24/7', label: 'Listening access' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-border/70 bg-card/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur md:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-2xl text-primary">
                D
              </div>
              <p className="mb-2 text-sm uppercase tracking-[0.24em] text-primary/80">Welcome back</p>
              <h2 className="mb-2 text-3xl">Sign in to your account</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Use your email and password, or continue with Google if it is connected for your workspace.
              </p>
            </div>

            <div className="space-y-4">
              <GoogleAuthButton
                mode="login"
                loading={googleLoading}
                error={fieldErrors.google}
                onCredential={handleGoogleLogin}
                onStatusMessage={(message) =>
                  setFieldErrors((previousErrors) => ({
                    ...previousErrors,
                    google: message,
                  }))
                }
              />

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Or use email</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email address
                </label>
                <div
                  className={`relative rounded-2xl border bg-background transition-colors ${
                    fieldErrors.email ? 'border-destructive/70' : 'border-border'
                  }`}
                >
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldError('email');
                    }}
                    placeholder="you@example.com"
                    className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-4 text-sm outline-none"
                    autoComplete="email"
                    required
                  />
                </div>
                {fieldErrors.email && <p className="mt-2 text-sm text-destructive">{fieldErrors.email}</p>}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-sm text-primary transition-colors hover:text-primary/80"
                  >
                    Forgot password?
                  </button>
                </div>
                <div
                  className={`relative rounded-2xl border bg-background transition-colors ${
                    fieldErrors.password ? 'border-destructive/70' : 'border-border'
                  }`}
                >
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError('password');
                    }}
                    placeholder="Enter your password"
                    className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-14 text-sm outline-none"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previousValue) => !previousValue)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="mt-2 text-sm text-destructive">{fieldErrors.password}</p>}
              </div>

              {fieldErrors.form && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {fieldErrors.form}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_20px_50px_-22px_rgba(16,185,129,0.8)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-8 rounded-3xl border border-border/70 bg-background/70 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">New here?</p>
                  <p className="text-sm text-muted-foreground">Create a free account first, then upgrade when you need more.</p>
                </div>
                <button
                  onClick={() => onNavigate('signup')}
                  className="inline-flex items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  Create Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
