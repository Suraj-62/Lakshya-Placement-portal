import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../components/withAuth';
import { AlertCircle, Clock, ChevronRight, CheckCircle2, ChevronLeft, Flag, Bookmark } from 'lucide-react';

function Exam() {
  const router = useRouter();
  const { id } = router.query;

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [answersMap, setAnswersMap] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  const timerRef = useRef(null);

  // LOAD EXAM
  useEffect(() => {
    if (!id) return;

    const fetchExam = async () => {
      try {
        const { data } = await api.get(`/exam/${id}`);
        setExam(data);
        setQuestions(data.questions);

        const map = {};
        data.answers.forEach(a => {
          map[a.question] = a.selectedAnswer;
        });

        setAnswersMap(map);

        if (data.endTime) {
          const end = new Date(data.endTime).getTime();
          const now = new Date().getTime();
          setTimeRemaining(Math.max(0, Math.floor((end - now) / 1000)));
        }
      } catch (error) {
        toast.error('Failed to load exam');
        router.push('/dashboard');
      }
    };

    const fetchBookmarks = async () => {
      try {
        const { data } = await api.get('/bookmarks');
        setBookmarks(data.map(b => b._id || b));
      } catch (e) {
        console.error(e);
      }
    };

    fetchExam();
    fetchBookmarks();
  }, [id, router]);

  // TIMER
  useEffect(() => {
    if (timeRemaining === null) return;
    if (timeRemaining <= 0) {
      handleCompleteExam();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleCompleteExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeRemaining]);

  // ANTI-CHEAT: TAB SWITCH
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error("Tab switch detected! Your exam is being automatically submitted.", {
          duration: 5000,
          position: 'top-center'
        });
        handleCompleteExam();
      }
    };

    const disableContextMenu = (e) => {
      e.preventDefault();
      toast.error("Right-click is restricted during the test.", { position: 'bottom-center' });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", disableContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  // CHANGE QUESTION → restore selected
  useEffect(() => {
    if (questions[currentIndex]) {
      const qid = questions[currentIndex]._id;
      setSelected(answersMap[qid] || '');
    }
  }, [currentIndex, questions, answersMap]);

  // SUBMIT ANSWER
  const handleSubmitAnswer = async () => {
    if (!selected) {
       toast.error("Please select an answer before proceeding.");
       return;
    }

    const currentQ = questions[currentIndex];
    const toastId = toast.loading('Saving answer...');

    try {
      await api.post(`/exam/${id}/answer`, {
        questionId: currentQ._id,
        selectedAnswer: selected,
      });

      setAnswersMap(prev => ({
        ...prev,
        [currentQ._id]: selected
      }));

      toast.success('Saved', { id: toastId });

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch {
      toast.error('Failed to submit answer', { id: toastId });
    }
  };

  const handleCompleteExam = async () => {
    try {
      await api.post(`/exam/${id}/complete`);
      router.push(`/exam/${id}/result`);
    } catch {
      toast.error('Failed to complete exam');
    }
  };

  const toggleBookmark = async () => {
    try {
      const currentQId = questions[currentIndex]._id;
      const { data } = await api.post(`/bookmarks/${currentQId}`);
      setBookmarks(data.bookmarks);
      
      if (data.bookmarked) {
         toast.success('Question Bookmarked');
      } else {
         toast.success('Bookmark Removed');
      }
    } catch (e) {
      toast.error('Failed to modify bookmark');
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!exam || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-stone-400">
        <div className="animate-spin w-6 h-6 border-2 border-[#8b5e3c] border-t-transparent rounded-full"></div>
        <span className="ml-3">Loading exam environment...</span>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-300 font-sans selection:bg-amber-700/30">
      <div className="animate-in fade-in duration-500 w-full max-w-[1800px] mx-auto pt-8 px-4 sm:px-8 pb-12 relative min-h-screen">
        
        {/* Abstract Background Effects */}
        <div className="fixed top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-amber-900/10 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>
        <div className="fixed bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-[#8b5e3c]/10 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-stone-900/40 p-4 sm:px-8 sm:py-5 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-2xl gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b5e3c] to-[#6a462c] text-orange-50 flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-900/20">
              {exam.user?.name?.charAt(0).toUpperCase() || 'E'}
            </div>
            <div>
              <p className="text-stone-400 text-xs font-medium tracking-wide uppercase">Candidate</p>
              <p className="font-bold text-orange-50 text-lg tracking-tight">{exam.user?.name || 'Examinee'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-stone-950/80 border border-white/5 px-5 py-3 rounded-2xl flex items-center gap-3 text-amber-500 font-bold font-mono text-xl shadow-inner">
              <Clock className="w-6 h-6 text-amber-600 animate-pulse" />
              {formatTime(timeRemaining)}
            </div>
            <button
              onClick={handleCompleteExam}
              className="group bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
            >
              <Flag className="w-4 h-4 group-hover:animate-bounce" /> End Exam
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* LEFT - QUESTION */}
          <div className="w-full lg:w-[70%] space-y-6">
            
            <div className="bg-stone-900/40 p-8 sm:p-10 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              
              {/* Subtle Gradient overlay inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-900/5 blur-[80px] rounded-full pointer-events-none"></div>

              <div className="flex justify-between items-center mb-8 relative z-10 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-gradient-to-r from-[#8b5e3c] to-[#7a5234] text-orange-50 px-4 py-1.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-900/20 tracking-wide">
                      Question {currentIndex + 1}
                    </span>
                    <span className="text-stone-500 text-sm font-semibold tracking-wide">
                      / {questions.length}
                    </span>
                  </div>
                  {currentQ.category && (
                    <div className="flex items-center gap-2 text-stone-500 bg-stone-950/50 px-3 py-1.5 rounded-xl border border-white/5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600/70" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{currentQ.category.name}</span>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={toggleBookmark}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                    bookmarks.includes(currentQ._id) 
                      ? 'bg-amber-900/30 border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-amber-400 hover:border-amber-700/50 hover:bg-stone-800'
                  }`}
                >
                   <Bookmark className={`w-4 h-4 ${bookmarks.includes(currentQ._id) ? 'fill-current text-amber-500' : ''}`} />
                   <span className="text-sm font-bold hidden sm:block">{bookmarks.includes(currentQ._id) ? 'Saved' : 'Bookmark'}</span>
                </button>
              </div>

              <div className="text-base sm:text-lg text-stone-200 mb-8 leading-relaxed font-mono relative z-10 whitespace-pre-wrap bg-black/40 p-6 rounded-2xl border border-white/5 shadow-inner">
                {currentQ.questionText}
              </div>

              <div className="space-y-4 relative z-10">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selected === opt;
                  return (
                    <label
                      key={i}
                      className={`group flex items-start gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5
                        ${isSelected 
                          ? 'bg-gradient-to-br from-amber-900/30 to-[#8b5e3c]/10 border-[#8b5e3c] shadow-xl shadow-amber-900/10' 
                          : 'bg-stone-950/40 border-white/5 hover:border-amber-900/30 hover:bg-stone-900/80'}
                      `}
                    >
                      <div className="mt-1 relative flex items-center justify-center shrink-0">
                        <input
                          type="radio"
                          name="answer"
                          value={opt}
                          checked={isSelected}
                          onChange={(e) => setSelected(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                          ${isSelected ? 'border-amber-500 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]' : 'border-stone-600 bg-stone-900/50 group-hover:border-amber-700/50'}
                        `}>
                          <div className={`w-2 h-2 bg-stone-950 rounded-full transition-transform duration-300 ${isSelected ? 'scale-100' : 'scale-0'}`} />
                        </div>
                      </div>
                      <span className={`text-lg leading-relaxed transition-colors duration-300 whitespace-pre-wrap font-mono ${isSelected ? 'text-orange-50 font-medium' : 'text-stone-300 group-hover:text-stone-200'}`}>
                        {opt}
                      </span>
                    </label>
                  )
                })}
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <button 
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-stone-400 hover:text-orange-50 hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-300"
                 >
                   <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                  <button 
                    onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                    disabled={currentIndex === questions.length - 1}
                    className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-stone-400 hover:text-orange-50 hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-300"
                  >
                    Skip <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    className="w-full sm:w-auto group flex justify-center items-center gap-3 bg-gradient-to-r from-[#8b5e3c] to-[#7a5234] hover:from-[#7a5234] hover:to-[#6a462c] text-orange-50 px-8 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-amber-900/20 hover:shadow-amber-900/40 transform hover:-translate-y-0.5"
                  >
                    Save & Next <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT - NAVIGATOR */}
          <div className="w-full lg:w-[30%]">
            <div className="bg-stone-900/40 p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl sticky top-8">
              
              <h3 className="text-xl text-orange-50 font-bold mb-6 flex items-center gap-2">
                 Question Navigator
              </h3>

              <div className="grid grid-cols-5 gap-3">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = !!answersMap[q._id];
                  
                  return (
                    <button
                      key={q._id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative aspect-square rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 border-2
                        ${isCurrent ? 'border-amber-500 bg-amber-950/40 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-transparent'}
                        ${isAnswered && !isCurrent ? 'bg-gradient-to-br from-[#8b5e3c] to-[#6a462c] text-orange-50 shadow-lg shadow-amber-900/20' : ''}
                        ${!isAnswered && !isCurrent ? 'bg-stone-950/80 border-white/5 text-stone-400 hover:bg-stone-800 hover:text-stone-200' : ''}
                      `}
                    >
                      {idx + 1}
                      {isAnswered && !isCurrent && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-stone-900 shadow-sm" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="mt-10 space-y-4 pt-8 border-t border-white/5 text-sm font-medium text-stone-400">
                <div className="flex items-center gap-4">
                   <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#8b5e3c] to-[#6a462c] shadow-md relative">
                     <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-stone-900" />
                   </div>
                   <span>Attempted / Saved</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-5 h-5 rounded-lg bg-stone-950/80 border border-white/10"></div>
                   <span>Unattempted</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-5 h-5 rounded-lg border-2 border-amber-500 bg-amber-950/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]"></div>
                   <span>Current Question</span>
                </div>
              </div>

              <div className="mt-8 p-5 rounded-2xl bg-amber-900/10 border border-amber-900/30 text-amber-500/90 text-sm flex gap-3 shadow-inner">
                <AlertCircle className="w-6 h-6 shrink-0 text-amber-500 animate-pulse" />
                <p className="leading-relaxed"><strong>Warning:</strong> Tab switching or leaving the site will automatically submit your exam.</p>
             </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Strip out global layout so exam takes actual full screen width/height without navbar limitations.
Exam.getLayout = (page) => page;
export default Exam;