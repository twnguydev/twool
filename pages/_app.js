// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/layout/app-layout';
import { AuthProvider } from '../context/auth-context';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isElectron } from '../utils/platform';

const UpdateNotifier = dynamic(
  () => import('../components/ui/update-notifier'),
  { ssr: false }
);

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Effet pour la redirection dans Electron
  useEffect(() => {
    // Si nous sommes dans Electron et sur la page d'accueil, rediriger vers login
    if (isElectron() && router.pathname === '/') {
      router.replace('/auth/login');
    }
  }, [router.pathname]);

  const getLayout = Component.getLayout || ((page) => (
    <AuthProvider>
      <Layout
        title={pageProps.seo?.title}
        description={pageProps.seo?.description}
        keywords={pageProps.seo?.keywords}
        ogImage={pageProps.seo?.ogImage}
        ogType={pageProps.seo?.ogType}
        structuredData={pageProps.seo?.structuredData}
        canonicalUrl={pageProps.seo?.canonicalUrl}
        language={pageProps.seo?.language}
        contentType={pageProps.seo?.contentType}
        lastUpdated={pageProps.seo?.lastUpdated}
        readingTime={pageProps.seo?.readingTime}
        topicClusters={pageProps.seo?.topicClusters}
      >
        {page}
        <UpdateNotifier />
      </Layout>
    </AuthProvider>
  ));

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;