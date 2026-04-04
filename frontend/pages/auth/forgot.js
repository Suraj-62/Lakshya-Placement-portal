import { useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function Forgot() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post('/auth/forgot', { email });
      toast.success(data.message);
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-xl">

        <h2 className="text-2xl mb-4 text-yellow-400">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded bg-white/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full bg-yellow-500 p-3 rounded">
          Send Reset Link
        </button>

      </form>
    </div>
  );
}