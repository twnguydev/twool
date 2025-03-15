import React from 'react';
import {
  DollarSign,
  LineChart,
  Zap,
  Lightbulb,
} from 'lucide-react';

const FeatureIcons = {
  cost: DollarSign,
  decision: LineChart,
  productivity: Zap,
  innovation: Lightbulb
};

export const ValueProposition = ({ features }) => {
  return (
    <div className="py-24 bg-gradient-to-b from-indigo-50 to-white overflow-hidden relative">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply opacity-20"></div>
        <div className="absolute -left-10 bottom-1/3 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply opacity-20"></div>
        <svg className="absolute right-0 top-0 opacity-10" width="400" height="400" viewBox="0 0 200 200">
          <path fill="none" stroke="#6366f1" strokeWidth="1" d="M40,90 Q90,20 140,90 Q190,160 140,180 Q90,200 40,180 Q-10,160 40,90" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4">
            <span className="text-sm font-semibold text-blue-800">Jumeau Numérique</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            La valeur ajoutée pour votre entreprise
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Modélisez vos opérations, identifiez les goulots d'étranglement et testez des améliorations sans aucun risque.
          </p>
        </div>

        <div className="mt-20 relative">
          {/* Ligne de connexion entre les cartes */}
          <div className="absolute hidden lg:block top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
            {features.map((feature, index) => {
              const Icon = FeatureIcons[feature.iconKey];
              return (
                <div 
                  key={feature.name} 
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500 relative z-10"
                >
                  <div className="flex flex-col">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.name}</h3>
                    <p className="text-base text-gray-500">{feature.description}</p>
                    
                    {/* Numéro pour indication visuelle d'ordre/importance */}
                    <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};