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
  Activity
} from 'lucide-react';

import Head from 'next/head';

export default function Layout({ children, title = 'Lakshya Placement Portal', navHidden = false, fullWidth = false }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  useEffect(() => {
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
      </Head>
      <div className="min-h-screen bg-[#0c0a09] font-sans selection:bg-amber-500/30 selection:text-amber-200">
        {/* Dynamic Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-900/10 blur-[120px] rounded-full animate-pulse transition-all duration-1000"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-950/10 blur-[120px] rounded-full animate-pulse delay-700 transition-all duration-1000"></div>
        </div>

        {/* Navbar */}
        {!navHidden && (
        <nav className="fixed top-0 w-full z-50 border-b border-amber-900/20 bg-[#0c0a09]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#8b5e3c] flex items-center justify-center font-bold text-orange-50 shadow-inner shadow-orange-200/20">L</div>
            <span className="text-xl font-bold text-orange-50 tracking-tight">Lakshya</span>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                
                {/* Desktop Links (Conditional for Admin) */}
                <div className="hidden sm:flex items-center gap-6">
                  {user.role === 'admin' ? (
                    <Link href="/admin" className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-2">
                       <Activity className="w-4 h-4" /> Admin Control Center
                    </Link>
                  ) : (
                    <>
                      <Link href="/dashboard" className="text-sm font-medium text-stone-400 hover:text-orange-50 transition-colors">Dashboard</Link>
                      <Link href="/practice" className="text-sm font-medium text-stone-400 hover:text-orange-50 transition-colors">Practice</Link>
                      <Link href="/leaderboard" className="text-sm font-medium text-stone-400 hover:text-orange-50 transition-colors">Leaderboard</Link>
                    </>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div onClick={() => setOpen(!open)} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-amber-900/40 text-amber-500 border border-amber-700/30 flex items-center justify-center font-bold text-sm group-hover:bg-amber-900/60 transition-colors">
                      {userInitial}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-stone-500 group-hover:text-stone-300 transition-all duration-300 ${open ? 'rotate-180' : ''}`} />
                  </div>

                  {open && (
                    <div className="absolute right-0 mt-3 w-52 py-2 bg-stone-900 border border-amber-900/30 rounded-xl shadow-2xl z-50 transform origin-top-right transition-all animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-3 border-b border-amber-900/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">Signed in as</p>
                          <p className="text-sm font-bold text-orange-50 truncate">{user.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        {user.role === 'admin' ? (
                          <button onClick={() => { setOpen(false); router.push('/admin'); }} className="w-full px-4 py-2.5 text-left text-sm text-amber-500 hover:bg-amber-500/10 flex items-center gap-2 transition-colors font-bold">
                            <Activity className="w-4 h-4" /> Admin Control
                          </button>
                        ) : (
                          <>
                            <button onClick={() => { setOpen(false); router.push('/dashboard'); }} className="w-full px-4 py-2 text-left text-sm text-stone-300 hover:bg-white/5 hover:text-orange-50 flex items-center gap-2 transition-colors">
                              <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </button>
                            <button onClick={() => { setOpen(false); router.push('/practice'); }} className="w-full px-4 py-2 text-left text-sm text-stone-300 hover:bg-white/5 hover:text-orange-50 flex items-center gap-2 transition-colors">
                              <Code className="w-4 h-4" /> Practice Arena
                            </button>
                            <button onClick={() => { setOpen(false); router.push('/leaderboard'); }} className="w-full px-4 py-2 text-left text-sm text-stone-300 hover:bg-white/5 hover:text-orange-50 flex items-center gap-2 transition-colors">
                              <Trophy className="w-4 h-4" /> Leaderboard
                            </button>
                          </>
                        )}
                        
                        <button onClick={() => { setOpen(false); router.push('/profile'); }} className="w-full px-4 py-2 text-left text-sm text-stone-300 hover:bg-white/5 hover:text-orange-50 flex items-center gap-2 transition-colors border-t border-stone-800 mt-1 pt-2">
                          <UserIcon className="w-4 h-4" /> My Profile
                        </button>
                        
                        <div className="my-1 border-t border-stone-800"></div>
                        
                        <button onClick={() => { setOpen(false); logout(); }} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-sm font-medium">
                <Link href="/auth/login" className="hover:text-amber-400 transition-colors">Log in</Link>
                <Link href="/auth/register" className="px-4 py-2 bg-[#8b5e3c] text-orange-50 rounded-lg hover:bg-[#7a5234] transition-colors shadow-md">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      )}

      {/* Main Content */}
      <main className={`relative z-10 w-full ${navHidden ? '' : 'min-h-[calc(100vh-64px)] pt-24 pb-12'} ${fullWidth || navHidden ? '' : 'px-6 max-w-7xl mx-auto'}`}>
        {children}
      </main>

      </div>
    </>
  );
}