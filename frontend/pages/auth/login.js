import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { Eye, EyeOff, User, Map, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

function Login() {
  const { login, continueWithGoogle } = useAuth();
  const router = useRouter();

  const isAdmin = router.query.role === "admin";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

    const res = await login(email, password);

    if (res.success) {
      if (res.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#0c0a09] selection:bg-amber-700/30">

      {/* LEFT - PRESENTATION (WOW FACTOR) */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-[#050404] overflow-hidden p-12 border-r border-white/5">
        
        {/* Abstract Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/20 blur-[120px] rounded-full animate-pulse z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#8b5e3c]/20 blur-[130px] rounded-full z-0 animation-delay-2000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        
        {/* Glassmorphism Hero Card */}
        <div className="relative z-10 w-full max-w-lg p-10 rounded-[3rem] bg-stone-900/40 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <div className="flex flex-col items-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b5e3c] to-[#6a462c] flex items-center justify-center font-bold text-3xl text-orange-50 mb-10 shadow-xl shadow-amber-900/30 border border-amber-700/30">
              L
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight">
              Master the Code. <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Ace the Interview.
              </span>
            </h1>
            
            <p className="text-stone-300 text-lg leading-relaxed mb-10">
              Join thousands of students securing their dream tech placements through structured, human-centric preparation module designed for success.
            </p>

            {/* Social Proof / Stats */}
            <div className="flex flex-col xl:flex-row items-center gap-6 p-5 rounded-3xl bg-black/40 border border-white/5 w-full shadow-inner">
               <div className="flex -space-x-4">
                  {['S','A','R'].map((initial, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[#12100e] bg-stone-800 flex items-center justify-center text-sm font-bold text-amber-500 shadow-md">
                      {initial}
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-[#12100e] bg-amber-900/50 flex items-center justify-center text-xs font-bold text-amber-400 backdrop-blur-sm">
                    +2k
                  </div>
               </div>
               <div className="flex flex-col">
                 <div className="flex items-center gap-1.5 text-amber-400 mb-0.5">
                   {[1,2,3,4,5].map(v => <Sparkles key={v} className="w-4 h-4 fill-current" />)}
                 </div>
                 <span className="text-sm font-medium text-stone-400 tracking-wide">
                   Over <strong className="text-white">10,000+</strong> active learners
                 </span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT - AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-[#0c0a09] relative">
        
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-900/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 animate-in slide-in-from-right-8 duration-700 fade-in">
          
          <div className="lg:hidden w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8b5e3c] to-[#6a462c] flex items-center justify-center font-bold text-2xl text-orange-50 mb-8 shadow-xl shadow-amber-900/30 border border-amber-700/30">
            L
          </div>
          
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
              {isAdmin ? "Admin Access" : "Welcome Back"}
            </h2>
            <p className="text-stone-400 text-lg">
              {isAdmin ? "System administration control panel." : "Sign in to continue your preparation journey."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-300 tracking-wide uppercase">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full p-4 rounded-2xl bg-stone-900/50 border border-white/10 text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent focus:bg-stone-900/80 transition-all duration-300 shadow-inner"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-300 tracking-wide uppercase">Password</label>
                <Link href="/auth/forgot" className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full p-4 rounded-2xl bg-stone-900/50 border border-white/10 text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent focus:bg-stone-900/80 transition-all duration-300 shadow-inner"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-stone-500 hover:text-stone-300 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="pt-2">
              <button className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 transform hover:-translate-y-1 ${
                isAdmin
                  ? "bg-stone-800 hover:bg-stone-700 border border-white/10 shadow-xl shadow-stone-900/50"
                  : "bg-gradient-to-r from-[#8b5e3c] to-[#7a5234] hover:from-[#7a5234] hover:to-[#6a462c] shadow-xl shadow-amber-900/20"
              }`}>
                {isAdmin ? "Log in as Admin" : "Sign In to Lakshya"}
              </button>
            </div>

          </form>

          {!isAdmin && (
            <div className="mt-6 flex flex-col gap-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#0c0a09] text-stone-500 font-medium">Or continue with</span>
                </div>
              </div>
              
              <div className="flex justify-center w-full">
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
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            {isAdmin ? (
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors">
                 Return to User Login
              </Link>
            ) : (
              <div className="space-y-6">
                <p className="text-base text-stone-400">
                  New to Lakshya?{' '}
                  <Link href="/auth/register" className="text-amber-500 font-bold hover:text-amber-400 transition-colors underline underline-offset-4">
                    Create an account
                  </Link>
                </p>
                <div>
                  <Link href="/auth/login?role=admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900/50 border border-white/5 text-xs font-semibold text-stone-500 hover:text-stone-300 hover:bg-stone-900 transition-colors">
                    <User className="w-3 h-3" /> Admin portal access
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

Login.getLayout = (page) => page;
export default Login;