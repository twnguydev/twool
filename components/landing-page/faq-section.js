import Link from 'next/link';

export const FaqSection = () => {
  return (
    <>
      {/* FAQ Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-indigo-700">FAQ</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Questions fréquemment posées
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Tout ce que vous devez savoir sur Twool Labs
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
            {[
              {
                question: "Qu'est-ce qu'un jumeau numérique?",
                answer: "Un jumeau numérique est une réplique virtuelle de vos processus, équipements ou systèmes. Cette technologie permet de simuler, analyser et optimiser vos opérations dans un environnement virtuel avant d'implémenter des changements dans le monde réel."
              },
              {
                question: "Combien de temps faut-il pour implémenter Twool Labs?",
                answer: "La mise en place de Twool Labs est rapide. Pour les processus simples, vous pouvez être opérationnel en quelques jours. Pour les environnements plus complexes ou les grandes entreprises, nous proposons un accompagnement personnalisé qui peut s'étendre sur quelques semaines pour garantir une intégration optimale."
              },
              {
                question: "Est-ce que Twool Labs s'intègre avec mes systèmes existants?",
                answer: "Absolument. Twool Labs dispose de connecteurs pour les principaux ERP, CRM, et systèmes de gestion. Nous proposons également une API complète pour développer des intégrations personnalisées si nécessaire."
              },
              {
                question: "Quelle est la précision des simulations?",
                answer: "La précision de nos simulations dépend de la qualité des données d'entrée. Avec des données précises, nos clients constatent une marge d'erreur moyenne inférieure à 5% entre les simulations et les résultats réels. Notre IA s'améliore constamment pour augmenter cette précision."
              },
              {
                question: "Comment protégez-vous nos données?",
                answer: "La sécurité est notre priorité. Nous utilisons le chiffrement de bout en bout, des serveurs sécurisés et des pratiques conformes aux normes RGPD, ISO 27001 et SOC 2. Nous ne partageons jamais vos données et vous en restez propriétaire à 100%."
              }
            ].map((faq, index) => (
              <div key={index} className="py-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-base text-gray-500">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-base text-gray-500">
              Vous avez d'autres questions?{' '}
              <Link href="/contact">
                <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  Contactez notre équipe
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}