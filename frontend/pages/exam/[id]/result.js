import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import withAuth from '../../../components/withAuth';
import Link from 'next/link';

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
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  const correctCount = exam.answers.filter(a => a.isCorrect).length;
  const total = exam.questions.length;
  const score = ((correctCount / total) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center mb-6">
        Exam Result 
      </h1>

      {/* SCORE CARD */}
      <div className="bg-white/10 p-6 rounded-xl text-center mb-8">
        <p className="text-2xl">Score: {score}%</p>
        <p className="mt-2">Correct: {correctCount} / {total}</p>
      </div>

      {/* QUESTIONS REVIEW */}
      <div className="space-y-6">

        {exam.questions.map((q, index) => {
          const userAnswer = exam.answers.find(a => a.question === q._id);

          return (
            <div key={q._id} className="bg-white/10 p-5 rounded-xl">

              <h3 className="font-semibold mb-2">
                Q{index + 1}. {q.questionText}
              </h3>

              <p>
                <span className="text-yellow-400">Your Answer:</span>{' '}
                {userAnswer?.selectedAnswer || 'Not Attempted'}
              </p>

              <p>
                <span className="text-green-400">Correct Answer:</span>{' '}
                {q.correctAnswer}
              </p>

              {/* RESULT */}
              <p className={`mt-1 ${userAnswer?.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {userAnswer?.isCorrect ? '✔ Correct' : '✖ Incorrect'}
              </p>

              {/* 🔥 EXPLANATION */}
              <p className="mt-2 text-sm text-gray-300">
                💡 {q.explanation || 'No explanation available'}
              </p>

            </div>
          );
        })}

      </div>

      {/* BACK */}
      <div className="text-center mt-8">
        <Link
          href="/dashboard"
          className="bg-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>

    </div>
  );
}

export default withAuth(ExamResult);