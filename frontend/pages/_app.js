import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {

  const getLayout =
    Component.getLayout ||
    ((page) => <Layout>{page}</Layout>);

  return (
    <AuthProvider>
      {getLayout(<Component {...pageProps} />)}
      <Toaster />
    </AuthProvider>
  );
}

export default MyApp;