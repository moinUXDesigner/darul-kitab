import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Crown, Eye, EyeOff, Lock, Mail, Phone, Sparkles, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthButton } from './GoogleAuthButton';

type FieldErrors = {
  userName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
  google?: string;
};

const freePlan = ['3 reciters included', 'Online streaming', 'Standard audio', 'Ads supported'];
const premiumPlan = ['All reciters unlocked', 'Offline downloads', '320kbps HD audio', 'No ads', 'Playlist creation'];

export function AuthSignupPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { signup, loginWithGoogle } = useAuth();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    const trimmedName = userName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      nextErrors.userName = 'Full name is required.';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (trimmedPhone && !/^[0-9+\-\s]{8,15}$/.test(trimmedPhone)) {
      nextErrors.phone = 'Enter a valid phone number or leave it empty.';
    }

    if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      await signup({
        user_name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone || undefined,
        password,
      });
      onNavigate('home');
    } catch (err: any) {
      setFieldErrors({
        form: err?.message || 'Signup failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (credential: string) => {
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_30%)] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[32px] border border-border/70 bg-card/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur md:p-8">
            <div className="mb-8">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-2xl text-primary">
                D
              </div>
              <p className="mb-2 text-sm uppercase tracking-[0.24em] text-primary/80">Start free</p>
              <h1 className="mb-2 text-3xl">Create your account</h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Build your free library first, then unlock premium when you want all reciters and offline listening.
              </p>
            </div>

            <div className="space-y-4">
              <GoogleAuthButton
                mode="signup"
                loading={googleLoading}
                error={fieldErrors.google}
                onCredential={handleGoogleSignup}
                onStatusMessage={(message) =>
                  setFieldErrors((previousErrors) => ({
                    ...previousErrors,
                    google: message,
                  }))
                }
              />

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Or sign up with email</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="space-y-4 rounded-3xl border border-border/70 bg-background/70 p-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account details</p>
                    <p className="text-xs text-muted-foreground">Who you are and where we should reach you.</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Full name
                  </label>
                  <div
                    className={`relative rounded-2xl border bg-background transition-colors ${
                      fieldErrors.userName ? 'border-destructive/70' : 'border-border'
                    }`}
                  >
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="name"
                      type="text"
                      value={userName}
                      onChange={(e) => {
                        setUserName(e.target.value);
                        clearFieldError('userName');
                      }}
                      placeholder="Enter your full name"
                      className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-4 text-sm outline-none"
                      autoComplete="name"
                      required
                    />
                  </div>
                  {fieldErrors.userName && <p className="mt-2 text-sm text-destructive">{fieldErrors.userName}</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                      Phone number
                    </label>
                    <div
                      className={`relative rounded-2xl border bg-background transition-colors ${
                        fieldErrors.phone ? 'border-destructive/70' : 'border-border'
                      }`}
                    >
                      <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          clearFieldError('phone');
                        }}
                        placeholder="Optional"
                        className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-4 text-sm outline-none"
                        autoComplete="tel"
                      />
                    </div>
                    {fieldErrors.phone && <p className="mt-2 text-sm text-destructive">{fieldErrors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-border/70 bg-background/70 p-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Security</p>
                    <p className="text-xs text-muted-foreground">Use a password you can remember and others cannot guess.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium">
                      Password
                    </label>
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
                        placeholder="Create a password"
                        className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-14 text-sm outline-none"
                        autoComplete="new-password"
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

                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                      Confirm password
                    </label>
                    <div
                      className={`relative rounded-2xl border bg-background transition-colors ${
                        fieldErrors.confirmPassword ? 'border-destructive/70' : 'border-border'
                      }`}
                    >
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          clearFieldError('confirmPassword');
                        }}
                        placeholder="Repeat your password"
                        className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-4 text-sm outline-none"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="mt-2 text-sm text-destructive">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
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
                {loading ? 'Creating account...' : 'Create Free Account'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-8 rounded-3xl border border-border/70 bg-background/70 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">Already have an account?</p>
                  <p className="text-sm text-muted-foreground">Use your existing login and jump straight back into listening.</p>
                </div>
                <button
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  Sign In
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-primary/10 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.85)] md:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-emerald-100">
              <Sparkles className="h-4 w-4" />
              Free account now, premium whenever you are ready
            </div>

            <h2 className="mb-4 text-4xl leading-tight">See exactly what changes when you upgrade.</h2>
            <p className="max-w-lg text-sm leading-7 text-slate-300 md:text-base">
              Your free account gets you in the door. Premium adds deeper access for committed daily listening.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-100">
                  <User className="h-4 w-4 text-emerald-300" />
                  Free
                </div>
                <div className="space-y-3">
                  {freePlan.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-amber-300/25 bg-amber-300/10 p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-amber-100">
                  <Crown className="h-4 w-4 text-amber-300" />
                  Premium
                </div>
                <div className="space-y-3">
                  {premiumPlan.map((item) => (
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
                { value: 'Free', label: 'Start today' },
                { value: 'Monthly', label: 'Upgrade later' },
                { value: 'Yearly', label: 'Best value option' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
