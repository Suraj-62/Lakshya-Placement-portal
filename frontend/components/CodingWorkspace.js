import React from 'react';
import { SplitPane, Pane } from 'react-split-pane';
import { Award, BookOpen, Clock, Tag } from 'lucide-react';
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
              {question.testCases?.filter(tc => !tc.isHidden).slice(0, 2).map((tc, idx) => (
                <div key={idx} className="mt-8">
                  <h4 className="text-orange-50 font-bold mb-3">Example {idx + 1}:</h4>
                  <div className="bg-stone-900/50 border border-white/5 rounded-xl p-4 font-mono text-sm">
                    <p className="mb-2"><span className="text-stone-500">Input:</span> <span className="text-orange-50 font-bold">{tc.input}</span></p>
                    <p><span className="text-stone-500">Output:</span> <span className="text-emerald-500 font-bold">{tc.output}</span></p>
                  </div>
                </div>
              ))}

              {/* Constraints */}
              <div className="mt-10 pt-10 border-t border-white/5">
                  <h4 className="text-orange-50 font-bold mb-4">Constraints:</h4>
                  <ul className="list-disc pl-5 text-stone-500 space-y-2 text-sm italic">
                      <li>Optimal time complexity is expected.</li>
                      <li>Space complexity should be minimized.</li>
                      <li>Ensure all edge cases are handled.</li>
                  </ul>
              </div>
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
