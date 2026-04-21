import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Camera, User, Mail, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import withAuth from '../components/withAuth';

function Profile() {
  const { user, updateAuthUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [image, setImage] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5000';
  const [preview, setPreview] = useState(
    user?.avatar
      ? (user.avatar.startsWith('http') ? user.avatar : `${BACKEND_URL}${user.avatar}?t=${new Date().getTime()}`)
      : ''
  );

  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Auto-hide status message after 4 seconds
  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (image) formData.append('avatar', image);

      // axios automatically sets 'Content-Type': 'multipart/form-data' with boundary
      const res = await api.put('/users/profile', formData);

      updateAuthUser(res.data);
      setStatus({ type: 'success', message: 'Profile updated successfully!' });

    } catch (error) {
      console.error('Update Error Full Object:', error);
      console.dir(error);
      
      let errorMsg = 'Update failed. Please try again.';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = `Server Error: ${error.response.data.error}`;
      } else if (error.message === 'Network Error') {
        errorMsg = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMsg = `Error: ${error.message}`;
      }

      // If we have details (stack trace) and we're debugging
      if (error.response?.data?.details) {
        console.error('Server Stack Trace:', error.response.data.details);
      }

      setStatus({ 
        type: 'error', 
        message: errorMsg 
      });
    } finally {
      setLoading(false);
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
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
               <div className="flex-1">
                 {status.message && (
                   <div className={`flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-left-4 duration-300 ${status.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                     {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                     {status.message}
                   </div>
                 )}
               </div>
               
               <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 active:scale-95 min-w-[160px]"
               >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
               </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Profile);