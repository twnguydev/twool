from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import os
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv
from app.models.flow_ia_analysis import FlowIAAnalysis
from app.services.database import DatabaseService

# Charger les variables d'environnement
load_dotenv()

class FlowIAService:
    """Service pour gérer les opérations d'analyse de workflow par IA"""
    
    def __init__(self):
        """Initialise le service FlowIA"""
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = "gpt-4o"
        self.prompts_dir = Path("app/services/prompts")
        
        # Créer le répertoire des prompts s'il n'existe pas
        self.prompts_dir.mkdir(parents=True, exist_ok=True)
        
        # S'assurer que les fichiers de prompts existent
        self._ensure_prompt_files()
    
    def _ensure_prompt_files(self):
        """Vérifie que les fichiers de prompts existent et les crée si nécessaire"""
        system_prompt_path = self.prompts_dir / "system-prompt-gpt4o.md"
        user_prompt_path = self.prompts_dir / "user-prompt-gpt4o.md"
        
        if not system_prompt_path.exists():
            with open(system_prompt_path, "w", encoding="utf-8") as f:
                f.write("""Tu es WF-Optimizer, une intelligence artificielle spécialisée en analyse, optimisation et simulation de workflows d'entreprise. Ta mission est d'examiner méticuleusement des workflows structurés en graphes pour identifier des opportunités d'amélioration tangibles en te basant exclusivement sur les données fournies. Tu excelles dans l'analyse de modèles économiques, la détection de goulots d'étranglement, et la simulation de scénarios alternatifs. Ne fais aucune supposition externe et évite les généralisations non justifiées. Tu dois comprendre les relations entre les nœuds (formules, décisions, événements, scénarios), les variables utilisées et les flux logiques. Réponds uniquement en JSON structuré.""")
        
        if not user_prompt_path.exists():
            with open(user_prompt_path, "w", encoding="utf-8") as f:
                f.write("""Analyse le workflow suivant qui représente un modèle économique avec calculs de coûts, marges et tests de résilience. Identifie des optimisations concrètes et réalistes. Ta réponse doit être un JSON structuré avec les clés suivantes :

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

Données du workflow : {workflow_data}""")
    
    def _load_prompt(self, filename):
        """Charge un prompt depuis un fichier"""
        with open(self.prompts_dir / filename, "r", encoding="utf-8") as file:
            return file.read()
    
    async def analyze_workflow(self, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyse un workflow à l'aide de GPT-4o et renvoie des suggestions d'optimisation
        
        Args:
            workflow_data: Données du workflow à analyser
            
        Returns:
            Dict contenant l'analyse et les suggestions d'optimisation
        """
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY n'est pas définie dans les variables d'environnement")
        
        # Chargement des prompts
        system_prompt = self._load_prompt("system-prompt-gpt4o.md")
        user_prompt = self._load_prompt("user-prompt-gpt4o.md")
        
        # Formatage du prompt utilisateur avec les données du workflow
        formatted_user_prompt = user_prompt.replace("{workflow_data}", json.dumps(workflow_data))
        
        # Appel à l'API OpenAI
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": formatted_user_prompt}
                    ],
                    "temperature": 0.2  # Valeur basse pour des réponses plus cohérentes et précises
                },
                timeout=60.0  # Timeout plus long pour les workflows complexes
            )
        
        # Vérification de la réponse
        if response.status_code != 200:
            raise Exception(f"Erreur API OpenAI: {response.status_code} - {response.text}")
        
        result = response.json()
        analysis_text = result["choices"][0]["message"]["content"]
        
        # Parse la réponse JSON
        try:
            analysis_json = json.loads(analysis_text)
            return analysis_json
        except json.JSONDecodeError:
            # Fallback en cas d'échec du parsing JSON
            return {
                "error": "La réponse n'est pas au format JSON valide",
                "raw_response": analysis_text,
                "confidence_score": 0
            }
    
    @staticmethod
    def create_analysis(db: Session, process_id: str, analysis_data: Dict[str, Any]) -> FlowIAAnalysis:
        """
        Crée une nouvelle analyse FlowIA dans la base de données
        
        Args:
            db: Session SQLAlchemy
            process_id: ID du processus analysé
            analysis_data: Données d'analyse
            
        Returns:
            L'analyse créée
        """
        data = {
            'process_id': process_id,
            'model_analysis': analysis_data.get('model_analysis'),
            'flow_analysis': analysis_data.get('flow_analysis'),
            'critical_variables': analysis_data.get('critical_variables'),
            'bottlenecks': analysis_data.get('bottlenecks'),
            'optimizations': analysis_data.get('optimizations'),
            'alternative_scenarios': analysis_data.get('alternative_scenarios'),
            'resilience_assessment': analysis_data.get('resilience_assessment'),
            'confidence_score': analysis_data.get('confidence_score'),
            'visualization_suggestions': analysis_data.get('visualization_suggestions')
        }
        
        if 'error' in analysis_data:
            data['error_message'] = analysis_data.get('error')
        
        return DatabaseService.create(db, FlowIAAnalysis, data)
    
    @staticmethod
    def get_analysis(db: Session, analysis_id: str) -> Optional[FlowIAAnalysis]:
        """
        Récupère une analyse par son ID
        
        Args:
            db: Session SQLAlchemy
            analysis_id: ID de l'analyse
            
        Returns:
            L'analyse trouvée ou None
        """
        return DatabaseService.get_by_id(db, FlowIAAnalysis, analysis_id)
    
    @staticmethod
    def get_analyses_by_process(db: Session, process_id: str, skip: int = 0, limit: int = 100) -> List[FlowIAAnalysis]:
        """
        Récupère toutes les analyses pour un processus donné
        
        Args:
            db: Session SQLAlchemy
            process_id: ID du processus
            skip: Nombre d'éléments à ignorer
            limit: Nombre maximum d'éléments à récupérer
            
        Returns:
            Liste des analyses
        """
        filters = {'process_id': process_id}
        return DatabaseService.get_all(db, FlowIAAnalysis, skip, limit, filters)
    
    @staticmethod
    def delete_analysis(db: Session, analysis_id: str) -> bool:
        """
        Supprime une analyse
        
        Args:
            db: Session SQLAlchemy
            analysis_id: ID de l'analyse à supprimer
            
        Returns:
            True si suppression réussie, False sinon
        """
        analysis = FlowIAService.get_analysis(db, analysis_id)
        if analysis:
            return DatabaseService.delete(db, analysis)
        return False
    
    @staticmethod
    def analysis_to_dict(analysis: FlowIAAnalysis) -> Dict[str, Any]:
        """
        Convertit une analyse en dictionnaire
        
        Args:
            analysis: Analyse à convertir
            
        Returns:
            Dictionnaire représentant l'analyse
        """
        return DatabaseService.to_dict(analysis)