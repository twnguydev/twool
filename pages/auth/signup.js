import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApi } from '../../hooks/useApi';

export default function Signup() {
  const router = useRouter();
  const { auth } = useApi();

  // États pour les étapes d'inscription
  const [step, setStep] = useState(1);

  // États pour le formulaire d'informations personnelles
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // État pour le choix d'abonnement
  const [subscriptionChoice, setSubscriptionChoice] = useState(null);
  const [subscriptionType, setSubscriptionType] = useState('monthly');

  // État pour l'activation de licence
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseKeys, setLicenseKeys] = useState(['', '', '', '', '', '']);

  const getLicenseKey = () => {
    return `${licenseKeys.join('-')}`;
  };

  // Gestion des erreurs
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options d'abonnement
  const subscriptions = [
    {
      id: 'solo',
      name: 'Solo',
      description: 'Pour les indépendants et consultants',
      priceMonthly: 29,
      priceAnnually: 290,
      features: [
        '3 workflows maximum',
        'Stockage limité à 500 Mo',
        'Fonctionnalités d\'IA de base',
        'Support par email',
      ]
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Pour les PME et équipes',
      priceMonthly: 99,
      priceAnnually: 990,
      features: [
        'Workflows illimités',
        'Stockage de 5 Go',
        'Toutes les fonctionnalités d\'IA',
        'Support prioritaire',
        'Partage d\'équipe (5 utilisateurs)',
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Pour les grandes organisations',
      priceMonthly: 249,
      priceAnnually: 2490,
      features: [
        'Workflows illimités',
        'Stockage illimité',
        'Fonctionnalités d\'IA avancées',
        'Support dédié 24/7',
        'Utilisateurs illimités',
        'SSO et intégrations personnalisées',
      ]
    }
  ];

  // Validation du formulaire d'inscription
  const validatePersonalInfo = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!lastName.trim()) newErrors.lastName = "Le nom est requis";

    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 8) {
      newErrors.password = "Le mot de passe doit comporter au moins 8 caractères";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation de la clé de licence
  const validateLicense = () => {
    const newErrors = {};

    if (licenseKeys.some(part => part.trim() === '')) {
      newErrors.licenseKey = "La clé de licence est requise";
    } else if (licenseKeys.some(part => part.length !== 4)) {
      newErrors.licenseKey = "Format de clé de licence invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLicenseKeyChange = (index, value) => {
    const newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    const newLicenseKeys = [...licenseKeys];
    newLicenseKeys[index] = newValue;
    setLicenseKeys(newLicenseKeys);

    // Auto-focus sur le champ suivant si celui-ci est rempli
    if (newValue.length === 4 && index < 5) {
      document.getElementById(`licenseKey-${index + 1}`).focus();
    }
  };

  // Soumission de l'étape 1 (informations personnelles)
  const handleSubmitPersonalInfo = (e) => {
    e.preventDefault();

    if (validatePersonalInfo()) {
      setStep(2);
    }
  };

  const handleSubmitLicensePurchase = (e) => {
    e.preventDefault();

    handleCompleteSignup();
  };

  // Soumission finale modifiée
  const handleCompleteSignup = async (licenseKeyValue = null) => {
    setIsSubmitting(true);

    try {
      // 1. Créer le compte utilisateur (inscription standard)
      const userData = {
          email,
          password,
          firstName,
          lastName,
      };

      let response;

      if (subscriptionChoice) {
        // Inscription avec abonnement
        const subscriptionData = {
          type: subscriptionType,
          tier: subscriptionChoice,
          paymentProvider: 'stripe',
          paymentId: 'placeholder'
        };

        response = await auth.registerWithSubscription(userData, subscriptionData);
      } else if (licenseKeyValue) {
        userData.license_key = licenseKeyValue;
        response = await auth.register(userData);
      } else {
        // Inscription standard
        response = await auth.register(userData);
      }

      // Stocker les informations d'authentification
      localStorage.setItem('twool_auth', JSON.stringify({
        token: response.token,
        user: response.user
      }));

      // Redirection vers la page de confirmation ou dashboard
      router.push('/signup-success');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setErrors({ submit: error.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Soumission de l'abonnement
  const handleSubmitSubscription = (e) => {
    e.preventDefault();
    handleCompleteSignup();
  };

  // Soumission de la licence
  const handleSubmitLicense = (e) => {
    e.preventDefault();

    if (validateLicense()) {
      const fullLicenseKey = getLicenseKey();
      handleCompleteSignup(fullLicenseKey);
    }
  };

  // Fonction pour revenir à l'étape précédente
  const handleBack = () => {
    if (step >= 3 && step <= 5) {
      setStep(2);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  // Formatage du prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Rendu de la phase 1 : Informations personnelles
  const renderPersonalInfo = () => (
    <form onSubmit={handleSubmitPersonalInfo} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Adresse email
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Link href="/auth/login">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </button>
          </Link>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continuer
          </button>
        </div>
      </div>
    </form>
  );

  // Rendu de la phase 2 : Choix du mode d'accès
  // Rendu de la phase 2 : Choix du mode d'accès (modifié pour inclure l'achat de licence)
  const renderAccessChoice = () => (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          <li>
            <button
              onClick={() => setStep(3)}
              className="w-full block hover:bg-gray-50 transition-colors"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-indigo-600">Souscrire à un abonnement</div>
                      <div className="text-sm text-gray-500">Choisissez un abonnement mensuel ou annuel</div>
                    </div>
                  </div>
                  <div>
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => setStep(4)}
              className="w-full block hover:bg-gray-50 transition-colors"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                      <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-green-600">J'ai déjà une clé de licence</div>
                      <div className="text-sm text-gray-500">Activez votre licence pour accéder à Twool Labs</div>
                    </div>
                  </div>
                  <div>
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </li>
          {/* Nouvelle option: Acheter une licence */}
          <li>
            <button
              onClick={() => setStep(5)}
              className="w-full block hover:bg-gray-50 transition-colors"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                      <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue-600">Acheter une licence</div>
                      <div className="text-sm text-gray-500">Procéder à l'achat d'une licence pour accéder à Twool Labs</div>
                    </div>
                  </div>
                  <div>
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </li>
        </ul>
      </div>

      <div className="pt-5">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={handleBack}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );

  // Rendu de la phase 3 : Choix de l'abonnement
  const renderSubscriptionChoice = () => (
    <form onSubmit={handleSubmitSubscription} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Choisissez votre formule</h3>

          <div className="flex items-center">
            <span className={`mr-3 text-sm ${subscriptionType === 'monthly' ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
              Mensuel
            </span>
            <button
              type="button"
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${subscriptionType === 'annual' ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              onClick={() => setSubscriptionType(subscriptionType === 'monthly' ? 'annual' : 'monthly')}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${subscriptionType === 'annual' ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
            <span className={`ml-3 text-sm ${subscriptionType === 'annual' ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
              Annuel <span className="text-green-600 font-semibold">(-16%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className={`relative rounded-lg border p-4 shadow-sm flex flex-col ${subscriptionChoice === subscription.id
                ? 'border-indigo-500 ring-2 ring-indigo-500'
                : 'border-gray-300'
                }`}
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{subscription.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{subscription.description}</p>

                <p className="mt-4 text-3xl font-bold text-gray-900">
                  {formatPrice(subscriptionType === 'monthly' ? subscription.priceMonthly : subscription.priceAnnually)}
                  <span className="text-base font-medium text-gray-500">
                    {subscriptionType === 'monthly' ? '/mois' : '/an'}
                  </span>
                </p>

                <ul className="mt-6 space-y-3">
                  {subscription.features.map((feature) => (
                    <li key={feature} className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setSubscriptionChoice(subscription.id)}
                className={`mt-6 w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${subscriptionChoice === subscription.id
                  ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {subscriptionChoice === subscription.id ? 'Sélectionné' : 'Sélectionner'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {errors.submit}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div className="pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retour
          </button>

          <button
            type="submit"
            disabled={!subscriptionChoice || isSubmitting}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(!subscriptionChoice || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </>
            ) : (
              "Confirmer et payer"
            )}
          </button>
        </div>
      </div>
    </form>
  );

  // Rendu de la phase 4 : Activation de licence
  const renderLicenseActivation = () => (
    <form onSubmit={handleSubmitLicense} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Activation de votre licence</h3>
        <p className="text-sm text-gray-500">
          Entrez votre clé de licence pour activer votre compte. Si vous n'avez pas de licence, vous pouvez
          <button
            type="button"
            onClick={() => setStep(3)}
            className="ml-1 text-indigo-600 hover:text-indigo-500 focus:outline-none"
          >
            souscrire à un abonnement
          </button>.
        </p>

        <div>
          <label htmlFor="licenseKey-0" className="block text-sm font-medium text-gray-700">
            Clé de licence
          </label>
          <div className="mt-1 flex space-x-2 items-center">
            <span className="text-gray-500 font-medium">TW-</span>
            {licenseKeys.map((part, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-400">-</span>}
                <input
                  type="text"
                  id={`licenseKey-${index}`}
                  value={part}
                  onChange={(e) => handleLicenseKeyChange(index, e.target.value)}
                  className={`appearance-none w-16 px-2 py-2 border rounded-md shadow-sm text-center placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.licenseKey ? 'border-red-500' : 'border-gray-300'}`}
                  maxLength={4}
                />
              </React.Fragment>
            ))}
          </div>
          {errors.licenseKey && (
            <p className="mt-1 text-sm text-red-600">{errors.licenseKey}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Entrez la clé de licence qui vous a été fournie. La clé de licence est au format TW-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX.
          </p>
        </div>
      </div>

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {errors.submit}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div className="pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retour
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Activation en cours...
              </>
            ) : (
              "Activer ma licence"
            )}
          </button>
        </div>
      </div>
    </form>
  );

  // Rendu de la phase 5: Achat de licence
  const renderLicensePurchase = () => (
    <form onSubmit={handleSubmitLicensePurchase} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Acheter une licence Twool Labs</h3>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Licence Pro</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Accès complet à toutes les fonctionnalités</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Prix</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">199€</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Durée</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">1 an</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Fonctionnalités</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Workflows illimités</li>
                    <li>5 GB de stockage</li>
                    <li>Toutes les fonctionnalités d'IA</li>
                    <li>Support prioritaire</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Ajoutez ici les champs pour les informations de paiement */}
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Numéro de carte
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
              Date d'expiration
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="expiry"
                placeholder="MM/AA"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
              CVC
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="cvc"
                placeholder="123"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retour
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </>
            ) : (
              "Acheter et créer mon compte"
            )}
          </button>
        </div>
      </div>
    </form>
  );

  // Rendu principal en fonction de l'étape actuelle
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderAccessChoice();
      case 3:
        return renderSubscriptionChoice();
      case 4:
        return renderLicenseActivation();
      case 5:
        return renderLicensePurchase();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/auth/login">
            <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
              connectez-vous à votre compte existant
            </span>
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl md:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Indicateur d'étape */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="w-full flex items-center">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}>
                  <span className="text-white text-sm font-medium">1</span>
                </div>
                <div className={`h-1 flex-1 mx-2 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}></div>
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}>
                  <span className={`text-sm font-medium ${step >= 2 ? 'text-white' : 'text-gray-600'}`}>2</span>
                </div>
                <div className={`h-1 flex-1 mx-2 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}></div>
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}>
                  <span className={`text-sm font-medium ${step >= 3 ? 'text-white' : 'text-gray-600'}`}>3</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-medium text-gray-500">Informations</span>
              <span className="text-xs font-medium text-gray-500">Choix d'accès</span>
              <span className="text-xs font-medium text-gray-500">Activation</span>
            </div>
          </div>

          {/* Contenu de l'étape actuelle */}
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}