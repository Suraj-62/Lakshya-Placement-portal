import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import withAuth from '../../components/withAuth';

function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data || []);

        const qRes = await api.get('/admin/questions');
        setQuestions(qRes.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load data');
      }
    };

    fetchData();
  }, []);

  // ✅ DELETE QUESTION
  const deleteQuestion = async (id) => {
    if (!confirm('Delete this question?')) return;

    try {
      await api.delete(`/admin/questions/${id}`);
      setQuestions(prev => prev.filter(q => q._id !== id));
      toast.success('Question deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  // ✅ DELETE CATEGORY
  const deleteCategory = async (id) => {
    if (!confirm('Delete category + all questions?')) return;

    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success('Category deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="text-white">

      {/* 🔥 TITLE */}
      <h1 className="text-3xl font-bold mb-8 text-red-400">
        Admin Dashboard 
      </h1>

      {/* ================= CATEGORIES ================= */}
      <div className="mb-12">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Categories</h2>

          <Link
            href="/admin/categories/new"
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            + Add Category
          </Link>
        </div>

        {categories.length === 0 ? (
          <p className="text-gray-400">No categories found</p>
        ) : (
          <div className="space-y-3">
            {categories.map(cat => (
              <div
                key={cat._id}
                className="flex justify-between items-center bg-white/10 p-4 rounded-lg border border-white/10"
              >
                <span className="font-medium">
                  {cat.name} {cat.icon}
                </span>

                <div className="space-x-3">
                  <Link
                    href={`/admin/categories/${cat._id}`}
                    className="text-yellow-400 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= QUESTIONS ================= */}
      <div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Questions</h2>

          <Link
            href="/admin/questions/new"
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            + Add Question
          </Link>
        </div>

        {questions.length === 0 ? (
          <p className="text-gray-400">No questions found</p>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full bg-white/10 rounded-lg overflow-hidden">

              <thead className="bg-white/20">
                <tr>
                  <th className="py-3 px-4 text-left">Question</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Difficulty</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {questions.map(q => (
                  <tr key={q._id} className="border-t border-white/10">

                    <td className="py-3 px-4">
                      {q.questionText?.slice(0, 60) || 'No text'}...
                    </td>

                    <td className="py-3 px-4">
                      {q.category?.name || 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      {q.difficulty || 'N/A'}
                    </td>

                    <td className="py-3 px-4 space-x-3">

                      <Link
                        href={`/admin/questions/${q._id}`}
                        className="text-yellow-400 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteQuestion(q._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default withAuth(AdminDashboard, { requireAdmin: true });