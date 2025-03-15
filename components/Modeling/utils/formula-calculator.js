// components/Modeling/utils/formulaCalculator.js
import { evaluate } from 'mathjs';

/**
 * Service qui permet d'évaluer des formules mathématiques dans le contexte d'un processus
 */
export class FormulaCalculator {
  /**
   * Calcule le résultat d'une ou plusieurs formules
   * @param {string} formulaText - Texte contenant une ou plusieurs formules (séparées par des sauts de ligne)
   * @param {Object} variables - Variables à utiliser dans la formule
   * @param {Object} context - Contexte d'exécution (nœuds précédents, etc.)
   * @returns {Object} Résultat des calculs et variables assignées
   */
  static evaluateFormula(formulaText, variables = {}, context = {}) {
    try {
      // Préparer l'environnement d'évaluation avec les variables initiales
      const scope = {
        ...this.prepareVariables(variables),
        ...this.extractContextVariables(context)
      };
      
      // Diviser le texte en formules individuelles (séparées par des sauts de ligne)
      const formulas = formulaText.split('\n').filter(formula => formula.trim() !== '');
      
      const results = {
        success: true,
        results: [],
        assignedVariables: [],
        allVariables: { ...scope },
        error: null
      };
      
      // Évaluer chaque formule séquentiellement
      for (const formula of formulas) {
        const trimmedFormula = formula.trim();
        
        // Détecter si la formule est une assignation ou simplement une expression
        const isAssignment = trimmedFormula.includes('=');
        
        if (isAssignment) {
          // Si c'est une assignation, évaluer et capturer la variable assignée
          const assignedVariable = trimmedFormula.split('=')[0].trim();
          const result = evaluate(trimmedFormula, results.allVariables);
          
          // Stocker le résultat dans l'environnement pour les formules suivantes
          results.allVariables[assignedVariable] = result;
          
          // Ajouter aux résultats
          results.results.push(result);
          results.assignedVariables.push({
            name: assignedVariable,
            value: result
          });
        } else {
          // Sinon, évaluer simplement l'expression
          const result = evaluate(trimmedFormula, results.allVariables);
          results.results.push(result);
        }
      }
      
      // Pour garantir la compatibilité avec le code existant, on retourne également le premier résultat
      results.result = results.results[0];
      
      return results;
    } catch (error) {
      console.error('Erreur lors de l\'évaluation de la formule:', error);
      return {
        success: false,
        error: error.message,
        results: [],
        assignedVariables: []
      };
    }
  }
  
  /**
   * Prépare les variables pour l'évaluation
   * @param {Array|Object} variables - Variables à préparer
   * @returns {Object} Variables préparées
   */
  static prepareVariables(variables) {
    // Si variables est un tableau d'objets {name, value}
    if (Array.isArray(variables)) {
      return variables.reduce((acc, { name, value }) => {
        // Essayer de convertir la valeur en nombre si possible
        const numValue = Number(value);
        acc[name] = isNaN(numValue) ? value : numValue;
        return acc;
      }, {});
    }
    
    // Si variables est déjà un objet
    return variables;
  }
  
  /**
   * Extrait les variables pertinentes du contexte du processus
   * @param {Object} context - Contexte du processus
   * @returns {Object} Variables extraites
   */
  static extractContextVariables(context) {
    const result = {};
    
    // Extraire les variables des nœuds précédents
    if (context.nodes) {
      context.nodes.forEach(node => {
        if (node.type === 'task') {
          // Pour les tâches, extraire durée et coût
          result[`${node.id}_duration`] = node.data.duration || 0;
          result[`${node.id}_cost`] = node.data.cost || 0;
          
          // Si le nœud a des variables, les extraire aussi
          if (Array.isArray(node.data.variables)) {
            node.data.variables.forEach(variable => {
              const numValue = Number(variable.value);
              result[variable.name] = isNaN(numValue) ? variable.value : numValue;
            });
          }
        } else if (node.type === 'formula') {
          // Pour les formules, extraire le résultat
          if (node.data.result !== undefined) {
            result[`${node.id}_result`] = node.data.result;
          }
          
          // Et les variables définies
          if (node.data.variables) {
            node.data.variables.forEach(variable => {
              const numValue = Number(variable.value);
              result[variable.name] = isNaN(numValue) ? variable.value : numValue;
            });
          }
          
          // AMÉLIORATION: Extraire aussi les variables assignées pour les rendre disponibles
          if (node.data.assignedVariables) {
            node.data.assignedVariables.forEach(variable => {
              const numValue = Number(variable.value);
              result[variable.name] = isNaN(numValue) ? variable.value : numValue;
            });
          }
        }
      });
    }
    
    // Ajouter des fonctions d'agrégation et des utilitaires
    result.sum = (arr) => arr.reduce((a, b) => a + b, 0);
    result.avg = (arr) => arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
    result.min = Math.min;
    result.max = Math.max;
    result.round = (val, decimals = 0) => Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
    
    // Fonctions pour les calculs financiers
    result.roi = (profit, investment) => (profit / investment) * 100;
    result.cagr = (endValue, startValue, years) => 
      (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
    result.npv = (rate, cashflows) => {
      return cashflows.reduce((acc, cf, index) => 
        acc + cf / Math.pow(1 + rate, index), 0
      );
    };
    
    return result;
  }
  
  /**
   * Exécute un nœud de formule dans le contexte du processus
   * @param {Object} formulaNode - Nœud de formule à exécuter
   * @param {Object} processContext - Contexte complet du processus
   * @returns {Object} Nœud de formule mis à jour avec le résultat
   */
  static executeFormulaNode(formulaNode, processContext) {
    const formula = formulaNode.data.formula;
    const variables = formulaNode.data.variables || [];
    
    // Évaluer la formule
    const result = this.evaluateFormula(formula, variables, processContext);
    
    if (result.success) {
      // AMÉLIORATION: Extraire automatiquement les variables assignées 
      // et les ajouter aux variables du nœud
      const existingVariableNames = new Set(variables.map(v => v.name));
      const newVariables = [...variables];
      
      // Ajouter uniquement les nouvelles variables assignées
      result.assignedVariables.forEach(assignedVar => {
        if (!existingVariableNames.has(assignedVar.name)) {
          newVariables.push(assignedVar);
          existingVariableNames.add(assignedVar.name);
        } else {
          // Mettre à jour la valeur d'une variable existante
          const existingVar = newVariables.find(v => v.name === assignedVar.name);
          if (existingVar) {
            existingVar.value = assignedVar.value;
          }
        }
      });
      
      // Mettre à jour le nœud avec le résultat et les variables assignées
      return {
        ...formulaNode,
        data: {
          ...formulaNode.data,
          result: result.results[0], // Le premier résultat est stocké comme le résultat principal
          results: result.results,   // Tous les résultats sont stockés dans un tableau
          variables: newVariables,   // Liste mise à jour des variables incluant celles assignées
          assignedVariables: result.assignedVariables, // Variables assignées par la formule
          error: null,
          lastCalculation: new Date().toISOString()
        }
      };
    } else {
      // En cas d'erreur
      return {
        ...formulaNode,
        data: {
          ...formulaNode.data,
          result: 'Erreur',
          error: result.error,
          lastCalculation: new Date().toISOString()
        }
      };
    }
  }
}

export default FormulaCalculator;