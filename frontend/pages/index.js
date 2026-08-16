import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, Code, Brain, LineChart, BookOpen, Video, Mic, Globe, Users, MessageSquare, 
  ChevronDown, ChevronUp, Star, Quote, Mail, MapPin, Phone, Rocket 
} from "lucide-react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  
  const words = ["Software Engineer", "Data Scientist", "Product Manager", "SDE-1", "Tech Lead"];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const faqs = [
    { question: "Is Lakshya suitable for beginners?", answer: "Absolutely. We have structured modules that start from fundamental concepts and gradually scale up to advanced competitive programming and system design." },
    { question: "How does the Samvaad feature work?", answer: "Samvaad allows you to pair up with peers or mentors for live mock interviews. It features real-time video, audio, and a collaborative code editor." },
    { question: "Are the practice questions up to date?", answer: "Yes, our dedicated team constantly updates the question bank with the latest patterns asked in top product-based companies like Google, Amazon, and Microsoft." },
    { question: "Can I track my progress over time?", answer: "Yes! Your dashboard provides detailed analytics, including topic-wise proficiency, accuracy rates, and an AI-driven report to highlight your weak areas." }
  ];

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };
  return (
    <div className="min-h-screen bg-[#070504] text-stone-300 font-sans selection:bg-amber-500/30 selection:text-amber-200 transition-colors duration-500 relative">
      {/* Global Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-[0.1] mix-blend-overlay"></div>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#070504]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 w-1/4">
            <img src="/logo.png" alt="Lakshya Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]" />
            <span className="text-xl font-bold text-amber-500 tracking-tight">
              Lakshya
            </span>
          </div>
          
          <div className="hidden md:flex flex-1 justify-center gap-8 text-sm font-medium">
            <Link href="#features" className="text-stone-400 hover:text-white transition-colors">Features</Link>
            <Link href="#about" className="text-stone-400 hover:text-white transition-colors">About</Link>
            <Link href="#contact" className="text-stone-400 hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex justify-end items-center gap-6 text-sm font-medium w-1/4">
            <Link href="/auth/login" className="text-stone-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/auth/register" className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] font-bold">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-24 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* Subtle glowing center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
            Accelerate Your Tech <br/> Leadership Journey
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg text-stone-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Lakshya Placement Portal is your direct path to senior tech roles. Access curated resources, master technical interviews, and find your next lead role.
          </p>

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-900/50 text-emerald-500 text-[10px] font-bold tracking-widest uppercase mb-12 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Elevate Your Career
          </div>
          
          {/* Gradient Divider */}
          <div className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-stone-500/30 to-transparent mb-10"></div>

          {/* 4 Feature Cards Inline */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 w-full max-w-5xl">
            {[
              { icon: <Code className="w-6 h-6 mb-3 text-stone-300" />, title: "Coding Practice" },
              { icon: <Mic className="w-6 h-6 mb-3 text-stone-300" />, title: "Mock Interviews" },
              { icon: <Rocket className="w-6 h-6 mb-3 text-stone-300" />, title: "Role Matching" },
              { icon: <Globe className="w-6 h-6 mb-3 text-stone-300" />, title: "Company Research" }
            ].map((feature, idx) => (
              <div key={idx} className="flex-1 min-w-[140px] max-w-[220px] p-6 rounded-2xl bg-[#110e0d] border border-white/5 hover:border-white/10 hover:bg-[#161211] transition-all flex flex-col items-center justify-center cursor-pointer group">
                <div className="group-hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center">
                  {feature.icon}
                  <h3 className="text-xs font-bold text-stone-300">{feature.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-2">
            <Link href="/auth/register" className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-400 hover:to-orange-400 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 group w-full sm:w-auto">
              Start Practicing Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="px-8 py-3.5 bg-[#151211] text-stone-300 rounded-xl font-bold hover:bg-[#1f1a18] transition-all border border-white/5 w-full sm:w-auto flex justify-center">
              View Capabilities
            </Link>
          </div>

        </div>
      </section>

      {/* Trusted By / Prepare For Marquee */}
      <section className="py-12 border-y border-stone-200 dark:border-amber-900/10 bg-white dark:bg-[#070504] overflow-hidden flex flex-col items-center relative z-10 transition-colors duration-300">
        <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#8b5e3c] uppercase mb-8 shadow-stone-200 dark:shadow-black drop-shadow-sm dark:drop-shadow-lg">
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

      {/* Platform Preview Section */}
      <section className="py-24 bg-stone-50 dark:bg-[#090706] relative overflow-hidden transition-colors duration-300 border-b border-stone-200 dark:border-amber-900/10">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-orange-50 mb-4">Experience the Platform</h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">A seamless, distraction-free environment built for focus.</p>
          </div>
          
          <div className="w-full max-w-5xl mx-auto rounded-xl shadow-premium overflow-hidden border border-stone-200 dark:border-stone-800 bg-[#1e1e1e] flex flex-col group hover:-translate-y-2 transition-transform duration-500">
            {/* Mac Window Header */}
            <div className="h-10 bg-[#2d2d2d] flex items-center px-4 gap-2 border-b border-stone-800">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            {/* Window Content */}
            <div className="flex flex-col md:flex-row flex-1 text-left">
              {/* Problem Sidebar */}
              <div className="w-full md:w-1/3 bg-[#1e1e1e] p-6 border-r border-stone-800">
                <h3 className="text-lg font-bold text-white mb-2">1. Two Sum</h3>
                <div className="flex gap-2 mb-4">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-green-500/20 text-green-400 rounded-md font-bold">Easy</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-amber-500/20 text-amber-400 rounded-md font-bold">Array</span>
                </div>
                <p className="text-stone-400 text-sm leading-relaxed mb-4">
                  Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.
                </p>
                <div className="p-3 bg-[#2d2d2d] rounded-lg text-xs font-mono text-stone-300">
                  <span className="text-stone-500">Input:</span> nums = [2,7,11,15], target = 9<br/>
                  <span className="text-stone-500">Output:</span> [0,1]
                </div>
              </div>
              
              {/* Code Editor */}
              <div className="w-full md:w-2/3 bg-[#151515] p-6 font-mono text-sm leading-relaxed text-stone-300 relative overflow-hidden">
                <div className="absolute top-4 right-4 flex gap-2">
                   <div className="px-3 py-1 bg-stone-800 rounded-md text-xs text-stone-400">Python 3</div>
                   <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-md text-xs border border-amber-500/30 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Running</div>
                </div>
                <div className="mt-8">
                  <div className="text-blue-400">class <span className="text-yellow-300">Solution</span>:</div>
                  <div className="pl-4">
                    <div className="text-blue-400">def <span className="text-yellow-300">twoSum</span>(self, nums: List[int], target: int) -&gt; List[int]:</div>
                    <div className="pl-4 text-emerald-400"># Use a hash map for O(n) lookup</div>
                    <div className="pl-4">seen = {'{}'}</div>
                    <div className="pl-4"><span className="text-purple-400">for</span> i, num <span className="text-purple-400">in</span> enumerate(nums):</div>
                    <div className="pl-8">complement = target - num</div>
                    <div className="pl-8"><span className="text-purple-400">if</span> complement <span className="text-purple-400">in</span> seen:</div>
                    <div className="pl-12"><span className="text-purple-400">return</span> [seen[complement], i]</div>
                    <div className="pl-8">seen[num] = i</div>
                    <div className="pl-4"><span className="text-purple-400">return</span> []</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-stone-100 dark:bg-[#070504] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
               <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-orange-50 tracking-tight leading-tight">
                 The Interview Prep <br/><span className="text-amber-500">Broken System.</span>
               </h2>
               <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
                 Most platforms focus solely on solving algorithms in isolation. But real interviews are collaborative. They test how you communicate, handle pressure, and adapt to feedback.
               </p>
               
               <div className="space-y-4">
                 <div className="flex gap-4 p-5 rounded-2xl glass-card shadow-premium relative group hover:-translate-y-1 transition-all duration-300">
                   <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500 flex-shrink-0 shadow-glow">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </div>
                   <div>
                     <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Lonely Grinding</h4>
                     <p className="text-sm text-stone-500">Practicing alone doesn't build interview communication skills.</p>
                   </div>
                 </div>
                 <div className="flex gap-4 p-5 rounded-2xl glass-card shadow-premium relative group hover:-translate-y-1 transition-all duration-300">
                   <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 flex-shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <div>
                     <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-1">The Lakshya Edge</h4>
                     <p className="text-sm text-stone-500">Live mock interviews (Samvaad) simulate the real pressure.</p>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] rotate-3 opacity-40 blur-2xl animate-pulse"></div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Students collaborating" className="relative z-10 rounded-[2.5rem] shadow-premium object-cover aspect-[4/3] border border-white/10" />
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-stone-50 dark:bg-[#070504] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
             <h2 className="text-3xl font-bold text-stone-900 dark:text-orange-50 mb-4">Your Path to Placement</h2>
             <p className="text-stone-600 dark:text-stone-400">Three simple steps to transform your technical interview performance.</p>
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
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-amber-900/30 flex items-center justify-center text-xl font-black text-amber-600 dark:text-amber-500 mb-6 shadow-xl shadow-stone-200 dark:shadow-black">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-stone-600 dark:text-stone-500 text-sm leading-relaxed max-w-[200px]">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Samvaad Integrated Section */}
      <section className="py-24 border-t border-stone-200 dark:border-amber-900/10 bg-white dark:bg-[#0c0a09] relative overflow-hidden transition-colors duration-300">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 blur-[120px] rounded-full animate-blob pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
                <Globe className="w-3 h-3" /> Integrated Platform
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-white mb-6 tracking-tight leading-tight">
                Beyond Practice: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-500">
                  Live Mock Interviews
                </span>
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-8 leading-relaxed font-medium">
                Take your preparation to the next level with <span className="text-amber-500 font-bold">Samvaad</span>, our dedicated peer-to-peer interview platform. Practice live coding, system design, and behavioral rounds with fellow aspirants in a professional environment.
              </p>
              
              <div className="space-y-4 mb-10">
                {[
                  { icon: <Video className="w-4 h-4" />, text: "HD Video & Audio connectivity" },
                  { icon: <Code className="w-4 h-4" />, text: "Collaborative Real-time Code Editor" },
                  { icon: <Users className="w-4 h-4" />, text: "Group Discussion (GD) Rooms" },
                  { icon: <Mic className="w-4 h-4" />, text: "Peer-to-peer Feedback & Rating System" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
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
      <section id="features" className="py-24 border-t border-stone-200 dark:border-amber-900/20 bg-stone-50 dark:bg-[#0c0a09] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-orange-50 mb-4">Built for Success</h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">Our platform provides comprehensive tools to bridge the gap between learning and landing your dream job.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl glass-card relative group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">Curated Data Bank</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm font-medium">
                Access a highly curated list of challenges asked in product-based companies. Filter by difficulty, topic, and company.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-card relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform shadow-sm">
                <Code className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3 relative z-10">Live Code IDE</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm font-medium relative z-10">
                Write, compile, and run code in multiple languages directly in your browser with a distraction-free IDE interface.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-card relative group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <LineChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">Performance Analytics</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm font-medium">
                Track your progress with detailed metrics on accuracy, speed, and topic-wise mastery to identify weak areas.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-card relative group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <MessageSquare className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">GD Preparation</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm font-medium">
                Master Group Discussions with curated topics, tips, and common pitfalls. Prepare for the most crucial round of placements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 border-t border-white/5 bg-[#0a0807] transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none animate-blob"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-[2rem] rotate-[-3deg] blur-xl"></div>
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" alt="About Lakshya Team" className="relative z-10 rounded-[2rem] shadow-premium object-cover aspect-square border border-white/10" />
            </div>
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">
                <Users className="w-3 h-3 fill-current" /> Our Mission
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Empowering the Next Generation of <span className="text-amber-500">Tech Leaders.</span>
              </h2>
              <p className="text-stone-400 leading-relaxed text-lg">
                Lakshya was born from a simple observation: there's a massive gap between learning to code and actually clearing a technical interview at a top-tier product company.
              </p>
              <p className="text-stone-400 leading-relaxed text-lg">
                We've built a comprehensive ecosystem that combines curated, high-yield practice problems with real-time peer-to-peer mock interviews (Samvaad). Our goal is to simulate the exact pressure and environment of a real interview so you walk in with absolute confidence.
              </p>
              <div className="pt-4 flex gap-8">
                <div>
                  <h4 className="text-3xl font-black text-white mb-1">10K+</h4>
                  <p className="text-stone-500 text-sm font-bold uppercase tracking-widest">Active Users</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white mb-1">50+</h4>
                  <p className="text-stone-500 text-sm font-bold uppercase tracking-widest">Partner Companies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 border-t border-stone-200 dark:border-amber-900/20 bg-white dark:bg-[#070504] relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-600/10 blur-[120px] rounded-full animate-blob pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <Star className="w-3 h-3 fill-current" /> Success Stories
            </div>
            <h2 className="text-3xl font-bold text-stone-900 dark:text-orange-50 mb-4">From Aspirants to Achievers</h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">See how Lakshya has transformed the careers of engineers just like you.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Rahul S.", role: "SDE-1 @ Microsoft", quote: "The curated problem sets and live mock interviews on Samvaad were game-changers. I walked into my Microsoft interview feeling completely prepared." },
              { name: "Anjali K.", role: "Software Engineer @ Google", quote: "Lakshya's analytics helped me identify my weak spots in Dynamic Programming. The distraction-free IDE made practicing a breeze." },
              { name: "Vikram P.", role: "Backend Developer @ Amazon", quote: "The GD preparation modules gave me the confidence I needed to clear the initial screening rounds. Highly recommend it to everyone." }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 rounded-3xl glass-card relative group hover:-translate-y-2 transition-all duration-300">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-stone-200 dark:text-stone-800/50 group-hover:text-amber-500/20 transition-colors" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-glow">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-stone-900 dark:text-white font-bold">{testimonial.name}</h4>
                    <p className="text-amber-600 dark:text-amber-500 text-xs font-semibold">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-stone-50 dark:bg-[#050403] relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 dark:bg-amber-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="p-12 md:p-16 rounded-[3rem] glass-card shadow-premium border border-amber-500/20 text-center relative overflow-hidden">
             {/* Inner glowing element */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/20 blur-[80px] rounded-full"></div>
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full"></div>
             
             <h2 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-white mb-6 tracking-tight relative z-10">
               Ready to Crack Your Next <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">Tech Interview?</span>
             </h2>
             <p className="text-stone-600 dark:text-stone-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
               Join thousands of students who have already transformed their careers with Lakshya's premium curated content and live mock interviews.
             </p>
             <Link href="/auth/register" className="inline-flex px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all shadow-glow hover:shadow-glow-lg text-lg items-center gap-3 group relative z-10 hover:-translate-y-1">
               Create Your Free Account
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-stone-200 dark:border-amber-900/20 bg-stone-50 dark:bg-[#0c0a09] transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-orange-50 mb-4">Frequently Asked Questions</h2>
            <p className="text-stone-600 dark:text-stone-400">Everything you need to know about the platform.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-sm">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-stone-800 dark:text-white font-medium">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                  )}
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 border-t border-stone-200 dark:border-amber-900/20 bg-stone-50 dark:bg-[#090706] transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none animate-blob"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-orange-50 mb-4">Get in Touch</h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">Have questions? We're here to help you on your placement journey.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="p-8 rounded-3xl glass-card relative group hover:-translate-y-1 transition-all duration-300 flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-glow flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Email Us</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm font-medium">mishrasuraj6299@gmail.com</p>
                </div>
              </div>

              <div className="p-8 rounded-3xl glass-card relative group hover:-translate-y-1 transition-all duration-300 flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Call Us</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm font-medium">+91 6299323274</p>
                </div>
              </div>
              
              <div className="p-8 rounded-3xl glass-card relative group hover:-translate-y-1 transition-all duration-300 flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Location</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm font-medium">India</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-10 rounded-3xl glass-card relative shadow-premium">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-[#151211]/50 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-stone-400 dark:placeholder-stone-600" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-[#151211]/50 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-stone-400 dark:placeholder-stone-600" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-[#151211]/50 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-stone-400 dark:placeholder-stone-600" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Message</label>
                  <textarea rows="4" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-[#151211]/50 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-stone-400 dark:placeholder-stone-600 resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2 group">
                  Send Message
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="pt-20 pb-10 border-t border-stone-200 dark:border-amber-900/20 bg-white dark:bg-[#050403] relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="Lakshya Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(217,119,6,0.5)]" />
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-500 tracking-tight">
                  Lakshya
                </span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-6">
                Master the code. Ace the interview. Your comprehensive platform for engineering placement preparation, offering curated challenges and live mock interviews.
              </p>
              <div className="flex gap-4">
                <a href="https://x.com/Surajkumar70232" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-amber-500 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/suraj-kumar-mishra-30112527b" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-blue-600 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://github.com/Suraj-62" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-800 dark:hover:bg-stone-700 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-stone-900 dark:text-white font-bold mb-6 tracking-wide">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/practice" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Practice Arena</Link></li>
                <li><Link href="/dashboard" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Student Dashboard</Link></li>
                <li><a href="https://samvaad-ten.vercel.app" target="_blank" rel="noopener noreferrer" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Samvaad Interviews</a></li>
                <li><Link href="/leaderboard" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Global Leaderboard</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-stone-900 dark:text-white font-bold mb-6 tracking-wide">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#features" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Features</Link></li>
                <li><Link href="#testimonials" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Success Stories</Link></li>
                <li><Link href="#faq" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">FAQ</Link></li>
                <li><Link href="/auth/register" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Create Account</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div id="contact">
              <h4 className="text-stone-900 dark:text-white font-bold mb-6 tracking-wide">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 text-stone-600 dark:text-stone-400">
                  <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <a href="mailto:mishrasuraj6299@gmail.com" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">mishrasuraj6299@gmail.com</a>
                </li>
                <li className="flex items-start gap-3 text-stone-600 dark:text-stone-400">
                  <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>+91 6299323274</span>
                </li>
                <li className="flex items-start gap-3 text-stone-600 dark:text-stone-400">
                  <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <span>India</span>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="pt-8 border-t border-stone-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-stone-500">
            <p>© {new Date().getFullYear()} Lakshya Placement Portal. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

Home.getLayout = (page) => page;