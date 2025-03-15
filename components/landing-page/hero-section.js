import Image from 'next/image';
import Link from 'next/link';
import {
  Play,
  ArrowRight,
} from 'lucide-react';

export const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-indigo-600 to-indigo-700">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/90 to-indigo-700/90"></div>
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 bg-white/5 skew-x-[-15deg] transform origin-bottom-right"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white/10 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center mt-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-200/20 rounded-full mb-6">
              <span className="text-sm font-semibold text-white">Twool Labs</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block text-white">Challengez vos processus métier</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">sans risquer votre business</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
              Modélisez, simulez et optimisez vos opérations critiques sans perturber l'activité réelle. Réduisez les coûts opérationnels jusqu'à <span className="font-bold text-white">47%</span>.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link href="/auth/signup">
                <span className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-lg hover:shadow-xl transition duration-300 ease-in-out cursor-pointer">
                  Démarrer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
              <Link href="#demo">
                <span className="flex items-center justify-center px-8 py-4 border border-indigo-300 text-base font-medium rounded-md text-white bg-transparent hover:bg-indigo-600/20 transition duration-300 ease-in-out cursor-pointer">
                  <Play className="mr-2 h-5 w-5" />
                  Voir une démo
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-16 relative w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-800/10 to-transparent pointer-events-none z-10 rounded-xl"></div>
            <Image
              src="/images/dashboard.png"
              alt="Aperçu du tableau de bord Twool Labs"
              layout="responsive"
              width={1600}
              height={900}
              objectFit="contain"
              className="rounded-xl"
              priority={true}
            />
          </div>

          <div className="mt-16 pt-6 px-8 bg-white/10 backdrop-blur-xs rounded-2xl">
            <p className="text-center text-sm text-indigo-100 mb-6">Ils nous font confiance :</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {['acme', 'globex', 'umbrella', 'stark'].map((company) => (
                <div key={company} className="h-10 opacity-80 hover:opacity-100 transition-opacity duration-300">
                  <Image src={`/images/logos/${company}.svg`} alt={`${company} Logo`} width={120} height={40} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}