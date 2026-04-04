import { useState } from 'react';
import api from '../../../lib/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import withAuth from '../../../components/withAuth';

function NewCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/categories', { name, description, icon });
      toast.success('Category created');
      router.push('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">New Category</h1>
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
          <label className="block text-sm font-medium text-gray-700">Icon (emoji)</label>
          <input type="text" value={icon} onChange={e => setIcon(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="📚" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Create</button>
      </form>
    </div>
  );
}

export default withAuth(NewCategory, { requireAdmin: true });