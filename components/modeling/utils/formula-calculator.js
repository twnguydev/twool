// components/Modeling/utils/formulaCalculator.js
import { evaluate } from 'mathjs';

/**
 * Service qui permet d'évaluer des formules mathématiques dans le contexte d'un processus
 * avec gestion robuste des termes composés comme "Postes à pourvoir"
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
        error: null,
        // Mapping global des variables pour traduire entre les noms avec et sans espaces
        variableMapping: {},
        // Valeurs courantes de toutes les variables pour le débogage
        currentValues: {}
      };
      
      // Identifier d'abord tous les termes composés dans l'ensemble des formules
      const composedTerms = this.identifyComposedTerms(formulas);
      
      // Évaluer chaque formule séquentiellement
      for (const formula of formulas) {
        const trimmedFormula = formula.trim();
        
        try {
          // Préprocesser la formule avec les termes composés identifiés
          const { processedFormula, variableMap } = this.preprocessFormula(
            trimmedFormula,
            results.variableMapping,
            composedTerms
          );
          
          console.log(`Prétraitement: "${trimmedFormula}" -> "${processedFormula}"`);
          
          // Fusionner les mappings de variables
          results.variableMapping = { ...results.variableMapping, ...variableMap };
          
          // Préparer le scope pour mathjs
          const evaluationScope = { ...results.allVariables };
          
          // Vérifier les variables sanitizées et les ajouter à l'environnement
          Object.entries(results.variableMapping).forEach(([original, sanitized]) => {
            if (evaluationScope[original] !== undefined) {
              evaluationScope[sanitized] = evaluationScope[original];
            } else if (evaluationScope[sanitized] !== undefined) {
              evaluationScope[original] = evaluationScope[sanitized];
            }
          });
          
          // Pour débogage
          results.currentValues = { ...evaluationScope };
          
          // Détecter si la formule est une assignation
          const isAssignment = processedFormula.includes('=');
          
          if (isAssignment) {
            // Extraire la variable assignée et l'expression
            const [sanitizedVariable, expression] = processedFormula.split('=').map(part => part.trim());
            
            try {
              // Évaluer l'expression avec mathjs
              const result = evaluate(processedFormula, evaluationScope);
              
              // Déterminer le nom de variable original
              const originalVariable = this.getOriginalVariableName(
                sanitizedVariable,
                results.variableMapping
              ) || sanitizedVariable;
              
              // Stocker les résultats dans l'environnement pour les formules suivantes
              results.allVariables[originalVariable] = result;
              results.allVariables[sanitizedVariable] = result;
              
              // Ajouter aux résultats
              results.results.push(result);
              results.assignedVariables.push({
                name: originalVariable,
                value: result
              });
              
            } catch (evalError) {
              // Essayer de déterminer quelle variable est indéfinie
              const undefinedMatch = evalError.message.match(/Undefined symbol (.+)/);
              if (undefinedMatch) {
                const undefinedVar = undefinedMatch[1];
                const mappedVars = Object.entries(results.variableMapping).map(([k, v]) => ({ original: k, sanitized: v }));
                
                console.error(`Variable non définie: ${undefinedVar}`);
                console.error(`Variables disponibles:`, Object.keys(evaluationScope));
                console.error(`Mapping de variables:`, mappedVars);
                
                // Essayer de trouver le problème
                const potentialMatches = mappedVars.filter(v => 
                  v.sanitized.includes(undefinedVar) || 
                  v.original.includes(undefinedVar)
                );
                
                if (potentialMatches.length > 0) {
                  console.error(`Correspondances potentielles pour ${undefinedVar}:`, potentialMatches);
                }
              }
              throw evalError;
            }
          } else {
            // Pour une simple expression sans assignation
            const result = evaluate(processedFormula, evaluationScope);
            results.results.push(result);
          }
        } catch (error) {
          console.error(`Erreur sur la formule "${trimmedFormula}":`, error);
          throw new Error(`Erreur sur la formule "${trimmedFormula}": ${error.message}`);
        }
      }
      
      // Pour garantir la compatibilité avec le code existant
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
   * Identifie les termes composés (avec espaces) dans un ensemble de formules
   * @param {Array<string>} formulas - Tableau de formules à analyser
   * @returns {Array<string>} - Tableau de termes composés identifiés, triés par longueur décroissante
   */
  static identifyComposedTerms(formulas) {
    // Regex qui détecte les termes composés comme "Postes à pourvoir"
    const composedTermRegex = /\b([a-zA-Z][a-zA-Z0-9]*(?:\s+(?:à|de|des|en|du|pour|par|avec|et|sur|dans|sans|entre)\s+[a-zA-Z][a-zA-Z0-9]*)+)\b/gi;
    
    const composedTerms = new Set();
    
    // Parcourir chaque formule
    formulas.forEach(formula => {
      let match;
      // Réinitialiser le regex pour chaque formule
      const regex = new RegExp(composedTermRegex);
      
      // Collecter tous les termes composés
      while ((match = regex.exec(formula)) !== null) {
        composedTerms.add(match[0]);
      }
    });
    
    // Convertir en tableau et trier par longueur décroissante
    return Array.from(composedTerms).sort((a, b) => b.length - a.length);
  }
  
  /**
   * Préprocesse une formule pour gérer les espaces dans les noms de variables
   * @param {string} formula - Texte de la formule à préprocesser
   * @param {Object} existingVars - Mapping existant des variables
   * @param {Array<string>} composedTerms - Termes composés identifiés
   * @returns {Object} Formule préprocessée et mapping des variables
   */
  static preprocessFormula(formula, existingVars = {}, composedTerms = []) {
    if (!formula || typeof formula !== 'string') {
      return { processedFormula: '', variableMap: {} };
    }
    
    // Étape 1: Détecter si c'est une assignation
    const assignmentIndex = formula.indexOf('=');
    if (assignmentIndex === -1) {
      return { processedFormula: formula.trim(), variableMap: {} };
    }
    
    // Étape 2: Extraire les parties gauche et droite
    const leftSide = formula.substring(0, assignmentIndex).trim();
    const rightSide = formula.substring(assignmentIndex + 1).trim();
    
    // Étape 3: Créer un dictionnaire de mappage pour les variables avec espaces
    const variableMap = { ...existingVars };
    
    // Fonction pour sanitizer les noms de variables (remplacer espaces par underscores)
    function sanitizeVariableName(name) {
      return name.replace(/\s+/g, '_');
    }
    
    // D'abord traiter les termes composés identifiés
    composedTerms.forEach(term => {
      if (!variableMap[term]) {
        variableMap[term] = sanitizeVariableName(term);
      }
    });
    
    // Ensuite traiter les variables simples avec espaces
    function extractSimpleVariables(text) {
      // Extraire les variables simples (mots séparés par des espaces)
      const simpleVarRegex = /\b([a-zA-Z][a-zA-Z0-9]*(?:\s+[a-zA-Z][a-zA-Z0-9]*)*)\b/g;
      
      let match;
      while ((match = simpleVarRegex.exec(text)) !== null) {
        const term = match[0].trim();
        // Ne pas traiter les termes déjà identifiés comme composés
        if (term.includes(' ') && !composedTerms.includes(term) && !variableMap[term]) {
          variableMap[term] = sanitizeVariableName(term);
        }
      }
    }
    
    // Extraire les variables simples de chaque côté
    extractSimpleVariables(leftSide);
    extractSimpleVariables(rightSide);
    
    // Étape 4: Remplacer les variables avec espaces par leur version sanitizée
    let processedLeftSide = leftSide;
    let processedRightSide = rightSide;
    
    // Remplacer dans l'ordre de longueur décroissante pour éviter les remplacements partiels
    const sortedVarNames = Object.keys(variableMap).sort((a, b) => b.length - a.length);
    
    for (const original of sortedVarNames) {
      const sanitized = variableMap[original];
      
      // Utiliser une regex pour remplacer uniquement les mots entiers
      const regex = new RegExp(`\\b${FormulaCalculator.escapeRegExp(original)}\\b`, 'g');
      
      processedLeftSide = processedLeftSide.replace(regex, sanitized);
      processedRightSide = processedRightSide.replace(regex, sanitized);
    }
    
    // Traitement spécial pour "Postes à pourvoir" qui peut être mal détecté
    if (rightSide.includes("Postes à pourvoir") && processedRightSide.includes("Postes à pourvoir")) {
      // Si le terme n'a pas été correctement remplacé, forcer un remplacement direct
      processedRightSide = processedRightSide.replace(/Postes à pourvoir/g, "Postes_à_pourvoir");
      variableMap["Postes à pourvoir"] = "Postes_à_pourvoir";
    }
    
    // Étape 5: Normaliser les opérateurs dans la partie droite
    const operators = ['+', '-', '*', '/', '^', '%'];
    
    operators.forEach(op => {
      // Créer une regex qui trouve l'opérateur sans espaces
      const regex = new RegExp(`([a-zA-Z0-9_\\.\\)\\]])\\${op}([a-zA-Z0-9_\\.\\(\\[])`);
      
      // Tant qu'il y a des correspondances, les remplacer
      while (regex.test(processedRightSide)) {
        processedRightSide = processedRightSide.replace(regex, `$1 ${op} $2`);
      }
    });
    
    // Assembler la formule finale
    const processedFormula = `${processedLeftSide} = ${processedRightSide}`;
    
    return {
      processedFormula,
      variableMap
    };
  }
  
  /**
   * Échapper les caractères spéciaux pour une utilisation dans des regex
   * @param {string} string - Chaîne à échapper
   * @returns {string} - Chaîne échappée
   */
  static escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  /**
   * Récupère le nom de variable original à partir du nom sanitizé
   * @param {string} sanitizedName - Nom de variable sanitizé
   * @param {Object} variableMap - Mapping des variables
   * @returns {string} Nom de variable original ou null si non trouvé
   */
  static getOriginalVariableName(sanitizedName, variableMap) {
    // Créer un mapping inverse (sanitized -> original)
    for (const [original, sanitized] of Object.entries(variableMap)) {
      if (sanitized === sanitizedName) {
        return original;
      }
    }
    return null;
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
    
    // Mapping pour garder une trace des variables avec espaces
    const variableMapping = {};
    
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
              
              // Si le nom contient des espaces, ajouter aussi une version sans espaces
              if (variable.name.includes(' ')) {
                const sanitizedName = variable.name.replace(/\s+/g, '_');
                result[sanitizedName] = result[variable.name];
                variableMapping[variable.name] = sanitizedName;
              }
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
              
              // Si le nom contient des espaces, ajouter aussi une version sans espaces
              if (variable.name.includes(' ')) {
                const sanitizedName = variable.name.replace(/\s+/g, '_');
                result[sanitizedName] = result[variable.name];
                variableMapping[variable.name] = sanitizedName;
              }
            });
          }
          
          // Extraire aussi les variables assignées pour les rendre disponibles
          if (node.data.assignedVariables) {
            node.data.assignedVariables.forEach(variable => {
              const numValue = Number(variable.value);
              result[variable.name] = isNaN(numValue) ? variable.value : numValue;
              
              // Si le nom contient des espaces, ajouter aussi une version sans espaces
              if (variable.name.includes(' ')) {
                const sanitizedName = variable.name.replace(/\s+/g, '_');
                result[sanitizedName] = result[variable.name];
                variableMapping[variable.name] = sanitizedName;
              }
            });
          }
          
          // Si le nœud a un mapping de variables, l'incorporer
          if (node.data.variableMapping) {
            Object.assign(variableMapping, node.data.variableMapping);
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
    
    // Ajouter le mapping de variables au résultat
    result.__variableMapping = variableMapping;
    
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
    
    // Récupérer le mapping de variables du contexte s'il existe
    const contextVariables = this.extractContextVariables(processContext);
    const existingMapping = contextVariables.__variableMapping || {};
    delete contextVariables.__variableMapping;
    
    // Évaluer la formule avec le mapping existant
    const result = this.evaluateFormula(formula, variables, processContext);
    
    if (result.success) {
      // Extraire automatiquement les variables assignées 
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
          variableMapping: result.variableMapping, // Mapping des variables avec espaces
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