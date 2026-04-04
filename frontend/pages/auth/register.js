import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

function Register() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password);
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div
        className="hidden md:flex w-1/2 items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/lakshya.png')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 text-center text-white px-10">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">
            Lakshya
          </h1>
          <p className="text-lg text-gray-200">
            Crack Your Dream Job 🚀
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">

        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">

          <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold py-3 rounded-md hover:scale-105 transition"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-300">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-yellow-400 font-medium">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

//  VERY IMPORTANT
Register.getLayout = function (page) {
  return page;
};

export default Register;