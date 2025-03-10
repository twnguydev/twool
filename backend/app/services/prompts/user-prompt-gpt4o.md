Analyse le workflow suivant qui représente un modèle économique avec calculs de coûts, marges et tests de résilience. Identifie des optimisations concrètes et réalistes. Ta réponse doit être un JSON structuré avec les clés suivantes :

1. 'model_analysis': Synthèse du modèle économique détecté (variables clés, formules et leur signification, seuils critiques)

2. 'flow_analysis': Analyse de la structure du workflow (séquences, branches conditionnelles, boucles potentielles)

3. 'critical_variables': Variables ayant le plus d'impact sur les résultats, classées par ordre d'importance avec justification

4. 'bottlenecks': Points de blocage ou risques identifiés, avec impact estimé et priorité (haute/moyenne/basse)

5. 'optimizations': Liste d'améliorations possibles, chacune avec:
   - 'description': Description détaillée
   - 'impact_estimate': Impact estimé (quantitatif si possible)
   - 'implementation_complexity': Complexité de mise en œuvre (haute/moyenne/basse)
   - 'priority': Priorité recommandée

6. 'alternative_scenarios': Propositions de scénarios alternatifs ou complémentaires aux tests de stress existants

7. 'resilience_assessment': Évaluation de la résilience du modèle selon les simulations existantes

8. 'confidence_score': Score de confiance de tes recommandations (0-1) avec justification

9. 'visualization_suggestions': Suggestions pour améliorer la visualisation ou la structure du workflow

Données du workflow : {workflow_data}