import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

function MyApp({ Component, pageProps }) {

  const getLayout =
    Component.getLayout ||
    ((page) => <Layout>{page}</Layout>);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <AuthProvider>
        {getLayout(<Component {...pageProps} />)}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1c1917', // stone-900
            color: '#fffbeb', // amber-50
            border: '1px solid rgba(139, 94, 60, 0.4)', // amber-900 border
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            fontFamily: 'inherit',
            fontWeight: '500',
            fontSize: '14px',
            padding: '12px 20px',
            borderRadius: '12px',
          },
          success: {
            containerStyle: {
              border: '1px solid rgba(16, 185, 129, 0.2)', // emerald hint
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#1c1917',
            },
          },
          error: {
            containerStyle: {
              border: '1px solid rgba(244, 63, 94, 0.2)', // rose hint
            },
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#1c1917',
            },
          },
        }}
      />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default MyApp;