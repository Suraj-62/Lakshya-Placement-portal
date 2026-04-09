import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import CategoryGrid from '../components/CategoryGrid';
import withAuth from '../components/withAuth';
import Link from 'next/link';
import { Target, CheckCircle2, XCircle, Activity, PlayCircle, BarChart3, PieChart as PieChartIcon, Flame, Trophy, Award, TrendingDown, BookOpen } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  XAxis, YAxis, CartesianGrid, Area, AreaChart 
} from 'recharts';

function Dashboard() {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    overallAccuracy: 0,
    accuracyTrend: [],
    points: 0,
    badges: [],
    streak: 0,
  });
  const [weakTopics, setWeakTopics] = useState([]);
  const [summary, setSummary] = useState('');

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fallback for categories if endpoint fails, so Dashboard still loads
        let catRes = { data: [] };
        try { catRes = await api.get('/categories'); } catch(e) {}
        
        const [dashRes, weakRes, sumRes] = await Promise.all([
          api.get('/progress/dashboard'),
          api.get('/progress/weakness'),
          api.get('/progress/summary')
        ]);
        
        setCategories(catRes.data);
        setDashboardData(dashRes.data);
        setWeakTopics(weakRes.data.weakTopics || []);
        setSummary(sumRes.data.summary || '');
        
      } catch (err) {
        console.error("Dashboard fetching error: ", err);
      }
    };

    fetchData();
  }, []);

  const hasData = dashboardData.totalAttempts > 0;
  const incorrect = dashboardData.totalAttempts - dashboardData.totalCorrect;

  // Chart Data Preparation
  const pieData = [
    { name: 'Correct', value: dashboardData.totalCorrect || (hasData ? 0 : 1), color: '#10b981' },
    { name: 'Incorrect', value: incorrect > 0 ? incorrect : 0, color: '#f43f5e' }
  ];

  // Map history trend, ensuring valid display points
  let historyData = dashboardData.accuracyTrend;
  if (!historyData || historyData.length === 0) {
    historyData = [
      { name: 'Mock 1', score: 40 },
      { name: 'Mock 2', score: 55 },
      { name: 'Current', score: hasData ? dashboardData.overallAccuracy : 0 }
    ];
  }

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-10 text-center md:text-left relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
           {user?.avatar ? (
             <div className="w-24 h-24 shrink-0 rounded-full bg-stone-900 border-[3px] border-amber-900/50 shadow-xl shadow-amber-900/20 relative flex items-center justify-center">
               <img 
                 src={`http://localhost:5000${user.avatar}`} 
                 alt="Profile" 
                 className="w-full h-full object-cover rounded-full absolute inset-0"
                 onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling.style.display='flex'; }}
               />
               {/* Hidden fallback if image fails */}
               <div className="hidden w-full h-full items-center justify-center text-4xl font-bold text-amber-500/50 rounded-full">
                 {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
               </div>
             </div>
           ) : (
             <div className="w-24 h-24 shrink-0 rounded-full bg-stone-800 border-[3px] border-amber-900/30 shadow-xl shadow-amber-900/20 flex items-center justify-center text-4xl font-bold text-amber-500/50">
               {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
             </div>
           )}
           <div className="pt-2">
             <h1 className="text-3xl font-bold text-orange-50 tracking-tight">
               Welcome back, <span className="text-amber-500">{user?.name}</span>
             </h1>
             <p className="text-stone-400 mt-2 text-lg">
                <span className="font-semibold text-amber-500/80 mr-2">Resume Insight:</span> 
                {summary || 'Take your first test to generate your performance summary.'}
             </p>
             
             {/* Gamification Badges Row */}
             {dashboardData.badges?.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                   {dashboardData.badges.map((badge, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 border border-amber-700 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                        <Award className="w-3.5 h-3.5" />
                        {badge}
                      </span>
                   ))}
                </div>
             )}
           </div>
        </div>

        {/* Gamification Top Stats */}
        <div className="flex gap-4 md:pt-2">
           <div className="flex flex-col items-center justify-center bg-[#151210] border border-orange-900/30 rounded-3xl p-5 min-w-[110px] shadow-lg">
              <Flame className="w-7 h-7 text-orange-500 mb-2 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
              <span className="text-2xl font-black text-orange-50">{dashboardData.streak}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold mt-1">Day Streak</span>
           </div>
           <div className="flex flex-col items-center justify-center bg-[#151210] border border-yellow-900/30 rounded-3xl p-5 min-w-[110px] shadow-lg">
              <Trophy className="w-7 h-7 text-yellow-400 mb-2 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]" />
              <span className="text-2xl font-black text-orange-50">{dashboardData.points}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold mt-1">Total Points</span>
           </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Attempts */}
        <div className="bg-stone-900/60 border border-amber-900/20 rounded-3xl p-6 flex items-start justify-between hover:border-amber-700/40 transition-colors shadow-lg">
          <div>
            <p className="text-stone-400 text-sm font-medium mb-1">Total Attempts</p>
            <p className="text-3xl font-bold text-orange-50">{dashboardData.totalAttempts}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-900/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        {/* Correct */}
        <div className="bg-stone-900/60 border border-amber-900/20 rounded-3xl p-6 flex items-start justify-between hover:border-amber-700/40 transition-colors shadow-lg">
          <div>
            <p className="text-stone-400 text-sm font-medium mb-1">Correct</p>
            <p className="text-3xl font-bold text-emerald-500">{dashboardData.totalCorrect}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-900/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        {/* Incorrect */}
        <div className="bg-stone-900/60 border border-amber-900/20 rounded-3xl p-6 flex items-start justify-between hover:border-amber-700/40 transition-colors shadow-lg">
          <div>
            <p className="text-stone-400 text-sm font-medium mb-1">Incorrect</p>
            <p className="text-3xl font-bold text-rose-500">{incorrect}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-900/20 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-rose-500" />
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-stone-900/60 border border-amber-900/20 rounded-3xl p-6 flex items-start justify-between hover:border-amber-700/40 transition-colors shadow-lg">
          <div>
            <p className="text-stone-400 text-sm font-medium mb-1">Accuracy</p>
            <p className="text-3xl font-bold text-[#c19a6b]">{dashboardData.overallAccuracy}%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#8b5e3c]/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-[#c19a6b]" />
          </div>
        </div>

      </div>

      {/* Analytics Charts & Weaknesses Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        
        {/* Performance Graph */}
        <div className="lg:col-span-2 bg-stone-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <div className="bg-amber-900/30 p-2 rounded-lg">
                 <BarChart3 className="w-5 h-5 text-amber-500" />
               </div>
               <h2 className="text-xl font-bold text-orange-50 tracking-tight">Performance Trajectory</h2>
             </div>
           </div>
           
           <div className="h-64 w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#8b5e3c" stopOpacity={0.6}/>
                     <stop offset="95%" stopColor="#8b5e3c" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                 <XAxis dataKey="name" stroke="#57534e" tick={{fill: '#a8a29e', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                 <YAxis stroke="#57534e" tick={{fill: '#a8a29e', fontSize: 12}} axisLine={false} tickLine={false} domain={[0, 100]} />
                 <Tooltip 
                   cursor={{ stroke: '#ffffff10', strokeWidth: 2 }}
                   contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #3f3f46', borderRadius: '16px', color: '#fff', padding: '12px' }} 
                   itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }} 
                 />
                 <Area type="monotone" dataKey="score" name="Accuracy Score" stroke="#fbbf24" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Weakness Analyzer Box */}
        <div className="lg:col-span-1 bg-stone-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm flex flex-col items-start shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
           <div className="flex items-center gap-3 mb-6">
             <div className="bg-rose-900/30 p-2 rounded-lg">
               <TrendingDown className="w-5 h-5 text-rose-500" />
             </div>
             <h2 className="text-xl font-bold text-orange-50 tracking-tight">Weak Topics</h2>
           </div>

           <div className="flex-grow w-full space-y-4">
              {!hasData || weakTopics.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-60">
                    <BookOpen className="w-8 h-8 text-stone-500 mb-3" />
                    <p className="text-sm text-stone-400">Complete more tests to generate weakness insights.</p>
                 </div>
              ) : (
                 weakTopics.map((item, i) => (
                    <div key={i} className="flex flex-col gap-1.5 p-3 rounded-xl bg-stone-950/50 border border-rose-900/20">
                      <div className="flex justify-between items-center w-full">
                         <span className="text-orange-50 font-semibold text-sm truncate pr-2">{item.topic}</span>
                         <span className="text-rose-400 font-bold text-sm bg-rose-950/50 px-2 py-0.5 rounded-md">{item.accuracy}%</span>
                      </div>
                      <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                         <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-1.5 rounded-full" style={{ width: `${item.accuracy}%` }}></div>
                      </div>
                    </div>
                 ))
              )}
           </div>
        </div>

        {/* Answer Ratio (Pie Chart) */}
        <div className="lg:col-span-1 bg-stone-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm flex flex-col items-center shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
           <div className="flex items-center gap-3 mb-2 w-full justify-start">
             <div className="bg-amber-900/30 p-2 rounded-lg">
               <PieChartIcon className="w-5 h-5 text-amber-500" />
             </div>
             <h2 className="text-xl font-bold text-orange-50 tracking-tight">Ratio</h2>
           </div>
           
           {!hasData && <p className="text-xs text-stone-500 mt-2 text-center">Solve questions to generate insights.</p>}
           
           <div className="h-56 w-full flex-grow flex items-center justify-center relative mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   cx="50%"
                   cy="50%"
                   innerRadius={65}
                   outerRadius={85}
                   paddingAngle={8}
                   dataKey="value"
                   stroke="none"
                   cornerRadius={6}
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={!hasData && index === 0 ? '#292524' : entry.color} />
                   ))}
                 </Pie>
                 {hasData && (
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #3f3f46', borderRadius: '12px', color: '#fff' }} 
                     formatter={(value, name) => [`${value} Answers`, name]}
                   />
                 )}
               </PieChart>
             </ResponsiveContainer>
             
             {/* Center display text for Pie chart */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-white">{hasData ? dashboardData.totalAttempts : 0}</span>
                <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest mt-1">Total</span>
             </div>
           </div>

           {/* Custom Legend */}
           <div className="flex justify-center gap-4 mt-6 w-full">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-stone-300 font-medium tracking-wide">Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <span className="text-xs text-stone-300 font-medium tracking-wide">Incorrect</span>
              </div>
           </div>
        </div>

      </div>

      {/* Start Full Test Banner */}
      <div className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900/30 via-[#2a1b12] to-stone-900 border border-amber-900/40 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-amber-950/50 border border-amber-900 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            A.I. Recommendation Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-50 mb-3 tracking-tight">Challenge Your Weaknesses</h2>
          <p className="text-stone-400 max-w-xl text-lg">Our system has evaluated your history. Start a targeted test tailored to force improvement precisely where you need it most.</p>
        </div>
        <Link href="/exam/start" className="relative z-10 shrink-0 bg-gradient-to-br from-[#8b5e3c] to-[#6a462c] hover:from-[#7a5234] hover:to-[#5a361c] text-orange-50 px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 group shadow-[0_0_30px_rgba(139,94,60,0.4)] transform hover:-translate-y-1">
          <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          Targeted Practice
        </Link>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-orange-50 mb-2 tracking-tight">Practice by Subject</h2>
        <p className="text-stone-400 mb-8 text-lg">Focus your preparation on specific technologies directly.</p>
        <CategoryGrid categories={categories} />
      </div>

    </div>
  );
}

export default withAuth(Dashboard);