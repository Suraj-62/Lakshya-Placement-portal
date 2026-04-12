import Link from "next/link";
import { ArrowRight, Code, Brain, LineChart, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-300 font-sans selection:bg-amber-700/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-amber-900/20 bg-[#0c0a09]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8b5e3c] flex items-center justify-center font-bold text-orange-50 shadow-inner shadow-orange-200/20">
              L
            </div>
            <span className="text-xl font-bold text-orange-50 tracking-tight">
              Lakshya
            </span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-amber-400 transition-colors">Features</Link>
            <Link href="#about" className="hover:text-amber-400 transition-colors">About</Link>
            <Link href="#contact" className="hover:text-amber-400 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/auth/login" className="hover:text-amber-400 transition-colors">
              Log in
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-[#8b5e3c] text-orange-50 rounded-lg hover:bg-[#7a5234] transition-colors shadow-md">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay z-0"></div>
        
        {/* Futuristic Glowing Orbs */}
        <div className="absolute top-[20%] left-1/2 -translate-x-[80%] w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute top-[30%] right-1/2 translate-x-[80%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/80 border border-white/5 text-stone-300 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-xl shadow-2xl hover:border-white/10 transition-colors cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Elevate Your Career
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-none drop-shadow-2xl text-center">
            Master the code. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500">
              Ace the interview.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            A premium, distraction-free environment for algorithmic practice. Curated challenges, live compilation, and deep analytics to prepare you for top-tier tech placements.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link href="/auth/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-stone-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:-translate-y-1">
              Start Practicing Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-stone-900/50 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all hover:-translate-y-1">
              View Capabilities
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted By / Prepare For Marquee */}
      <section className="py-12 border-y border-amber-900/10 bg-[#070504] overflow-hidden flex flex-col items-center relative z-10">
        <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#8b5e3c] uppercase mb-8 shadow-black drop-shadow-lg">
          Prepare for Top Tech Giants
        </p>
        
        {/* Marquee Wrapper mask to fade edges cleanly */}
        <div 
          className="w-full max-w-[100vw] flex overflow-hidden relative" 
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
        >
          {/* Marquee Track container that is double wide to loop seamlessly */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
             
             {/* Single Set of items - We repeat it twice below */}
             {[
               "Tata Consultancy Services", "Google", "Microsoft", "Wipro", 
               "Accenture", "Infosys", "Cognizant", "Amazon", "Capgemini", "IBM"
             ].map((company, i) => (
                <div key={`set1-${i}`} className="flex items-center justify-center px-10 sm:px-16 whitespace-nowrap">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-800 uppercase tracking-tighter hover:text-stone-600 transition-colors duration-300">
                    {company}
                  </span>
                </div>
             ))}

             {/* Duplicated Set for Seamless Loop (Tailwind marquee shifts exactly -50% to align perfectly here) */}
             {[
               "Tata Consultancy Services", "Google", "Microsoft", "Wipro", 
               "Accenture", "Infosys", "Cognizant", "Amazon", "Capgemini", "IBM"
             ].map((company, i) => (
                <div key={`set2-${i}`} className="flex items-center justify-center px-10 sm:px-16 whitespace-nowrap">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-800 uppercase tracking-tighter hover:text-stone-600 transition-colors duration-300">
                    {company}
                  </span>
                </div>
             ))}

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-amber-900/20 bg-[#0c0a09]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-orange-50 mb-4">Built for Success</h2>
            <p className="text-stone-400 max-w-2xl mx-auto">Our platform provides comprehensive tools to bridge the gap between learning and landing your dream job.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-stone-900/40 border border-white/5 hover:border-white/10 hover:bg-stone-900/60 transition-all group backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Curated Data Bank</h3>
              <p className="text-stone-400 leading-relaxed font-medium">
                Access a highly curated list of challenges asked in product-based companies. Filter by difficulty, topic, and company.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-900/40 border border-white/5 hover:border-white/10 hover:bg-stone-900/60 transition-all group backdrop-blur-xl relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Live Coding Environment</h3>
              <p className="text-stone-400 leading-relaxed font-medium relative z-10">
                Write, compile, and run code in multiple languages directly in your browser with an intuitive, distraction-free IDE interface.
              </p>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
            </div>

            <div className="p-8 rounded-3xl bg-stone-900/40 border border-white/5 hover:border-white/10 hover:bg-stone-900/60 transition-all group backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Performance Analytics</h3>
              <p className="text-stone-400 leading-relaxed font-medium">
                Track your progress over time. Identify weak areas with detailed metrics on accuracy, speed, and topic-wise mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 border-t border-amber-900/20 bg-[#0c0a09]">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-orange-50 mb-6">About Lakshya</h2>
            <p className="text-stone-400 text-lg leading-relaxed">
                Lakshya aims to democratize tech placement preparation. Whether you are aiming for FAANG or top startups, our structured learning paths and realistic mock environments ensure you won't be caught off-guard.
            </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-8 border-t border-amber-900/20 bg-stone-900/30 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#8b5e3c] flex items-center justify-center font-bold text-orange-50 shadow-inner shadow-orange-200/20">
                L
              </div>
              <span className="text-xl font-bold text-orange-50 tracking-tight">
                Lakshya
              </span>
            </div>
            <p className="text-stone-400 max-w-sm">
              Master the code. Ace the interview. Your comprehensive platform for tech placement preparation.
            </p>
          </div>
          
          <div id="contact" className="md:justify-self-end">
            <h3 className="text-xl font-semibold text-orange-50 mb-6">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-stone-400">
                 <span className="text-amber-500">Email:</span>
                 <a href="mailto:mishrasuraj6299@gmail.com" className="hover:text-amber-400 transition-colors">mishrasuraj6299@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-stone-400">
                 <span className="text-amber-500">Phone:</span>
                 <span className="text-stone-300">6299323274</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-amber-900/20">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} Lakshya. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

Home.getLayout = (page) => page;