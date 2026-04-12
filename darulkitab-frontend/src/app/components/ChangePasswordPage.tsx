import React, { useMemo, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

type FieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  form?: string;
};

export function ChangePasswordPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const passwordChecklist = useMemo(
    () => [
      { label: 'At least 6 characters', met: newPassword.length >= 6 },
      { label: 'Matches confirmation', met: confirmPassword.length > 0 && newPassword === confirmPassword },
    ],
    [confirmPassword, newPassword],
  );

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((previousErrors) => {
      if (!previousErrors[field] && !previousErrors.form) {
        return previousErrors;
      }

      return {
        ...previousErrors,
        [field]: '',
        form: '',
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: FieldErrors = {};

    if (newPassword.length < 6) {
      nextErrors.newPassword = 'Password must be at least 6 characters.';
    }

    if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      await api.post('/auth/change-password.php', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSubmitted(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setFieldErrors({
        form: err?.response?.data?.message || 'Unable to update password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl pb-32 md:pb-8">
      <button
        onClick={() => onNavigate('settings')}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </button>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[28px] border border-primary/15 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-8">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mb-3 text-3xl">Change password</h1>
          <p className="mb-6 max-w-md text-sm leading-6 text-muted-foreground">
            Keep your account secure for {user?.email}. If you signed up with Google, you can leave your current
            password empty and set one now.
          </p>

          <div className="space-y-3 rounded-3xl border border-border/70 bg-background/80 p-5">
            <p className="text-sm font-medium">Password checklist</p>
            {passwordChecklist.map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${item.met ? 'bg-primary' : 'bg-border'}`}
                  aria-hidden="true"
                />
                <span className={item.met ? 'text-foreground' : ''}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-border/80 bg-card/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur md:p-8">
          {submitted ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-2xl">Password updated</h2>
              <p className="mb-6 max-w-sm text-sm leading-6 text-muted-foreground">
                Your new password is active now. Use it the next time you sign in.
              </p>
              <button
                onClick={() => onNavigate('settings')}
                className="rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Return to Settings
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.24em] text-primary/80">Security</p>
                <h2 className="text-2xl">Update your sign-in password</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium">
                    Current password
                  </label>
                  <div
                    className={`relative rounded-2xl border bg-background transition-colors ${
                      fieldErrors.currentPassword ? 'border-destructive/70' : 'border-border'
                    }`}
                  >
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        clearFieldError('currentPassword');
                      }}
                      placeholder="Enter your current password"
                      className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-14 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((previousValue) => !previousValue)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Leave this blank only if your account was created with Google.
                  </p>
                  {fieldErrors.currentPassword && (
                    <p className="mt-2 text-sm text-destructive">{fieldErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="mb-2 block text-sm font-medium">
                    New password
                  </label>
                  <div
                    className={`relative rounded-2xl border bg-background transition-colors ${
                      fieldErrors.newPassword ? 'border-destructive/70' : 'border-border'
                    }`}
                  >
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        clearFieldError('newPassword');
                      }}
                      placeholder="Create a new password"
                      className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-14 text-sm outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((previousValue) => !previousValue)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {fieldErrors.newPassword && <p className="mt-2 text-sm text-destructive">{fieldErrors.newPassword}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                    Confirm new password
                  </label>
                  <div
                    className={`relative rounded-2xl border bg-background transition-colors ${
                      fieldErrors.confirmPassword ? 'border-destructive/70' : 'border-border'
                    }`}
                  >
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearFieldError('confirmPassword');
                      }}
                      placeholder="Repeat your new password"
                      className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-4 text-sm outline-none"
                      required
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-destructive">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                {fieldErrors.form && (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {fieldErrors.form}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_18px_45px_-20px_rgba(16,185,129,0.75)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Updating password...' : 'Save New Password'}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
