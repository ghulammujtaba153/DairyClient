import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/useAuthContext';
import { Milk, Lock, Mail, ArrowRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative px-4">
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
            <Milk className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dairy Manager</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your business</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/30 active:scale-[0.98] mt-8"
          >
            Sign In to Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
