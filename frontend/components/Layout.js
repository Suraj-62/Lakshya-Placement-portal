import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // USER INITIAL
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '';

  //  FIXED SYMBOLS (NO HYDRATION ERROR)
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 40 }).map(() => ({
      left: Math.random() * 100,
      duration: 8 + Math.random() * 10,
      size: 14 + Math.random() * 20,
      symbol: ["< />", "{ }", "[ ]", "+", "*", "</>", "==", "&&", "||"][
        Math.floor(Math.random() * 9)
      ]
    }));

    setSymbols(generated);
  }, []);

  //  OUTSIDE CLICK CLOSE
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]"></div>

      {/* FLOATING CODE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {symbols.map((item, i) => (
          <span
            key={i}
            className="code-symbol"
            style={{
              left: `${item.left}%`,
              animationDuration: `${item.duration}s`,
              fontSize: `${item.size}px`,
            }}
          >
            {item.symbol}
          </span>
        ))}
      </div>

      {/* NAVBAR */}
      <nav className="relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">

            {/* LEFT */}
            <div
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image src="/lakshya.png" alt="logo" width={40} height={40} />
              <span className="text-lg font-bold text-yellow-400">
                Lakshya
              </span>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-5">

              {user ? (
                <>
                  <select className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm">
                    <option>English</option>
                    <option>Hindi</option>
                  </select>

                  <span className="text-sm text-gray-400">
                    ID: {user?._id?.slice(-6)}
                  </span>

                  {/* DROPDOWN */}
                  <div className="relative" ref={dropdownRef}>
                    <div
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#8b5e3c] flex items-center justify-center text-white font-bold text-lg">
                        {userInitial}
                      </div>

                      <span className="font-medium">{user.name}</span>
                    </div>

                    {open && (
                      <div className="absolute right-0 mt-3 w-44 bg-[#0f172a] border border-white/10 rounded-lg z-50 shadow-xl">

                        <button
                          onClick={() => {
                            setOpen(false);
                            router.push('/profile');
                          }}
                          className="block w-full px-4 py-3 hover:bg-white/10 text-left"
                        >
                          Edit Profile
                        </button>

                        <button
                          onClick={() => {
                            setOpen(false);
                            logout();
                          }}
                          className="block w-full px-4 py-3 hover:bg-white/10 text-left"
                        >
                          Logout
                        </button>

                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-300">
                    Login
                  </Link>

                  <Link
                    href="/auth/register"
                    className="bg-indigo-600 px-4 py-2 rounded-md"
                  >
                    Register
                  </Link>
                </>
              )}

            </div>

          </div>
        </div>
      </nav>

      {/*  MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>

      {/*  CSS */}
      <style jsx>{`
        .code-symbol {
          position: absolute;
          top: 100%;
          color: rgba(0, 255, 150, 0.12);
          font-family: monospace;
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh);
            opacity: 0;
          }
        }
      `}</style>

    </div>
  );
}