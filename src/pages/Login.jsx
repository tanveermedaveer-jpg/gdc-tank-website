import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff, X } from 'lucide-react';
import campusImg from '../assets/campus.png';
import { isAdminUser, isSupabaseConfigured, supabase } from '../lib/supabase';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.removeItem('casdct_is_logged_in');
    localStorage.removeItem('casdct_admin_name');
    localStorage.removeItem('casdct_admin_pass');
    if (!supabase) return;

    let isMounted = true;
    supabase.auth.getSession()
      .then(({ data, error: sessionError }) => {
        if (sessionError) throw sessionError;
        if (isMounted && isAdminUser(data.session?.user)) {
          const targetPath = location.state?.from?.pathname || '/admin';
          navigate(targetPath, { replace: true });
        }
      })
      .catch((sessionError) => {
        if (isMounted) setError(`Unable to check your session: ${sessionError.message}`);
      });

    return () => {
      isMounted = false;
    };
  }, [navigate, location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setError('Admin login is not configured yet. Please contact the site administrator.');
      return;
    }

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: username.trim(),
        password
      });
      if (loginError) throw loginError;
      if (!isAdminUser(data.user)) {
        await supabase.auth.signOut();
        setError('This account is not authorized to access the admin dashboard.');
        setPassword('');
        return;
      }

      setError('');
      setUsername('');
      setPassword('');
      const targetPath = location.state?.from?.pathname || '/admin';
      navigate(targetPath, { replace: true });
    } catch (loginError) {
      console.error('Admin sign-in failed:', loginError);
      setError(loginError.message || 'Unable to sign in. Please try again.');
      setPassword('');
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
            <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
              Login with your admin email and password
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold p-3.5 rounded-xl mb-5 text-center">
              Admin sign-in is not configured. Add the Supabase project URL and public key to the deployment environment.
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-3.5 rounded-xl mb-5 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" autoComplete="on">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ADMIN EMAIL *</label>
              <input 
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-800 font-medium"
                placeholder="Enter admin email"
                disabled={!isSupabaseConfigured}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PASSWORD *</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-800 font-medium"
                  placeholder="Enter Password"
                  disabled={!isSupabaseConfigured}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!isSupabaseConfigured}
              className="bg-teal-700 hover:bg-teal-800 text-white w-full py-2.5 rounded-md font-bold transition-colors text-sm uppercase tracking-wider shadow-md"
            >
              LOGIN
            </button>
          </form>

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
