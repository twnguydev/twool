import React from 'react';
import {
  Monitor,
  Brain,
  Clock,
  PieChart,
  Plug,
  Shield
} from 'lucide-react';

export const CoreFeatures = () => {
  const features = [
    {
      title: "Interface intuitive",
      description: "Une expérience utilisateur fluide et intuitive pour modéliser vos processus sans expertise technique.",
      icon: <Monitor className="h-6 w-6" />
    },
    {
      title: "IA prédictive",
      description: "Notre IA analyse vos processus et suggère des optimisations personnalisées à votre contexte spécifique.",
      icon: <Brain className="h-6 w-6" />
    },
    {
      title: "Simulations en temps réel",
      description: "Testez instantanément l'impact de vos modifications et visualisez les résultats en temps réel.",
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: "Analyses détaillées",
      description: "Explorez des tableaux de bord interactifs pour identifier les opportunités d'optimisation.",
      icon: <PieChart className="h-6 w-6" />
    },
    {
      title: "Intégration simplifiée",
      description: "Connectez Twool Labs à vos systèmes existants grâce à nos API et connecteurs pré-configurés.",
      icon: <Plug className="h-6 w-6" />
    },
    {
      title: "Sécurité renforcée",
      description: "Vos données sont protégées par des protocoles de sécurité avancés et conformes aux normes du secteur.",
      icon: <Shield className="h-6 w-6" />
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-indigo-50 py-24 relative overflow-hidden">
      {/* Cercles décoratifs */}
      <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-indigo-100 rounded-full opacity-30"></div>
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-indigo-100 rounded-full opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
            <span className="text-sm font-semibold text-indigo-700">Fonctionnalités clés</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pourquoi choisir Twool Labs?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Découvrez les fonctionnalités qui font de notre solution le choix privilégié des entreprises innovantes.
          </p>
        </div>

        {/* Grille de fonctionnalités avec design hexagonal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-start relative overflow-hidden border border-indigo-50"
            >
              {/* Élément décoratif d'angle */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-[100px] -z-10"></div>
              
              {/* Icône avec cercle intérieur et anneau extérieur */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-30 w-14 h-14 animate-pulse"></div>
                <div className="relative z-10 p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full shadow">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 grow">{feature.description}</p>
              
              {/* Indicateur décoratif */}
              <div className="w-16 h-1 bg-indigo-200 rounded mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};