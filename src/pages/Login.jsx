import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Yahan aap apna admin username aur password set kar rahe hain
    // Misal ke taur par username: admin aur password: 12345
    if (username === 'admin' && password === '12345') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
    } else {
      setError('غلط یوزر نام یا پاسورڈ! براہ کرم دوبارہ کوشش کریں۔');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Back to Home */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Website
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
            <Lock className="w-8 h-8 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-white">Admin Portal Login</h2>
          <p className="text-xs text-slate-400 mt-1">Captain Ashfaq Shaheed Degree College, Tank</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Enter admin username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition duration-200 text-sm tracking-wide uppercase"
          >
            Login to Dashboard
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-slate-500">
          Authorized personnel only. All access attempts are monitored.
        </div>

      </div>
    </div>
  );
}
