import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import withAuth from '../../../components/withAuth';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Plus, Trash2, HelpCircle, 
  BookOpen, Layers, BarChart, Code2, Type, Braces,
  Settings
} from 'lucide-react';

function NewQuestion() {
  const router = useRouter();
  const { category: queryCategory, mode } = router.query;

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [questionText, setQuestionText] = useState('');
  const [constraints, setConstraints] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [type, setType] = useState('mcq');
  const [loading, setLoading] = useState(false);

  // Coding Specific Fields
  const [functionName, setFunctionName] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', output: '', explanation: '', imageUrl: '', isHidden: false }]);
  const [starterCode, setStarterCode] = useState({
    cpp: '',
    java: '',
    python: '',
    javascript: ''
  });

  useEffect(() => {
    if (mode === 'coding') {
      setType('code');
    } else {
      setType('mcq');
    }
  }, [mode]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
        
        if (queryCategory) {
            const found = data.find(c => c.name.toLowerCase() === queryCategory.toLowerCase());
            if (found) setCategory(found._id);
            else if (data.length) setCategory(data[0]._id);
        } else if (data.length) {
            setCategory(data[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load categories');
      }
    };
    if (router.isReady) fetch();
  }, [router.isReady, queryCategory]);

  const handleOptionChange = (i, value) => {
    const newOptions = [...options];
    newOptions[i] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const addTestCase = () => setTestCases([...testCases, { input: '', output: '', explanation: '', imageUrl: '', isHidden: false }]);
  const removeTestCase = (i) => setTestCases(testCases.filter((_, idx) => idx !== i));
  const updateTestCase = (i, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[i][field] = value;
    setTestCases(newTestCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return toast.error('Please select a category');
    if (!questionText) return toast.error('Question text is required');
    if (type === 'mcq' && !correctAnswer) return toast.error('Correct answer is required for MCQ');
    if (type === 'code' && !functionName) return toast.error('Function name is required for coding challenges');

    setLoading(true);
    try {
      await api.post('/admin/questions', {
        category,
        topic,
        difficulty,
        questionText,
        constraints,
        options: type === 'mcq' ? options : [],
        correctAnswer: type === 'mcq' || type === 'text' ? correctAnswer : '',
        explanation,
        type,
        testCases: type === 'code' ? testCases : [],
        starterCode: type === 'code' ? starterCode : {},
        functionName: type === 'code' ? functionName : ''
      });

      toast.success('Question Created Successfully');
      router.push('/admin');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      
      {/* Navigation */}
      <Link href="/admin" className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-50 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
            <h1 className="text-3xl font-bold text-orange-50 tracking-tight">
               {mode === 'coding' ? 'Create Coding Challenge' : 'Create Library Question'}
            </h1>
            <p className="text-stone-400 mt-1">
              {mode === 'coding' ? 'Define algorithmic problems and judge test cases.' : 'Add multiple-choice or text questions to subject banks.'}
            </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Question Text Card */}
            <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-6 backdrop-blur-sm">
                <label className="block text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> {type === 'code' ? 'Problem Statement' : 'Question Content'}
                </label>
                <textarea
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    placeholder={type === 'code' ? "Describe the problem statement, input formats, and output expectations..." : "Enter the question or problem statement..."}
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all min-h-[150px] placeholder:text-stone-700 font-medium"
                    required
                />
            </div>

            {/* Constraints Card (NEW) */}
            {type === 'code' && (
               <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-6 backdrop-blur-sm animate-in fade-in duration-500">
                  <label className="block text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Braces className="w-4 h-4" /> Constraints
                  </label>
                  <textarea
                      value={constraints}
                      onChange={e => setConstraints(e.target.value)}
                      placeholder="e.g. 1 <= n <= 10^5, Time Limit: 1s, Memory: 256MB"
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all min-h-[100px] placeholder:text-stone-700 font-medium"
                  />
               </div>
            )}

            {/* Mode Selection & Content */}
            <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                    <label className="text-sm font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" /> Implementation Details
                    </label>
                    <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800">
                        {(mode !== 'coding') && (
                          <>
                            <button 
                                type="button"
                                onClick={() => setType('mcq')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${type === 'mcq' ? 'bg-amber-600 text-amber-50' : 'text-stone-500 hover:text-stone-300'}`}
                            >
                              MCQ
                            </button>
                            <button 
                                type="button"
                                onClick={() => setType('text')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${type === 'text' ? 'bg-amber-600 text-amber-50' : 'text-stone-500 hover:text-stone-300'}`}
                            >
                              Text
                            </button>
                          </>
                        )}
                        {(mode === 'coding') && (
                          <div className="px-4 py-2 rounded-lg text-xs font-black bg-amber-600 text-amber-50 flex items-center gap-2 uppercase tracking-widest">
                            <Code2 className="w-3.5 h-3.5" /> Coding Mode
                          </div>
                        )}
                    </div>
                </div>

                {/* MCQ Mode */}
                {type === 'mcq' && (
                    <div className="space-y-3">
                        {options.map((opt, i) => (
                            <div key={i} className="flex gap-2">
                                <div className="flex-grow relative">
                                    <input
                                        value={opt}
                                        onChange={e => handleOptionChange(i, e.target.value)}
                                        placeholder={`Option ${i + 1}`}
                                        className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 px-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-stone-700 font-medium"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setCorrectAnswer(opt)}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-all ${correctAnswer === opt && opt !== '' ? 'bg-emerald-500 text-emerald-50' : 'text-stone-600 hover:text-stone-400 bg-stone-900'}`}
                                    >
                                        {correctAnswer === opt && opt !== '' ? 'Correct' : 'Mark'}
                                    </button>
                                </div>
                                {options.length > 2 && (
                                    <button onClick={() => removeOption(i)} type="button" className="p-3 text-stone-600 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={addOption}
                            className="w-full py-3 border-2 border-dashed border-stone-800 rounded-xl text-stone-500 hover:text-stone-300 hover:border-stone-700 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" /> Add Option
                        </button>
                    </div>
                )}

                {/* Text Mode */}
                {type === 'text' && (
                    <div className="space-y-4">
                        <input
                            value={correctAnswer}
                            onChange={e => setCorrectAnswer(e.target.value)}
                            placeholder="Exact correct answer for text matching..."
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 px-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-stone-700 font-medium"
                        />
                    </div>
                )}

                {/* Coding Mode */}
                {type === 'code' && (
                  <div className="space-y-8">
                    {/* Function Config */}
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-[0.2em] flex items-center gap-2">
                           Target Function Name
                        </label>
                        <input
                            value={functionName}
                            onChange={e => setFunctionName(e.target.value)}
                            placeholder="e.g. solve, findMax"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 px-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-mono shadow-inner"
                            required
                        />
                    </div>

                    {/* Test Cases Editor */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-[0.2em] flex items-center justify-between">
                           Test Cases (Unit tests)
                           <button onClick={addTestCase} type="button" className="text-amber-500 hover:text-amber-400 flex items-center gap-1 font-black underline underline-offset-4">
                              + Add New Case
                           </button>
                        </label>
                        
                        <div className="space-y-3">
                          {testCases.map((tc, i) => (
                            <div key={i} className="p-6 bg-stone-950 border border-stone-800 rounded-2xl flex flex-col gap-4 relative group/tc">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-grow space-y-3">
                                  <div>
                                    <label className="text-[9px] font-bold text-stone-600 uppercase mb-1 block">Input</label>
                                    <input 
                                      value={tc.input} 
                                      onChange={e => updateTestCase(i, 'input', e.target.value)}
                                      placeholder="e.g. [1, 2, 3]" 
                                      className="w-full bg-stone-900/50 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:ring-1 focus:ring-amber-500/50 font-mono"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-stone-600 uppercase mb-1 block">Expected Output</label>
                                    <input 
                                      value={tc.output} 
                                      onChange={e => updateTestCase(i, 'output', e.target.value)}
                                      placeholder="e.g. 6" 
                                      className="w-full bg-stone-900/50 border border-stone-800 rounded-lg px-3 py-2 text-xs text-amber-500/80 focus:ring-1 focus:ring-amber-500/50 font-mono font-bold"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-start sm:flex-col gap-3 pt-4 sm:pt-0">
                                  <button 
                                    type="button"
                                    onClick={() => updateTestCase(i, 'isHidden', !tc.isHidden)}
                                    className={`text-[9px] font-black px-3 py-1.5 rounded-lg border transition-all uppercase tracking-wider ${tc.isHidden ? 'bg-amber-900/20 border-amber-900/50 text-amber-500' : 'border-stone-800 text-stone-600 hover:border-stone-700'}`}
                                  >
                                    {tc.isHidden ? 'Hidden Case' : 'Example Case'}
                                  </button>
                                  {testCases.length > 1 && (
                                    <button onClick={() => removeTestCase(i)} type="button" className="p-2 text-stone-800 hover:text-red-500 transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Explanation & Image Fields */}
                              {!tc.isHidden && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-900 mt-2 animate-in slide-in-from-top-2 duration-300">
                                  <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                                      <HelpCircle className="w-3 h-3" /> Example Explanation
                                    </label>
                                    <textarea 
                                      value={tc.explanation || ''} 
                                      onChange={e => updateTestCase(i, 'explanation', e.target.value)}
                                      placeholder="Explain the logic for this example..." 
                                      className="w-full bg-stone-900/30 border border-stone-800/50 rounded-xl p-3 text-xs text-stone-400 focus:ring-1 focus:ring-amber-500/30 h-20 resize-none"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                                      <BookOpen className="w-3 h-3" /> Image URL (Optional)
                                    </label>
                                    <input 
                                      value={tc.imageUrl || ''} 
                                      onChange={e => updateTestCase(i, 'imageUrl', e.target.value)}
                                      placeholder="https://example.com/image.png" 
                                      className="w-full bg-stone-900/30 border border-stone-800/50 rounded-xl p-3 text-xs text-stone-400 focus:ring-1 focus:ring-amber-500/30"
                                    />
                                    {tc.imageUrl && (
                                      <div className="mt-2 rounded-lg overflow-hidden border border-stone-800 h-14 w-full bg-stone-900 flex items-center justify-center">
                                        <img src={tc.imageUrl} alt="Preview" className="h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                    </div>

                    {/* Starter Code Simple Tabs (Languages) */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-[0.2em]">Starter Templates</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['javascript', 'python', 'cpp', 'java'].map(lang => (
                             <div key={lang} className="space-y-2">
                                <div className="text-[10px] font-black uppercase text-stone-700 ml-1">{lang}</div>
                                <textarea 
                                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500/30 font-mono h-[100px]"
                                  value={starterCode[lang]}
                                  onChange={e => setStarterCode({...starterCode, [lang]: e.target.value})}
                                  placeholder={`${lang} boiler...`}
                                />
                             </div>
                          ))}
                        </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Explanation Card */}
            <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-6 backdrop-blur-sm">
                <label className="block text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">Internal Notes / Explanation</label>
                <textarea
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    placeholder="Provide details on the correct logic or solution complexity..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all min-h-[100px] placeholder:text-stone-700"
                />
            </div>
        </div>

        {/* Right Column: Simplified Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-[#0f0d0c] border border-stone-800 rounded-[2.5rem] p-8 backdrop-blur-md sticky top-24 shadow-2xl">
                
                <div className="space-y-8">
                    {/* DIFFICULTY: NOW PRIMARY */}
                    <div>
                        <label className="block text-[10px] font-black text-stone-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <BarChart className="w-3 h-3 text-amber-500" /> Challenge Level
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {['easy', 'medium', 'hard'].map(level => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setDifficulty(level)}
                                    className={`py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all flex items-center justify-between px-6 ${
                                        difficulty === level 
                                        ? (level === 'easy' ? 'bg-emerald-600/10 border-emerald-600/30 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : level === 'medium' ? 'bg-amber-600/10 border-amber-600/30 text-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.1)]' : 'bg-red-600/10 border-red-600/30 text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.1)]')
                                        : 'bg-stone-950/50 border-stone-800 text-stone-700 hover:border-stone-700'
                                    }`}
                                >
                                    {level}
                                    <div className={`w-2 h-2 rounded-full ${difficulty === level ? (level === 'easy' ? 'bg-emerald-500' : level === 'medium' ? 'bg-amber-500' : 'bg-red-500' ) : 'bg-stone-800'}`}></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ORGANIZATION: NOW SECONDARY / MINIMIZED */}
                    <div className="pt-8 border-t border-stone-900 space-y-6">
                        <div>
                            <label className="block text-[9px] font-black text-stone-700 uppercase tracking-widest mb-2 flex items-center gap-2 opacity-60">
                               <Layers className="w-3 h-3" /> Category
                            </label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-4 text-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all cursor-pointer"
                                required
                            >
                                <option value="">Select Topic</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[9px] font-black text-stone-700 uppercase tracking-widest mb-2 flex items-center gap-2 opacity-60">
                               Sub-Topic (Optional)
                            </label>
                            <input
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                placeholder="e.g. Arrays, Sorting"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-4 text-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-stone-800"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            disabled={loading}
                            className="w-full bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-amber-50 font-black uppercase tracking-[0.15em] py-5 rounded-2xl shadow-xl shadow-amber-900/40 transition-all flex items-center justify-center gap-3 text-sm"
                        >
                            {loading ? 'Creating...' : (
                                <>
                                    <Save className="w-5 h-5" /> Save Entry
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
}

const AlignLeft = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
);

export default withAuth(NewQuestion, { requireAdmin: true });