import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Sparkles, ArrowRight, Lock, Mail, Target } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import Head from 'next/head';

function Login() {
  const { login, continueWithGoogle } = useAuth();
  const router = useRouter();

  const isAdmin = router.query.role === "admin";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credential) => {
    const res = await continueWithGoogle(credential);
    if (res?.success) {
      if (res.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(email, password);

      if (res.success) {
        if (res.user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-stone-50 dark:bg-[#0a0a0a] selection:bg-emerald-500/30 relative overflow-hidden p-4 transition-colors duration-300">
      <Head>
        <title>{isAdmin ? "Admin Login" : "Login"} | Lakshya</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      {/* DYNAMIC BACKGROUND - Neetcode Style */}
      <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
        {/* Subtle glowing center */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
        {/* Dot grid pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        {/* Gradient mask to fade out the grid at the edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]"></div>
      </div>

      {/* AUTH CONTAINER */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <div className="inline-flex h-14 px-6 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-md border border-stone-200 dark:border-white/20 items-center justify-center font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-500 shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.1)] tracking-tight hover:scale-105 transition-transform duration-300 group cursor-pointer">
            <Target className="w-8 h-8 mr-3 text-emerald-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-transform duration-500 group-hover:rotate-90" />
            Lakshya
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-stone-200 dark:border-white/10 rounded-[2rem] shadow-2xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-8 sm:p-10 relative overflow-hidden group transition-colors duration-300">
          {/* Subtle border glow effect on hover */}
          <div className="absolute inset-0 border border-stone-200/0 dark:border-white/0 group-hover:border-stone-300 dark:group-hover:border-white/10 rounded-[2rem] transition-colors duration-500 pointer-events-none"></div>
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-stone-900 to-stone-600 dark:from-white dark:to-stone-400 mb-3 tracking-tight">
              {isAdmin ? "Admin Access" : "Welcome Back"}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm font-medium">
              {isAdmin ? "Secure system administration." : "Sign in to continue to your workspace."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 dark:text-stone-500 group-focus-within/input:text-emerald-600 dark:group-focus-within/input:text-emerald-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 p-3.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">Password</label>
                <Link href="/auth/forgot" className="text-xs font-bold text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 dark:text-stone-500 group-focus-within/input:text-emerald-600 dark:group-focus-within/input:text-emerald-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 p-3.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-white focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="pt-4">
              <button 
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group/btn ${
                isAdmin
                  ? "bg-stone-800 text-white hover:bg-stone-700"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] hover:-translate-y-0.5"
              }`}>
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? "Signing in..." : (isAdmin ? "Access Control Panel" : "Sign In to Workspace")}
                  {!isLoading && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                </span>
              </button>
            </div>
          </form>

          {!isAdmin && (
            <div className="mt-8 flex flex-col gap-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="px-4 bg-stone-50 dark:bg-slate-900 text-stone-500 font-bold rounded-full transition-colors duration-300">Or continue with</span>
                </div>
              </div>
              
              <div className="flex justify-center w-full hover:scale-[1.02] transition-transform">
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    handleGoogleSuccess(credentialResponse.credential);
                  }}
                  onError={() => {
                    toast.error('Google Sign In failed');
                  }}
                  theme="filled_black"
                  size="large"
                  shape="pill"
                  text="continue_with"
                />
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-8 pt-8 border-t border-stone-200 dark:border-white/10 text-center">
            {isAdmin ? (
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                 Return to User Login
              </Link>
            ) : (
              <p className="text-sm text-stone-600 dark:text-stone-400 font-medium">
                New to Lakshya?{' '}
                <Link href="/auth/register" className="text-emerald-600 dark:text-emerald-500 font-bold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Create an account
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Login.getLayout = (page) => page;
export default Login;
