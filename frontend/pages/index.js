import Link from "next/link";
import { ArrowRight, Code, Brain, LineChart, BookOpen, Video, Mic, Globe, Users, MessageSquare } from "lucide-react";

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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-8 mt-20 w-full max-w-2xl border-t border-white/5 pt-12">
            {[
              { label: "Practice Questions", value: "1,500+" },
              { label: "Success Rate", value: "94%" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">{stat.label}</p>
              </div>
            ))}
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

      {/* How it Works Section */}
      <section className="py-24 bg-[#070504]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
             <h2 className="text-3xl font-bold text-orange-50 mb-4">Your Path to Placement</h2>
             <p className="text-stone-400">Three simple steps to transform your technical interview performance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
             {/* Connector Line (Hidden on mobile) */}
             <div className="absolute top-1/2 left-0 w-full h-[2px] bg-amber-900/10 hidden md:block z-0"></div>

             {[
               { step: "01", title: "Select Module", desc: "Choose from DSA, System Design, or Language-specific practice banks." },
               { step: "02", title: "Practice Hard", desc: "Solve challenges in our live IDE with real-time feedback and hidden test cases." },
               { step: "03", title: "Get Hired", desc: "Use our AI-driven reports to target your weaknesses and walk in with confidence." }
             ].map((item, i) => (
               <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-stone-900 border-2 border-amber-900/30 flex items-center justify-center text-xl font-black text-amber-500 mb-6 shadow-xl shadow-black">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed max-w-[200px]">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Samvaad Integrated Section */}
      <section className="py-24 border-t border-amber-900/10 bg-[#0c0a09] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
                <Globe className="w-3 h-3" /> Integrated Platform
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Beyond Practice: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  Live Mock Interviews
                </span>
              </h2>
              <p className="text-stone-400 text-lg mb-8 leading-relaxed font-medium">
                Take your preparation to the next level with <span className="text-amber-500 font-bold">Samvaad</span>, our dedicated peer-to-peer interview platform. Practice live coding, system design, and behavioral rounds with fellow aspirants in a professional environment.
              </p>
              
              <div className="space-y-4 mb-10">
                {[
                  { icon: <Video className="w-4 h-4" />, text: "HD Video & Audio connectivity" },
                  { icon: <Code className="w-4 h-4" />, text: "Collaborative Real-time Code Editor" },
                  { icon: <Users className="w-4 h-4" />, text: "Group Discussion (GD) Rooms" },
                  { icon: <Mic className="w-4 h-4" />, text: "Peer-to-peer Feedback & Rating System" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-stone-300">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-semibold">{feature.text}</span>
                  </div>
                ))}
              </div>

              <a 
                href="https://samvaad-ten.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-amber-900/20 hover:shadow-amber-900/40 hover:-translate-y-1"
              >
                Launch Samvaad <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative">
                {/* Mockup Frame */}
                <div className="bg-stone-900 rounded-3xl p-3 border border-white/10 shadow-2xl overflow-hidden relative group">
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden relative">
                    {/* Placeholder image representation for Samvaad */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-black flex items-center justify-center">
                       <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                            <Video className="w-10 h-10 text-amber-500" />
                          </div>
                          <p className="text-amber-500 font-black tracking-widest uppercase text-xs">Live Interview in Progress</p>
                       </div>
                    </div>
                    {/* Floating UI elements for mockup feel */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                       <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-500/80"></div>
                          <div className="w-8 h-8 rounded-full bg-stone-800/80"></div>
                       </div>
                    </div>
                  </div>
                </div>
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-stone-900 border border-white/10 p-4 rounded-2xl shadow-2xl max-w-[180px] animate-bounce-slow">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Live Now</p>
                   </div>
                </div>
              </div>
            </div>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-stone-900/40 border border-white/5 hover:border-white/10 hover:bg-stone-900/60 transition-all group backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Curated Data Bank</h3>
              <p className="text-stone-400 leading-relaxed text-sm font-medium">
                Access a highly curated list of challenges asked in product-based companies. Filter by difficulty, topic, and company.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-900/40 border border-white/5 hover:border-white/10 hover:bg-stone-900/60 transition-all group backdrop-blur-xl relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Live Code IDE</h3>
              <p className="text-stone-400 leading-relaxed text-sm font-medium relative z-10">
                Write, compile, and run code in multiple languages directly in your browser with a distraction-free IDE interface.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-900/40 border border-white/5 hover:border-white/10 hover:bg-stone-900/60 transition-all group backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Performance Analytics</h3>
              <p className="text-stone-400 leading-relaxed text-sm font-medium">
                Track your progress with detailed metrics on accuracy, speed, and topic-wise mastery to identify weak areas.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-900/40 border border-white/5 hover:border-white/10 hover:bg-stone-900/60 transition-all group backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">GD Preparation</h3>
              <p className="text-stone-400 leading-relaxed text-sm font-medium">
                Master Group Discussions with curated topics, tips, and common pitfalls. Prepare for the most crucial round of placements.
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
            <ul className="space-y-4">
              <li className="flex items-center gap-4 text-stone-400 group">
                 <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center group-hover:bg-amber-600 transition-all">
                   <svg className="w-5 h-5 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase text-stone-600 tracking-widest">Email</p>
                   <a href="mailto:mishrasuraj6299@gmail.com" className="text-stone-300 hover:text-amber-400 transition-colors">mishrasuraj6299@gmail.com</a>
                 </div>
              </li>
              <li className="flex items-center gap-4 text-stone-400 group">
                 <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center group-hover:bg-emerald-600 transition-all">
                    <svg className="w-5 h-5 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase text-stone-600 tracking-widest">Phone</p>
                   <span className="text-stone-300">6299323274</span>
                 </div>
              </li>
              <li className="flex items-center gap-4 text-stone-400 group">
                 <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                    <svg className="w-5 h-5 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase text-stone-600 tracking-widest">LinkedIn</p>
                   <a href="https://www.linkedin.com/in/suraj-kumar-mishra-30112527b" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-amber-400 transition-colors">Suraj Kumar Mishra</a>
                 </div>
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