import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CategoryGrid({ categories }) {
  if (!categories || categories.length === 0) {
    return <p className="text-stone-500">No categories found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {categories.map(cat => (
        <Link
          key={cat._id}
          href={`/exam/start?category=${cat._id}`}
          className="group block p-6 rounded-2xl bg-stone-900/60 border border-amber-900/20 hover:border-amber-700/40 hover:bg-stone-900 transition-all shadow-lg hover:shadow-amber-900/20"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-900/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              {cat.icon || '📚'}
            </div>
            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </div>

          <h3 className="text-xl font-bold text-orange-50 mb-2">{cat.name}</h3>

          <p className="text-sm text-stone-400">
            Practice questions and mock tests for {cat.name}.
          </p>
        </Link>
      ))}

    </div>
  );
}