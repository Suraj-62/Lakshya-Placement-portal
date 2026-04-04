import { useState } from 'react';

export default function QuestionCard({ question, onSubmit }) {
  const [selected, setSelected] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return alert('Please select an answer');
    onSubmit(selected);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-lg font-medium mb-4">{question.questionText}</p>
      <form onSubmit={handleSubmit}>
        {question.options.map((opt, idx) => (
          <div key={idx} className="mb-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="answer"
                value={opt}
                checked={selected === opt}
                onChange={(e) => setSelected(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          </div>
        ))}
        <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Submit
        </button>
      </form>
    </div>
  );
}