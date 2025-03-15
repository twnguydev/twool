import Link from 'next/link';
import {
  ArrowRight,
} from 'lucide-react';

export const CtaBanner = () => {
  return (
    <>
      {/* CTA Section */}
      <div className="bg-linear-to-r from-indigo-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/90 to-indigo-700/90"></div>
        <div className="absolute inset-y-0 right-0 w-1/3 bg-indigo-500/20 skew-x-[-15deg] transform origin-top-right"></div>
        <div className="absolute inset-y-0 left-0 w-1/3 bg-indigo-500/20 skew-x-[15deg] transform origin-bottom-left"></div>

        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Prêt à transformer vos processus?</span>
              <span className="block text-indigo-200">Démarrez votre essai gratuit aujourd'hui.</span>
            </h2>
            <p className="mt-4 text-lg text-indigo-100 max-w-md">
              Rejoignez les entreprises qui optimisent déjà leurs opérations grâce à Twool Labs.
            </p>
          </div>
          <div className="mt-10 lg:mt-0 lg:shrink-0 flex flex-col sm:flex-row gap-4">
            <div className="rounded-md shadow-sm">
              <Link href="/auth/signup">
                <span className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-300 cursor-pointer">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </div>
            <div className="rounded-md shadow-sm">
              <Link href="/contact">
                <span className="flex items-center justify-center px-5 py-3 border border-indigo-300 text-base font-medium rounded-md text-white bg-indigo-800/40 hover:bg-indigo-700/60 transition-colors duration-300 cursor-pointer">
                  Contacter un expert
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}