// components/Footer.js
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Navigation links groupés par catégorie
  const footerLinks = [
    {
      title: 'Produit',
      links: [
        { name: 'Fonctionnalités', href: '/features' },
        { name: 'Solutions', href: '/solutions' },
        { name: 'Tarifs', href: '/pricing' },
        { name: 'Roadmap', href: '/roadmap' },
        { name: 'Release Notes', href: '/releases' },
      ],
    },
    {
      title: 'Ressources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Tutoriels', href: '/tutorials' },
        { name: 'Blog', href: '/blog' },
        { name: 'Études de cas', href: '/case-studies' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { name: 'À propos', href: '/about' },
        { name: 'Carrières', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Partenaires', href: '/partners' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { name: 'Confidentialité', href: '/privacy' },
        { name: 'Conditions d\'utilisation', href: '/terms' },
        { name: 'Mentions légales', href: '/legal' },
        { name: 'Conformité RGPD', href: '/gdpr' },
      ],
    },
  ];

  // Réseaux sociaux
  const socialLinks = [
    { name: 'LinkedIn', href: 'https://linkedin.com/company/twool-labs', icon: 'linkedin' },
    { name: 'Twitter', href: 'https://twitter.com/twool_labs', icon: 'twitter' },
    { name: 'GitHub', href: 'https://github.com/twool-labs', icon: 'github' },
    { name: 'YouTube', href: 'https://youtube.com/c/twool-labs', icon: 'youtube' },
  ];

  // Fonction pour générer les icônes sociales
  const getSocialIcon = (icon) => {
    switch (icon) {
      case 'linkedin':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.04 10.04 0 01-3.127 1.195c-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045A13.98 13.98 0 011.64 3.162a4.89 4.89 0 001.524 6.574 4.9 4.9 0 01-2.23-.616v.06a4.955 4.955 0 003.971 4.859 4.99 4.99 0 01-2.225.084 4.959 4.959 0 004.624 3.442A9.99 9.99 0 010 19.54a14.01 14.01 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 4.59z" />
          </svg>
        );
      case 'github':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo et description */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/logo-white.svg"
              alt="Twool Labs"
              width={120}
              height={40}
            />
            <p className="mt-4 text-sm text-gray-300">
              Plateforme de jumeaux numériques pour l'optimisation des processus métier et la prise de décision basée sur les données.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  {getSocialIcon(social.icon)}
                </Link>
              ))}
            </div>
          </div>

          {/* Liens de navigation */}
          {footerLinks.map((group) => (
            <div key={group.title} className="mt-4 md:mt-0">
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bannière de langue */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <select className="bg-gray-800 text-gray-300 text-sm rounded-md py-1 px-2 border border-gray-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500">
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
            </select>
          </div>

          {/* Copyright */}
          <div className="mt-4 md:mt-0 text-center md:text-left">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Twool Labs. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;