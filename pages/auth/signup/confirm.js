import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SignupSuccess() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // Récupérer les données de l'utilisateur du localStorage
    const authData = localStorage.getItem('twool_auth');
    if (!authData) {
      // Rediriger vers la page d'inscription si aucune donnée n'est trouvée
      router.push('/auth/signup');
      return;
    }
    
    try {
      const parsedData = JSON.parse(authData);
      setUserData(parsedData.user);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      router.push('/auth/signup');
    }
  }, [router]);
  
  if (!userData) {
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
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Bienvenue sur Twool Labs !
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Votre compte a été créé avec succès.
          </p>
        </div>
        
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                Un email de confirmation a été envoyé à <span className="font-medium">{userData.email}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Votre compte</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Nom:</span> {userData.firstName} {userData.lastName}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Email:</span> {userData.email}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Type de compte:</span> {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Link href="/dashboard">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Accéder à mon tableau de bord
            </button>
          </Link>
          
          <Link href="/onboarding">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Commencer le tutoriel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}