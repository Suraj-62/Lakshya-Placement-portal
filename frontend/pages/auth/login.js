import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { Eye, EyeOff, User, Map, Sparkles, ArrowRight } from 'lucide-react';
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

    <div className="min-h-screen flex font-sans bg-[#0c0a09] selection:bg-amber-700/30">
      <Head>
        <title>{isAdmin ? "Admin Login" : "Login"} | Lakshya</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      {/* LEFT - PRESENTATION (WOW FACTOR) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center bg-black overflow-hidden p-16 border-r border-white/5">
        
        {/* Sleek Mesh Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_rgba(217,119,6,0.15)_0%,_transparent_50%),radial-gradient(circle_at_100%_100%,_rgba(59,130,246,0.1)_0%,_transparent_50%)] z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay z-0"></div>
        
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex h-16 px-6 rounded-2xl bg-white items-center justify-center font-black text-3xl text-black mb-12 shadow-[0_0_40px_rgba(255,255,255,0.2)] tracking-tight">
            Lakshya
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
            Elevate your <br/> 
            <span className="text-stone-400">
              engineering career.
            </span>
          </h1>
          
          <p className="text-stone-400 text-lg leading-relaxed mb-12 font-medium max-w-md">
            Join the elite tier of engineers securing top-tier tech placements through our rigorously structured, professional-grade platform.
          </p>

          {/* Social Proof / Stats */}
          <div className="flex items-center gap-6 pt-8 border-t border-white/10">
             <div className="flex -space-x-4">
                {['S','A','R'].map((initial, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-stone-900 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                    {initial}
                  </div>
                ))}
             </div>
             <div className="flex flex-col">
               <div className="flex items-center gap-1 text-amber-500 mb-1">
                 {[1,2,3,4,5].map(v => <Sparkles key={v} className="w-4 h-4 fill-current" />)}
               </div>
               <span className="text-sm font-bold text-stone-400">
                 Trusted by <span className="text-white">10k+</span> students
               </span>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT - AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-24 bg-[#0a0a0a] relative">

        <div className="w-full max-w-sm relative z-10 animate-in slide-in-from-right-8 duration-700 fade-in">
          
          <div className="lg:hidden inline-flex h-12 px-5 rounded-xl bg-white items-center justify-center font-black text-xl text-black mb-10 shadow-lg tracking-tight">
            Lakshya
          </div>
          
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
              {isAdmin ? "Admin Access" : "Welcome back"}
            </h2>
            <p className="text-stone-400 font-medium">
              {isAdmin ? "Secure system administration." : "Sign in to your professional workspace."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full p-3.5 rounded-xl bg-transparent border border-white/10 text-white placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all font-medium"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Password</label>
                <Link href="/auth/forgot" className="text-xs font-bold text-stone-400 hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full p-3.5 rounded-xl bg-transparent border border-white/10 text-white placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all font-medium"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-stone-500 hover:text-white focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="pt-4">
              <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isAdmin
                  ? "bg-stone-800 text-white hover:bg-stone-700"
                  : "bg-white text-black hover:bg-stone-200"
              }`}>
                {isAdmin ? "Access Control Panel" : "Sign In to Workspace"}
                <ArrowRight className="w-4 h-4" />
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