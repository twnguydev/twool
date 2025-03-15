// components/Modeling/utils/businessFormulaExamples.js
/**
 * Exemples de formules pour la modélisation de business
 * Ces exemples peuvent être utilisés comme templates dans l'interface
 */
export const businessFormulaExamples = [
  {
    category: "Rentabilité",
    formulas: [
      {
        name: "Marge brute",
        formula: "margeBrute = revenu - coutDirect",
        description: "Calcule la marge brute en soustrayant les coûts directs du revenu",
        variables: [
          { name: "revenu", value: 100000 },
          { name: "coutDirect", value: 60000 }
        ]
      },
      {
        name: "Marge nette",
        formula: "margeNette = (revenu - coutTotal) / revenu * 100",
        description: "Calcule la marge nette en pourcentage",
        variables: [
          { name: "revenu", value: 100000 },
          { name: "coutTotal", value: 85000 }
        ]
      },
      {
        name: "ROI (Retour sur investissement)",
        formula: "roi = (profit / investissement) * 100",
        description: "Calcule le retour sur investissement en pourcentage",
        variables: [
          { name: "profit", value: 20000 },
          { name: "investissement", value: 100000 }
        ]
      }
    ]
  },
  {
    category: "Tarification",
    formulas: [
      {
        name: "Taux Journalier Moyen (TJM)",
        formula: "tjm = revenusAnnuels / joursFacturables",
        description: "Calcule le TJM en divisant les revenus annuels par le nombre de jours facturables",
        variables: [
          { name: "revenusAnnuels", value: 120000 },
          { name: "joursFacturables", value: 200 }
        ]
      },
      {
        name: "Prix de vente",
        formula: "prixVente = coutUnitaire / (1 - margeVoulue)",
        description: "Calcule le prix de vente en fonction du coût unitaire et de la marge voulue",
        variables: [
          { name: "coutUnitaire", value: 50 },
          { name: "margeVoulue", value: 0.3 } // 30%
        ]
      },
      {
        name: "Coût Journalier Moyen (CJM)",
        formula: "cjm = coutAnnuel / joursOuvres",
        description: "Calcule le coût journalier moyen d'un employé",
        variables: [
          { name: "coutAnnuel", value: 80000 }, // Salaire + charges
          { name: "joursOuvres", value: 220 }
        ]
      }
    ]
  },
  {
    category: "Résilience",
    formulas: [
      {
        name: "Point Mort",
        formula: "pointMort = chargesFixesAnnuelles / tauxMargeContribution",
        description: "Calcule le point mort (seuil de rentabilité)",
        variables: [
          { name: "chargesFixesAnnuelles", value: 150000 },
          { name: "tauxMargeContribution", value: 0.35 } // 35%
        ]
      },
      {
        name: "Runway",
        formula: "runway = tresorerie / burnRate",
        description: "Calcule le nombre de mois avant épuisement de la trésorerie",
        variables: [
          { name: "tresorerie", value: 300000 },
          { name: "burnRate", value: 50000 } // Par mois
        ]
      },
      {
        name: "Ratio de diversification clients",
        formula: "ratioDiversification = 1 - (CA_PlusGrosClient / CA_Total)",
        description: "Mesure la dépendance au plus gros client (0 = total dépendant, 1 = parfaitement diversifié)",
        variables: [
          { name: "CA_PlusGrosClient", value: 200000 },
          { name: "CA_Total", value: 500000 }
        ]
      }
    ]
  },
  {
    category: "Croissance",
    formulas: [
      {
        name: "Taux de croissance annuel",
        formula: "tauxCroissance = ((revenueAnnee2 / revenueAnnee1) - 1) * 100",
        description: "Calcule le taux de croissance annuel en pourcentage",
        variables: [
          { name: "revenueAnnee1", value: 500000 },
          { name: "revenueAnnee2", value: 650000 }
        ]
      },
      {
        name: "CAGR (Taux de Croissance Annuel Composé)",
        formula: "cagr = (Math.pow(valeurFinale / valeurInitiale, 1 / nombreAnnees) - 1) * 100",
        description: "Calcule le taux de croissance annuel composé sur plusieurs années",
        variables: [
          { name: "valeurInitiale", value: 100000 },
          { name: "valeurFinale", value: 161051 },
          { name: "nombreAnnees", value: 5 }
        ]
      },
      {
        name: "Ratio client-employé",
        formula: "ratioClientEmploye = nombreClients / nombreEmployes",
        description: "Mesure l'efficacité opérationnelle par employé",
        variables: [
          { name: "nombreClients", value: 120 },
          { name: "nombreEmployes", value: 15 }
        ]
      }
    ]
  },
  {
    category: "Clients",
    formulas: [
      {
        name: "Coût d'acquisition client (CAC)",
        formula: "cac = depensesMarketing / nouveauxClients",
        description: "Calcule le coût moyen d'acquisition d'un nouveau client",
        variables: [
          { name: "depensesMarketing", value: 50000 },
          { name: "nouveauxClients", value: 100 }
        ]
      },
      {
        name: "Valeur vie client (CLV)",
        formula: "clv = revenueAnnuelMoyen * dureeRelationClient * margeNette",
        description: "Estime la valeur totale qu'un client génère pendant sa relation avec l'entreprise",
        variables: [
          { name: "revenueAnnuelMoyen", value: 2000 },
          { name: "dureeRelationClient", value: 3 }, // années
          { name: "margeNette", value: 0.2 } // 20%
        ]
      },
      {
        name: "Ratio CLV:CAC",
        formula: "ratioClvCac = clv / cac",
        description: "Compare la valeur vie client au coût d'acquisition (idéalement > 3)",
        variables: [
          { name: "clv", value: 1200 },
          { name: "cac", value: 400 }
        ]
      }
    ]
  },
  {
    category: "Financier",
    formulas: [
      {
        name: "Valeur Actuelle Nette (VAN)",
        formula: "van = investissementInitial + sum(cashFlows.map((cf, i) => cf / Math.pow(1 + tauxActualisation, i + 1)))",
        description: "Calcule la valeur actuelle des flux de trésorerie futurs",
        variables: [
          { name: "investissementInitial", value: -100000 },
          { name: "cashFlows", value: [30000, 40000, 50000, 40000] },
          { name: "tauxActualisation", value: 0.1 } // 10%
        ]
      },
      {
        name: "Ratio d'endettement",
        formula: "ratioEndettement = detteTotal / capitauxPropres",
        description: "Mesure la proportion de dette par rapport aux fonds propres",
        variables: [
          { name: "detteTotal", value: 200000 },
          { name: "capitauxPropres", value: 500000 }
        ]
      },
      {
        name: "Besoin en fonds de roulement (BFR)",
        formula: "bfr = (stockMoyen + creancesClients) - dettesFournisseurs",
        description: "Calcule le besoin en financement du cycle d'exploitation",
        variables: [
          { name: "stockMoyen", value: 50000 },
          { name: "creancesClients", value: 80000 },
          { name: "dettesFournisseurs", value: 40000 }
        ]
      }
    ]
  },
  {
    category: "Productivité",
    formulas: [
      {
        name: "Chiffre d'affaires par employé",
        formula: "caParEmploye = chiffreAffairesTotal / nombreEmployes",
        description: "Mesure la productivité globale de l'entreprise",
        variables: [
          { name: "chiffreAffairesTotal", value: 1200000 },
          { name: "nombreEmployes", value: 15 }
        ]
      },
      {
        name: "Taux d'utilisation des ressources",
        formula: "tauxUtilisation = (heuresBillables / heuresDisponibles) * 100",
        description: "Mesure l'efficacité de l'utilisation des ressources humaines",
        variables: [
          { name: "heuresBillables", value: 1600 },
          { name: "heuresDisponibles", value: 2000 }
        ]
      },
      {
        name: "Délai de conversion (Lead Time)",
        formula: "leadTime = tempsProduction + tempsAttente + tempsTransport",
        description: "Calcule le temps total nécessaire pour livrer un produit/service",
        variables: [
          { name: "tempsProduction", value: 5 }, // jours
          { name: "tempsAttente", value: 3 }, // jours
          { name: "tempsTransport", value: 2 } // jours
        ]
      }
    ]
  }
];

export default businessFormulaExamples;