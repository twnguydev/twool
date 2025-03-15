export const StatsSection = ({ stats }) => {
  return (
    <>
      {/* Stats Section */}
      <div className="bg-linear-to-r from-indigo-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/50 to-indigo-700/50"></div>
        <div className="absolute inset-y-0 right-0 w-1/3 bg-indigo-600/20 skew-x-[-15deg] transform origin-top-right"></div>
        <div className="absolute inset-y-0 left-0 w-1/3 bg-indigo-600/20 skew-x-[15deg] transform origin-bottom-left"></div>

        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Résultats prouvés pour les entreprises
            </h2>
            <p className="mt-4 text-xl text-indigo-200">
              Nos clients ont obtenu des améliorations significatives en seulement 3 mois d'utilisation.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-xs rounded-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <dd className="text-5xl font-extrabold text-white mb-4">
                  {stat.value}
                </dd>
                <dt className="text-lg font-medium text-indigo-200">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}