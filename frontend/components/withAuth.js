import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAuth(Component, options = { requireAdmin: false }) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/auth/login');
        } else if (options.requireAdmin && user.role !== 'admin') {
          router.push('/dashboard');
        }
      }
    }, [user, loading]);

    if (loading || !user) {
      return <div className="text-center mt-20">Loading...</div>;
    }

    return <Component {...props} />;
  };
}