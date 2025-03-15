import { Play } from 'lucide-react';

export const DemoSection = () => {
  return (
    <>
      {/* Demo Section */}
      <div id="demo" className="py-24 bg-linear-to-b from-white to-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-bl from-indigo-100 to-transparent rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-indigo-100 to-transparent rounded-tr-full opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-indigo-700">Démonstration</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Voir Twool Labs en action
            </h2>
            <p className="mt-4 text-xl text-gray-500 mb-10">
              Découvrez comment notre plateforme peut transformer vos processus métier.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 bg-linear-to-br from-indigo-900 to-indigo-900 flex items-center justify-center">
              <div className="text-center">
                <div className="group">
                  <div className="h-24 w-24 bg-linear-to-r from-indigo-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto cursor-pointer transform transition-all duration-300 hover:scale-110 shadow-xl">
                    <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
                      <Play className="h-10 w-10 text-indigo-600 ml-1" />
                    </div>
                  </div>
                  <p className="mt-6 text-white text-xl font-medium">Voir la démo (3:45)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}