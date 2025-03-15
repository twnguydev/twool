import Link from 'next/link';
import {
  ArrowRight,
} from 'lucide-react';

export const GuaranteedResults = () => {
  return (
    <>
      {/* Guaranteed Results */}
      <div className="bg-linear-to-r from-indigo-700 via-indigo-700 to-pink-700 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/90 to-pink-700/90"></div>
        <div className="absolute inset-y-0 right-0 w-1/3 bg-white/5 skew-x-[-15deg] transform origin-top-right"></div>
        <div className="absolute inset-y-0 left-0 w-1/3 bg-white/5 skew-x-[15deg] transform origin-bottom-left"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Résultats garantis ou remboursés
            </h2>
            <div className="w-24 h-1 bg-linear-to-r from-indigo-300 to-indigo-300 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-white/90 mb-8">
              Nous sommes tellement confiants dans l'efficacité de notre solution que nous vous garantissons des résultats mesurables. Si vous n'obtenez pas d'améliorations quantifiables dans les 90 jours, nous vous remboursons intégralement.
            </p>
            <Link href="/garantie">
              <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors duration-300 shadow-lg cursor-pointer">
                Découvrir notre garantie
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}