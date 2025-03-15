// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LandingPage from '../components/landing-page/landing-page'; // Votre composant de landing page

export default function Home(props) {
  const router = useRouter();

  // Redirection côté client pour Electron
  useEffect(() => {
    // Fonction de détection Electron
    const isElectron = () => {
      if (typeof window === 'undefined') return false;
      return window.electron ||
        window.navigator.userAgent.toLowerCase().indexOf('electron') > -1 ||
        (window.process && window.process.type);
    };

    // Si nous sommes dans Electron, rediriger vers la page de connexion
    if (isElectron()) {
      router.replace('/auth/login');
    }
  }, []);

  // Rendu normal pour le web (ne sera pas affiché dans Electron grâce à la redirection)
  return <LandingPage {...props} />;
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