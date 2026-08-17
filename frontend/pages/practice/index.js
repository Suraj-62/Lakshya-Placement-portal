import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import withAuth from '../../components/withAuth';
import api from '../../lib/api';
import Link from 'next/link';
import { 
    BookOpen, ChevronRight, Award, Zap, Search, Code, 
    Brain, CheckCircle, ChevronDown, Flame, Trophy, 
    Calendar, LayoutTemplate, Database, Bot, Cpu, Sparkles,
    Layers, Network, Code2, CheckCircle2, Star
} from 'lucide-react';

const PracticeDashboard = () => {
    const [questions, setQuestions] = useState([]);
    const [dashboardData, setDashboardData] = useState({ streak: 0, points: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedTopics, setExpandedTopics] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [qRes, dRes] = await Promise.all([
                    api.get('/questions/coding'),
                    api.get('/progress/dashboard').catch(() => ({ data: { streak: 0, points: 0 } }))
                ]);
                setQuestions(qRes.data);
                setDashboardData(dRes.data);
                
                // Expand first topic by default if questions exist
                if (qRes.data.length > 0) {
                    const firstTopic = qRes.data[0].topic || 'Fundamentals';
                    setExpandedTopics({ [firstTopic]: true });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const solvedCount = questions.filter(q => q.isSolved).length;

    const filteredQuestions = questions.filter(q => {
        return q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) || 
               q.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Group questions by topic
    const groupedQuestions = filteredQuestions.reduce((acc, q) => {
        const topic = q.topic || 'Fundamentals';
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(q);
        return acc;
    }, {});

    const toggleTopic = (topic) => {
        setExpandedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
    };

    return (
        <Layout title="Practice | Lakshya" fullWidth={true}>
            <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-4">
                
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr_320px] gap-6 items-start">
                    
                    {/* LEFT SIDEBAR: MENU */}
                    <div className="hidden lg:block sticky top-20 bg-stone-900/40 border border-white/5 rounded-3xl p-4 shadow-sm backdrop-blur-md">
                        <div className="flex items-center justify-between px-2 mb-6">
                            <h3 className="text-sm font-bold text-teal-50 uppercase tracking-widest">Menu</h3>
                            <LayoutTemplate className="w-4 h-4 text-stone-500" />
                        </div>

                        <div className="space-y-1">
                            {/* Coding Interviews (Active) */}
                            <div className="bg-stone-800/50 rounded-2xl overflow-hidden border border-white/5">
                                <div className="px-4 py-3 flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Code className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm font-bold text-teal-50">Coding Interviews</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-stone-400" />
                                </div>
                                <div className="pb-2">
                                    <div className="px-4 py-2 mx-2 bg-stone-700/30 rounded-xl text-sm font-semibold text-emerald-400 cursor-pointer">Problems</div>
                                    <div className="px-4 py-2 mx-2 text-sm font-medium text-stone-400 hover:text-stone-200 cursor-pointer transition-colors">Company Tagged</div>
                                    <div className="px-4 py-2 mx-2 text-sm font-medium text-stone-400 hover:text-stone-200 cursor-pointer transition-colors">Cheatsheets</div>
                                </div>
                            </div>

                            {/* Other Menu Items */}
                            <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-stone-800/30 rounded-xl transition-colors group mt-2">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-stone-500 group-hover:text-stone-300" />
                                    <span className="text-sm font-medium text-stone-400 group-hover:text-stone-200">AI Coding</span>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">Beta</span>
                            </div>
                            
                            <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-stone-800/30 rounded-xl transition-colors group mt-1">
                                <Cpu className="w-4 h-4 text-stone-500 group-hover:text-stone-300" />
                                <span className="text-sm font-medium text-stone-400 group-hover:text-stone-200">System Design</span>
                            </div>

                            <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-stone-800/30 rounded-xl transition-colors group mt-1">
                                <Bot className="w-4 h-4 text-stone-500 group-hover:text-stone-300" />
                                <span className="text-sm font-medium text-stone-400 group-hover:text-stone-200">Machine Learning</span>
                            </div>

                            <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-stone-800/30 rounded-xl transition-colors group mt-1">
                                <Database className="w-4 h-4 text-stone-500 group-hover:text-stone-300" />
                                <span className="text-sm font-medium text-stone-400 group-hover:text-stone-200">Databases</span>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT: ACCORDIONS */}
                    <div className="flex flex-col gap-6 w-full">
                        {/* HERO & TOP CARDS (NEW) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Card 1 */}
                            <div className="bg-stone-900/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/[0.02] cursor-pointer transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                                    <Layers className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="text-sm font-bold text-stone-300 group-hover:text-stone-100 transition-colors leading-tight">DSA for Beginners</span>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-stone-900/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/[0.02] cursor-pointer transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors border border-red-500/20">
                                    <Network className="w-5 h-5 text-red-400" />
                                </div>
                                <span className="text-sm font-bold text-stone-300 group-hover:text-stone-100 transition-colors leading-tight">Advanced Algorithms</span>
                            </div>
                            {/* Card 3 */}
                            <div className="bg-stone-900/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/[0.02] cursor-pointer transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors border border-amber-500/20">
                                    <Code2 className="w-5 h-5 text-amber-400" />
                                </div>
                                <span className="text-sm font-bold text-stone-300 group-hover:text-stone-100 transition-colors leading-tight">Python for Interviews</span>
                            </div>
                        </div>

                        <div className="bg-stone-900/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                            <div className="relative z-10 flex-1">
                                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Lakshya <span className="text-emerald-500">150.</span></h1>
                                <p className="text-stone-400 text-sm leading-relaxed max-w-md">
                                    The ideal curated list of problems to master Data Structures & Algorithms and crack top tech companies.
                                </p>
                            </div>
                            <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
                                <div className="flex-1 md:flex-initial flex items-center gap-3 bg-stone-800/50 rounded-2xl px-5 py-3.5 border border-white/5 shadow-inner">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Solved</p>
                                        <p className="text-lg font-black text-white leading-none mt-1">{solvedCount}<span className="text-stone-500 text-xs font-bold">/{questions.length}</span></p>
                                    </div>
                                </div>
                                <div className="flex-1 md:flex-initial flex items-center gap-3 bg-stone-800/50 rounded-2xl px-5 py-3.5 border border-white/5 shadow-inner">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <Star className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Starred</p>
                                        <p className="text-lg font-black text-white leading-none mt-1">0</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                            <input 
                                type="text" 
                                placeholder="Search problems or topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-stone-900/60 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-teal-50 focus:outline-none focus:border-emerald-600/50 transition-all placeholder:text-stone-600 text-sm font-medium shadow-sm backdrop-blur-md"
                            />
                        </div>

                        {/* Accordion List */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-stone-900/20 border border-white/5 rounded-3xl">
                                <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
                                <p className="text-stone-500 font-bold animate-pulse">Loading roadmap...</p>
                            </div>
                        ) : filteredQuestions.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {Object.entries(groupedQuestions).map(([topic, topicQuestions]) => {
                                    const topicSolved = topicQuestions.filter(q => q.isSolved).length;
                                    const progress = Math.round((topicSolved / topicQuestions.length) * 100) || 0;
                                    const isExpanded = !!expandedTopics[topic];
                                    
                                    return (
                                        <div key={topic} className="bg-stone-900/40 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                                            {/* Accordion Header */}
                                            <div 
                                                onClick={() => toggleTopic(topic)}
                                                className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <ChevronRight className={`w-5 h-5 text-stone-500 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-emerald-500' : ''}`} />
                                                    <h2 className="text-lg font-bold text-teal-50">{topic}</h2>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    {/* Progress Bar (NeetCode Style) */}
                                                    <div className="hidden sm:flex items-center gap-3">
                                                        <span className="text-xs font-bold text-stone-500">{topicSolved} / {topicQuestions.length}</span>
                                                        <div className="w-24 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Accordion Body (Expanded State) */}
                                            {isExpanded && (
                                                <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-black/20">
                                                    {/* Read Concept Link inside Expanded area */}
                                                    <div className="mb-4 mt-2 flex justify-end">
                                                        <a 
                                                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' data structure concept tutorial')}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all text-xs font-bold text-emerald-400 group"
                                                        >
                                                            <BookOpen className="w-3.5 h-3.5" />
                                                            Learn Concept
                                                        </a>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 gap-2.5">
                                                        {topicQuestions.map((q) => (
                                                            <Link key={q._id} href={`/practice/coding/${q._id}`}>
                                                                <div className={`group bg-stone-800/40 hover:bg-stone-700/50 border border-white/5 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${q.isSolved ? 'opacity-60 hover:opacity-100' : ''}`}>
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-6 h-6 flex items-center justify-center">
                                                                            {q.isSolved ? (
                                                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                                            ) : (
                                                                                <div className="w-2 h-2 rounded-full bg-stone-600 group-hover:bg-emerald-500 transition-colors"></div>
                                                                            )}
                                                                        </div>
                                                                        <h3 className={`text-sm font-semibold ${q.isSolved ? 'text-stone-400' : 'text-stone-200 group-hover:text-emerald-400'} transition-colors`}>
                                                                            {q.title || (q.questionText.length > 80 ? q.questionText.substring(0, 80) + '...' : q.questionText)}
                                                                        </h3>
                                                                    </div>
                                                                    
                                                                    {/* Difficulty Badge */}
                                                                    <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                                                                        q.difficulty === 'easy' ? 'text-emerald-400' :
                                                                        q.difficulty === 'medium' ? 'text-amber-400' :
                                                                        'text-red-400'
                                                                    }`}>
                                                                        {q.difficulty}
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-stone-900/20 border border-white/5 rounded-3xl border-dashed">
                                <Zap className="w-12 h-12 text-stone-700 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-teal-50 mb-2">No Challenges Found</h3>
                                <p className="text-stone-500">Try adjusting your search query.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR: STATS & STREAK */}
                    <div className="hidden xl:flex flex-col gap-4 sticky top-20">
                        
                        {/* Current Streak Card */}
                        <div className="bg-stone-900/40 border border-white/5 rounded-3xl p-6 shadow-sm backdrop-blur-md">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">Current Streak</p>
                                    <div className="flex items-center gap-2">
                                        <Flame className="w-6 h-6 text-amber-500" />
                                        <span className="text-3xl font-black text-teal-50">{dashboardData.streak || 0} <span className="text-sm text-stone-500">days</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-stone-800 rounded-full h-1.5 mb-3">
                                <div className="bg-amber-500 h-1.5 rounded-full w-1/3"></div>
                            </div>
                            <p className="text-xs font-medium text-stone-400 text-center">Solve one problem a day to keep your streak</p>
                        </div>

                        {/* Progress Chart (NeetCode Style) */}
                        <div className="bg-stone-900/40 border border-white/5 rounded-3xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-6">
                                <LayoutTemplate className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-bold text-teal-50">Lakshya 150</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-emerald-400 text-xs font-bold w-12">Easy</span>
                                        <span className="text-stone-300 text-xs font-bold">{questions.filter(q => q.isSolved && q.difficulty === 'easy').length}/{questions.filter(q => q.difficulty === 'easy').length}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-amber-400 text-xs font-bold w-12">Medium</span>
                                        <span className="text-stone-300 text-xs font-bold">{questions.filter(q => q.isSolved && q.difficulty === 'medium').length}/{questions.filter(q => q.difficulty === 'medium').length}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-red-400 text-xs font-bold w-12">Hard</span>
                                        <span className="text-stone-300 text-xs font-bold">{questions.filter(q => q.isSolved && q.difficulty === 'hard').length}/{questions.filter(q => q.difficulty === 'hard').length}</span>
                                    </div>
                                </div>
                                
                                {/* CSS Circular Progress Ring */}
                                <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-stone-800">
                                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent border-l-transparent transform rotate-45"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent border-r-transparent transform -rotate-45"></div>
                                    <div className="text-center z-10">
                                        <div className="text-2xl font-black text-white leading-none">{solvedCount}</div>
                                        <div className="text-[10px] text-stone-500 font-bold">/{questions.length} Solved</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mini Calendar Placeholder */}
                        <div className="bg-stone-900/40 border border-white/5 rounded-3xl p-6 shadow-sm backdrop-blur-md">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-teal-50 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-stone-400" /> August 2026
                                </span>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-500 mb-2">
                                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-stone-400">
                                <div className="text-stone-700">26</div><div className="text-stone-700">27</div><div className="text-stone-700">28</div><div className="text-stone-700">29</div><div className="text-stone-700">30</div><div className="text-stone-700">31</div>
                                <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>
                                <div>8</div><div>9</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div>
                                <div>15</div><div>16</div><div className="bg-emerald-500/20 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center mx-auto border border-emerald-500/30">17</div><div className="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center mx-auto">18</div><div>19</div><div>20</div><div>21</div>
                                <div>22</div><div>23</div><div>24</div><div>25</div><div>26</div><div>27</div><div>28</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default withAuth(PracticeDashboard);
