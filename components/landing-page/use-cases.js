import React from 'react';
import {
  Factory,
  BarChart4,
  Truck,
  Heart,
  Cpu,
  Store,
} from 'lucide-react';

const UseCaseIcons = {
  factory: Factory,
  chart: BarChart4,
  truck: Truck,
  health: Heart,
  energy: Cpu,
  store: Store
};

export const UseCases = () => {
  const cases = [
    {
      name: "Industrie manufacturière",
      description: "Optimisez les chaînes de production, réduisez les temps d'arrêt et simulez les changements de cadence.",
      icon: "factory",
      color: "from-blue-600 to-blue-700"
    },
    {
      name: "Services financiers",
      description: "Automatisez les processus d'approbation, gérez les risques et optimisez les flux de travail des services clients.",
      icon: "chart",
      color: "from-green-600 to-green-700"
    },
    {
      name: "Logistique & Supply Chain",
      description: "Améliorez l'efficacité des itinéraires, réduisez les coûts de transport et anticipez les ruptures de stock.",
      icon: "truck",
      color: "from-amber-600 to-amber-700"
    },
    {
      name: "Santé & Pharmaceutique",
      description: "Optimisez les parcours patients, les processus de fabrication et la gestion des stocks critiques.",
      icon: "health",
      color: "from-red-600 to-red-700"
    },
    {
      name: "Énergie & Utilities",
      description: "Maximisez l'efficacité opérationnelle, réduisez la consommation d'énergie et prévoyez les besoins de maintenance.",
      icon: "energy",
      color: "from-purple-600 to-purple-700"
    },
    {
      name: "Commerce de détail",
      description: "Optimisez l'agencement des magasins, la gestion du personnel et les stratégies de réapprovisionnement.",
      icon: "store",
      color: "from-teal-600 to-teal-700"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50 relative">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute -bottom-10 -left-10 text-gray-100 opacity-50" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
          <defs>
            <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
        </svg>
        <svg className="absolute -top-10 -right-10 text-gray-100 opacity-50" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
          <defs>
            <pattern id="85737c0e-0916-41d7-917f-596dc7edfa28" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa28)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
            <span className="text-sm font-semibold text-indigo-700">Solutions sectorielles</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
            Solutions adaptées à votre secteur
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-500 mb-16">
            Quelle que soit votre industrie, Twool Labs s'adapte à vos besoins spécifiques.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((useCase, index) => {
            const Icon = UseCaseIcons[useCase.icon];
            return (
              <div 
                key={useCase.name} 
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* Bande colorée supérieure */}
                <div className={`h-2 bg-gradient-to-r ${useCase.color}`}></div>
                
                <div className="p-8">
                  {/* Conteneur d'icône avec style unique */}
                  <div className="inline-flex mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-r ${useCase.color} rounded-lg flex items-center justify-center transform rotate-3 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white transform -rotate-3" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{useCase.name}</h3>
                  <p className="text-gray-500">{useCase.description}</p>
                  
                  {/* Élément visuel supplémentaire */}
                  <div className="mt-6 flex items-center text-sm text-indigo-600 font-medium">
                    <span>Découvrir plus</span>
                    <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};