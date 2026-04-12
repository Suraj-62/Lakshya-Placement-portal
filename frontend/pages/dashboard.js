import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import CategoryGrid from '../components/CategoryGrid';
import withAuth from '../components/withAuth';
import Link from 'next/link';
import { 
  Target, CheckCircle2, Flame, Trophy, BrainCircuit, 
  Settings, TrendingUp, Code
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell 
} from 'recharts';

function Dashboard() {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    codingSolved: 0,
    totalMcqsInDb: 0,
    totalCodingInDb: 0,
    overallAccuracy: 0,
    accuracyTrend: [],
    skillMastery: [],
    points: 0,
    badges: [],
    streak: 0,
  });
  const [weakTopics, setWeakTopics] = useState([]);
  const [aiReport, setAiReport] = useState({
    strength: "",
    objective: "",
    level: "Beginner"
  });
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
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
        
        if (typeof sumRes.data.summary === 'object') {
           setAiReport(sumRes.data.summary);
        } else {
           setAiReport({ strength: sumRes.data.summary, objective: "Take more tests for specific goals.", level: "Active" });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Dashboard error: ", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const skillData = categories.length > 0
    ? categories.map(cat => {
        const found = dashboardData.skillMastery?.find(s => s.subject === cat.name);
        return { subject: cat.name, value: found ? parseFloat(found.value) : 0 };
      })
    : dashboardData.skillMastery?.length > 0 
      ? dashboardData.skillMastery 
      : [
          { subject: 'Data Structures', value: 0 },
          { subject: 'Algorithms', value: 0 },
          { subject: 'Database', value: 0 },
          { subject: 'Operating System', value: 0 },
        ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-800 border border-stone-700 p-3 rounded-lg shadow-xl">
          <p className="text-orange-50 font-semibold">{`${payload[0].payload.subject}`}</p>
          <p className="text-amber-500 text-sm mt-1">{`Mastery: ${parseFloat(payload[0].value).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200 pb-20 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Segment */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
           <div className="flex items-center gap-5">
             <div className="relative">
                {user?.avatar && !imageError ? (
                  <img 
                      src={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'}${user.avatar}?t=${new Date().getTime()}`} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover border border-stone-700 bg-stone-900" 
                      onError={() => setImageError(true)} 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-2xl font-bold text-amber-500">
                     {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Status dot */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full"></div>
             </div>
             <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">{user?.name}</h1>
                <p className="text-stone-400 text-sm flex items-center gap-2 mt-1">
                   {user?.email}
                </p>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
              <Link href="/profile" className="p-2 bg-[#121212] hover:bg-stone-800 border border-white/5 rounded-xl transition-colors text-stone-400 hover:text-white">
                 <Settings className="w-5 h-5" />
              </Link>
           </div>
        </div>

        {/* 5-Grid Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-[#121212] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
               <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Flame className="w-5 h-5" /></div>
                   <span className="text-sm font-medium text-stone-400">Day Streak</span>
               </div>
               <div className="text-3xl font-bold text-white">{dashboardData.streak}</div>
            </div>
            
            <div className="bg-[#121212] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
               <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Trophy className="w-5 h-5" /></div>
                   <span className="text-sm font-medium text-stone-400">Total Points</span>
               </div>
               <div className="text-3xl font-bold text-white">{dashboardData.points}</div>
            </div>
            
            <div className="bg-[#121212] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
               <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                   <span className="text-sm font-medium text-stone-400">MCQs Solved</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <div className="text-3xl font-bold text-white">{dashboardData.totalCorrect}</div>
                 <span className="text-xs text-stone-500 font-medium tracking-wide">
                    / {dashboardData.totalMcqsInDb}
                 </span>
               </div>
            </div>

            <div className="bg-[#121212] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
               <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg"><Code className="w-5 h-5" /></div>
                   <span className="text-sm font-medium text-stone-400">Coding Solved</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <div className="text-3xl font-bold text-white">{dashboardData.codingSolved}</div>
                 <span className="text-xs text-stone-500 font-medium tracking-wide">
                    / {dashboardData.totalCodingInDb}
                 </span>
               </div>
            </div>
            
            <div className="bg-[#121212] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors col-span-2 md:col-span-1">
               <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Target className="w-5 h-5" /></div>
                   <span className="text-sm font-medium text-stone-400">Avg Accuracy</span>
               </div>
               <div className="text-3xl font-bold text-white">{dashboardData.overallAccuracy}%</div>
            </div>
        </div>

        {/* Middle Section: Bar Chart & AI Report */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Proficiency Bar Chart (Col-span-2) */}
            <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold text-white">Topic Proficiency</h2>
                </div>
                <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillData} layout="horizontal" margin={{ top: 20, right: 10, left: -20, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
                            <XAxis 
                                dataKey="subject" 
                                tick={{ fill: '#a8a29e', fontSize: 11 }} 
                                axisLine={false}
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                            />
                            <YAxis type="number" hide domain={[0, 100]} />
                            <Tooltip cursor={{ fill: '#1a1a1a' }} content={<CustomTooltip />} />
                            <Bar 
                                dataKey="value" 
                                radius={[6, 6, 0, 0]} 
                                barSize={32}
                            >
                              {skillData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f59e0b' : '#d97706'} />
                              ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Insights (Col-span-1) */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 md:p-8 flex-1 flex flex-col">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="p-2bg-transparent">
                          <BrainCircuit className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-white">AI Analysis</h2>
                   </div>
                   
                   <div className="space-y-8 flex-grow">
                      <div>
                         <div className="flex items-center gap-2 mb-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Top Strength</h4>
                         </div>
                         <p className="text-[15px] text-stone-300 leading-relaxed">
                            {aiReport?.strength || "Awaiting sufficient data to establish your technical strengths."}
                         </p>
                      </div>

                      <div>
                         <div className="flex items-center gap-2 mb-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                             <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Focus Area</h4>
                         </div>
                         <p className="text-[15px] text-stone-300 leading-relaxed">
                            {aiReport?.objective || "Complete more practice modules to receive targeted improvement goals."}
                         </p>
                      </div>
                   </div>
                   
                   <Link href="/exam/start" className="mt-8 w-full py-3.5 bg-white text-black hover:bg-stone-200 text-sm font-semibold rounded-xl transition-colors text-center shadow-lg shadow-white/5">
                       Start Practice Session
                   </Link>
                </div>
            </div>
        </div>

        {/* Categories Section */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 md:p-8 mb-8">
            <div className="mb-8">
                 <h2 className="text-xl font-semibold text-white">Practice Categories</h2>
                 <p className="text-stone-400 text-sm mt-1">Select a topic to improve your skills</p>
            </div>
            <CategoryGrid categories={categories} />
        </div>

      </div>
    </div>
  );
}

export default withAuth(Dashboard);