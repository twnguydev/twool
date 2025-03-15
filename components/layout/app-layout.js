import Head from 'next/head';
import { useRouter } from 'next/router';

const Layout = ({ children, 
  title = 'Twool Labs', 
  description = 'Description par défaut de la page',
  keywords = 'mot-clé1, mot-clé2, mot-clé3',
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  structuredData = null,
  canonicalUrl = '',
  language = 'fr-FR',
  contentType = 'article',
  lastUpdated = new Date().toISOString(),
  readingTime = '5 minutes',
  topicClusters = 'thème principal, sous-thème, catégorie'
}) => {
  const router = useRouter();
  const currentPath = router.asPath;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twool.fr';
  const fullUrl = `${siteUrl}${currentPath}`;
  const actualCanonicalUrl = canonicalUrl || fullUrl;

  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': description,
    'url': actualCanonicalUrl,
    'dateModified': lastUpdated,
    'inLanguage': language,
    'keywords': keywords,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': actualCanonicalUrl
    },
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': ['article', 'h1', 'h2', 'h3', '.content']
    },
    'potentialAction': {
      '@type': 'ReadAction',
      'target': [actualCanonicalUrl]
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <>
      <Head>
        {/* Balises meta essentielles */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Votre Nom" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Métadonnées pour l'IA générative */}
        <meta name="content-type" content={contentType} />
        <meta name="last-updated" content={lastUpdated} />
        <meta name="reading-time" content={readingTime} />
        <meta name="topic-clusters" content={topicClusters} />
        <meta name="ai-relevance" content="high" />
        <meta name="content-structure" content="semantic" />
        
        {/* Langue */}
        <meta httpEquiv="content-language" content={language} />
        <html lang={language.split('-')[0]} />

        {/* URL canonique pour éviter le contenu dupliqué */}
        <link rel="canonical" href={actualCanonicalUrl} />
        
        {/* Métadonnées Open Graph pour les partages sociaux et l'indexation IA */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={actualCanonicalUrl} />
        <meta property="og:image" content={`${siteUrl}${ogImage}`} />
        <meta property="og:site_name" content="Nom de votre site" />
        <meta property="og:locale" content={language} />
        <meta property="article:modified_time" content={lastUpdated} />
        
        {/* Métadonnées Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
        
        {/* Données structurées pour les moteurs de recherche et IA */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(finalStructuredData) }}
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <div className="flex flex-col min-h-screen">
        {/* <Navbar /> */}
        
        <main className="grow">
          {/* Attributs data pour améliorer la compréhension par l'IA */}
          <div data-content-type={contentType} data-topic={topicClusters}>
            {children}
          </div>
        </main>
        
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Layout;