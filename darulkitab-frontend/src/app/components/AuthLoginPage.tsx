import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthButton } from './GoogleAuthButton';

type FieldErrors = {
  email?: string;
  password?: string;
  form?: string;
  google?: string;
};

export function AuthLoginPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const logoSrc = `${import.meta.env.BASE_URL}Logo.png`;

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
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-10">
          <div className="mb-6 flex items-center gap-3">
            <img
              src={logoSrc}
              alt="Quran Fahmi Logo"
              className="h-14 w-14 rounded-2xl object-cover"
            />
            <div>
              <p className="text-base font-semibold tracking-tight text-foreground">Quran Fahmi</p>
              <p className="text-sm text-muted-foreground">Sign in and continue your listening</p>
            </div>
          </div>

          <h1 className="text-4xl leading-tight tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Sign in with your email and password, or continue with Google.
          </p>
        </div>

        <div className="space-y-5">
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

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
              Email address
            </label>
            <div
              className={`relative rounded-2xl border bg-muted/35 transition-colors ${
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
                className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-4 text-base outline-none"
                autoComplete="email"
                required
              />
            </div>
            {fieldErrors.email && <p className="mt-2 text-sm text-destructive">{fieldErrors.email}</p>}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
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
              className={`relative rounded-2xl border bg-muted/35 transition-colors ${
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
                className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-14 text-base outline-none"
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
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_20px_50px_-22px_rgba(16,185,129,0.8)] transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>New here?</span>
          <button
            onClick={() => onNavigate('signup')}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
