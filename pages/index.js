// pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { 
  DollarSign, 
  LineChart, 
  Zap, 
  Lightbulb, 
  Factory, 
  BarChart4, 
  Truck, 
  Heart, 
  Cpu, 
  Store,
  Play,
  ArrowRight,
  Check
} from 'lucide-react';

// Icônes pour les fonctionnalités avec lucide-react
const FeatureIcons = {
  cost: DollarSign,
  decision: LineChart,
  productivity: Zap,
  innovation: Lightbulb
};

// Icônes pour les cas d'usage avec lucide-react
const UseCaseIcons = {
  factory: Factory,
  chart: BarChart4,
  truck: Truck,
  health: Heart,
  energy: Cpu,
  store: Store
};

export default function Home({ testimonials, features, stats }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'inscription à implémenter
    console.log('Email soumis:', email);
  };

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
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-linear-to-r from-indigo-600 to-indigo-700">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600/90 to-indigo-700/90"></div>
          <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 bg-white/5 skew-x-[-15deg] transform origin-bottom-right"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white/10 to-transparent"></div>

          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center mt-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-200/20 rounded-full mb-6">
                <span className="text-sm font-semibold text-white">Twool Labs</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block text-white">Challengez vos processus métier</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">sans risquer votre business</span>
              </h1>
              <p className="mt-6 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
                Modélisez, simulez et optimisez vos opérations critiques sans perturber l'activité réelle. Réduisez les coûts opérationnels jusqu'à <span className="font-bold text-white">47%</span>.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <Link href="/auth/signup">
                  <span className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-lg hover:shadow-xl transition duration-300 ease-in-out cursor-pointer">
                    Démarrer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Link>
                <Link href="#demo">
                  <span className="flex items-center justify-center px-8 py-4 border border-indigo-300 text-base font-medium rounded-md text-white bg-transparent hover:bg-indigo-600/20 transition duration-300 ease-in-out cursor-pointer">
                    <Play className="mr-2 h-5 w-5" />
                    Voir une démo
                  </span>
                </Link>
              </div>
            </div>
            
            <div className="mt-16 relative w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-800/10 to-transparent pointer-events-none z-10 rounded-xl"></div>
              <Image
                src="/images/dashboard.png"
                alt="Aperçu du tableau de bord Twool Labs"
                layout="responsive"
                width={1600}
                height={900}
                objectFit="contain"
                className="rounded-xl"
                priority={true}
              />
            </div>
            
            <div className="mt-16 pt-6 px-8 bg-white/10 backdrop-blur-xs rounded-2xl">
              <p className="text-center text-sm text-indigo-100 mb-6">Ils nous font confiance :</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {['acme', 'globex', 'umbrella', 'stark'].map((company) => (
                  <div key={company} className="h-10 opacity-80 hover:opacity-100 transition-opacity duration-300">
                    <Image src={`/images/logos/${company}.svg`} alt={`${company} Logo`} width={120} height={40} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-linear-to-r from-indigo-700 to-indigo-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600/50 to-indigo-700/50"></div>
          <div className="absolute inset-y-0 right-0 w-1/3 bg-indigo-600/20 skew-x-[-15deg] transform origin-top-right"></div>
          <div className="absolute inset-y-0 left-0 w-1/3 bg-indigo-600/20 skew-x-[15deg] transform origin-bottom-left"></div>
          
          <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Résultats prouvés pour les entreprises
              </h2>
              <p className="mt-4 text-xl text-indigo-200">
                Nos clients ont obtenu des améliorations significatives en seulement 3 mois d'utilisation.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-xs rounded-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                  <dd className="text-5xl font-extrabold text-white mb-4">
                    {stat.value}
                  </dd>
                  <dt className="text-lg font-medium text-indigo-200">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className="py-24 bg-linear-to-b from-indigo-50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
                <span className="text-sm font-semibold text-indigo-700">Jumeau Numérique</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                La valeur ajoutée pour votre entreprise
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Modélisez vos opérations, identifiez les goulots d'étranglement et testez des améliorations sans aucun risque.
              </p>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
                {features.map((feature) => {
                  const Icon = FeatureIcons[feature.iconKey];
                  return (
                    <div key={feature.name} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                      <div className="flex items-start">
                        <div className="shrink-0">
                          <div className="bg-linear-to-r from-indigo-600 to-indigo-600 rounded-lg p-3 shadow-lg">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="ml-6">
                          <h3 className="text-xl font-bold text-gray-900">{feature.name}</h3>
                          <p className="mt-3 text-base text-gray-500">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="py-24 bg-linear-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {[
                {
                  name: "Industrie manufacturière",
                  description: "Optimisez les chaînes de production, réduisez les temps d'arrêt et simulez les changements de cadence.",
                  icon: "factory"
                },
                {
                  name: "Services financiers",
                  description: "Automatisez les processus d'approbation, gérez les risques et optimisez les flux de travail des services clients.",
                  icon: "chart"
                },
                {
                  name: "Logistique & Supply Chain",
                  description: "Améliorez l'efficacité des itinéraires, réduisez les coûts de transport et anticipez les ruptures de stock.",
                  icon: "truck"
                },
                {
                  name: "Santé & Pharmaceutique",
                  description: "Optimisez les parcours patients, les processus de fabrication et la gestion des stocks critiques.",
                  icon: "health"
                },
                {
                  name: "Énergie & Utilities",
                  description: "Maximisez l'efficacité opérationnelle, réduisez la consommation d'énergie et prévoyez les besoins de maintenance.",
                  icon: "energy"
                },
                {
                  name: "Commerce de détail",
                  description: "Optimisez l'agencement des magasins, la gestion du personnel et les stratégies de réapprovisionnement.",
                  icon: "store"
                }
              ].map((useCase) => {
                const Icon = UseCaseIcons[useCase.icon];
                return (
                  <div key={useCase.name} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:translate-y-[-8px] transition-all duration-300 border border-gray-100">
                    <div className="bg-linear-to-r from-indigo-600 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{useCase.name}</h3>
                    <p className="text-gray-500">{useCase.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-linear-to-b from-gray-50 to-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
                <span className="text-sm font-semibold text-indigo-700">Témoignages</span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-16">
                Ce que nos clients disent
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.name}
                  className={`relative rounded-2xl shadow-xl p-8 bg-linear-to-br ${
                    index === 0 ? 'from-indigo-600 to-indigo-700' : 
                    index === 1 ? 'from-indigo-600 to-indigo-700' : 
                    'from-indigo-600 to-pink-700'
                  } transform hover:scale-105 transition-transform duration-300`}
                >
                  <div className="absolute top-0 left-0 w-20 h-20 -mt-10 -ml-6">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white opacity-20">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-white text-lg italic mb-6">"{testimonial.quote}"</p>
                    
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4 border-2 border-white/30">
                        <Image 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          layout="fill" 
                          objectFit="cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{testimonial.name}</h3>
                        <p className="text-white/80 text-sm">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <svg
                          key={rating}
                          className={`h-5 w-5 ${
                            rating <= testimonial.rating ? 'text-yellow-300' : 'text-white/30'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div id="demo" className="py-24 bg-linear-to-b from-white to-indigo-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-bl from-indigo-100 to-transparent rounded-bl-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-indigo-100 to-transparent rounded-tr-full opacity-50"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
                <span className="text-sm font-semibold text-indigo-700">Démonstration</span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Voir Twool Labs en action
              </h2>
              <p className="mt-4 text-xl text-gray-500 mb-10">
                Découvrez comment notre plateforme peut transformer vos processus métier.
              </p>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto" style={{ aspectRatio: '16/9' }}>
              <div className="absolute inset-0 bg-linear-to-br from-indigo-900 to-indigo-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="group">
                    <div className="h-24 w-24 bg-linear-to-r from-indigo-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto cursor-pointer transform transition-all duration-300 hover:scale-110 shadow-xl">
                      <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
                        <Play className="h-10 w-10 text-indigo-600 ml-1" />
                      </div>
                    </div>
                    <p className="mt-6 text-white text-xl font-medium">Voir la démo (3:45)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  className={`rounded-2xl overflow-hidden shadow-xl bg-white border ${
                    plan.highlighted ? 'transform scale-105 border-indigo-400' : 'border-gray-200'
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

        {/* CTA Section */}
        <div className="bg-linear-to-r from-indigo-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600/90 to-indigo-700/90"></div>
          <div className="absolute inset-y-0 right-0 w-1/3 bg-indigo-500/20 skew-x-[-15deg] transform origin-top-right"></div>
          <div className="absolute inset-y-0 left-0 w-1/3 bg-indigo-500/20 skew-x-[15deg] transform origin-bottom-left"></div>
          
          <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Prêt à transformer vos processus?</span>
                <span className="block text-indigo-200">Démarrez votre essai gratuit aujourd'hui.</span>
              </h2>
              <p className="mt-4 text-lg text-indigo-100 max-w-md">
                Rejoignez les entreprises qui optimisent déjà leurs opérations grâce à Twool Labs.
              </p>
            </div>
            <div className="mt-10 lg:mt-0 lg:shrink-0 flex flex-col sm:flex-row gap-4">
              <div className="rounded-md shadow-sm">
                <Link href="/auth/signup">
                  <span className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-300 cursor-pointer">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Link>
              </div>
              <div className="rounded-md shadow-sm">
                <Link href="/contact">
                  <span className="flex items-center justify-center px-5 py-3 border border-indigo-300 text-base font-medium rounded-md text-white bg-indigo-800/40 hover:bg-indigo-700/60 transition-colors duration-300 cursor-pointer">
                    Contacter un expert
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

{/* Newsletter */}
<div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
                <span className="text-sm font-semibold text-indigo-700">Newsletter</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Recevez nos conseils d'optimisation
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                Inscrivez-vous à notre newsletter pour recevoir des conseils d'experts et des études de cas.
              </p>
              
              <form onSubmit={handleSubmit} className="mt-12 sm:mx-auto sm:max-w-lg">
                <div className="sm:flex bg-white p-1 rounded-lg shadow-xl border border-gray-100">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="email" className="sr-only">Adresse email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Votre adresse email"
                      className="block w-full px-5 py-4 rounded-md border-0 shadow-none focus:ring-0"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      className="block w-full px-6 py-4 rounded-md border border-transparent bg-linear-to-r from-indigo-600 to-indigo-600 text-white font-medium hover:from-indigo-700 hover:to-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      S'inscrire
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Nous respectons votre vie privée. Consultez notre{' '}
                  <Link href="/privacy">
                    <span className="font-medium text-indigo-600 hover:text-indigo-500 underline cursor-pointer">
                      politique de confidentialité
                    </span>
                  </Link>.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Features Supplementaires Section */}
        <div className="bg-linear-to-b from-white to-indigo-50 py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-indigo-100 rounded-full opacity-30"></div>
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-indigo-100 rounded-full opacity-30"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Interface intuitive",
                  description: "Une expérience utilisateur fluide et intuitive pour modéliser vos processus sans expertise technique.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  title: "IA prédictive",
                  description: "Notre IA analyse vos processus et suggère des optimisations personnalisées à votre contexte spécifique.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )
                },
                {
                  title: "Simulations en temps réel",
                  description: "Testez instantanément l'impact de vos modifications et visualisez les résultats en temps réel.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Analyses détaillées",
                  description: "Explorez des tableaux de bord interactifs pour identifier les opportunités d'optimisation.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: "Intégration simplifiée",
                  description: "Connectez Twool Labs à vos systèmes existants grâce à nos API et connecteurs pré-configurés.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "Sécurité renforcée",
                  description: "Vos données sont protégées par des protocoles de sécurité avancés et conformes aux normes du secteur.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-start"
                >
                  <div className="p-3 bg-linear-to-r from-indigo-500 to-indigo-500 rounded-lg shadow-md mb-6">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 grow">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
                <span className="text-sm font-semibold text-indigo-700">FAQ</span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Questions fréquemment posées
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Tout ce que vous devez savoir sur Twool Labs
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
              {[
                {
                  question: "Qu'est-ce qu'un jumeau numérique?",
                  answer: "Un jumeau numérique est une réplique virtuelle de vos processus, équipements ou systèmes. Cette technologie permet de simuler, analyser et optimiser vos opérations dans un environnement virtuel avant d'implémenter des changements dans le monde réel."
                },
                {
                  question: "Combien de temps faut-il pour implémenter Twool Labs?",
                  answer: "La mise en place de Twool Labs est rapide. Pour les processus simples, vous pouvez être opérationnel en quelques jours. Pour les environnements plus complexes ou les grandes entreprises, nous proposons un accompagnement personnalisé qui peut s'étendre sur quelques semaines pour garantir une intégration optimale."
                },
                {
                  question: "Est-ce que Twool Labs s'intègre avec mes systèmes existants?",
                  answer: "Absolument. Twool Labs dispose de connecteurs pour les principaux ERP, CRM, et systèmes de gestion. Nous proposons également une API complète pour développer des intégrations personnalisées si nécessaire."
                },
                {
                  question: "Quelle est la précision des simulations?",
                  answer: "La précision de nos simulations dépend de la qualité des données d'entrée. Avec des données précises, nos clients constatent une marge d'erreur moyenne inférieure à 5% entre les simulations et les résultats réels. Notre IA s'améliore constamment pour augmenter cette précision."
                },
                {
                  question: "Comment protégez-vous nos données?",
                  answer: "La sécurité est notre priorité. Nous utilisons le chiffrement de bout en bout, des serveurs sécurisés et des pratiques conformes aux normes RGPD, ISO 27001 et SOC 2. Nous ne partageons jamais vos données et vous en restez propriétaire à 100%."
                }
              ].map((faq, index) => (
                <div key={index} className="py-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-base text-gray-500">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <p className="text-base text-gray-500">
                Vous avez d'autres questions?{' '}
                <Link href="/contact">
                  <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                    Contactez notre équipe
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Guaranteed Results */}
        <div className="bg-linear-to-r from-indigo-700 via-indigo-700 to-pink-700 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600/90 to-pink-700/90"></div>
          <div className="absolute inset-y-0 right-0 w-1/3 bg-white/5 skew-x-[-15deg] transform origin-top-right"></div>
          <div className="absolute inset-y-0 left-0 w-1/3 bg-white/5 skew-x-[15deg] transform origin-bottom-left"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
                Résultats garantis ou remboursés
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-indigo-300 to-indigo-300 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-white/90 mb-8">
                Nous sommes tellement confiants dans l'efficacité de notre solution que nous vous garantissons des résultats mesurables. Si vous n'obtenez pas d'améliorations quantifiables dans les 90 jours, nous vous remboursons intégralement.
              </p>
              <Link href="/garantie">
                <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors duration-300 shadow-lg cursor-pointer">
                  Découvrir notre garantie
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>

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