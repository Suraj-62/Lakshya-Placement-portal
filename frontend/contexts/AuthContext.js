import { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LOAD USER (refresh pe)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');

        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));

      } catch (error) {
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));

      toast.success('Logged in successfully ✅');

      return {
        success: true,
        user: data, // 🔥 VERY IMPORTANT (admin redirect ke liye)
      };

    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed ❌');
      return { success: false };
    }
  };

  // ✅ REGISTER
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));

      toast.success('Registered successfully 🎉');

      window.location.href = '/dashboard';

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed ❌');
    }
  };

  // ✅ LOGOUT (FULL CLEAN)
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {}

    setUser(null);

    localStorage.removeItem('user');
    sessionStorage.clear();

    toast.success('Logged out 👋');

    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);