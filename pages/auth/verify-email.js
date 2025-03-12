import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useApi } from '/hooks/useApi';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const { auth } = useApi();
  
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!token) return;
    
    const verifyEmail = async () => {
      try {
        await auth.verifyEmail(token);
        setStatus('success');
      } catch (err) {
        console.error('Erreur lors de la vérification:', err);
        setStatus('error');
        setError(err.message || 'Une erreur est survenue lors de la vérification.');
      }
    };
    
    verifyEmail();
  }, [token]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Vérification en cours...
            </h2>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email vérifié avec succès !
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/auth/login')}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Se connecter
              </button>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Erreur de vérification
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error || "Le lien de vérification est invalide ou a expiré."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/auth/login')}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}