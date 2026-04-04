import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export default function StatsWidget({ stats }) {
  const pieData = [
    { name: 'Correct', value: stats.correctAttempts },
    { name: 'Incorrect', value: stats.totalAttempts - stats.correctAttempts },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Overall Accuracy: {stats.accuracy}%</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        {stats.categoryStats?.map(cat => (
          <div key={cat.categoryName} className="flex justify-between mb-2">
            <span>{cat.categoryName}</span>
            <span>{cat.correct}/{cat.total} ({cat.accuracy.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}