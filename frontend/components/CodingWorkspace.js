import React from 'react';
import { SplitPane, Pane } from 'react-split-pane';
import { Award, BookOpen, Clock, Tag, Braces } from 'lucide-react';
import CodeEditor from './CodeEditor';

const CodingWorkspace = ({ question }) => {
  if (!question) return null;

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden bg-stone-950">
      <SplitPane 
        split="vertical" 
        className="coding-split-pane"
      >
        {/* Left Pane: Question Details */}
        <Pane minSize={300} initialSize="40%" className="overflow-y-auto custom-scrollbar">
          <div className="p-8 pb-20 h-full">
            <div className="flex items-center gap-2 mb-6 text-amber-500 font-bold text-sm tracking-wider uppercase">
              <Tag className="w-4 h-4" />
              {question.topic}
            </div>
            
            {/* Removes the oversized and redundant title based on user request */}

            <div className="flex items-center gap-4 mb-8">
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  question.difficulty === 'easy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                  question.difficulty === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                  'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {question.difficulty.toUpperCase()}
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
                  <Award className="w-4 h-4 text-amber-600" />
                  10 Points
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="text-stone-300 leading-relaxed space-y-4 whitespace-pre-wrap">
                {question.questionText}
              </div>

              {/* Example Section */}
              <div className="space-y-10 mt-10">
                {question.testCases?.filter(tc => !tc.isHidden).map((tc, idx) => (
                  <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                    <h4 className="text-orange-50 font-bold mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-center justify-center text-[10px] text-amber-500">
                        {idx + 1}
                      </span>
                      Example {idx + 1}:
                    </h4>
                    
                    <div className="bg-stone-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                      {tc.imageUrl && (
                        <div className="w-full bg-stone-950/50 p-4 border-b border-white/5">
                          <img 
                            src={tc.imageUrl} 
                            alt={`Example ${idx + 1} visual`} 
                            className="max-w-full h-auto rounded-lg mx-auto shadow-lg border border-white/5" 
                            onError={(e) => e.target.parentElement.style.display = 'none'}
                          />
                        </div>
                      )}
                      
                      <div className="p-5 font-mono text-xs space-y-3">
                        <div className="flex gap-4">
                          <span className="text-stone-500 w-16 shrink-0">Input:</span> 
                          <span className="text-orange-50 font-bold break-all">{tc.input}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-stone-500 w-16 shrink-0">Output:</span> 
                          <span className="text-emerald-500 font-bold break-all">{tc.output}</span>
                        </div>
                        
                        {tc.explanation && (
                          <div className="pt-4 mt-4 border-t border-white/5 font-sans italic text-stone-400 leading-relaxed">
                            <span className="text-stone-500 font-bold not-italic mr-2 block mb-1 uppercase text-[10px] tracking-widest">Explanation:</span>
                            {tc.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              {question.constraints && (
                <div className="mt-12 pt-10 border-t border-white/5">
                    <h4 className="text-orange-50 font-bold mb-5 flex items-center gap-2">
                      <Braces className="w-4 h-4 text-stone-500" />
                      Constraints:
                    </h4>
                    <div className="bg-stone-950/50 border border-white/5 rounded-2xl p-6">
                      <div className="text-stone-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {question.constraints}
                      </div>
                    </div>
                </div>
              )}
            </div>
          </div>
        </Pane>

        {/* Right Pane: Code Editor */}
        <Pane className="bg-stone-900 overflow-hidden flex flex-col">
          <CodeEditor 
            questionId={question._id} 
            initialCode={question.starterCode} 
            language={question.savedLanguage || "javascript"}
          />
        </Pane>
      </SplitPane>

      <style jsx global>{`
        .coding-split-pane .Resizer {
          background: rgba(255, 255, 255, 0.05);
          width: 4px;
          cursor: col-resize;
          transition: background 0.2s;
        }
        .coding-split-pane .Resizer:hover {
          background: #fb923c;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CodingWorkspace;
