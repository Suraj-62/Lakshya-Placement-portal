import Link from 'next/link';

export default function CategoryGrid({ categories }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {categories.map(cat => (
        <Link
          key={cat._id}
          href={`/exam/start?category=${cat._id}`}
          className="block p-6 rounded-2xl bg-gradient-to-r from-[#8b5e3c] to-[#c19a6b] text-white shadow-lg hover:scale-105 transition"
        >
          <div className="text-3xl mb-2">{cat.icon || '📚'}</div>

          <h3 className="text-xl font-bold">{cat.name}</h3>

          <p className="mt-2 text-sm text-gray-200">
            Practice {cat.name} questions
          </p>
        </Link>
      ))}

    </div>
  );
}