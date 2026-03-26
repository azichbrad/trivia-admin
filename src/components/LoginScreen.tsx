import { useState } from 'react';
import { Trophy, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function LoginScreen() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (authMode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setErrorMessage(error.message);
      else if (!data.session) setErrorMessage('Check if this email already has an account, or ensure Email Confirmations are OFF.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMessage(error.message);
    }
  };

  const handleOAuthLogin = async (provider: 'google') => {
    setErrorMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: { redirectTo: window.location.origin }
    });
    if (error) setErrorMessage(error.message);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex items-center justify-center p-6 font-sans selection:bg-blue-500/30">
      <div className="max-w-[400px] w-full animate-fade-in">
        
        <div className="flex justify-center mb-8">
           <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Trophy className="w-6 h-6 text-white" />
           </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">
          {authMode === 'login' ? 'Log in to Command' : 'Create your venue'}
        </h1>
        <p className="text-center text-slate-400 mb-8 text-sm">
          {authMode === 'login' ? 'Welcome back to Trivia Command' : 'Start hosting live trivia in minutes'}
        </p>

        <div className="bg-[#111111] border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <button type="button" onClick={() => handleOAuthLogin('google')} className="w-full bg-white text-black font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors mb-6 shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Or continue with email</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0a0a0a] text-slate-100 text-sm rounded-lg px-4 py-2.5 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600" placeholder="manager@venue.com" required/>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0a0a0a] text-slate-100 text-sm rounded-lg px-4 py-2.5 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600" placeholder="••••••••" required/>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors mt-2">
              {authMode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setErrorMessage(''); }} className="text-white hover:text-blue-400 transition-colors font-medium">
            {authMode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}