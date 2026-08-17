import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Code, 
  Trophy, 
  User as UserIcon, 
  LogOut, 
  ChevronDown,
  Activity,
  ExternalLink,
  Sun,
  Moon,
  Target
} from 'lucide-react';
import { useTheme } from 'next-themes';

import Head from 'next/head';

export default function Layout({ children, title = 'Lakshya Placement Portal', navHidden = false, fullWidth = false }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    if (!user) return router.push('/');
    if (user.role === 'admin') return router.push('/admin');
    return router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] font-sans selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-500 relative">
        {/* Neetcode Style Background Grid */}
        <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
          {/* Subtle glowing center */}
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
          {/* Dot grid pattern */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          {/* Gradient mask to fade out the grid at the edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]"></div>
        </div>

        {/* Navbar */}
        {!navHidden && (
        <nav className="fixed top-0 w-full z-50 border-b border-stone-200/50 dark:border-white/5 bg-white/70 dark:bg-[#0a0a0a]/80 backdrop-blur-xl shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer group">
            <Target className="w-8 h-8 text-emerald-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-transform duration-500 group-hover:rotate-90" />
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 tracking-tight">Lakshya</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Core Navigation Links - Visible to All */}
            <div className="hidden md:flex items-center gap-8 mr-4">
              <Link href="/practice" className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2">
                <Code className="w-4 h-4" /> Practice
              </Link>
              <a 
                href="https://samvaad-ten.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                Samvaad <ExternalLink className="w-3 h-3" />
              </a>
              <Link href="/dashboard" className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> MCA
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className="text-sm font-bold text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-2">
                   <Activity className="w-4 h-4" /> Admin
                </Link>
              )}
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-stone-200 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-700 transition-all border border-transparent dark:border-white/5"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div onClick={() => setOpen(!open)} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-emerald-900/40 text-emerald-500 border border-emerald-700/30 flex items-center justify-center font-bold text-sm group-hover:bg-emerald-900/60 transition-colors">
                      {userInitial}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-stone-500 group-hover:text-stone-300 transition-all duration-300 ${open ? 'rotate-180' : ''}`} />
                  </div>

                  {open && (
                    <div className="absolute right-0 mt-3 w-52 py-2 glass-card rounded-2xl shadow-premium z-50 transform origin-top-right transition-all animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-3 border-b border-stone-100 dark:border-emerald-900/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">Signed in as</p>
                          <p className="text-sm font-bold text-stone-800 dark:text-teal-50 truncate">{user.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        {user.role === 'admin' ? (
                          <button onClick={() => { setOpen(false); router.push('/admin'); }} className="w-full px-4 py-2.5 text-left text-sm text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 flex items-center gap-2 transition-colors font-bold">
                            <Activity className="w-4 h-4" /> Admin Control
                          </button>
                        ) : (
                          <>
                            <button onClick={() => { setOpen(false); router.push('/dashboard'); }} className="w-full px-4 py-2 text-left text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-emerald-600 dark:hover:text-teal-50 flex items-center gap-2 transition-colors">
                              <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </button>
                            <button onClick={() => { setOpen(false); router.push('/practice'); }} className="w-full px-4 py-2 text-left text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-emerald-600 dark:hover:text-teal-50 flex items-center gap-2 transition-colors">
                              <Code className="w-4 h-4" /> Practice Arena
                            </button>
                            <a 
                              href="https://samvaad-ten.vercel.app" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-full px-4 py-2 text-left text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-emerald-600 dark:hover:text-teal-50 flex items-center gap-2 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" /> Samvaad
                            </a>
                            <button onClick={() => { setOpen(false); router.push('/leaderboard'); }} className="w-full px-4 py-2 text-left text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-emerald-600 dark:hover:text-teal-50 flex items-center gap-2 transition-colors">
                              <Trophy className="w-4 h-4" /> Leaderboard
                            </button>
                          </>
                        )}
                        
                        <button onClick={() => { setOpen(false); router.push('/profile'); }} className="w-full px-4 py-2 text-left text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-emerald-600 dark:hover:text-teal-50 flex items-center gap-2 transition-colors border-t border-stone-100 dark:border-stone-800 mt-1 pt-2">
                          <UserIcon className="w-4 h-4" /> My Profile
                        </button>
                        
                        <div className="my-1 border-t border-stone-100 dark:border-stone-800"></div>
                        
                        <button onClick={() => { setOpen(false); logout(); }} className="w-full px-4 py-2 text-left text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-sm font-medium">
                <Link href="/auth/login" className="text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Log in</Link>
                <Link href="/auth/register" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 font-bold">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      )}

      {/* Main Content */}
      <main className={`relative z-10 w-full ${navHidden ? '' : 'min-h-[calc(100vh-64px)] pt-[72px] pb-4'} ${fullWidth || navHidden ? '' : 'px-6 max-w-7xl mx-auto'}`}>
        {children}
      </main>

      </div>
    </>
  );
}
