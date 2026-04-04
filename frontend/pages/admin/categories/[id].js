import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../../components/withAuth';

function EditCategory() {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');

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
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/categories/${id}`, { name, description, icon });
      toast.success('Category updated');
      router.push('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows="3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Icon</label>
          <input type="text" value={icon} onChange={e => setIcon(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Update</button>
      </form>
    </div>
  );
}

export default withAuth(EditCategory, { requireAdmin: true });