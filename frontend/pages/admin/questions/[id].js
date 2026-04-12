import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../../components/withAuth';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Plus, Trash2, HelpCircle, 
  BookOpen, Layers, BarChart, Code2, Type, Braces
} from 'lucide-react';

function EditQuestion() {
  const router = useRouter();
  const { id } = router.query;

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Coding Specific Fields
  const [functionName, setFunctionName] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', output: '', isHidden: false }]);
  const [starterCode, setStarterCode] = useState({
    cpp: '',
    java: '',
    python: '',
    javascript: ''
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [catRes, qRes] = await Promise.all([
          api.get('/categories'),
          api.get('/admin/questions'),
        ]);

        setCategories(catRes.data);

        const q = qRes.data.find(q => q._id === id);

        if (q) {
          setCategory(q.category?._id || '');
          setTopic(q.topic || '');
          setDifficulty(q.difficulty || 'easy');
          setQuestionText(q.questionText || '');
          setConstraints(q.constraints || '');
          setOptions(q.options?.length ? q.options : ['', '', '', '']);
          setCorrectAnswer(q.correctAnswer || '');
          setExplanation(q.explanation || '');
          setType(q.type || 'mcq');
          
          // Coding fields
          if (q.type === 'code') {
            setFunctionName(q.functionName || '');
            setTestCases(q.testCases?.length ? q.testCases : [{ input: '', output: '', isHidden: false }]);
            setStarterCode(q.starterCode || { cpp: '', java: '', python: '', javascript: '' });
          }
        }
      } catch {
        toast.error('Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const addTestCase = () => setTestCases([...testCases, { input: '', output: '', isHidden: false }]);
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

    setSaving(true);
    try {
      await api.put(`/admin/questions/${id}`, {
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

      toast.success('Question Updated ✅');
      router.push('/admin');

    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async () => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      toast.success('Question removed');
      router.push('/admin');
    } catch {
      toast.error('Failed to delete question');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-amber-600/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-bold animate-pulse text-sm uppercase tracking-widest text-[10px]">Loading Record...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      
      {/* Navigation */}
      <Link href="/admin" className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-50 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
            <h1 className="text-3xl font-bold text-orange-50 tracking-tight">
               Edit {type === 'code' ? 'Coding Challenge' : 'Repository Item'}
            </h1>
            <p className="text-stone-400 mt-1">Update question properties and judge logic.</p>
        </div>
        <button 
            type="button"
            onClick={deleteQuestion}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-900/10 hover:bg-red-900/20 text-red-500 rounded-2xl border border-red-900/10 transition-all text-xs font-black uppercase tracking-widest"
        >
            <Trash2 className="w-4 h-4" /> Delete Question
        </button>
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
                    placeholder="Enter the question text here..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all min-h-[150px] placeholder:text-stone-700 font-medium"
                    required
                />
            </div>

            {/* Constraints Card */}
            {type === 'code' && (
               <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-6 backdrop-blur-sm animate-in fade-in duration-500">
                  <label className="block text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Braces className="w-4 h-4" /> Constraints
                  </label>
                  <textarea
                      value={constraints}
                      onChange={e => setConstraints(e.target.value)}
                      placeholder="e.g. 1 <= n <= 10^5"
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all min-h-[100px] placeholder:text-stone-700 font-medium"
                  />
               </div>
            )}

            {/* Answer & Options Card */}
            <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                    <label className="text-sm font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" /> Validation Rules
                    </label>
                    <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800">
                        {type === 'mcq' && <div className="px-4 py-2 rounded-lg text-xs font-black bg-amber-600 text-amber-50 flex items-center gap-2 uppercase tracking-widest"><Type className="w-3.5 h-3.5" /> MCQ</div>}
                        {type === 'text' && <div className="px-4 py-2 rounded-lg text-xs font-black bg-amber-600 text-amber-50 flex items-center gap-2 uppercase tracking-widest"><AlignLeft className="w-3.5 h-3.5" /> Text</div>}
                        {type === 'code' && <div className="px-4 py-2 rounded-lg text-xs font-black bg-amber-600 text-amber-50 flex items-center gap-2 uppercase tracking-widest"><Code2 className="w-3.5 h-3.5" /> Coding</div>}
                    </div>
                </div>

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
                                    <button 
                                        type="button"
                                        onClick={() => removeOption(i)}
                                        className="p-3 text-stone-600 hover:text-red-400 transition-colors"
                                    >
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

                {type === 'text' && (
                    <div className="space-y-4">
                        <input
                            value={correctAnswer}
                            onChange={e => setCorrectAnswer(e.target.value)}
                            placeholder="Exact correct answer..."
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 px-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-stone-700 font-medium"
                        />
                    </div>
                )}

                {type === 'code' && (
                  <div className="space-y-8">
                    {/* Function Config */}
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-[0.2em]">Target Function Name</label>
                        <input
                            value={functionName}
                            onChange={e => setFunctionName(e.target.value)}
                            placeholder="e.g. solve, findMax"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 px-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-mono"
                        />
                    </div>

                    {/* Test Cases Editor */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-[0.2em] flex items-center justify-between">
                           Test Cases
                           <button onClick={addTestCase} type="button" className="text-amber-500 hover:text-amber-400 flex items-center gap-1 font-black underline underline-offset-4">
                              + Add New Case
                           </button>
                        </label>
                        
                        <div className="space-y-3">
                          {testCases.map((tc, i) => (
                            <div key={i} className="p-4 bg-stone-950 border border-stone-800 rounded-2xl flex flex-col sm:flex-row gap-3 relative group/tc">
                              <div className="flex-grow space-y-2">
                                <input 
                                  value={tc.input} 
                                  onChange={e => updateTestCase(i, 'input', e.target.value)}
                                  placeholder="Input" 
                                  className="w-full bg-transparent border-none text-xs text-stone-400 focus:ring-0 p-0 font-mono"
                                />
                                <div className="h-[1px] bg-stone-800 w-full"></div>
                                <input 
                                  value={tc.output} 
                                  onChange={e => updateTestCase(i, 'output', e.target.value)}
                                  placeholder="Expected Output" 
                                  className="w-full bg-transparent border-none text-xs text-amber-500 focus:ring-0 p-0 font-mono font-bold"
                                />
                              </div>
                              <div className="flex items-center justify-between sm:justify-end sm:flex-col gap-2">
                                <button 
                                  type="button"
                                  onClick={() => updateTestCase(i, 'isHidden', !tc.isHidden)}
                                  className={`text-[8px] font-black px-2 py-0.5 rounded border transition-all uppercase tracking-tighter ${tc.isHidden ? 'bg-amber-900/20 border-amber-900/50 text-amber-500' : 'border-stone-800 text-stone-600'}`}
                                >
                                  {tc.isHidden ? 'Hidden' : 'Visible'}
                                </button>
                                {testCases.length > 1 && (
                                  <button onClick={() => removeTestCase(i)} type="button" className="text-stone-800 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>

                    {/* Starter Code Editor */}
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
                <label className="block text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">Internal Notes</label>
                <textarea
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    placeholder="Provide a detailed explanation for the correct answer..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all min-h-[100px] placeholder:text-stone-700 font-medium"
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
                                <option value="" disabled>Select Category</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[9px] font-black text-stone-700 uppercase tracking-widest mb-2 flex items-center gap-2 opacity-60">
                               Sub-Topic
                            </label>
                            <input
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                placeholder="e.g. Arrays, Sorting"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-4 text-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-stone-800"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            disabled={saving}
                            className="w-full bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-amber-50 font-black uppercase tracking-[0.15em] py-5 rounded-2xl shadow-xl shadow-amber-900/40 transition-all flex items-center justify-center gap-3 text-sm"
                        >
                            {saving ? 'Updating...' : (
                                <>
                                    <Save className="w-5 h-5" /> Update Record
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

export default withAuth(EditQuestion, { requireAdmin: true });