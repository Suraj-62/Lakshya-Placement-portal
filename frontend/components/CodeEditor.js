import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { SplitPane, Pane } from 'react-split-pane';
import { Play, Send, ChevronDown, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const CodeEditor = ({ questionId, initialCode, language: initialLanguage }) => {
    const [language, setLanguage] = useState(initialLanguage || 'javascript');
    const [code, setCode] = useState('');
    const [results, setResults] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialCode && typeof initialCode === 'object') {
            setCode(initialCode[language] || '');
        } else if (typeof initialCode === 'string') {
            setCode(initialCode);
        }
    }, [initialCode, language]);

    const languages = [
        { id: 'javascript', name: 'JavaScript' },
        { id: 'python', name: 'Python 3' },
        { id: 'cpp', name: 'C++' },
        { id: 'java', name: 'Java' },
    ];

    const handleRunCode = async () => {
        setIsRunning(true);
        setResults(null);
        try {
            const { data } = await api.post('/execution/run', {
                questionId,
                code,
                language
            });
            console.log('Execution Result:', data);
            setResults(data.results);
            if (data.allPassed) {
                toast.success('All public test cases passed!');
            } else {
                toast.error('Some test cases failed.');
            }
        } catch (error) {
            toast.error('Execution failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmitCode = async () => {
        setIsSubmitting(true);
        setResults(null);
        try {
            const { data } = await api.post('/execution/submit', {
                questionId,
                code,
                language
            });
            setResults(data.results);
            if (data.allPassed) {
                toast.success(`Accepted! You earned ${data.pointsEarned} points. Passed ${data.passedCount}/${data.totalCount} test cases.`);
            } else {
                toast.error(`Passed ${data.passedCount}/${data.totalCount} test cases.`);
            }
        } catch (error) {
            toast.error('Submission failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const [outputHeight, setOutputHeight] = useState(350);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const newHeight = window.innerHeight - e.clientY - 40; // Approx offset
            setOutputHeight(Math.max(100, Math.min(newHeight, window.innerHeight * 0.8)));
        };
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="flex flex-col h-full bg-stone-950 rounded-none overflow-hidden border-l border-white/5 relative">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-stone-900 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="appearance-none bg-stone-800 text-orange-50 px-4 py-2 pr-10 rounded-xl text-xs font-bold border border-white/10 focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                        >
                            {languages.map(lang => (
                                <option key={lang.id} value={lang.id}>{lang.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none group-hover:text-amber-500" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleRunCode}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-bold text-xs hover:bg-stone-700 hover:text-orange-50 transition-all disabled:opacity-50"
                    >
                        {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 text-emerald-500" />}
                        Run
                    </button>
                    <button 
                        onClick={handleSubmitCode}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-amber-600 text-stone-900 font-bold text-xs hover:bg-amber-500 transition-all disabled:opacity-50 shadow-lg shadow-amber-900/20"
                    >
                        {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        Submit
                    </button>
                </div>
            </div>

            {/* Main content with resizable output */}
            <div className="flex flex-col flex-grow relative min-h-0">
                {/* Editor */}
                <div className="w-full flex-grow relative min-h-0">
                    <Editor
                        height="100%"
                        language={language === 'cpp' ? 'cpp' : language}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                            padding: { top: 16 },
                            smoothScrolling: true,
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: 'on',
                            automaticLayout: true,
                            scrollBeyondLastLine: false,
                            lineNumbers: 'on',
                            renderLineHighlight: 'all',
                            overviewRulerBorder: false,
                            hideCursorInOverviewRuler: true,
                        }}
                    />
                </div>

                {/* Results Panel */}
                {results && (
                    <div 
                        style={{ height: `${outputHeight}px` }}
                        className="flex flex-col shrink-0 bg-stone-900 border-t border-white/10 relative"
                    >
                        {/* Resizer Handle */}
                        <div 
                            className="absolute top-0 left-0 right-0 h-1.5 -mt-[3px] cursor-row-resize z-50 hover:bg-amber-500 transition-colors"
                            onMouseDown={() => setIsDragging(true)}
                        />
                        
                        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-orange-50 font-bold text-sm tracking-tight flex items-center gap-2">
                                    Output
                                </h4>
                                <button onClick={() => setResults(null)} className="text-stone-500 hover:text-orange-50 text-xs font-bold">Clear</button>
                            </div>
                            <div className="space-y-3">
                                {results.map((res, i) => (
                                    <div key={i} className={`p-3 rounded-lg border ${res.passed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Test Case {i + 1}</span>
                                            {res.passed ? (
                                                <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                                                    <CheckCircle className="w-3 h-3" /> Accepted
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs">
                                                    <XCircle className="w-3 h-3" /> Failed
                                                </div>
                                            )}
                                        </div>
                                        
                                        {res.status === 'error' ? (
                                            <pre className="bg-stone-950 p-3 rounded text-[11px] font-mono text-red-400 overflow-x-auto whitespace-pre-wrap">
                                                {res.actualOutput || res.error}
                                            </pre>
                                        ) : (
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-[9px] uppercase font-bold text-stone-600 mb-1">Input</p>
                                                    <pre className="bg-stone-950 p-2 rounded text-[11px] font-mono text-stone-400 overflow-x-auto">{res.input || 'None'}</pre>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <p className="text-[9px] uppercase font-bold text-stone-600 mb-1">Expected</p>
                                                        <pre className="bg-stone-950 p-2 rounded text-[11px] font-mono text-stone-500 overflow-x-auto">{res.expectedOutput}</pre>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] uppercase font-bold text-stone-600 mb-1">Actual</p>
                                                        <pre className={`bg-stone-950 p-2 rounded text-[11px] font-mono overflow-x-auto ${res.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                                            {res.actualOutput || 'No output'}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeEditor;
