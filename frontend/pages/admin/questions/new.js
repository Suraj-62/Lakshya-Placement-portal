import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import withAuth from '../../../components/withAuth';

function NewQuestion() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [type, setType] = useState('mcq');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get('/categories');
      setCategories(data);
      if (data.length) setCategory(data[0]._id);
    };
    fetch();
  }, []);

  const handleOptionChange = (i, value) => {
    const newOptions = [...options];
    newOptions[i] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/admin/questions', {
        category,
        topic,
        difficulty,
        questionText,
        options,
        correctAnswer,
        explanation,
        type,
      });

      toast.success('Created ✅');
      router.push('/admin/dashboard');

    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 text-white">

      <h1 className="text-3xl font-bold mb-6 text-yellow-400">
        Add Question
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full p-3 bg-white text-black rounded"
        >
          {categories.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Topic"
          className="w-full p-3 bg-white text-black rounded"
        />

        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="w-full p-3 bg-white text-black rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <textarea
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          placeholder="Question"
          className="w-full p-3 bg-white text-black rounded"
        />

        {options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            onChange={e => handleOptionChange(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            className="w-full p-3 bg-white text-black rounded"
          />
        ))}

        <input
          value={correctAnswer}
          onChange={e => setCorrectAnswer(e.target.value)}
          placeholder="Correct Answer"
          className="w-full p-3 bg-white text-black rounded"
        />

        <textarea
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          placeholder="Explanation"
          className="w-full p-3 bg-white text-black rounded"
        />

        <button className="w-full bg-green-500 py-3 rounded">
          Create Question
        </button>

      </form>
    </div>
  );
}

export default withAuth(NewQuestion, { requireAdmin: true });