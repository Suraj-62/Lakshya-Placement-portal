import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../components/withAuth';
import { Play, Clock, Hash, BookOpen, AlertCircle, CheckCircle2, Sparkles, Wand2 } from 'lucide-react';

function StartExam() {
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [count] = useState(7);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [isAI, setIsAI] = useState(false);
  const [generating, setGenerating] = useState(false);

  // CATEGORY / MIXED LOGIC
  useEffect(() => {
    if (!router.isReady) return;

    const catId = router.query.category;

    if (catId) {
      setCategory(catId);
      const fetchCategory = async () => {
        try {
          const { data } = await api.get('/categories');
          const cat = data.find(c => c._id === catId);
          if (cat) {
            setCategoryName(cat.name);
          } else {
            setCategoryName("Unknown Category");
          }
          setLoading(false);
        } catch (err) {
          console.log(err);
          toast.error("Failed to load category");
        }
      };
      fetchCategory();
    } else {
      setCategory('');
      setCategoryName('Mixed (All Subjects)');
      setLoading(false);
    }
  }, [router.isReady, router.query.category]);

  // START EXAM
  const handleStart = async (e) => {
    e.preventDefault();
    try {
      const payload = { count, duration };
      if (category) payload.category = category;

      let responseData;
      if (isAI) {
        setGenerating(true);
        toast.loading("A.I. is crafting your custom company-level test...", { id: 'ai-load' });
        const { data } = await api.post('/exam/start-ai', payload);
        responseData = data;
        toast.success("Ready! Best of luck.", { id: 'ai-load' });
      } else {
        const { data } = await api.post('/exam/start', payload);
        responseData = data;
      }

      sessionStorage.setItem(
        `exam_${responseData.examId}`,
        JSON.stringify(responseData.questions)
      );

      router.push(`/exam/${responseData.examId}`);
    } catch (error) {
      if (isAI) toast.dismiss('ai-load');
      setGenerating(false);
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to start exam');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-stone-400">
        <div className="animate-spin w-6 h-6 border-2 border-[#8b5e3c] border-t-transparent rounded-full"></div>
        <span className="ml-3">Loading test configuration...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Instructions Panel */}
        <div className="bg-stone-900/80 border border-amber-900/20 p-8 rounded-3xl shadow-2xl backdrop-blur-xl self-start">
           <h2 className="text-2xl font-bold text-orange-50 mb-6 flex items-center gap-3 border-b border-amber-900/20 pb-4">
             <AlertCircle className="text-amber-500 w-6 h-6" />
             Test Instructions
           </h2>
           <div className="space-y-5 text-stone-300">
             <div className="flex gap-4">
               <CheckCircle2 className="w-5 h-5 text-[#8b5e3c] shrink-0 mt-0.5" />
               <p className="leading-relaxed"><strong className="text-orange-50 font-medium tracking-wide">Stable Connection: </strong>Ensure you have a reliable internet connection before clicking 'Begin Test'. Avoid refreshing the page once the test starts.</p>
             </div>
             <div className="flex gap-4">
               <CheckCircle2 className="w-5 h-5 text-[#8b5e3c] shrink-0 mt-0.5" />
               <p className="leading-relaxed"><strong className="text-orange-50 font-medium tracking-wide">No Tab Switching: </strong>Navigating away from the test window or switching tabs may be recorded as a violation and could result in automatic submission.</p>
             </div>
             <div className="flex gap-4">
               <CheckCircle2 className="w-5 h-5 text-[#8b5e3c] shrink-0 mt-0.5" />
               <p className="leading-relaxed"><strong className="text-orange-50 font-medium tracking-wide">Time Management: </strong>A timer will be displayed prominently. The test will be automatically submitted when your stipulated duration is fully exhausted.</p>
             </div>
             <div className="flex gap-4">
               <CheckCircle2 className="w-5 h-5 text-[#8b5e3c] shrink-0 mt-0.5" />
               <p className="leading-relaxed"><strong className="text-orange-50 font-medium tracking-wide">Final Submission: </strong>Once submitted, answers cannot be altered. We strongly suggest utilizing any spare time to review your attempted questions thoroughly.</p>
             </div>
           </div>
        </div>

        {/* Configuration Panel */}
        <div className="w-full bg-stone-900/80 border border-amber-900/20 p-8 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col justify-center">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-900/20 flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-amber-500 ml-1" />
            </div>
            <h1 className="text-2xl font-bold text-orange-50 tracking-tight">
              Start Assessment
            </h1>
            <p className="text-stone-400 text-sm mt-2">Check details and configure duration</p>
          </div>

          <form onSubmit={handleStart} className="space-y-6">

            {/* CATEGORY */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Category
              </label>
              <div className="w-full bg-stone-950 border border-amber-900/20 rounded-xl p-3 text-stone-300 font-medium">
                {categoryName}
              </div>
            </div>

            {/* QUESTIONS */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-400 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Questions
              </label>
              <div className="w-full bg-stone-950 border border-amber-900/20 rounded-xl p-3 text-stone-300 font-medium">
                {count} Questions
              </div>
            </div>

            {/* TIMER */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="e.g. 30"
                className="w-full bg-stone-950 border border-amber-900/20 rounded-xl p-3 text-orange-50 focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/50 transition-all placeholder:text-stone-600"
              />
            </div>

            {/* AI TOGGLE */}
            <div className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${isAI ? 'bg-amber-900/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-stone-950 border-white/5 hover:border-amber-900/30'}`} onClick={() => setIsAI(!isAI)}>
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isAI ? 'bg-amber-500/20 text-amber-500' : 'bg-stone-900 text-stone-500'}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isAI ? 'text-amber-500' : 'text-stone-300'}`}>A.I. Custom Generation</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Generate fresh company-level questions for this test</p>
                  </div>
               </div>
               <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${isAI ? 'bg-amber-500' : 'bg-stone-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${isAI ? 'translate-x-6' : 'translate-x-0'}`} />
               </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={generating}
              className="w-full mt-8 bg-gradient-to-r from-[#8b5e3c] to-[#6a462c] text-orange-50 py-3.5 rounded-xl hover:from-[#7a5234] hover:to-[#5a361c] transition font-bold flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(139,94,60,0.3)] group disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {generating ? (
                 <>
                   <Wand2 className="w-5 h-5 animate-pulse text-amber-400" /> Generating AI Test...
                 </>
               ) : (
                 <>
                   Begin {isAI ? 'A.I ' : ''}Test <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                 </>
               )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(StartExam);