import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff, X } from 'lucide-react';
import campusImg from '../assets/campus.png';
import {
  clearAdminSession,
  verifyAdminSession,
  hasAdminSession,
  signInAdmin
} from '../lib/adminApi';

export default function Login() {
  const [username, setUsername] = useState('');
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
      await signInAdmin(username, password);
      const targetPath = location.state?.from?.pathname || '/admin';
      navigate(targetPath, { replace: true });
    } catch (loginError) {
      clearAdminSession();
      setError(loginError.message || 'Unable to sign in. Please try again.');
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex-grow flex items-center justify-center py-16 relative bg-slate-900">
      {/* Background Image with Dark Blur Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={campusImg} 
          alt="Campus Background" 
          className="w-full h-full object-cover opacity-20 blur-[2px]" 
        />
        <div className="absolute inset-0 bg-slate-950/70"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center text-teal-400 hover:text-teal-350 text-sm font-bold mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Homepage
        </Link>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {/* Close (X) button */}
          <Link 
            to="/" 
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-50 rounded-lg"
            title="Exit to Homepage"
            aria-label="Exit to Homepage"
          >
            <X className="w-5 h-5" />
          </Link>
          <div className="text-center pb-6 border-b border-slate-100 mb-6">
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-655 mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-blue-950 font-serif">Login to your account</h1>
          </div>

          {isCheckingSession ? (
            <p role="status" className="text-center text-sm text-slate-500">Verifying admin session…</p>
          ) : (
          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ADMIN USERNAME *</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                autoFocus
                autoCapitalize="none"
                autoComplete="username"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ADMIN PASSWORD *</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-800 font-medium"
                  placeholder="Enter Password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {error && <p role="status" className="text-center text-xs text-slate-500">{error}</p>}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-700 hover:bg-teal-800 text-white w-full py-2.5 rounded-md font-bold transition-colors text-sm uppercase tracking-wider shadow-md"
            >
              {isSubmitting ? 'PLEASE WAIT...' : 'LOGIN'}
            </button>
          </form>
          )}

          {/* Links Section */}
          <div className="pt-6 border-t border-slate-100 mt-6 text-center space-y-3.5 text-xs font-medium">
            <div>
              <Link 
                to="/" 
                className="inline-flex items-center text-teal-700 hover:text-teal-800 font-bold hover:underline"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
