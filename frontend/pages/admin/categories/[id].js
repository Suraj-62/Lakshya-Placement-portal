import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../../components/withAuth';
import Link from 'next/link';
import { ArrowLeft, Save, Layers, AlignLeft, Smile, Trash2 } from 'lucide-react';

function EditCategory() {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const { data } = await api.get('/categories');
        const cat = data.find(c => c._id === id);
        if (cat) {
          setName(cat.name);
          setDescription(cat.description || '');
          setIcon(cat.icon || '');
        }
      } catch (error) {
        toast.error('Failed to load category');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/admin/categories/${id}`, { name, description, icon });
      toast.success('Category updated');
      router.push('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async () => {
    if (!confirm('Are you sure you want to delete this category? Questions will become uncategorized.')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Category removed');
      router.push('/admin');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  if (loading) return <div className="text-stone-400 flex items-center justify-center min-h-[60vh]">Loading Category...</div>;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      
      {/* Navigation */}
      <Link href="/admin" className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-50 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
            <h1 className="text-3xl font-bold text-orange-50 tracking-tight flex items-center gap-3">
              <Layers className="text-amber-500" /> Edit Category
            </h1>
            <p className="text-stone-400 mt-1">Update the name, description, or emoji for this category.</p>
        </div>
        <button 
            type="button"
            onClick={deleteCategory}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-2xl border border-red-900/20 transition-all text-sm font-bold"
        >
            <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-8 backdrop-blur-sm space-y-6">
            
            {/* Name */}
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase flex items-center gap-2 mb-3">
                    <AlignLeft className="w-3.5 h-3.5" /> Category Name
                </label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="e.g. Operating Systems, DBMS"
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl py-4 px-6 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-stone-700" 
                    required 
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase flex items-center gap-2 mb-3">
                    Description
                </label>
                <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Briefly describe what this category covers..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl py-4 px-6 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all min-h-[120px] placeholder:text-stone-700" 
                    rows="4" 
                />
            </div>

            {/* Icon */}
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase flex items-center gap-2 mb-3">
                    <Smile className="w-3.5 h-3.5" /> Icon (Emoji)
                </label>
                <input 
                    type="text" 
                    value={icon} 
                    onChange={e => setIcon(e.target.value)} 
                    placeholder="📚"
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl py-4 px-6 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-stone-700" 
                />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button 
                    disabled={saving}
                    className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-amber-50 font-bold py-4 rounded-2xl shadow-xl shadow-amber-900/30 transition-all flex items-center justify-center gap-2"
                >
                    {saving ? 'Saving...' : (
                        <>
                            <Save className="w-5 h-5" /> Update Category
                        </>
                    )}
                </button>
            </div>
        </div>

      </form>
    </div>
  );
}

export default withAuth(EditCategory, { requireAdmin: true });