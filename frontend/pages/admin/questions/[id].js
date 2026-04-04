import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../../components/withAuth';

function EditQuestion() {
  const router = useRouter();
  const { id } = router.query;

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
    if (!id) return;

    const fetchData = async () => {
      try {
        const [catRes, qRes] = await Promise.all([
          api.get('/categories'),
          api.get('/admin/questions'),
        ]);

        setCategories(catRes.data);

        const question = qRes.data.find(q => q._id === id);

        if (question) {
          setCategory(question.category?._id);
          setTopic(question.topic || '');
          setDifficulty(question.difficulty);
          setQuestionText(question.questionText);
          setOptions(question.options || ['', '', '', '']);
          setCorrectAnswer(question.correctAnswer);
          setExplanation(question.explanation || '');
          setType(question.type);
        }
      } catch {
        toast.error('Failed to load question');
      }
    };

    fetchData();
  }, [id]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/admin/questions/${id}`, {
        category,
        topic,
        difficulty,
        questionText,
        options,
        correctAnswer,
        explanation,
        type,
      });

      toast.success('Updated ✅');
      router.push('/admin/dashboard');

    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 text-white">

      <h1 className="text-3xl font-bold mb-6 text-yellow-400">
        Edit Question
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* CATEGORY */}
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

        {/* TOPIC */}
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Topic"
          className="w-full p-3 bg-white text-black rounded"
        />

        {/* DIFFICULTY */}
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="w-full p-3 bg-white text-black rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* QUESTION */}
        <textarea
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          placeholder="Question"
          className="w-full p-3 bg-white text-black rounded"
        />

        {/* OPTIONS */}
        {options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            onChange={e => handleOptionChange(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            className="w-full p-3 bg-white text-black rounded"
          />
        ))}

        {/* CORRECT */}
        <input
          value={correctAnswer}
          onChange={e => setCorrectAnswer(e.target.value)}
          placeholder="Correct Answer"
          className="w-full p-3 bg-white text-black rounded"
        />

        {/* EXPLANATION */}
        <textarea
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          placeholder="Explanation"
          className="w-full p-3 bg-white text-black rounded"
        />

        {/* TYPE */}
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full p-3 bg-white text-black rounded"
        >
          <option value="mcq">MCQ</option>
          <option value="code">Code</option>
          <option value="text">Text</option>
        </select>

        <button className="w-full bg-green-500 py-3 rounded">
          Update Question
        </button>

      </form>
    </div>
  );
}

export default withAuth(EditQuestion, { requireAdmin: true });