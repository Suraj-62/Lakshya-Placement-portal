import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';

function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const isAdmin = router.query.role === "admin";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await login(email, password);

    if (res.success) {
      // 🔥 ROLE BASED REDIRECT
      if (res.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    }
  };

  return (
    <div className="min-h-screen flex">

<div
  className="hidden md:flex w-1/2 items-center justify-center bg-cover bg-center relative"
  style={{ backgroundImage: "url('/lakshya.png')" }}
>
  {/* overlay */}
  <div className="absolute inset-0 bg-black/70"></div>

  <div className="relative z-10 text-center text-white px-10">
    <h1 className="text-5xl font-bold text-yellow-400 mb-4">
      Lakshya
    </h1>
    <p className="text-gray-300">
      Your Gateway to Placement Success 
    </p>
  </div>
</div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-900">

        <div className="w-full max-w-md bg-white/10 p-8 rounded-xl border border-white/20">

          <h2 className={`text-2xl text-center mb-6 font-bold ${
            isAdmin ? "text-red-400" : "text-yellow-400"
          }`}>
            {isAdmin ? "Admin Login " : "User Login"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-white/20 text-white"
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD WITH EYE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 rounded bg-white/20 text-white"
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <Link href="/auth/forgot" className="text-sm text-yellow-400">
                Forgot Password?
              </Link>
            </div>

            <button className={`w-full py-3 rounded font-semibold ${
              isAdmin
                ? "bg-red-500 hover:bg-red-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}>
              {isAdmin ? "Login as Admin" : "Login"}
            </button>

          </form>

          {/* SWITCH */}
          <div className="mt-4 text-center">
            {isAdmin ? (
              <Link href="/auth/login" className="text-yellow-400">
                Login as User
              </Link>
            ) : (
              <Link href="/auth/login?role=admin" className="text-red-400">
                Login as Admin
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

Login.getLayout = (page) => page;
export default Login;