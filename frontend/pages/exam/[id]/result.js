import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import withAuth from '../../../components/withAuth';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowLeft, Trophy, Target, Lightbulb } from 'lucide-react';

function ExamResult() {
  const router = useRouter();
  const { id } = router.query;

  const [exam, setExam] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        const { data } = await api.get(`/exam/${id}`);
        setExam(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResult();
  }, [id]);

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-stone-400">
        <div className="animate-spin w-8 h-8 border-4 border-[#8b5e3c] border-t-transparent rounded-full"></div>
        <span className="ml-4 font-semibold text-lg">Generating performance report...</span>
      </div>
    );
  }

  const correctCount = exam.answers.filter(a => a.isCorrect).length;
  const total = exam.questions.length;
  const attempted = exam.answers.length;
  const unattempted = total - attempted;
  const score = ((correctCount / total) * 100).toFixed(0);

  // Identify status message based on score
  let message = "Keep Practicing!";
  let scoreColor = "text-amber-500";
  if (score >= 80) { message = "Excellent Performance!"; scoreColor = "text-emerald-500"; }
  else if (score >= 50) { message = "Good Effort!"; scoreColor = "text-[#8b5e3c]"; }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto tracking-wide pt-4">
      
      {/* HEADER -> SCORE CARD */}
      <div className="bg-stone-900/40 border border-white/5 p-8 sm:p-12 rounded-3xl shadow-2xl backdrop-blur-xl mb-12 relative overflow-hidden">
        
        {/* Abstract Backdrop */}
        <div className={`absolute top-0 right-0 w-80 h-80 blur-[100px] rounded-full pointer-events-none opacity-20 ${score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
           
           {/* Left side text */}
           <div className="text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/20 border border-amber-900/30 text-amber-500 text-sm font-bold mb-6">
               <Trophy className="w-4 h-4" /> Assessment Complete
             </div>
             <h1 className="text-3xl sm:text-5xl font-bold text-orange-50 mb-4">{message}</h1>
             <p className="text-stone-400 text-lg max-w-xl">You have successfully completed this module. Review your answers below to identify areas for improvement.</p>
           </div>
           
           {/* Right side circle stats */}
           <div className="w-48 h-48 sm:w-56 sm:h-56 shrink-0 rounded-full bg-stone-950/80 border-[10px] border-stone-800/80 flex flex-col items-center justify-center relative shadow-inner">
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-stone-800/20 opacity-0" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" 
                        strokeDasharray="289" strokeDashoffset={289 - (289 * score) / 100} 
                        className={`${score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-1000 ease-out`} />
              </svg>
              <div className="text-center translate-y-1">
                <span className={`text-5xl font-extrabold tracking-tighter ${scoreColor}`}>{score}%</span>
                <p className="text-stone-400 text-xs mt-2 uppercase tracking-widest font-bold flex items-center justify-center gap-1"><Target className="w-3 h-3" /> Score</p>
              </div>
           </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/5 relative z-10">
          <div className="bg-stone-950/60 p-5 rounded-2xl border border-white/5 text-center shadow-inner">
            <p className="text-stone-500 text-[11px] font-bold uppercase tracking-widest mb-1.5">Total Q's</p>
            <p className="text-2xl text-stone-200 font-bold">{total}</p>
          </div>
          <div className="bg-emerald-950/20 p-5 rounded-2xl border border-emerald-900/30 text-center shadow-inner">
            <p className="text-emerald-500/80 text-[11px] font-bold uppercase tracking-widest mb-1.5">Correct</p>
            <p className="text-2xl text-emerald-400 font-bold">{correctCount}</p>
          </div>
          <div className="bg-rose-950/20 p-5 rounded-2xl border border-rose-900/30 text-center shadow-inner">
            <p className="text-rose-500/80 text-[11px] font-bold uppercase tracking-widest mb-1.5">Incorrect</p>
            <p className="text-2xl text-rose-400 font-bold">{attempted - correctCount}</p>
          </div>
          <div className="bg-stone-950/60 p-5 rounded-2xl border border-white/5 text-center shadow-inner">
            <p className="text-stone-500 text-[11px] font-bold uppercase tracking-widest mb-1.5">Skipped</p>
            <p className="text-2xl text-stone-200 font-bold">{unattempted}</p>
          </div>
        </div>
      </div>

      {/* QUESTIONS REVIEW */}
      <h2 className="text-2xl font-bold text-orange-50 mb-6 px-2 flex items-center gap-3">
        Detailed Report
      </h2>

      <div className="space-y-6 lg:space-y-8">
        {exam.questions.map((q, index) => {
          const userAnswer = exam.answers.find(a => a.question === q._id);
          const isAttempted = !!userAnswer;
          const isCorrect = isAttempted && userAnswer.isCorrect;

          return (
            <div key={q._id} className={`bg-stone-900/40 p-6 sm:p-8 rounded-3xl border-2 shadow-xl backdrop-blur-xl transition-all duration-300
              ${isCorrect ? 'border-emerald-900/30' : isAttempted ? 'border-rose-900/30' : 'border-white/5'}
            `}>

              {/* Status Badge */}
              <div className="flex justify-between items-start mb-6">
                <span className="bg-stone-950/80 text-stone-300 px-4 py-1.5 rounded-xl text-sm font-bold border border-white/5 shadow-inner">
                  Q {index + 1}
                </span>
                
                {isAttempted ? (
                  isCorrect ? (
                    <span className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-xl text-sm font-bold border border-emerald-900/50 shadow-inner">
                      <CheckCircle2 className="w-4 h-4" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-rose-400 bg-rose-950/30 px-3 py-1.5 rounded-xl text-sm font-bold border border-rose-900/50 shadow-inner">
                      <XCircle className="w-4 h-4" /> Incorrect
                    </span>
                  )
                ) : (
                  <span className="flex items-center gap-2 text-stone-500 bg-stone-950/50 px-3 py-1.5 rounded-xl text-sm font-bold border border-white/5 shadow-inner">
                    Skipped
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-xl sm:text-2xl text-orange-50 font-medium mb-8 leading-relaxed font-mono whitespace-pre-wrap">
                {q.questionText}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {q.options.map((opt, i) => {
                  const isUserSelection = isAttempted && userAnswer.selectedAnswer === opt;
                  const isActuallyCorrect = q.correctAnswer === opt;
                  
                  let optionClass = "bg-stone-950/40 border-white/5 text-stone-400"; // default
                  
                  if (isActuallyCorrect) {
                     optionClass = "bg-emerald-900/20 border-emerald-500/50 text-emerald-50 font-medium shadow-lg shadow-emerald-500/10";
                  } else if (isUserSelection && !isActuallyCorrect) {
                     optionClass = "bg-rose-900/20 border-rose-500/50 text-rose-50 font-medium shadow-lg shadow-rose-500/10";
                  }

                  return (
                    <div key={i} className={`p-4 sm:p-5 rounded-2xl border-2 flex items-start gap-4 transition-all duration-300 ${optionClass}`}>
                      <div className="mt-0.5 shrink-0">
                         {isActuallyCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                         {!isActuallyCorrect && isUserSelection && <XCircle className="w-6 h-6 text-rose-500" />}
                         {!isActuallyCorrect && !isUserSelection && <div className="w-5 h-5 ml-0.5 rounded-full border-2 border-stone-700" />}
                      </div>
                      <span className="leading-relaxed text-lg font-mono whitespace-pre-wrap">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box */}
              <div className="bg-amber-900/10 border border-amber-900/30 p-5 sm:p-6 rounded-2xl flex items-start gap-4">
                 <div className="bg-amber-900/30 p-2.5 rounded-xl text-amber-500 shrink-0 shadow-inner">
                    <Lightbulb className="w-6 h-6" />
                 </div>
                 <div className="pt-0.5">
                   <p className="text-amber-500 font-bold mb-1">Explanation</p>
                   <p className="text-stone-300 leading-relaxed">
                     {q.explanation || 'No detailed explanation provided for this question.'}
                   </p>
                 </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-center mt-12 pb-12">
        <Link
          href="/dashboard"
          className="group flex items-center gap-3 bg-[#8b5e3c] hover:bg-[#7a5234] text-orange-50 px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-amber-900/20 hover:shadow-amber-900/40 transform hover:-translate-y-1"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Dashboard
        </Link>
      </div>

    </div>
  );
}

export default withAuth(ExamResult);