import Link from "next/link";
import { useEffect, useState } from "react";

function Home() {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    const arr = Array.from({ length: 40 }).map(() => ({
      left: Math.random() * 100,
      duration: 10 + Math.random() * 10,
      size: 14 + Math.random() * 20,
      symbol: ["< />", "{ }", "[ ]", "+", "*", "</>", "==", "&&", "||"][
        Math.floor(Math.random() * 9)
      ],
    }));
    setSymbols(arr);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-[#020617]">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute w-[600px] h-[600px] bg-purple-700 opacity-20 blur-[120px] top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[500px] h-[500px] bg-cyan-500 opacity-20 blur-[120px] bottom-[-100px] right-[-100px]"></div>
      </div>

      {/* FLOATING SYMBOLS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* 🔥 NAVBAR */}
      <div className="relative z-10 flex justify-between items-center px-10 py-6 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/lakshya.png" className="w-10 h-10 rounded-lg" />
          <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
            LAKSHYA
          </h1>
        </div>

        <div className="flex gap-6 items-center">
          <Link href="#about" className="hover:text-purple-400 transition">
            About
          </Link>
          <Link href="#contact" className="hover:text-purple-400 transition">
            Contact
          </Link>

          <Link
            href="/auth/login"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:scale-105 transition shadow-lg"
          >
            Login
          </Link>
        </div>
      </div>

      {/* 🔥 HERO */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-10 pt-24 pb-20 gap-12">

        {/* LEFT */}
        <div className="max-w-xl">
          <h1 className="text-6xl font-extrabold leading-tight">
            Build Skills.{" "}
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-yellow-300 bg-clip-text text-transparent">
              Crack Interviews.
            </span>{" "}
            Get Hired.
          </h1>

          <p className="mt-6 text-lg text-gray-400">
            AI-powered coding practice, mock interviews, and real-time feedback — all in one platform.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/auth/register"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold shadow-lg hover:scale-105 transition"
            >
              Get Started 
            </Link>

            <Link
              href="/auth/login"
              className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition backdrop-blur"
            >
              Login
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full md:w-[520px] group">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-cyan-500 blur-xl opacity-40 group-hover:opacity-70 transition"></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
            <img
              src="/graduation photo.jpg"
              className="w-full h-[400px] object-cover rounded-xl"
            />
          </div>

          
        </div>
      </div>

      {/* 🔥 FEATURES */}
      <div className="relative z-10 grid md:grid-cols-3 gap-6 px-10 pb-20">
        {[
          {
            title: "AI Mock Interviews",
            desc: "Practice real interview scenarios with AI",
          },
          {
            title: "Live Coding",
            desc: "Solve coding problems with instant feedback",
          },
          {
            title: "Performance Analytics",
            desc: "Track your growth and improve faster",
          },
        ].map((item, i) => (
          <div key={i} className="card hover:scale-105 transition">
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <div id="about" className="relative z-10 px-10 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 text-cyan-400">
          About LAKSHYA
        </h2>

        <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Lakshya helps students prepare for placements with structured learning,
          coding practice, mock interviews, and performance tracking. Our goal is
          to make you confident and job-ready.
        </p>
      </div>

      {/* CONTACT */}
      <div id="contact" className="relative z-10 px-10 pb-10 text-center">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">
          Contact Us
        </h2>

        <div className="text-gray-400 space-y-2">
          <p>Email: mishrasuraj6299@gmail.com</p>
          <p>Phone: 6299323274</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 text-center pb-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Lakshya. All rights reserved.
      </div>

      {/* STYLES */}
      <style jsx>{`
        .tag {
          position: absolute;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 24px;
          border-radius: 18px;
        }

        .code-symbol {
          position: absolute;
          top: 100%;
          color: rgba(0, 255, 200, 0.15);
          font-family: monospace;
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-120vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

Home.getLayout = (page) => page;
export default Home;