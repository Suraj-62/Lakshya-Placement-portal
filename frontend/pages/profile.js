import { useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Camera, User, Mail, Save } from 'lucide-react';
import withAuth from '../components/withAuth';

function Profile() {
  const { user, updateAuthUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [image, setImage] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5000';
  const [preview, setPreview] = useState(
    user?.avatar
      ? `${BACKEND_URL}${user.avatar}?t=${new Date().getTime()}`
      : ''
  );
  const [imageError, setImageError] = useState(false);

  // image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageError(false); // reset error on new selection
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (image) formData.append('avatar', image);

      const res = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      updateAuthUser(res.data);
      toast.success('Profile updated successfully');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200 animate-in fade-in duration-500 py-10">
      <div className="max-w-2xl mx-auto px-4">
        
        <div className="bg-[#121212] border border-white/5 p-8 sm:p-10 rounded-3xl shadow-2xl">
          
          <div className="mb-10 pb-6 border-b border-white/5">
            <h1 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
            <p className="text-stone-400 text-sm mt-2">Manage your personal details and account preferences.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* AVATAR UPLOAD */}
            <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-white/5">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-stone-700 bg-stone-900 flex items-center justify-center relative z-10 hover:border-amber-500 transition-colors">
                  {preview && !imageError ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover group-hover:brightness-50 transition-all duration-300"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-amber-500 group-hover:opacity-50 transition-opacity">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <label className="cursor-pointer absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/60 p-2.5 rounded-full backdrop-blur-sm">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-white font-semibold mb-1 text-lg">Profile Photo</h3>
                <p className="text-stone-500 text-sm mb-4">Recommended: Square image, maximum size 2MB.</p>
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] hover:bg-stone-800 border border-white/10 text-stone-300 text-sm font-medium rounded-xl transition-all">
                  <Camera className="w-4 h-4 text-amber-500" /> Upload New Photo
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
            </div>

            {/* NAME */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-stone-400 flex items-center gap-2">
                 <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-stone-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-stone-400 flex items-center gap-2">
                 <Mail className="w-4 h-4" /> Email Address
              </label>
              <input
                type="email"
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-stone-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
              />
            </div>

            {/* ACTIONS */}
            <div className="pt-8 flex items-center justify-end border-t border-white/5">
               <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-amber-900/20 active:scale-95">
                  <Save className="w-4 h-4" /> Save Changes
               </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Profile);