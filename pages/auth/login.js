import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthContext } from '/context/auth-context';
import { useApi } from '/hooks/useApi';
import { isElectron } from '/utils/platform';

export default function Login() {
  const router = useRouter();
  const { redirect } = router.query;
  const { auth } = useApi();
  const { login } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await auth.login(email, password);
      login(response.user, response.access_token);

      if (response.should_register_company === true) {
        router.push('/dashboard/company-setup');
      } else {
        router.push(redirect || '/dashboard');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);

      setError(err.message);

      if (err.message.includes('vérifier votre adresse email')) {
        setShowResendButton(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      await auth.resendVerificationEmail(email);
      setError('');
      setMessage('Un nouvel email de vérification a été envoyé à votre adresse.');
    } catch (err) {
      console.error('Erreur lors du renvoi:', err);
      setError('Impossible de renvoyer l\'email. Veuillez réessayer plus tard.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {isElectron ?? (
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800 mb-15">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </Link>
        )}
        <div className="flex justify-center">
          <div className="h-16 w-16 relative">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">Twool</span>
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion à Twool Labs
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/auth/signup">
            <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
              créez un compte pour démarrer
            </span>
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Message d'erreur */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Erreur d'authentification
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Message de succès */}
            {message && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Succès
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showResendButton && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleResendVerificationEmail}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Renvoyer l'email de vérification
                </button>
              </div>
            )}
            
            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-sm"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link href="/reset-password">
                  <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                    Mot de passe oublié ?
                  </span>
                </Link>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-xs bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Se connecter avec Google</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-xs bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Se connecter avec Microsoft</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Lien vers l'activation de licence */}
          <div className="mt-6 text-center">
            <Link href="/activate-license">
              <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                J'ai une clé de licence à activer
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}