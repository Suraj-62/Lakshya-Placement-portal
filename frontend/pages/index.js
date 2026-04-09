import Link from "next/link";
import { ArrowRight, Code, Brain, LineChart } from "lucide-react";

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
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#8b5e3c]/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/10 border border-amber-700/20 text-amber-500 text-sm mb-8 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
            Human-centric placement preparation
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-orange-50 mb-6 max-w-4xl mx-auto leading-tight">
            Master the code. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400">
              Ace the interview.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered coding practice, structured mock interviews, and real-time performance analytics designed to feel natural and encouraging.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="w-full sm:w-auto px-8 py-4 bg-orange-50 text-stone-900 rounded-xl font-semibold hover:bg-orange-100 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-amber-900/10">
              Start Practicing Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-stone-900 border border-amber-900/30 text-amber-50 rounded-xl font-semibold hover:bg-stone-800 transition-all">
              View Curriculum
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
            <div className="p-8 rounded-2xl bg-stone-900/50 border border-amber-900/20 hover:border-amber-700/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-900/20 flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-orange-50 mb-3">AI Mock Interviews</h3>
              <p className="text-stone-400 leading-relaxed">
                Experience realistic interview scenarios with our advanced AI. Get instant feedback on your problem-solving approach.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-900/50 border border-amber-900/20 hover:border-amber-700/40 transition-colors overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-orange-900/20 flex items-center justify-center mb-6 relative z-10">
                <Code className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-orange-50 mb-3 relative z-10">Live Coding Environment</h3>
              <p className="text-stone-400 leading-relaxed relative z-10">
                Write, compile, and run code in multiple languages directly in your browser with an intuitive, distraction-free editor.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-900/50 border border-amber-900/20 hover:border-amber-700/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#8b5e3c]/20 flex items-center justify-center mb-6">
                <LineChart className="w-6 h-6 text-[#c19a6b]" />
              </div>
              <h3 className="text-xl font-semibold text-orange-50 mb-3">Performance Analytics</h3>
              <p className="text-stone-400 leading-relaxed">
                Track your progress over time. Identify weak areas with detailed metrics on accuracy, speed, and topic proficiency.
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