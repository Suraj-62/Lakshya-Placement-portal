import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../components/withAuth';
import { Play, Clock, BookOpen, AlertCircle, CheckCircle2, ArrowRight, Info, ShieldCheck } from 'lucide-react';

function StartExam() {
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [count] = useState(10);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

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
    setInitializing(true);
    const toastId = toast.loading("Configuring assessment...", { duration: 0 });
    
    try {
      const payload = { count, duration };
      if (category) payload.category = category;

      const { data } = await api.post('/exam/start', payload);

      sessionStorage.setItem(
        `exam_${data.examId}`,
        JSON.stringify(data.questions)
      );

      toast.success("Ready to begin.", { id: toastId });
      router.push(`/exam/${data.examId}`);
    } catch (error) {
      setInitializing(false);
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to initialize session', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-400 gap-4">
        <div className="animate-spin w-6 h-6 border-2 border-stone-500 border-t-transparent rounded-full"></div>
        <span className="text-sm font-medium">Loading parameters...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200 animate-in fade-in duration-500 py-12">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        
        {/* Guidelines Panel (Left) */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
            <div className="mb-4">
               <h1 className="text-3xl font-bold text-white tracking-tight">Prepare for Assessment</h1>
               <p className="text-stone-400 mt-2">Please read the guidelines carefully before entering the examination environment.</p>
            </div>
            
            <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 flex-1 shadow-2xl">
               <h2 className="text-lg font-semibold text-white mb-8 flex items-center gap-3">
                 <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                 </div>
                 Assessment Guidelines
               </h2>
               <div className="space-y-6">
                 <InstructionItem 
                    title="Stable Connection" 
                    text="Ensure your internet connection is stable. Refreshing the browser may interrupt your session." 
                 />
                 <InstructionItem 
                    title="Anti-Cheat Monitoring" 
                    text="Tab switching and window focus are monitored. Avoid leaving the assessment window." 
                 />
                 <InstructionItem 
                    title="Time Management" 
                    text="The session automatically submits when the timer expires. Unsubmitted progress at expiry is ignored." 
                 />
                 <InstructionItem 
                    title="Final Submission" 
                    text="Once the assessment is submitted, answers cannot be modified. Review carefully before submitting." 
                 />
               </div>
            </div>
        </div>

        {/* Configuration Panel (Right) */}
        <div className="w-full md:w-1/2 flex flex-col">
            <div className="mt-auto mb-auto bg-[#121212] border border-white/5 p-8 rounded-3xl shadow-2xl">
              
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                <div className="p-3 bg-[#0a0a0a] rounded-xl border border-white/5">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Session Setup</h2>
                  <p className="text-sm text-stone-400">Configure your practice parameters</p>
                </div>
              </div>

              <form onSubmit={handleStart} className="space-y-6">

                {/* Config Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl">
                      <p className="text-xs font-semibold text-stone-500 mb-1">Module Format</p>
                      <p className="text-stone-200 font-medium text-sm truncate">{categoryName}</p>
                   </div>
                   <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl">
                      <p className="text-xs font-semibold text-stone-500 mb-1">Question Pool</p>
                      <p className="text-stone-200 font-medium text-sm">{count} Questions</p>
                   </div>
                </div>

                {/* TIMER CONFIG */}
                <div className="space-y-3 pt-2">
                  <label className="text-sm font-semibold text-stone-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Allocated Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3.5 px-4 text-white text-lg font-medium focus:outline-none focus:border-stone-500 transition-all text-center"
                    min="1"
                    max="180"
                  />
                </div>

                <div className="pt-6 mt-6 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={initializing}
                      className="w-full bg-white text-black hover:bg-stone-200 py-4 rounded-xl transition-all font-semibold flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-lg shadow-white/5"
                    >
                       {initializing ? 'Connecting...' : (
                         <>
                           Start Assessment <ArrowRight className="w-5 h-5" />
                         </>
                       )}
                    </button>
                </div>

              </form>
            </div>
        </div>
      </div>
    </div>
  );
}

function InstructionItem({ title, text }) {
    return (
        <div className="flex gap-4 group">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-600 shrink-0 group-hover:bg-indigo-400 transition-colors"></div>
            <div>
                <p className="text-stone-200 font-semibold text-sm mb-1">{title}</p>
                <p className="text-sm text-stone-500 leading-relaxed">{text}</p>
            </div>
        </div>
    );
}

export default withAuth(StartExam);