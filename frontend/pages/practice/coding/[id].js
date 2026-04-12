import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import withAuth from '../../../components/withAuth';
import CodingWorkspace from '../../../components/CodingWorkspace';
import api from '../../../lib/api';
import { ChevronLeft, Loader2, Home } from 'lucide-react';
import Link from 'next/link';

const CodingQuestionPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchQuestion = async () => {
            try {
                const { data } = await api.get(`/questions/${id}`);
                setQuestion(data);
            } catch (error) {
                console.error("Error fetching question:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    if (loading) {
        return (
            <Layout title="Loading... | Lakshya">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
                    <p className="text-stone-500 font-bold tracking-widest uppercase text-xs">Loading Workspace</p>
                </div>
            </Layout>
        );
    }

    if (!question) {
        return (
            <Layout title="Not Found | Lakshya">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                    <h2 className="text-2xl font-black text-orange-50">Challenge Not Found</h2>
                    <Link href="/practice">
                        <button className="flex items-center gap-2 px-6 py-3 bg-stone-900 border border-white/5 rounded-2xl text-stone-300 font-bold hover:text-orange-50 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Workspace
                        </button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={`${question.type === 'code' ? 'Code' : 'Solve'} | Lakshya`} navHidden={true}>
            {/* Minimal Header for Coding Workspace */}
            <div className="h-20 bg-stone-950 border-b border-white/5 flex items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    <Link href="/practice">
                        <button className="p-2 hover:bg-stone-900 rounded-xl transition-all group">
                            <ChevronLeft className="w-6 h-6 text-stone-400 group-hover:text-amber-500" />
                        </button>
                    </Link>
                    <div className="h-6 w-[1px] bg-white/5"></div>
                    <div>
                        <h2 className="text-orange-50 font-black text-lg leading-tight tracking-tight">
                            {question.topic} Challenge
                        </h2>
                        <p className="text-[10px] uppercase font-black text-stone-600 tracking-widest mt-0.5">
                            Lakshya Placement Portal • <span className="text-amber-600/80">Workspace</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-6 mr-6 hidden md:flex">
                        <div className="text-right">
                            <p className="text-[9px] uppercase font-black text-stone-600 tracking-wider">Difficulty</p>
                            <p className={`text-xs font-black uppercase ${
                                question.difficulty === 'easy' ? 'text-emerald-500' :
                                question.difficulty === 'medium' ? 'text-amber-500' : 'text-red-500'
                            }`}>{question.difficulty}</p>
                        </div>
                        <div className="h-8 w-[1px] bg-white/5"></div>
                        <div className="text-right">
                            <p className="text-[9px] uppercase font-black text-stone-600 tracking-wider">Estimated Time</p>
                            <p className="text-xs font-black text-orange-50">25 Mins</p>
                        </div>
                    </div>
                    <Link href="/dashboard">
                        <button className="p-2.5 bg-stone-900 hover:bg-stone-800 border border-white/5 rounded-2xl transition-all shadow-xl shadow-black/50">
                            <Home className="w-5 h-5 text-stone-400" />
                        </button>
                    </Link>
                </div>
            </div>

            <CodingWorkspace question={question} />
        </Layout>
    );
};

export default withAuth(CodingQuestionPage);
