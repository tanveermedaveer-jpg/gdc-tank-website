import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import campusImg from '../assets/campus.png';
import {
  clearAdminSession,
  verifyAdminSession,
  hasAdminSession,
  signInAdmin
} from '../lib/adminApi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(hasAdminSession);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      if (!hasAdminSession()) return;
      try {
        if (hasAdminSession() && await verifyAdminSession()) {
          const targetPath = location.state?.from?.pathname || '/admin';
          navigate(targetPath, { replace: true });
        }
      } catch (sessionError) {
        if (isMounted) setError(sessionError.message || 'Unable to verify the admin session.');
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    };
    checkSession();
    return () => { isMounted = false; };
  }, [navigate, location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const result = await signInAdmin(email, password);
      const targetPath = location.state?.from?.pathname || '/admin';
      navigate(targetPath, {
        replace: true,
        state: result.migrationWarning
          ? { adminWarning: result.migrationWarning }
          : null
      });
    } catch (loginError) {
      clearAdminSession();
      setError(loginError.message || 'Unable to sign in. Please try again.');
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <main className="relative isolate flex flex-grow items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:py-16">
      <img
        src={campusImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-teal-950/80" />

      <section
        aria-labelledby="login-title"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl shadow-black/30"
      >
        <div className="bg-gradient-to-br from-teal-800 to-slate-900 px-7 py-8 text-white sm:px-9">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-teal-100 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to homepage
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Lock className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                Admin portal
              </p>
              <h1 id="login-title" className="mt-1 text-2xl font-bold tracking-tight">
                Welcome back
              </h1>
            </div>
          </div>
        </div>

        <div className="px-7 py-8 sm:px-9">
          <p className="mb-6 text-sm leading-6 text-slate-600">
            Sign in with your administrator account to continue.
          </p>

          {isCheckingSession ? (
            <p role="status" className="py-8 text-center text-sm text-slate-600">
              Verifying admin session…
            </p>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
              <div className="space-y-2">
                <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-800">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoFocus
                  autoCapitalize="none"
                  autoComplete="username"
                  placeholder="Enter your admin email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword
                      ? <EyeOff className="h-5 w-5" aria-hidden="true" />
                      : <Eye className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {error && (
                <p id="login-error" role="alert" className="text-sm text-slate-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-teal-800 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition-colors hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20 disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
