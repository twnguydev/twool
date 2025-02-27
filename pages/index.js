// pages/index.js
import React from 'react';
import Layout from '../components/Layout/Layout';
import Link from 'next/link';

export default function Home() {
  // Données de démonstration pour les métriques
  const metrics = {
    processesCreated: 12,
    simulationsRun: 28,
    optimizationsGenerated: 8,
    timeOptimized: 145, // minutes
    costSaved: 1820 // euros
  };

  // Données de démonstration pour les processus récents
  const recentProcesses = [
    { id: 'p1', name: 'Intégration Client', lastModified: 'il y a 2 heures', status: 'actif', nodes: 12 },
    { id: 'p2', name: 'Traitement de Factures', lastModified: 'il y a 1 jour', status: 'optimisé', nodes: 8 },
    { id: 'p3', name: 'Processus de Recrutement', lastModified: 'il y a 3 jours', status: 'actif', nodes: 15 }
  ];

  // Données de démonstration pour les simulations récentes
  const recentSimulations = [
    { id: 's1', process: 'Intégration Client', date: 'il y a 2 heures', duration: 84, bottlenecks: 2 },
    { id: 's2', name: 'Traitement de Factures', date: 'il y a 1 jour', duration: 46, bottlenecks: 1 }
  ];

  // Données de démonstration pour les optimisations IA
  const recentOptimizations = [
    { id: 'o1', process: 'Traitement de Factures', date: 'il y a 1 jour', improvements: 3, timeSaved: 28 },
    { id: 'o2', process: 'Intégration Client', date: 'il y a 3 jours', improvements: 4, timeSaved: 42 }
  ];

  return (
    <Layout>
      <div className="p-6">
        {/* En-tête avec message de bienvenue et métriques clés */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenue sur Twool Labs</h1>
          <p className="mt-2 text-gray-600">Votre plateforme de jumeau numérique pour l'optimisation des processus</p>
        </div>

        {/* Métriques en cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Processus Totaux</div>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-semibold text-indigo-600">{metrics.processesCreated}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Simulations Lancées</div>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-semibold text-blue-600">{metrics.simulationsRun}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Optimisations IA</div>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-semibold text-green-600">{metrics.optimizationsGenerated}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Temps Optimisé</div>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-semibold text-purple-600">{metrics.timeOptimized}</span>
              <span className="ml-1 text-sm text-gray-500">minutes</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Économies Réalisées</div>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-semibold text-yellow-600">{metrics.costSaved}€</span>
            </div>
          </div>
        </div>

        {/* Section principale avec colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Processus récents */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-indigo-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-indigo-800">Processus Récents</h3>
                <Link href="/modeling">
                  <div className="px-3 py-1 bg-indigo-600 rounded-md text-sm text-white hover:bg-indigo-700 cursor-pointer">
                    Nouveau Processus
                  </div>
                </Link>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentProcesses.map((process) => (
                <li key={process.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-700 truncate">{process.name}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 mr-2">{process.lastModified}</span>
                        <span className="text-xs text-gray-500">{process.nodes} nœuds</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        process.status === 'optimisé' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {process.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {recentProcesses.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                Aucun processus créé pour le moment. Commencez par créer un nouveau processus.
              </div>
            )}
          </div>

          {/* Simulations récentes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-blue-800">Simulations Récentes</h3>
                <Link href="/simulations">
                  <div className="px-3 py-1 bg-blue-600 rounded-md text-sm text-white hover:bg-blue-700 cursor-pointer">
                    Toutes les Simulations
                  </div>
                </Link>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentSimulations.map((simulation) => (
                <li key={simulation.id} className="px-4 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-700 truncate">{simulation.process}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 mr-2">{simulation.date}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-blue-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-gray-600">{simulation.duration} min</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-xs text-gray-600">{simulation.bottlenecks} goulets</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {recentSimulations.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                Aucune simulation lancée pour le moment. Créez un processus et lancez une simulation.
              </div>
            )}
          </div>

          {/* Optimisations IA récentes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-green-50 border-b border-green-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-green-800">Optimisations IA</h3>
                <Link href="/optimizations">
                  <div className="px-3 py-1 bg-green-600 rounded-md text-sm text-white hover:bg-green-700 cursor-pointer">
                    Toutes les Optimisations
                  </div>
                </Link>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentOptimizations.map((optimization) => (
                <li key={optimization.id} className="px-4 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-700 truncate">{optimization.process}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 mr-2">{optimization.date}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xs text-gray-600">{optimization.improvements} améliorations</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-purple-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-gray-600">{optimization.timeSaved} min gagnées</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {recentOptimizations.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                Aucune optimisation générée pour le moment. Lancez d'abord une simulation.
              </div>
            )}
          </div>
        </div>

        {/* Section d'aide rapide */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:flex md:items-center md:justify-between">
            <div className="max-w-xl md:max-w-2xl">
              <h2 className="text-2xl font-bold text-white">Premiers pas</h2>
              <p className="mt-2 text-indigo-100">
                Créez votre premier modèle de processus en jumeau numérique, lancez des simulations et découvrez les optimisations générées par l'IA pour améliorer vos flux de travail.
              </p>
              <div className="mt-4 flex space-x-4">
                <Link href="/modeling">
                  <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 cursor-pointer">
                    Créer un Processus
                  </div>
                </Link>
                <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-800 bg-opacity-30 hover:bg-opacity-40">
                  Voir le Tutoriel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}