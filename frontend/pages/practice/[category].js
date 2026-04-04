import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import QuestionCard from '../../components/QuestionCard';
import withAuth from '../../components/withAuth';

function Practice() {
  const router = useRouter();
  const { category } = router.query;

  const [question, setQuestion] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

const fetchQuestion = async () => {
  if (!category) return;
  try {
    setLoading(true);

    const { data } = await api.get(`/questions/random/${category}`);

    setQuestion(data);
    setSubmitted(false);
    setResult(null);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  // Run when category changes
  useEffect(() => {
    if (category) {
      fetchQuestion();
    }
  }, [category]);

  // Submit Answer
  const handleSubmit = async (selectedAnswer) => {
    try {
      const { data } = await api.post(
        `/questions/${question._id}/attempt`,
        { selectedAnswer }
      );

      setResult(data);
      setSubmitted(true);

    } catch (error) {
      console.error(error);
    }
  };

  //  SAFE LOADING STATES
  if (!category) {
    return <div className="text-center mt-20 text-lg">Loading Category...</div>;
  }

  if (loading || !question) {
    return (
      <div className="text-center mt-20 text-lg animate-pulse">
        Loading Question...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-6">

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700">
            {question?.category?.name
              ? `${question.category.name} Practice`
              : "Practice"}
          </h1>

          <span className="text-sm bg-indigo-100 px-3 py-1 rounded">
            Random Question
          </span>
        </div>

        {/* QUESTION */}
        {!submitted ? (
          <div className="hover:scale-[1.01] transition duration-300">
            <QuestionCard question={question} onSubmit={handleSubmit} />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">

            <p
              className={`text-xl mb-4 font-bold ${
                result?.isCorrect ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {result?.isCorrect ? '✅ Correct Answer!' : '❌ Wrong Answer'}
            </p>

            <p className="mb-2">
              <strong>Correct Answer:</strong> {result?.correctAnswer}
            </p>

            <p className="mb-4 text-gray-600">
              <strong>Explanation:</strong> {result?.explanation}
            </p>

            <button
              onClick={fetchQuestion}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 hover:scale-105 transition"
            >
              Next Question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(Practice);