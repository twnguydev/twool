import React, { useState, useEffect } from 'react';
import Layout from '/components/Layout/Layout';
import Link from 'next/link';
import { withAuth, useAuthContext } from '/context/auth-context';
import { useApi } from '/hooks/useApi';

function Dashboard() {
  const { user } = useAuthContext();
  const api = useApi();

  const [workflows, setWorkflows] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [optimizations, setOptimizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    totalSimulations: 0,
    totalOptimizations: 0,
    timeOptimized: 0,
    costsReduced: 0
  });

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return 'à l\'instant';
    if (diffSec < 3600) return `il y a ${Math.floor(diffSec / 60)} min`;
    if (diffSec < 86400) return `il y a ${Math.floor(diffSec / 3600)} h`;
    return `il y a ${Math.floor(diffSec / 86400)} j`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Récupérer les workflows de façon sécurisée
        let workflowsData = [];
        try {
          if (user?.company_id) {
            try {
              const companyWorkflows = await api.workflows.getCompanyWorkflows(user.company_id, { limit: 5 });
              workflowsData = Array.isArray(companyWorkflows) ? companyWorkflows : [];
            } catch (err) {
              console.error("Erreur lors de la récupération des workflows d'entreprise:", err);
              workflowsData = [];
            }
          } else {
            try {
              const result = await api.workflows.getUserWorkflows(user.id, { limit: 5 });
              workflowsData = Array.isArray(result) ? result : [];
            } catch (err) {
              console.error("Erreur lors de la récupération des workflows:", err);
              workflowsData = [];
            }
          }
        } catch (err) {
          console.error("Erreur générale lors du chargement des workflows:", err);
          workflowsData = [];
        }

        setWorkflows(workflowsData);

        // 2. Récupérer les simulations récentes pour ces workflows
        if (workflowsData.length > 0) {
          const simulationPromises = workflowsData.map(workflow =>
            api.simulations.getSimulationsByWorkflow(workflow.id, { limit: 3 })
          );

          const simulationsResults = await Promise.all(simulationPromises);
          const allSimulations = simulationsResults
            .flat()
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);

          setSimulations(allSimulations);

          // 3. Récupérer les optimisations liées à ces workflows
          let allOptimizations = [];
          try {
            if (workflowsData && workflowsData.length > 0) {
              const optimizationPromises = workflowsData
                .filter(workflow => workflow && workflow.id)
                .map(workflow => {
                  return api.optimizations.getOptimizationsByProcess(workflow.id, { limit: 3 })
                    .catch(err => {
                      console.error(`Erreur lors de la récupération des optimisations pour le workflow ${workflow.id}:`, err);
                      return [];
                    });
                });

              const optimizationsResults = await Promise.all(optimizationPromises);
              const validResults = optimizationsResults.filter(Array.isArray);

              allOptimizations = validResults.reduce((acc, curr) => [...acc, ...curr], [])
                .filter(opt => opt && opt.id)
                .sort((a, b) => {
                  const dateA = a && a.created_at ? new Date(a.created_at) : new Date(0);
                  const dateB = b && b.created_at ? new Date(b.created_at) : new Date(0);
                  return dateB - dateA;
                })
                .slice(0, 5);
            }
          } catch (err) {
            console.error("Erreur lors du traitement des optimisations:", err);
            allOptimizations = [];
          }

          setOptimizations(allOptimizations);
        }

        // 4. Calculer les statistiques globales
        const statsData = {
          totalWorkflows: workflowsData.length,
          totalSimulations: simulations.length,
          totalOptimizations: optimizations.length,
          timeOptimized: optimizations.reduce((sum, opt) => sum + (opt.metrics?.time_saved || 0), 0),
          costsReduced: optimizations.reduce((sum, opt) => sum + (opt.metrics?.cost_saved || 0), 0)
        };

        setStats(statsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <Layout title="Tableau de bord">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête avec message de bienvenue */}
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-medium text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenue sur votre espace Twool Labs, {user.first_name} {user.last_name} !
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Métriques clés */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Processus</div>
                <div className="mt-2 flex items-baseline">
                  <span className="text-xl font-medium text-gray-900">{stats.totalWorkflows}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Simulations</div>
                <div className="mt-2 flex items-baseline">
                  <span className="text-xl font-medium text-gray-900">{stats.totalSimulations}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Optimisations</div>
                <div className="mt-2 flex items-baseline">
                  <span className="text-xl font-medium text-gray-900">{stats.totalOptimizations}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Temps optimisé</div>
                <div className="mt-2 flex items-baseline">
                  <span className="text-xl font-medium text-gray-900">{stats.timeOptimized}</span>
                  <span className="ml-1 text-xs text-gray-500">min</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Coûts réduits</div>
                <div className="mt-2 flex items-baseline">
                  <span className="text-xl font-medium text-gray-900">{stats.costsReduced}€</span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 mb-8">
              <h2 className="text-base font-medium text-gray-900 mb-4">Actions rapides</h2>
              <div className="flex flex-wrap gap-2">
                <Link href="/dashboard/modeling/workflows/create">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <svg className="h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouveau processus
                  </button>
                </Link>

                <Link href="/simulations">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <svg className="h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Lancer une simulation
                  </button>
                </Link>

                <Link href="/optimizations">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <svg className="h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Optimiser un processus
                  </button>
                </Link>

                <Link href="/flow-analysis">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <svg className="h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analyser un flux
                  </button>
                </Link>
              </div>
            </div>

            {/* Activité récente */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-8">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-base font-medium text-gray-900">Activité récente</h2>
                <div className="flex space-x-2">
                  <Link href="/modeling">
                    <span className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer">
                      Voir tous les processus
                    </span>
                  </Link>
                </div>
              </div>

              {workflows.length > 0 ? (
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {workflows.map((workflow) => (
                      <li key={workflow.id} className="px-4 py-3 hover:bg-gray-50">
                        <Link href={`/modeling/${workflow.id}`}>
                          <div className="flex items-center justify-between cursor-pointer">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-3">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="text-sm font-medium text-gray-800 truncate">
                                  {workflow.name}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center">
                                <span className="text-xs text-gray-500">
                                  Modifié {formatRelativeDate(workflow.updated_at)}
                                </span>
                                {workflow.is_shared && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Partagé
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <span className="text-xs text-gray-500">{workflow.nodes?.length || 0} nœuds</span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-gray-500">
                  <p>Aucun processus trouvé</p>
                  <Link href="/modeling">
                    <p className="mt-1 text-indigo-600 hover:text-indigo-800 cursor-pointer">Créer votre premier processus</p>
                  </Link>
                </div>
              )}
            </div>

            {/* Grille de deux colonnes pour les simulations et optimisations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dernières simulations */}
              <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-base font-medium text-gray-900">Dernières simulations</h2>
                  <Link href="/simulations">
                    <span className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer">
                      Voir toutes
                    </span>
                  </Link>
                </div>

                {simulations.length > 0 ? (
                  <div className="overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {simulations.map((simulation) => (
                        <li key={simulation.id} className="px-4 py-3 hover:bg-gray-50">
                          <Link href={`/simulations/${simulation.id}`}>
                            <div className="flex items-center cursor-pointer">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-3">
                                  <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-800 truncate">
                                    {simulation.workflow_name || "Simulation"}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center">
                                  <span className="text-xs text-gray-500">
                                    {formatRelativeDate(simulation.created_at)}
                                  </span>
                                  <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${simulation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    simulation.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                    {simulation.status === 'completed' ? 'Terminée' :
                                      simulation.status === 'running' ? 'En cours' :
                                        simulation.status === 'failed' ? 'Échec' : simulation.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-gray-500">
                    Aucune simulation lancée
                  </div>
                )}
              </div>

              {/* Dernières optimisations */}
              <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-base font-medium text-gray-900">Dernières optimisations</h2>
                  <Link href="/optimizations">
                    <span className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer">
                      Voir toutes
                    </span>
                  </Link>
                </div>

                {optimizations.length > 0 ? (
                  <div className="overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {optimizations.map((optimization) => (
                        <li key={optimization.id} className="px-4 py-3 hover:bg-gray-50">
                          <Link href={`/optimizations/${optimization.id}`}>
                            <div className="flex items-center cursor-pointer">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-3">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-800 truncate">
                                    {optimization.process_name || "Optimisation"}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center">
                                  <span className="text-xs text-gray-500">
                                    {formatRelativeDate(optimization.created_at)}
                                  </span>
                                  {optimization.suggestions?.length > 0 && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      {optimization.suggestions.length} suggestions
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-gray-500">
                    Aucune optimisation générée
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

// Protéger cette page avec le HOC d'authentification
export default withAuth(Dashboard);