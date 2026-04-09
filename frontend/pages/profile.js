import { useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Camera, User, Mail, Save } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    user?.avatar
      ? `http://localhost:5000${user.avatar}`
      : ''
  );

  // image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
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

      setUser(res.data);
      toast.success('Profile updated successfully');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto mt-8">
      
      <div className="bg-stone-900/60 border border-amber-900/20 p-8 rounded-3xl shadow-xl backdrop-blur-xl">
        
        <div className="mb-8 border-b border-amber-900/20 pb-6">
          <h1 className="text-2xl font-bold text-orange-50 tracking-tight">Edit Profile</h1>
          <p className="text-stone-400 text-sm mt-1">Manage your personal information and preferences.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* AVATAR UPLOAD */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-amber-900/20">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-amber-900/50 bg-stone-900 flex items-center justify-center shadow-xl shadow-amber-900/20">
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar"
                    className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-amber-500/50 group-hover:opacity-50 transition-opacity">
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <label className="cursor-pointer absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                  <Camera className="w-5 h-5 text-orange-50" />
                </div>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-orange-50 font-medium mb-1">Profile Photo</h3>
              <p className="text-stone-400 text-xs mb-3">Recommended: Square image, at least 400x400px.</p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-amber-900/20 text-stone-300 text-sm rounded-lg transition-colors">
                <Camera className="w-4 h-4" /> Change Photo
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
          </div>

          {/* NAME */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-400 flex items-center gap-2">
               <User className="w-4 h-4" /> Full Name
            </label>
            <input
              type="text"
              className="w-full bg-stone-950 border border-amber-900/20 rounded-xl p-3 text-orange-50 focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/50 transition-all placeholder:text-stone-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-400 flex items-center gap-2">
               <Mail className="w-4 h-4" /> Email Address
            </label>
            <input
              type="email"
              className="w-full bg-stone-950 border border-amber-900/20 rounded-xl p-3 text-orange-50 focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/50 transition-all placeholder:text-stone-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
            />
          </div>

          {/* ACTIONS */}
          <div className="pt-6 flex items-center justify-end border-t border-amber-900/20">
             <button type="submit" className="bg-[#8b5e3c] hover:bg-[#7a5234] text-orange-50 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(139,94,60,0.2)]">
                <Save className="w-4 h-4" /> Save Changes
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}