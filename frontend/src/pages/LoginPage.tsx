import React, { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, Zap } from 'lucide-react';
import { fetchApi } from '../api/client';

interface LoginPageProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('operator@chennai.gov.in');
  const [password, setPassword] = useState('chennai2026');
  const [fullName, setFullName] = useState('Traffic Operations Officer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await fetchApi('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, full_name: fullName })
        });
      }

      const data = await fetchApi<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem('token', data.access_token);
      const user = await fetchApi<any>('/auth/me');
      onLoginSuccess(data.access_token, user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-cyan-600 to-purple-600 rounded-2xl shadow-lg mb-2">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Quantum Traffic Control</h2>
          <p className="text-xs text-slate-400">Chennai Adaptive Signal Optimization Platform</p>
        </div>

        {error && (
          <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-slate-200"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1">Officer Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-slate-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition text-xs shadow-lg"
          >
            {loading ? 'Authenticating...' : (isRegister ? 'Register Account' : 'Authenticate Session')}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-800 pt-4">
          {isRegister ? (
            <button onClick={() => setIsRegister(false)} className="text-cyan-400 hover:underline">
              Already registered? Login to Session
            </button>
          ) : (
            <button onClick={() => setIsRegister(true)} className="text-cyan-400 hover:underline">
              Create New Operator Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
