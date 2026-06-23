import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, BarChart3, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

interface AuthPageProps {
  onAuthSuccess: (token: string, user: { id: number; name: string; email: string }) => void;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser({ email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onAuthSuccess(data.token, data.user);
      } else {
        const data = await registerUser({ name, email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onAuthSuccess(data.token, data.user);
      }
    } catch (err: any) {
      console.error('Authentication request failed:', err);
      setError(err.response?.data?.error || 'Authentication failed. Please verify credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-neonBlue/10 rounded-full filter blur-[80px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neonPurple/10 rounded-full filter blur-[80px] -z-10"></div>

      {/* Brand logo link */}
      <button onClick={onBack} className="flex items-center space-x-3 mb-8 focus:outline-none">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-neonBlue to-neonPurple flex items-center justify-center shadow-neon">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="font-outfit font-extrabold text-lg text-white block tracking-wide">ORGANALYTICS</span>
        </div>
      </button>

      {/* Form Card */}
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-neon/5 animate-fade-in">
        {/* Mode Toggle Tabs */}
        <div className="flex border-b border-darkBorder mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all duration-200 ${
              isLogin ? 'border-neonBlue text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all duration-200 ${
              !isLogin ? 'border-neonBlue text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Create Account
          </button>
        </div>

        <h3 className="text-xl font-bold font-outfit text-white mb-2">
          {isLogin ? 'Welcome Back' : 'Get Started'}
        </h3>
        <p className="text-gray-400 text-xs mb-6">
          {isLogin ? 'Enter credentials to access your insights history.' : 'Register to start running organizational analytics.'}
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start space-x-3 text-rose-400 text-xs">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Sign Up Only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl focus:outline-none focus:border-neonBlue/60 focus:ring-1 focus:ring-neonBlue/20 text-sm text-white placeholder-gray-600 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl focus:outline-none focus:border-neonBlue/60 focus:ring-1 focus:ring-neonBlue/20 text-sm text-white placeholder-gray-600 transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl focus:outline-none focus:border-neonBlue/60 focus:ring-1 focus:ring-neonBlue/20 text-sm text-white placeholder-gray-600 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold flex items-center justify-center space-x-2 shadow-neon hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
