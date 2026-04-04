import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import CategoryGrid from '../components/CategoryGrid';
import withAuth from '../components/withAuth';
import Link from 'next/link';

function Dashboard() {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0,
  });

  // 🔥 FETCH CATEGORY
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🔥 FETCH USER STATS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/exam/stats'); // 👈 create this API

        setStats({
          total: data.total || 0,
          correct: data.correct || 0,
          incorrect: data.incorrect || 0,
          accuracy: data.accuracy || 0,
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>

      {/* 🔥 USER NAME */}
      <h1 className="text-3xl font-bold mb-8">
        Welcome, <span className="text-yellow-400">{user?.name}</span>
      </h1>

      {/* 🔥 STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg">Total Attempts</h2>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg">Correct</h2>
          <p className="text-3xl font-bold mt-2">{stats.correct}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg">Incorrect</h2>
          <p className="text-3xl font-bold mt-2">{stats.incorrect}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg">Accuracy</h2>
          <p className="text-3xl font-bold mt-2">{stats.accuracy}%</p>
        </div>

      </div>

      {/* 🔥 CATEGORY */}
      <h2 className="text-2xl font-semibold mb-6">
        Practice by Category
      </h2>

      <CategoryGrid categories={categories} />

      {/* 🔥 START TEST */}
      <div className="mt-12 text-center">
        <Link
          href="/exam/start"
          className="bg-green-500 px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
           Start Test (All Subjects)
        </Link>
      </div>

    </div>
  );
}

export default withAuth(Dashboard);