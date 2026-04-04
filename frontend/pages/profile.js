import { useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
  user?.avatar
    ? `http://localhost:5000${user.avatar}`
    : '/default-avatar.png'
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

    if (image) {
      formData.append('avatar', image);
    }

    const res = await api.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("RESPONSE:", res.data); //  debug

    //  IMPORTANT FIX
    setUser(res.data);
    

    toast.success('Profile updated successfully ✅');

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || 'Update failed ❌');
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">

      <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* IMAGE */}
        <div className="flex flex-col items-center">
          <img
            src={preview || '/default-avatar.png'}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover mb-3 border"
          />

          <input type="file" onChange={handleImageChange} />
        </div>

        {/* NAME */}
        <input
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        {/* EMAIL */}
        <input
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
          Save Changes
        </button>

      </form>
    </div>
  );
}