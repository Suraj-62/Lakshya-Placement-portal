import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import withAuth from '../../components/withAuth';
import { 
  Users, 
  BookOpen, 
  Layers, 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  Code2, 
  BrainCircuit, 
  Network,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  Terminal,
  ChevronRight,
  Award,
  Sparkles,
  Zap
} from 'lucide-react';

function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [seeding, setSeeding] = useState(null); 
  const [displayLimit, setDisplayLimit] = useState(24);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, qRes, statsRes, usersRes] = await Promise.all([
          api.get('/categories'),
          api.get('/admin/questions'),
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        
        setCategories(catRes.data || []);
        setQuestions(qRes.data || []);
        setStats(statsRes.data || null);
        setUsers(usersRes.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteQuestion = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      setQuestions(prev => prev.filter(q => q._id !== id));
      toast.success('Question removed');
    } catch {
      toast.error('Failed to delete question');
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category? This will NOT delete the questions in it, but they will become uncategorized.')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success('Category removed');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const seedCategory = async (id, name) => {
    if (!confirm(`Do you want to use A.I. to generate 10-20 questions for "${name}"? This will populate your bank instantly.`)) return;
    setSeeding(id);
    const toastId = toast.loading(`A.I. is building "${name}" bank...`, { duration: 0 });
    try {
      const { data } = await api.post(`/admin/categories/${id}/seed-ai`);
      toast.success(data.message, { id: toastId });
      // Refresh question list
      const qRes = await api.get('/admin/questions');
      setQuestions(qRes.data || []);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to seed category';
      toast.error(errMsg, { id: toastId });
    } finally {
      setSeeding(null);
    }
  };

  // Split questions into MCQ/Text and Code
  const codingChallenges = questions.filter(q => q.type === 'code');
  const mcqQuestions = questions.filter(q => q.type !== 'code');

  const filteredMCQs = mcqQuestions.filter(q => {
    const matchesSearch = q.questionText?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || q.category?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const recentUsers = users.slice(0, 5);

  if (loading) return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-amber-600/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-bold animate-pulse text-sm uppercase tracking-widest leading-none">Initializing Control Center</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 lg:px-8">
      
      {/* Header & Stats Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-orange-50 tracking-tighter flex items-center gap-4">
              Control <span className="text-amber-500">Center</span>
              <span className="hidden sm:inline-block text-[10px] bg-amber-600/20 text-amber-500 px-3 py-1 rounded-full border border-amber-600/20 font-black uppercase tracking-widest mb-2">v3.0</span>
            </h1>
            <p className="text-stone-400 mt-1 font-medium text-base lg:text-lg">Manage questions, categories, and student growth.</p>
          </div>
          <div className="flex gap-3">
             <Link href="/admin/questions/new?mode=standard" className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-amber-50 rounded-2xl shadow-xl shadow-amber-900/30 transition-all font-bold group text-sm lg:text-base">
                <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Add Question
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard icon={<Users className="text-blue-400" />} label="Students" value={stats?.totalUsers || 0} sub="Registered users" />
          <StatCard icon={<BookOpen className="text-emerald-400" />} label="Subject Bank" value={mcqQuestions.length} sub="MCQ & Text questions" />
          <StatCard icon={<Terminal className="text-purple-400" />} label="Practice Arena" value={codingChallenges.length} sub="Coding challenges" />
          <StatCard icon={<Activity className="text-amber-400" />} label="Total Admins" value={stats?.totalAdmins || 0} sub="System controllers" />
        </div>
      </section>

      {/* PRACTICE ARENA SECTION */}
      <section className="animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl lg:text-3xl font-black text-orange-50 tracking-tighter flex items-center gap-3">
                  <Terminal className="text-amber-500 w-7 h-7 lg:w-8 h-8" /> Practice <span className="text-amber-500">Arena</span> Management
              </h2>
              <Link href="/admin/questions/new?mode=coding" className="text-[11px] lg:text-xs font-bold bg-white/5 border border-white/5 hover:border-amber-500/30 px-4 py-2 rounded-xl text-amber-500 transition-all uppercase tracking-widest font-black">
                  + Create Challenge
              </Link>
          </div>

          <div className="bg-[#0f0d0c] border border-stone-800 rounded-[2rem] p-6 lg:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                  {/* Left: Summary and Shortcuts */}
                  <div className="lg:col-span-4 space-y-6">
                      <div className="grid grid-cols-2 gap-3">
                          <div className="bg-stone-900/50 p-4 rounded-2xl border border-stone-800/50">
                              <p className="text-xl font-black text-orange-50">{codingChallenges.filter(c => c.difficulty === 'easy').length}</p>
                              <p className="text-[9px] uppercase font-black text-emerald-500 mt-1 tracking-widest">Easy</p>
                          </div>
                          <div className="bg-stone-900/50 p-4 rounded-2xl border border-stone-800/50">
                              <p className="text-xl font-black text-orange-50">{codingChallenges.filter(c => c.difficulty === 'medium').length}</p>
                              <p className="text-[9px] uppercase font-black text-amber-500 mt-1 tracking-widest">Medium</p>
                          </div>
                          <div className="bg-stone-900/50 p-4 rounded-2xl border border-stone-800/50">
                              <p className="text-xl font-black text-orange-50">{codingChallenges.filter(c => c.difficulty === 'hard').length}</p>
                              <p className="text-[9px] uppercase font-black text-red-500 mt-1 tracking-widest">Hard</p>
                          </div>
                          <div className="bg-stone-900/50 p-4 rounded-2xl border border-stone-800/50 flex items-center justify-center">
                              <Link href="/practice" className="text-stone-600 hover:text-amber-500 transition-colors">
                                  <ArrowRight className="w-5 h-5" />
                              </Link>
                          </div>
                      </div>

                      <div className="space-y-3">
                          <p className="text-[10px] font-black text-stone-700 uppercase tracking-widest">Core DSA Shortcuts</p>
                          <div className="grid grid-cols-1 gap-2">
                              <QuickActionCard icon={<Code2 />} title="Logic Lab" href="/admin/questions/new?mode=coding" color="blue" />
                              <QuickActionCard icon={<Network />} title="Graph Arena" href="/admin/questions/new?mode=coding" color="purple" />
                          </div>
                      </div>
                  </div>

                  {/* Right: Coding Challenges List */}
                  <div className="lg:col-span-8 space-y-4">
                      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                          {codingChallenges.map(challenge => (
                              <div key={challenge._id} className="bg-stone-950/40 border border-stone-800/40 p-4 rounded-2xl flex items-center justify-between hover:bg-white/[0.02] transition-all group/item px-6">
                                  <div className="flex items-center gap-5">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border ${challenge.difficulty === 'easy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : challenge.difficulty === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-50' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                          {challenge.difficulty.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                          <div className="flex items-center gap-2">
                                              <span className="font-bold text-orange-50 text-sm truncate max-w-[200px] lgs:max-w-md">{challenge.questionText}</span>
                                              <span className="text-[8px] bg-stone-950 px-2 py-0.5 rounded-full text-stone-600 font-black uppercase border border-stone-900">{challenge.category?.name || 'General'}</span>
                                          </div>
                                          <div className="flex items-center gap-3 mt-0.5 transition-all group-hover/item:translate-x-1 duration-300">
                                              <span className="text-[9px] text-stone-600 font-bold flex items-center gap-1"><Layers className="w-3 h-3" /> {challenge.topic || 'Logic'}</span>
                                              <span className="text-[9px] text-stone-600 font-bold flex items-center gap-1"><Activity className="w-3 h-3" /> {challenge.testCases?.length || 0} Test Vectors</span>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                      <Link href={`/admin/questions/${challenge._id}`} className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-500 hover:text-amber-500 hover:border-amber-500/30 transition-all">
                                          <Edit3 className="w-3.5 h-3.5" />
                                      </Link>
                                      <button 
                                          onClick={() => deleteQuestion(challenge._id)}
                                          className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-500 hover:text-red-500 hover:border-red-500/30 transition-all"
                                      >
                                          <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Main Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* User Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-orange-50 tracking-tighter flex items-center gap-3">
                    <Activity className="w-6 h-6 text-emerald-500" /> Recent <span className="text-emerald-500">Activity</span>
                </h2>
                <Link href="/admin/users" className="text-[10px] font-black text-amber-500 hover:text-amber-400 flex items-center gap-2 group uppercase tracking-widest">
                    Full Roster <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="bg-stone-900/40 border border-stone-800 rounded-[2rem] overflow-hidden backdrop-blur-md">
                   <div className="divide-y divide-stone-800/30">
                        {recentUsers.map(user => (
                            <div key={user._id} className="p-5 flex items-center justify-between hover:bg-white/[0.01] transition-colors relative group/user">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center font-black text-amber-500 group-hover/user:scale-110 transition-transform text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-100 text-base leading-tight">{user.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[9px] uppercase font-bold text-stone-600 tracking-wider">Solved {user.stats.mcqTotal + user.stats.codingSolved} units</p>
                                            <span className="w-0.5 h-0.5 bg-stone-800 rounded-full"></span>
                                            <p className="text-[9px] uppercase font-bold text-amber-700 tracking-wider">{user.points} XP</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-stone-500 flex items-center gap-1.5 justify-end">
                                        <Clock className="w-2.5 h-2.5" /> {user.lastActive ? new Date(user.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                    </p>
                                    <p className="text-[8px] font-black text-emerald-500/70 mt-1 tracking-tighter bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 inline-block">Active</p>
                                </div>
                            </div>
                        ))}
                   </div>
              </div>
          </div>

          {/* Site Health & Categories Summary (UPGRADED WITH AI SEED) */}
          <div className="space-y-6">
              <h2 className="text-2xl font-black text-orange-50 tracking-tighter">Topic <span className="text-amber-500">Armor</span></h2>
              <div className="bg-[#0c0a09] border border-stone-800 rounded-[2rem] p-6 lg:p-8 backdrop-blur-md space-y-6 h-fit shrink-0">
                  <div>
                    <div className="flex justify-between items-center mb-5">
                        <p className="text-[9px] font-black text-stone-700 uppercase tracking-widest leading-none">Resource Balance</p>
                        <span className="text-[8px] bg-stone-950 text-amber-600 border border-stone-900 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest">{categories.length} Modules</span>
                    </div>
                    <div className="space-y-4">
                        {stats?.distribution?.map(dist => (
                            <div key={dist.name} className="space-y-2 group/item">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <div className="flex items-center gap-2">
                                        <span className="text-stone-400 font-bold">{dist.name}</span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                                            <button 
                                                onClick={() => seedCategory(dist._id, dist.name)}
                                                disabled={seeding === dist._id}
                                                title="Seed with AI (100 Questions)"
                                                className={`p-1 rounded bg-amber-950 text-amber-500 hover:text-amber-400 transition-colors ${seeding === dist._id ? 'animate-pulse' : ''}`}
                                            >
                                               <Sparkles className="w-3 h-3" />
                                            </button>
                                            <Link href={`/admin/categories/${dist._id}`} className="p-1 rounded hover:text-white transition-colors">
                                                <Edit3 className="w-2.5 h-2.5" />
                                            </Link>
                                        </div>
                                    </div>
                                    <span className="text-stone-700 font-black">{dist.count} Items</span>
                                </div>
                                <div className="h-1.5 w-full bg-stone-950 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-amber-600/60 to-amber-500/20 rounded-full" style={{ width: `${Math.min(100, (dist.count / (mcqQuestions.length || 1)) * 100)}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-stone-900">
                       <Link href="/admin/categories/new" className="w-full py-3 bg-stone-950 hover:bg-stone-900 border border-stone-800 rounded-xl text-stone-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                           <Layers className="w-3.5 h-3.5" /> Extend Modules
                       </Link>
                  </div>
              </div>
          </div>
      </div>

      {/* MCQ Repository Section */}
      <section className="pt-10 border-t border-stone-800/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <h3 className="text-2xl font-black text-orange-50 tracking-tighter shrink-0">Asset <span className="text-amber-500">Repository</span></h3>
              
              <div className="flex flex-wrap items-center gap-2 bg-stone-950 p-1.5 rounded-2xl border border-stone-900 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  <CategoryNavItem 
                    label="Total Library" 
                    count={mcqQuestions.length}
                    active={activeCategory === 'All'} 
                    onClick={() => { setActiveCategory('All'); setDisplayLimit(24); }} 
                  />
                  {categories.map(cat => (
                      <CategoryNavItem 
                        key={cat._id} 
                        label={cat.name} 
                        count={mcqQuestions.filter(q => q.category?._id === cat._id).length}
                        active={activeCategory === cat.name} 
                        onClick={() => { setActiveCategory(cat.name); setDisplayLimit(24); }} 
                      />
                  ))}
              </div>
          </div>

        <div className="space-y-6">
            <div className="relative group/search">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-800 group-focus-within/search:text-amber-500/50 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Query the master bank..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0d0b0a] border border-stone-800/80 rounded-[2rem] py-5 pl-16 pr-6 text-orange-50 focus:outline-none focus:ring-2 focus:ring-amber-500/10 transition-all font-medium placeholder:text-stone-800"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMCQs.slice(0, displayLimit).map(q => (
                    <div key={q._id} className="bg-[#12100f] border border-stone-800/50 p-5 rounded-3xl group hover:border-amber-600/30 transition-all flex justify-between items-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-600/0 group-hover:bg-amber-600/20 transition-all"></div>
                        <div className="min-w-0 px-2">
                            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1.5 opacity-60">
                                {q.isAIGenerated ? <Sparkles className="w-2.5 h-2.5 inline mr-1" /> : ''}{q.category?.name || 'Uncategorized'}
                            </p>
                            <p className="text-sm text-stone-300 font-bold truncate pr-4">{q.questionText}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <Link href={`/admin/questions/${q._id}`} className="p-2 text-stone-600 hover:text-amber-500 transition-colors">
                                <Edit3 className="w-4 h-4" />
                            </Link>
                            <button onClick={() => deleteQuestion(q._id)} className="p-2 text-stone-600 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMCQs.length > displayLimit && (
                <div className="flex justify-center pt-8">
                    <button 
                        onClick={() => setDisplayLimit(prev => prev + 24)}
                        className="px-8 py-3 bg-stone-900 border border-stone-800 rounded-2xl text-stone-400 hover:text-amber-500 hover:border-amber-500/30 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
                    >
                        Load More Questions (+{Math.min(24, filteredMCQs.length - displayLimit)})
                    </button>
                </div>
            )}
        </div>
      </section>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-[#0f0d0c] border border-stone-800 p-6 lg:p-7 rounded-[2rem] transition-all hover:border-stone-700/50 group shadow-lg relative overflow-hidden">
      <div className="flex items-center gap-5 relative z-10">
        <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 group-hover:border-amber-500/20 transition-all duration-500 shadow-inner group-hover:scale-105">
          {icon}
        </div>
        <div>
          <p className="text-stone-700 text-[9px] font-black uppercase tracking-widest leading-none mb-1.5">{label}</p>
          <div className="flex items-baseline gap-2">
             <p className="text-3xl font-black text-orange-50 leading-none">{value}</p>
             <p className="text-[9px] text-stone-600 font-bold truncate opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{sub}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, href, color }) {
    const colorClasses = {
        blue: "hover:border-blue-500/40 hover:bg-blue-500/[0.03] text-blue-400",
        purple: "hover:border-purple-500/40 hover:bg-purple-500/[0.03] text-purple-400",
        amber: "hover:border-amber-500/40 hover:bg-amber-500/[0.03] text-amber-400"
    };
    return (
        <Link href={href} className={`p-4 bg-stone-950/80 border border-stone-800/50 rounded-xl transition-all group flex items-center gap-4 ${colorClasses[color] || 'text-stone-400 hover:border-amber-500/30'}`}>
            <div className="p-2 bg-stone-900 border border-stone-800 rounded-lg group-hover:scale-110 transition-transform shadow-inner">
                {icon}
            </div>
            <div className="flex flex-grow items-center justify-between">
                <span className="font-black text-stone-400 text-[10px] uppercase tracking-widest group-hover:text-stone-200 transition-colors">{title}</span>
                <PlusCircle className="w-3.5 h-3.5 text-stone-700 group-hover:text-amber-500 group-hover:rotate-90 transition-all" />
            </div>
        </Link>
    );
}

function CategoryNavItem({ label, active, onClick, count }) {
    return (
        <button 
            type="button"
            onClick={onClick}
            className={`px-5 py-2 rounded-xl cursor-pointer transition-all text-[9.5px] font-black uppercase tracking-widest flex items-center gap-2 ${active ? 'bg-amber-600/20 text-amber-500 border border-amber-600/10 shadow-lg' : 'text-stone-700 hover:text-stone-400 hover:bg-white/[0.02]'}`}
        >
            {label} 
            {count !== undefined && <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${active ? 'bg-amber-500 text-white' : 'bg-stone-900 text-stone-600'}`}>{count}</span>}
        </button>
    );
}

export default withAuth(AdminDashboard, { requireAdmin: true });