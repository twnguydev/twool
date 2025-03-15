import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '/context/auth-context';
import { useApi } from '/hooks/useApi';

const BUSINESS_SECTORS = [
  "Industrie manufacturière",
  "Services financiers",
  "Logistique & Supply Chain",
  "Santé & Pharmaceutique",
  "Énergie & Utilities",
  "Commerce de détail",
  "Agriculture & Agroalimentaire",
  "Automobile & Mobilité",
  "BTP & Construction",
  "Éducation & Formation",
  "Hôtellerie & Restauration",
  "Immobilier",
  "Technologies & Numérique",
  "Télécommunications",
  "Médias & Divertissement",
  "Transport & Voyages",
  "Services professionnels",
  "Secteur public & Administration",
  "Banque & Assurance",
  "Luxe & Cosmétiques",
  "Mode & Textile",
  "Sports & Loisirs",
  "Autre"
];

export default function CompanySetup() {
  const router = useRouter();
  const { user, isAuthenticated, token, loading, login } = useAuthContext();
  const { companies, auth } = useApi();
  
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    otherSector: '',
    street: '',
    streetComplement: '',
    postalCode: '',
    city: '',
    phone: '',
    website: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/auth/login');
        return;
      }

      if (user?.company_id || user.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }
    }
  }, [loading, isAuthenticated, user, router]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formatFullAddress = () => {
    let address = formData.street;
    
    if (formData.streetComplement) {
      address += `\n${formData.streetComplement}`;
    }
    
    address += `\n${formData.postalCode} ${formData.city}`;
    
    return address.trim();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!formData.name || !formData.sector || !formData.street || 
          !formData.postalCode || !formData.city || !formData.phone) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      if (formData.sector === "Autre" && !formData.otherSector) {
        throw new Error("Veuillez préciser votre secteur d'activité");
      }

      const companyData = {
        name: formData.name,
        description: formData.sector === "Autre" ? formData.otherSector : formData.sector,
        address: formatFullAddress(),
        phone: formData.phone,
        website: formData.website || null
      };

      await companies.createCompany(companyData);
      const refreshUser = await auth.getCurrentUser();
      login(refreshUser, token);

      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
      setError(error.message || error.response?.data?.detail || 'Une erreur s\'est produite lors de la création de l\'entreprise');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
            <svg className="h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Configurez votre entreprise
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Votre licence entreprise nécessite d'enregistrer les informations de votre entreprise.
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.707-9.293a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 011.414 1.414L11.414 12l2.293 2.293a1 1 0 01-1.414 1.414L10 13.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 12 6.293 9.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom de l'entreprise *
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                Secteur d'activité *
              </label>
              <div className="mt-1">
                <select
                  id="sector"
                  name="sector"
                  required
                  value={formData.sector}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Sélectionnez un secteur</option>
                  {BUSINESS_SECTORS.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {formData.sector === "Autre" && (
              <div>
                <label htmlFor="otherSector" className="block text-sm font-medium text-gray-700">
                  Précisez votre secteur d'activité *
                </label>
                <div className="mt-1">
                  <input
                    id="otherSector"
                    name="otherSector"
                    type="text"
                    required
                    value={formData.otherSector}
                    onChange={handleInputChange}
                    placeholder="Votre secteur d'activité"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Adresse *
                </label>
                <div className="mt-1">
                  <input
                    id="street"
                    name="street"
                    type="text"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Numéro et nom de rue"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="streetComplement" className="block text-sm font-medium text-gray-700">
                  Complément d'adresse
                </label>
                <div className="mt-1">
                  <input
                    id="streetComplement"
                    name="streetComplement"
                    type="text"
                    value={formData.streetComplement}
                    onChange={handleInputChange}
                    placeholder="Appartement, bâtiment, etc."
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Code postal *
                  </label>
                  <div className="mt-1">
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ville *
                  </label>
                  <div className="mt-1">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone *
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Site web
              </label>
              <div className="mt-1">
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer mon entreprise'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}