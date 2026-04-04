import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../components/withAuth';

function StartExam() {
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [count] = useState(7);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);

  //  CATEGORY / MIXED LOGIC
  useEffect(() => {
    if (!router.isReady) return;

    const catId = router.query.category;

    if (catId) {
      //  category selected
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
      //  MIXED TEST
      setCategory('');
      setCategoryName('Mixed (All Subjects)');
      setLoading(false);
    }

  }, [router.isReady]);

  //  START EXAM
  const handleStart = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        count,
        duration,
      };

      // category only if selected
      if (category) {
        payload.category = category;
      }

      const { data } = await api.post('/exam/start', payload);

      sessionStorage.setItem(
        `exam_${data.examId}`,
        JSON.stringify(data.questions)
      );

      router.push(`/exam/${data.examId}`);

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to start exam');
    }
  };

  //  LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]"></div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl font-bold text-center mb-6 text-yellow-400">
          Start Your Test 
        </h1>

        <form onSubmit={handleStart} className="space-y-5">

          {/* CATEGORY */}
          <div>
            <label className="text-sm text-gray-300">Category</label>
            <div className="mt-1 p-3 bg-white/10 rounded-md font-medium text-white">
              {categoryName}
            </div>
          </div>

          {/* QUESTIONS */}
          <div>
            <label className="text-sm text-gray-300">Questions</label>
            <div className="mt-1 p-3 bg-white/10 rounded-md font-medium text-white">
              {count} Questions
            </div>
          </div>

          {/* TIMER */}
          <div>
            <label className="text-sm text-gray-300">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 w-full bg-white/10 border border-white/20 rounded-md p-2 text-white"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
          >
             Start Test
          </button>

        </form>
      </div>

    </div>
  );
}

export default withAuth(StartExam);