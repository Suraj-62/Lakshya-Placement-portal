import { useRouter } from 'next/router';
import { useState } from 'react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/auth/reset/${token}`, { password });

      toast.success("Password reset successful ✅");

      router.push('/auth/login');

    } catch (err) {
      toast.error("Invalid or expired token ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-xl">

        <h2 className="text-2xl mb-4 text-yellow-400">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-3 mb-4 rounded bg-white/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-yellow-500 p-3 rounded">
          Reset Password
        </button>

      </form>

    </div>
  );
}