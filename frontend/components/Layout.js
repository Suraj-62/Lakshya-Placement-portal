import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { LogOut, User as UserIcon, LayoutDashboard, ChevronDown, Trophy } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-300 font-sans selection:bg-amber-700/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-amber-900/20 bg-[#0c0a09]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div onClick={() => router.push(user ? '/dashboard' : '/')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#8b5e3c] flex items-center justify-center font-bold text-orange-50 shadow-inner shadow-orange-200/20">L</div>
            <span className="text-xl font-bold text-orange-50 tracking-tight">Lakshya</span>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-sm font-medium text-stone-400 hover:text-orange-50 transition-colors hidden sm:block">Dashboard</Link>
                <Link href="/leaderboard" className="text-sm font-medium text-stone-400 hover:text-orange-50 transition-colors hidden sm:block">Leaderboard</Link>
                
                <div className="h-4 w-px bg-stone-700 hidden sm:block"></div>

                <div className="relative" ref={dropdownRef}>
                  <div onClick={() => setOpen(!open)} className="flex items-center gap-2 cursor-pointer group">
                    {user?.avatar ? (
                      <div className="w-9 h-9 rounded-full bg-stone-900 border border-amber-700/50 group-hover:border-amber-500 transition-colors shadow-sm relative flex items-center justify-center">
                        <img 
                          src={`http://localhost:5000${user.avatar}`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover rounded-full absolute inset-0"
                          onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling.style.display='flex'; }}
                        />
                        {/* Hidden fallback if image fails */}
                        <div className="hidden w-full h-full items-center justify-center font-bold text-sm text-amber-500 rounded-full">
                          {userInitial}
                        </div>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-amber-900/40 text-amber-500 border border-amber-700/30 flex items-center justify-center font-bold text-sm group-hover:bg-amber-900/60 transition-colors">
                        {userInitial}
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-stone-500 group-hover:text-stone-300 transition-colors" />
                  </div>

                  {open && (
                    <div className="absolute right-0 mt-3 w-48 py-2 bg-stone-900 border border-amber-900/30 rounded-xl shadow-2xl z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-2 border-b border-amber-900/20 text-sm text-stone-400">
                         Signed in as <br/> <strong className="text-orange-50">{user.name}</strong>
                      </div>
                      <div className="py-1">
                        <button onClick={() => { setOpen(false); router.push('/dashboard'); }} className="w-full px-4 py-2 text-left text-sm text-stone-300 hover:bg-white/5 hover:text-orange-50 flex items-center gap-2 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </button>
                        <button onClick={() => { setOpen(false); router.push('/leaderboard'); }} className="w-full px-4 py-2 text-left text-sm text-stone-300 hover:bg-white/5 hover:text-orange-50 flex items-center gap-2 transition-colors">
                          <Trophy className="w-4 h-4" /> Leaderboard
                        </button>
                        <button onClick={() => { setOpen(false); router.push('/profile'); }} className="w-full px-4 py-2 text-left text-sm text-stone-300 hover:bg-white/5 hover:text-orange-50 flex items-center gap-2 transition-colors">
                          <UserIcon className="w-4 h-4" /> Edit Profile
                        </button>
                        <div className="my-1 border-t border-amber-900/20"></div>
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

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto relative z-10 w-full min-h-[calc(100vh-64px)]">
        {children}
      </main>

    </div>
  );
}