import Head from 'next/head';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import { HeroSection } from './hero-section';
import { ValueProposition } from './value-proposition';
import { StatsSection } from './stats-section';
import { CoreFeatures } from './core-feature';
import { DemoSection } from './demo-section';
import { Pricing } from './pricing';
import { CtaBanner } from './cta-banner';
import { FaqSection } from './faq-section';
import { GuaranteedResults } from './guaranteed-results';
import { UseCases } from './use-cases';
import { Testimonials } from './testimonals';

const LandingPage = ({ testimonials, features, stats }) => {
  return (
    <>
      <Head>
        <title>Twool Labs | Plateforme de Jumeau Numérique pour l'Optimisation des Processus d'Entreprise</title>
        <meta
          name="description"
          content="Modélisez, simulez et optimisez vos processus métier grâce à notre plateforme de jumeau numérique basée sur l'IA. Réduisez les coûts, augmentez l'efficacité et gagnez un avantage concurrentiel."
        />
      </Head>

      <Navbar />
      <div className="bg-linear-to-b from-gray-50 to-white">
        <HeroSection />

        <StatsSection stats={stats} />
        <ValueProposition features={features} />
        <UseCases />
        <CoreFeatures />
        <DemoSection />
        <Testimonials testimonials={testimonials} />
        <Pricing />
        <CtaBanner />
        <FaqSection />
        <GuaranteedResults />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

// Cette fonction est exécutée côté serveur à la construction
export async function getStaticProps() {
  // Normalement, vous récupéreriez ces données depuis votre CMS ou API
  const testimonials = [
    {
      name: 'Sophie Durand',
      role: 'Directrice des Opérations',
      company: 'Globex Industries',
      avatar: '/images/testimonials/sophie.jpg',
      quote: 'Grâce à Twool Labs, nous avons réduit nos délais de production de 32% et identifié des économies potentielles de 1,2M€ par an. L\'interface est intuitive et nos équipes ont adopté l\'outil en quelques jours seulement.',
      rating: 5
    },
    {
      name: 'Jean-Pierre Martin',
      role: 'DSI',
      company: 'Finance Plus',
      avatar: '/images/testimonials/jean-pierre.jpg',
      quote: 'La possibilité de tester différents scénarios avant leur implémentation nous a évité plusieurs erreurs coûteuses. Le ROI a été atteint en moins de 4 mois.',
      rating: 5
    },
    {
      name: 'Émilie Lefèvre',
      role: 'Responsable Supply Chain',
      company: 'Retail Express',
      avatar: '/images/testimonials/emilie.jpg',
      quote: 'L\'IA de Twool a identifié des optimisations que nous n\'aurions jamais envisagées. Nous avons réduit nos stocks de 18% tout en améliorant notre taux de service client.',
      rating: 4
    }
  ];

  // Notez que nous renvoyons uniquement des clés d'icônes, pas des fonctions
  const features = [
    {
      name: 'Réduction des coûts opérationnels',
      description: 'Identifiez les gaspillages et optimisez vos processus pour réduire les coûts de 25% à 45% en moyenne.',
      iconKey: 'cost' // Clé d'icône au lieu de fonction
    },
    {
      name: 'Amélioration de la prise de décision',
      description: 'Testez différentes stratégies dans un environnement virtuel avant de les déployer, réduisant ainsi les risques de 78%.',
      iconKey: 'decision' // Clé d'icône au lieu de fonction
    },
    {
      name: 'Augmentation de la productivité',
      description: 'Optimisez l\'allocation des ressources et l\'ordonnancement des tâches pour augmenter la productivité jusqu\'à 35%.',
      iconKey: 'productivity' // Clé d'icône au lieu de fonction
    },
    {
      name: 'Innovation accélérée',
      description: 'Testez de nouveaux modèles d\'affaires et processus 5 fois plus rapidement qu\'avec les méthodes traditionnelles.',
      iconKey: 'innovation' // Clé d'icône au lieu de fonction
    }
  ];

  const stats = [
    { label: 'Coûts réduits', value: '47%' },
    { label: 'Productivité accrue', value: '35%' },
    { label: 'Délais de production', value: '-32%' }
  ];

  return {
    props: {
      testimonials,
      features,
      stats
    },
    // Revalidation des données toutes les 24 heures (en secondes)
    revalidate: 86400
  };
}

export default LandingPage;