import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../components/withAuth';

function Exam() {
  const router = useRouter();
  const { id } = router.query;

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [answersMap, setAnswersMap] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);

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

    fetchExam();
  }, [id]);

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

  // CHANGE QUESTION → restore selected
  useEffect(() => {
    if (questions[currentIndex]) {
      const qid = questions[currentIndex]._id;
      setSelected(answersMap[qid] || '');
    }
  }, [currentIndex, questions]);

  // SUBMIT ANSWER
  const handleSubmitAnswer = async () => {
    if (!selected) return toast.error("Select an answer");

    const currentQ = questions[currentIndex];

    try {
      await api.post(`/exam/${id}/answer`, {
        questionId: currentQ._id,
        selectedAnswer: selected,
      });

      setAnswersMap(prev => ({
        ...prev,
        [currentQ._id]: selected
      }));

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleCompleteExam();
      }

    } catch {
      toast.error('Failed to submit answer');
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

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!exam || questions.length === 0) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-white/10 p-4 rounded-xl">
        <div>
          👤 {exam.user?.name}
        </div>
        <div>
          ⏱ {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="flex gap-6">

        {/* LEFT */}
        <div className="w-2/3 bg-white/10 p-6 rounded-xl">

          <h2 className="mb-3 font-semibold">
            Question {currentIndex + 1} / {questions.length}
          </h2>

          <p className="text-lg mb-6">{currentQ.questionText}</p>

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition
                  ${selected === opt ? 'bg-green-500/20 border-green-500' : 'bg-white/5'}
                `}
              >
                <input
                  type="radio"
                  name="answer"
                  value={opt}
                  checked={selected === opt}
                  onChange={(e) => setSelected(e.target.value)}
                  className="mr-3"
                />
                {opt}
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmitAnswer}
            className="mt-6 bg-green-500 px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Save & Next →
          </button>

        </div>

        {/* RIGHT */}
        <div className="w-1/3 bg-white/10 p-4 rounded-xl">

          <h3 className="mb-3 font-semibold">Questions</h3>

          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, idx) => (
              <button
                key={q._id}
                onClick={() => setCurrentIndex(idx)}
                className={`p-2 rounded
                  ${idx === currentIndex ? 'bg-indigo-600' : 'bg-white/10'}
                  ${answersMap[q._id] ? 'border border-green-400' : ''}
                `}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleCompleteExam}
            className="mt-6 w-full bg-red-500 py-2 rounded-lg hover:bg-red-600"
          >
            End Exam
          </button>

        </div>

      </div>
    </div>
  );
}

export default withAuth(Exam);