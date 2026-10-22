import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@homelineinterio.com');
  const [password, setPassword] = useState('Homeline@2026Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (api.isAdminAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.adminLogin(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-base-border shadow-elevated p-8 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-olive-50 text-olive-700 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-olive-700 block">
            Homeline Interio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-semibold">
            Admin Portal
          </h1>
          <p className="text-xs text-charcoal-500">
            Sign in to manage incoming customer interior leads and consultation workflows.
          </p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="p-3.5 bg-olive-50 border border-olive-200 rounded-xl text-xs space-y-1.5 text-olive-900">
          <div className="flex items-center font-semibold text-olive-800 space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-olive-600" />
            <span>Demo Access Credentials</span>
          </div>
          <p className="text-[11px] text-charcoal-600 leading-tight">
            Use the provisioned credentials below to explore the lead dashboard:
          </p>
          <div className="font-mono text-[11px] space-y-0.5 pt-1 text-charcoal-800 bg-white/70 p-2 rounded border border-olive-100">
            <div>Email: <strong className="text-olive-800">admin@homelineinterio.com</strong></div>
            <div>Pass: <strong className="text-olive-800">Homeline@2026Admin</strong></div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-base-surfaceLight border border-base-border rounded-lg focus:outline-none focus:ring-1 focus:ring-olive-500 text-charcoal-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-base-surfaceLight border border-base-border rounded-lg focus:outline-none focus:ring-1 focus:ring-olive-500 text-charcoal-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-olive-700 hover:bg-olive-800 disabled:bg-olive-400 text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-soft transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs text-charcoal-500 hover:text-charcoal-800 underline transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
};
