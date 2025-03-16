import React, { useState } from 'react';
import Link from 'next/link';
import { UserRoundCheck, PlusSquare, Bell, ChevronDown, LogOut, Settings, User, Search, Menu, X } from 'lucide-react';
import { useAuthContext } from '/context/auth-context';

const Header = ({ title }) => {
  const { user } = useAuthContext();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Notifications fictives pour démonstration
  const notifications = [
    { id: 1, text: "Workflow 'Production Q1' mis à jour", time: "Il y a 10 min", isNew: true },
    { id: 2, text: "Simulation terminée pour 'Logistique'", time: "Il y a 2h", isNew: true },
    { id: 3, text: "Partage de 'Finances 2025' par Marc Dupont", time: "Hier", isNew: false },
  ];

  return (
    <header className="bg-white shadow-xs border-b border-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Partie gauche - info contextuelle et titre de page */}
          <div className="flex items-center">
            <div className="shrink-0 flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
              <div className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">Production</div>
            </div>
          </div>

          {/* Bouton menu mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Actions principales - visibles sur desktop */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {/* Recherche */}
            <div className="relative mr-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                type="text"
                placeholder="Rechercher..."
              />
            </div>

            {/* Bouton de création */}
            <Link href="/dashboard/modeling/workflows/create" className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-xs text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <PlusSquare size={16} className="mr-2" />
              Créer un workflow
            </Link>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className="relative p-1 rounded-full text-gray-500 hover:text-blue-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Bell size={20} />
                {notifications.filter(n => n.isNew).length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              
              {/* Dropdown notifications */}
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2 px-3 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`px-4 py-3 hover:bg-gray-50 ${notification.isNew ? 'bg-blue-50' : ''}`}
                      >
                        <p className="text-sm text-gray-800">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="py-2 px-3 border-t border-gray-100 text-center">
                    <Link href="#" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                      Voir toutes les notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profil utilisateur */}
            <div className="relative ml-3">
              <div>
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="flex items-center">
                    <div className="h-9 w-9 bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-xs">
                      <UserRoundCheck size={20} />
                    </div>
                    <span className="ml-2 mr-1 text-sm font-medium text-gray-700 hidden lg:block">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <ChevronDown size={16} className="text-gray-400 hidden lg:block" />
                  </div>
                </button>
              </div>
              
              {/* Dropdown menu utilisateur */}
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <Link
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User size={16} className="mr-3 text-gray-500" />
                      Mon profil
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} className="mr-3 text-gray-500" />
                      Paramètres
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-3 text-gray-500" />
                      Déconnexion
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="shrink-0">
                <div className="h-10 w-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                  <UserRoundCheck size={20} />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Marie Laurent</div>
                <div className="text-sm font-medium text-gray-500">marie@example.com</div>
              </div>
              <button 
                className="ml-auto p-1 rounded-full text-gray-500 hover:text-blue-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={toggleNotifications}
              >
                <Bell size={20} />
                {notifications.filter(n => n.isNew).length > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Mon profil
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Paramètres
              </Link>
              <button
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Créer un workflow
              </button>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Déconnexion
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;