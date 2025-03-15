// components/Modeling/utils/scenarioSimulator.js
import FormulaCalculator from './formula-calculator';

/**
 * Service qui permet de simuler différents scénarios de stress
 * sur un workflow de modélisation
 */
export class ScenarioSimulator {
  /**
   * Exécute les scénarios de simulation sur un processus
   * @param {Object} scenarioNode - Nœud de scénario contenant les différents scénarios
   * @param {Array} nodes - Ensemble des nœuds du processus
   * @param {Array} edges - Connexions entre les nœuds
   * @param {Object} options - Options supplémentaires (threshold, referenceVariable, etc.)
   * @returns {Object} Nœud de scénario mis à jour avec les résultats
   */
  static runSimulation(scenarioNode, nodes, edges, options = {}) {
    const scenarios = scenarioNode.data.scenarios || [];
    const threshold = options.threshold || scenarioNode.data.threshold || 15; // Seuil de résilience par défaut à 15%
    const referenceVariable = options.referenceVariable || 'tauxMarge'; // Variable de référence pour évaluer la résilience

    // Si aucun scénario n'est défini, on ne fait rien
    if (scenarios.length === 0) {
      return {
        ...scenarioNode,
        data: {
          ...scenarioNode.data,
          simulationResults: [],
          lastSimulation: new Date().toISOString()
        }
      };
    }

    // Récupérer le contexte initial du processus
    const baseContext = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        data: node.data
      }))
    };

    // Calculer la valeur de référence (cas de base)
    const baseResults = this.calculateBaseResults(baseContext, referenceVariable);

    // Simuler chaque scénario et collecter les résultats
    const simulationResults = [
      // Cas de base
      {
        scenario: 'Cas de base',
        margin: baseResults.referenceValue,
        isResilient: baseResults.referenceValue >= threshold
      }
    ];

    // Parcourir chaque scénario actif
    scenarios.filter(scenario => scenario.active !== false).forEach(scenario => {
      // Créer un contexte modifié pour ce scénario
      const scenarioContext = this.applyScenarioToContext(baseContext, scenario);

      // Calculer les résultats pour ce scénario
      const scenarioResults = this.calculateScenarioResults(scenarioContext, referenceVariable);

      // Ajouter à la liste des résultats
      simulationResults.push({
        scenario: scenario.name,
        margin: scenarioResults.referenceValue,
        isResilient: scenarioResults.referenceValue >= threshold,
        details: scenarioResults.details || {},
      });
    });

    // Mettre à jour le nœud avec les résultats
    return {
      ...scenarioNode,
      data: {
        ...scenarioNode.data,
        simulationResults,
        threshold,
        lastSimulation: new Date().toISOString()
      }
    };
  }

  /**
   * Calcule les résultats de base du processus
   * @param {Object} context - Contexte du processus
   * @param {string} referenceVariable - Variable de référence à évaluer
   * @returns {Object} Résultats de base
   */
  static calculateBaseResults(context, referenceVariable) {
    // Collecter toutes les variables disponibles
    const globalScope = this.collectVariablesFromContext(context);

    // Trouver la valeur de la variable de référence
    const referenceValue = globalScope[referenceVariable] || 0;

    return {
      referenceValue,
      variables: globalScope
    };
  }

  /**
   * Applique les modifications d'un scénario au contexte du processus
   * @param {Object} baseContext - Contexte de base du processus
   * @param {Object} scenario - Scénario à appliquer
   * @returns {Object} Contexte modifié pour le scénario
   */
  static applyScenarioToContext(baseContext, scenario) {
    // Créer une copie profonde du contexte
    const scenarioContext = JSON.parse(JSON.stringify(baseContext));

    // Appliquer les modifications de variables du scénario
    scenario.variables.forEach(variable => {
      // Trouver tous les nœuds qui ont cette variable
      scenarioContext.nodes.forEach(node => {
        if (node.type === 'formula' && Array.isArray(node.data.variables)) {
          // Rechercher la variable dans le nœud
          const nodeVariable = node.data.variables.find(v => v.name === variable.name);
          if (nodeVariable) {
            // Appliquer la modification
            nodeVariable.value = variable.value;
          }
        } else if (node.type === 'task' && Array.isArray(node.data.variables)) {
          // Rechercher la variable dans le nœud de tâche
          const nodeVariable = node.data.variables.find(v => v.name === variable.name);
          if (nodeVariable) {
            // Appliquer la modification
            nodeVariable.value = variable.value;
          }
        }
      });
    });

    return scenarioContext;
  }

  /**
   * Calcule les résultats pour un scénario donné
   * @param {Object} scenarioContext - Contexte modifié pour le scénario
   * @param {string} referenceVariable - Variable de référence à évaluer
   * @returns {Object} Résultats du scénario
   */
  static calculateScenarioResults(scenarioContext, referenceVariable) {
    // Créer une copie des nœuds pour la simulation
    const simulationNodes = JSON.parse(JSON.stringify(scenarioContext.nodes));

    // Exécuter toutes les formules pour recalculer les résultats avec les variables modifiées
    const formulaNodes = simulationNodes.filter(node => node.type === 'formula');

    // Exécuter les formules dans l'ordre (plusieurs passes pour gérer les dépendances)
    for (let pass = 0; pass < 3; pass++) {
      formulaNodes.forEach(formulaNode => {
        const updatedNode = FormulaCalculator.executeFormulaNode(formulaNode, { nodes: simulationNodes });
        // Mettre à jour le nœud dans la liste
        const nodeIndex = simulationNodes.findIndex(node => node.id === formulaNode.id);
        if (nodeIndex !== -1) {
          simulationNodes[nodeIndex] = updatedNode;
        }
      });
    }

    // Collecter toutes les variables après l'exécution
    const globalScope = this.collectVariablesFromContext({ nodes: simulationNodes });

    // Trouver la valeur de la variable de référence
    const referenceValue = globalScope[referenceVariable] || 0;

    return {
      referenceValue,
      variables: globalScope,
      details: {
        simulationNodes
      }
    };
  }

  /**
   * Collecte toutes les variables définies dans le contexte
   * @param {Object} context - Contexte du processus
   * @returns {Object} Toutes les variables disponibles
   */
  static collectVariablesFromContext(context) {
    const variables = {};

    // Parcourir tous les nœuds
    context.nodes.forEach(node => {
      if (node.type === 'formula') {
        // Ajouter les variables des formules
        if (Array.isArray(node.data.variables)) {
          node.data.variables.forEach(variable => {
            const numValue = Number(variable.value);
            variables[variable.name] = isNaN(numValue) ? variable.value : numValue;
          });
        }

        // Ajouter les variables assignées
        if (Array.isArray(node.data.assignedVariables)) {
          node.data.assignedVariables.forEach(variable => {
            const numValue = Number(variable.value);
            variables[variable.name] = isNaN(numValue) ? variable.value : numValue;
          });
        }

        // Ajouter le résultat
        if (node.data.result !== undefined) {
          variables[`${node.id}_result`] = node.data.result;
        }
      } else if (node.type === 'task') {
        // Ajouter les propriétés des tâches
        variables[`${node.id}_duration`] = node.data.duration || 0;
        variables[`${node.id}_cost`] = node.data.cost || 0;

        // Ajouter les variables des tâches
        if (Array.isArray(node.data.variables)) {
          node.data.variables.forEach(variable => {
            const numValue = Number(variable.value);
            variables[variable.name] = isNaN(numValue) ? variable.value : numValue;
          });
        }
      }
    });

    return variables;
  }

  /**
   * Crée un nœud de scénario avec des scénarios prédéfinis pour l'analyse de résilience
   * d'un business model d'ESN
   * @returns {Object} Nœud de scénario prédéfini
   */
  static createDefaultEsnScenarioNode() {
    return {
      id: `scenario-${Date.now()}`,
      type: 'scenario',
      data: {
        label: "Scénarios de stress",
        description: "Tests de résilience du business model",
        threshold: 15, // Seuil de marge minimal pour être considéré comme résilient
        scenarios: [
          {
            name: "Baisse TJM de 10%",
            description: "Simulation d'une pression sur les prix",
            active: true,
            variables: [
              { name: "tjmJunior", value: 495 }, // Baisse de 10% par rapport à 550€
              { name: "tjmSenior", value: 630 }  // Baisse de 10% par rapport à 700€
            ]
          },
          {
            name: "Baisse staffing de 10%",
            description: "Simulation d'une baisse du taux d'occupation",
            active: true,
            variables: [
              { name: "tauxStaffing", value: 0.72 } // Baisse de 10% par rapport à 80%
            ]
          },
          {
            name: "Hausse CJM de 8%",
            description: "Simulation d'une augmentation des salaires",
            active: true,
            variables: [
              { name: "cjmJunior", value: 378 }, // Hausse de 8% par rapport à 350€
              { name: "cjmSenior", value: 486 }  // Hausse de 8% par rapport à 450€
            ]
          },
          {
            name: "Combiné: -5% TJM, -5% staffing",
            description: "Simulation d'un scénario combiné modéré",
            active: true,
            variables: [
              { name: "tjmJunior", value: 522.5 }, // Baisse de 5% 
              { name: "tjmSenior", value: 665 },   // Baisse de 5%
              { name: "tauxStaffing", value: 0.76 } // Baisse de 5%
            ]
          },
          {
            name: "Scénario catastrophe",
            description: "Combinaison de plusieurs facteurs négatifs",
            active: false,
            variables: [
              { name: "tjmJunior", value: 495 },    // Baisse de 10%
              { name: "tjmSenior", value: 630 },    // Baisse de 10%
              { name: "tauxStaffing", value: 0.72 }, // Baisse de 10%
              { name: "cjmJunior", value: 368 },    // Hausse de 5%
              { name: "cjmSenior", value: 473 }     // Hausse de 5%
            ]
          }
        ]
      }
    };
  }
}

export default ScenarioSimulator;