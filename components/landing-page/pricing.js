import Link from 'next/link';
import {
  Check
} from 'lucide-react';

export const Pricing = () => {
  return (
    <>
      {/* Pricing Section */}
      <div className="bg-linear-to-b from-indigo-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-indigo-700">Tarification</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Solutions adaptées à votre taille d'entreprise
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-xl text-gray-500 mb-16">
              Choisissez l'offre qui correspond à vos besoins spécifiques et faites évoluer votre abonnement selon votre croissance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                name: "Startup",
                price: "299€",
                description: "Commencez avec les fonctionnalités essentielles pour optimiser vos opérations.",
                features: [
                  "Jusqu'à 3 modèles de processus",
                  "50 simulations par mois",
                  "Analyses de base",
                  "3 utilisateurs",
                  "Support par email"
                ],
                highlighted: false,
                cta: "Essayer Startup",
                color: "from-indigo-500 to-indigo-600"
              },
              {
                name: "Business",
                price: "799€",
                description: "Solution idéale pour les PME avec plusieurs processus à optimiser.",
                features: [
                  "Jusqu'à 10 modèles de processus",
                  "Simulation illimitée",
                  "IA prédictive de base",
                  "Jusqu'à 5 utilisateurs",
                  "Support aux heures de bureau",
                  "Intégration avec vos systèmes"
                ],
                highlighted: true,
                badge: "Plus populaire",
                cta: "Commencer avec Business",
                color: "from-indigo-500 to-indigo-700"
              },
              {
                name: "Enterprise",
                price: "2 499€",
                description: "Pour les grandes entreprises avec des processus complexes et interdépendants.",
                features: [
                  "Modèles de processus illimités",
                  "Simulation haute performance",
                  "IA prédictive avancée",
                  "Utilisateurs illimités",
                  "Support 24/7 dédié",
                  "Intégration personnalisée",
                  "Formation sur site"
                ],
                highlighted: false,
                cta: "Contacter notre équipe",
                color: "from-indigo-500 to-indigo-700"
              }
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl overflow-hidden shadow-xl bg-white border ${plan.highlighted ? 'transform scale-105 border-indigo-400' : 'border-gray-200'
                  }`}
              >
                {plan.highlighted && (
                  <div className="bg-linear-to-r from-indigo-600 to-indigo-700 text-center py-2">
                    <span className="text-sm font-semibold text-white">{plan.badge}</span>
                  </div>
                )}

                <div className="px-6 py-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-4 flex items-center justify-center">
                      <span className="px-3 flex items-start text-6xl tracking-tight text-gray-900">
                        <span className="text-xl font-medium mt-2">€</span>
                        <span className="font-extrabold">{plan.price.replace('€', '')}</span>
                        <span className="ml-2 text-xl font-medium text-gray-500">/mois</span>
                      </span>
                    </div>
                    <p className="mt-4 text-gray-500">{plan.description}</p>
                  </div>
                </div>

                <div className="px-6 py-8 bg-gray-50 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start">
                      <div className="shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-gray-700">{feature}</p>
                    </div>
                  ))}

                  <div className="pt-6">
                    <Link href={plan.highlighted ? "/auth/signup" : plan.name === "Enterprise" ? "/contact" : "/auth/signup"}>
                      <span
                        className={`block w-full py-4 px-6 border border-transparent rounded-lg text-center font-medium text-white bg-linear-to-r ${plan.color} shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] transition-all duration-300 cursor-pointer`}
                      >
                        {plan.cta}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}