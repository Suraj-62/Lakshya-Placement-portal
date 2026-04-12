import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import withAuth from '../../components/withAuth';
import api from '../../lib/api';
import Link from 'next/link';
import { BookOpen, ChevronRight, Award, Zap, Search, Filter, Code, Brain, CheckCircle } from 'lucide-react';

const PracticeDashboard = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'solved'

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { data } = await api.get('/questions/coding');
                setQuestions(data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const solvedCount = questions.filter(q => q.isSolved).length;

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             q.topic?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
        const matchesTab = activeTab === 'all' || (activeTab === 'solved' && q.isSolved);
        return matchesSearch && matchesDifficulty && matchesTab;
    });

    return (
        <Layout title="Practice | Lakshya" fullWidth={true}>
            <div className="w-full px-4 sm:px-8 lg:px-12 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm tracking-widest uppercase mb-3">
                            <Brain className="w-4 h-4" />
                            Skill Up
                        </div>
                        <h1 className="text-5xl font-black text-orange-50 tracking-tight leading-none drop-shadow-md">
                            Practice <span className="text-amber-500">Workspace</span>
                        </h1>
                        <p className="mt-4 text-stone-500 text-lg max-w-2xl font-medium">
                            Master your coding skills with curated industrial-level challenges. Hand-picked questions to get you placed in top tech companies.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-stone-900/50 p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
                        <div className="px-6 py-3 border-r border-white/5">
                            <p className="text-[10px] uppercase font-black text-stone-600 tracking-wider mb-1">Solved</p>
                            <p className="text-2xl font-black text-orange-50">{solvedCount} <span className="text-stone-700">/ {questions.length}</span></p>
                        </div>
                        <div className="px-6 py-3">
                            <p className="text-[10px] uppercase font-black text-stone-600 tracking-wider mb-1">Success Rate</p>
                            <p className="text-2xl font-black text-amber-500">{questions.length > 0 ? Math.round((solvedCount / questions.length) * 100) : 0}%</p>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-grow relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                        <input 
                            type="text" 
                            placeholder="Search by topic or question..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-stone-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-orange-50 focus:outline-none focus:border-amber-600/50 transition-all placeholder:text-stone-600 font-medium"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 bg-stone-900 border border-white/5 rounded-2xl p-1">
                        {['all', 'easy', 'medium', 'hard'].map((d) => (
                            <button
                                key={d}
                                onClick={() => setFilterDifficulty(d)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                    filterDifficulty === d 
                                    ? 'bg-amber-600 text-white' 
                                    : 'text-stone-500 hover:text-stone-300'
                                }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-8 mb-8 border-b border-white/5 px-2">
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                            activeTab === 'all' ? 'text-orange-50' : 'text-stone-600 hover:text-stone-400'
                        }`}
                    >
                        All Challenges
                        {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('solved')}
                        className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${
                            activeTab === 'solved' ? 'text-orange-50' : 'text-stone-600 hover:text-stone-400'
                        }`}
                    >
                        Solved Challenges
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'solved' ? 'bg-amber-500 text-black' : 'bg-stone-800 text-stone-500'}`}>
                            {solvedCount}
                        </span>
                        {activeTab === 'solved' && <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full"></div>}
                    </button>
                </div>

                {/* Question Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
                        <p className="text-stone-500 font-bold animate-pulse">Loading challenges...</p>
                    </div>
                ) : filteredQuestions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredQuestions.map((q) => (
                            <Link key={q._id} href={`/practice/coding/${q._id}`}>
                                <div className={`group bg-stone-900/30 border border-white/5 rounded-3xl p-6 hover:bg-stone-900/60 hover:border-amber-600/20 transition-all flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-amber-950/20 cursor-pointer ${q.isSolved && activeTab === 'all' ? 'opacity-80' : ''}`}>
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                            q.isSolved ? 'bg-emerald-500/20 text-emerald-500' :
                                            q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-500' :
                                            q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                            'bg-red-500/10 text-red-500'
                                        }`}>
                                            {q.isSolved ? <CheckCircle className="w-6 h-6" /> : <Code className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className={`text-xl font-black text-orange-50 group-hover:text-amber-500 transition-colors`}>
                                                    {q.questionText.length > 60 ? q.questionText.substring(0, 60) + '...' : q.questionText}
                                                </h3>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 px-2 py-1 bg-stone-950 rounded-lg">{q.topic}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm font-medium text-stone-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Award className="w-4 h-4 text-amber-600/50" />
                                                    {q.difficulty === 'easy' ? '10' : q.difficulty === 'medium' ? '20' : '30'} Points
                                                </div>
                                                <div className="flex items-center gap-1.5 text-stone-600">
                                                    <BookOpen className="w-4 h-4" />
                                                    {q.category?.name || 'DSA'}
                                                </div>
                                                {q.isSolved && (
                                                    <div className="flex items-center gap-1.5 text-emerald-500">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Completed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`hidden md:block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                                            q.isSolved ? 'border-emerald-500/20 text-emerald-500' :
                                            q.difficulty === 'easy' ? 'border-emerald-500/20 text-emerald-500' :
                                            q.difficulty === 'medium' ? 'border-amber-500/20 text-amber-500' :
                                            'border-red-500/20 text-red-500'
                                        }`}>
                                            {q.isSolved ? 'Solved' : q.difficulty}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-stone-900/20 border border-white/5 rounded-3xl border-dashed">
                        <Zap className="w-12 h-12 text-stone-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-orange-50 mb-2">No Challenges Found</h3>
                        <p className="text-stone-500">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default withAuth(PracticeDashboard);
