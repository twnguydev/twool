import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '/components/Layout/Layout';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Simulations() {
  const router = useRouter();
  const { workflow: workflowId } = router.query;

  // État pour filtrer par workflow sélectionné
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Données de démonstration pour les workflows
  const workflowsData = [
    { id: 'w1', name: 'Processus de Vente' },
    { id: 'w2', name: 'Intégration Client' },
    { id: 'w3', name: 'Traitement de Factures' },
    { id: 'w4', name: 'Processus de Recrutement' },
    { id: 'w5', name: 'Support Client' }
  ];

  // Données de démonstration pour les simulations
  const simulationsData = [
    // Cluster 1: Processus de Vente
    {
      id: 'c1',
      workflowId: 'w1',
      name: 'Processus de Vente - Mars 2025',
      description: 'Simulations itératives pour optimiser le tunnel de vente',
      lastUpdated: new Date(2025, 2, 1),
      simulations: [
        { id: 's1', name: 'Baseline', date: new Date(2025, 2, 1, 9, 30), status: 'completed', duration: 92, bottlenecks: 3 },
        { id: 's2', name: 'Optimisation 1', date: new Date(2025, 2, 1, 10, 45), status: 'completed', duration: 78, bottlenecks: 2 },
        { id: 's3', name: 'Optimisation 2', date: new Date(2025, 2, 1, 14, 15), status: 'completed', duration: 64, bottlenecks: 1 }
      ],
      improvement: 30.4,
      metrics: {
        timeReduction: 28,
        costSavings: 420,
        qualityImprovement: 15
      }
    },
    // Autres clusters...
    // Cluster 2: Intégration Client
    {
      id: 'c2',
      workflowId: 'w2',
      name: 'Intégration Client - Février 2025',
      description: 'Amélioration du parcours d\'onboarding client',
      lastUpdated: new Date(2025, 1, 25),
      simulations: [
        { id: 's4', name: 'Situation initiale', date: new Date(2025, 1, 23, 11, 0), status: 'completed', duration: 72, bottlenecks: 4 },
        { id: 's5', name: 'Réduction étapes', date: new Date(2025, 1, 24, 14, 30), status: 'completed', duration: 58, bottlenecks: 2 },
        { id: 's6', name: 'Automatisation', date: new Date(2025, 1, 25, 9, 15), status: 'completed', duration: 42, bottlenecks: 1 },
        { id: 's7', name: 'Version finale', date: new Date(2025, 1, 25, 16, 0), status: 'completed', duration: 38, bottlenecks: 0 }
      ],
      improvement: 47.2,
      metrics: {
        timeReduction: 34,
        costSavings: 560,
        qualityImprovement: 22
      }
    }
  ];

  // Mettre à jour le workflow sélectionné en fonction du paramètre d'URL
  useEffect(() => {
    if (workflowId) {
      setSelectedWorkflow(workflowId);
    }
  }, [workflowId]);

  // Filtrer les clusters de simulation en fonction du workflow sélectionné et du terme de recherche
  const filteredClusters = simulationsData.filter(cluster =>
    (!selectedWorkflow || cluster.workflowId === selectedWorkflow) &&
    (cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cluster.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Obtenir le nom du workflow sélectionné
  const getWorkflowName = (id) => {
    const workflow = workflowsData.find(w => w.id === id);
    return workflow ? workflow.name : 'Inconnu';
  };

  // Fonction pour formater la date relative
  function formatRelativeDate(date) {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  }

  // Fonction pour déterminer la couleur de statut
  function getStatusColor(status) {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <Layout title="Simulations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête avec titre */}
        <div className="mb-8 border-b border-gray-200 pb-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium text-gray-900">Simulations</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez et analysez les simulations de vos workflows
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/modeling">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Nouvelle Simulation
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedWorkflow || ''}
              onChange={(e) => setSelectedWorkflow(e.target.value || null)}
            >
              <option value="">Tous les workflows</option>
              {workflowsData.map(workflow => (
                <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Affichage des clusters de simulation */}
        <div className="space-y-6">
          {filteredClusters.map(cluster => (
            <div key={cluster.id} className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
              {/* En-tête du cluster */}
              <div className="px-4 py-4 sm:px-6 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{cluster.name}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {cluster.description}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Workflow: {getWorkflowName(cluster.workflowId)} · 
                    Dernière mise à jour: {format(cluster.lastUpdated, 'dd MMM yyyy', { locale: fr })} ·
                    {formatRelativeDate(cluster.lastUpdated)}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  {cluster.improvement && (
                    <div className="flex items-center text-green-600 font-semibold">
                      <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {cluster.improvement}% d'amélioration
                    </div>
                  )}
                  <div className="mt-2">
                    <Link href={`/simulations/cluster/${cluster.id}`}>
                      <span className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
                        Voir les détails →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Timeline des simulations */}
              <div className="px-4 py-4 sm:px-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500">Progression des simulations</h4>
                  <div className="mt-2 relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-between">
                      {cluster.simulations.map((simulation, index) => (
                        <div key={simulation.id} className="flex flex-col items-center">
                          <div
                            className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                              simulation.status === 'completed' ? 'bg-green-500' :
                              simulation.status === 'running' ? 'bg-indigo-500' :
                              'bg-gray-300'
                            } border-2 border-white`}
                          >
                            {simulation.status === 'completed' ? (
                              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : simulation.status === 'running' ? (
                              <svg className="h-5 w-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : (
                              <span className="text-xs text-white font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="mt-2 text-xs text-center">
                            <div className="font-medium">{simulation.name}</div>
                            <div className="text-gray-500">{format(simulation.date, 'dd/MM', { locale: fr })}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Liste des simulations */}
                <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {cluster.simulations.map((simulation) => (
                      <li key={simulation.id} className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{simulation.name}</p>
                            <div className="mt-1 flex items-center">
                              <span className="text-xs text-gray-500 mr-2">
                                {format(simulation.date, 'dd MMM yyyy HH:mm', { locale: fr })}
                              </span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(simulation.status)}`}>
                                {simulation.status === 'completed' ? 'Terminée' :
                                 simulation.status === 'running' ? 'En cours' :
                                 simulation.status === 'failed' ? 'Échec' : 'En attente'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-4 items-center">
                          {simulation.status === 'completed' && (
                            <>
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-900">{simulation.duration} min</span>
                                <span className="text-xs text-gray-500">Durée</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-900">{simulation.bottlenecks}</span>
                                <span className="text-xs text-gray-500">Goulets</span>
                              </div>
                            </>
                          )}
                          <div>
                            <Link href={`/simulations/${simulation.id}`}>
                              <div className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Métriques (si disponibles) */}
                {cluster.metrics && (
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="bg-white overflow-hidden rounded-md border border-gray-200">
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className="shrink-0 bg-indigo-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Temps économisé
                              </dt>
                              <dd>
                                <div className="text-lg font-semibold text-indigo-600">
                                  {cluster.metrics.timeReduction} minutes
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden rounded-md border border-gray-200">
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className="shrink-0 bg-indigo-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Économies réalisées
                              </dt>
                              <dd>
                                <div className="text-lg font-semibold text-indigo-600">
                                  {cluster.metrics.costSavings}€
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden rounded-md border border-gray-200">
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className="shrink-0 bg-indigo-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Amélioration qualité
                              </dt>
                              <dd>
                                <div className="text-lg font-semibold text-indigo-600">
                                  +{cluster.metrics.qualityImprovement}%
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Message si aucun cluster trouvé */}
          {filteredClusters.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden py-10 px-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune simulation trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedWorkflow ? 'Aucun résultat pour votre recherche.' : 'Vous n\'avez pas encore lancé de simulation.'}
              </p>
              <div className="mt-6">
                <Link href="/modeling">
                  <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-xs text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Lancer une simulation
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}