// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout/AppLayout';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => (
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
    </Layout>
  ));

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;