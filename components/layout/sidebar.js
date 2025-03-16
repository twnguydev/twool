import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Workflow,
  BarChart3,
  BrainCircuit,
  Link2,
  Settings,
  ChevronRight,
  ChevronDown,
  PanelLeft,
  PanelRight,
  Rocket,
  FileLineChart,
  Code2,
  Users,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [expandedSection, setExpandedSection] = useState('modeling');

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleSection = (item) => {
    if (expandedSection === item.section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(item.section);
    }
  };

  const menuItems = [
    {
      name: 'Tableau de bord',
      path: '/dashboard',
      icon: <LayoutDashboard size={collapsed ? 20 : 18} />
    },
    {
      name: 'Modélisation',
      icon: <Workflow size={collapsed ? 20 : 18} />,
      isExpandable: true,
      section: 'modeling',
      defaultPath: '/dashboard/modeling/workflows',
      subItems: [
        { name: 'Workflows', path: '/dashboard/modeling/workflows', icon: <Rocket size={16} /> },
        { name: 'Processus', path: '/dashboard/processes', icon: <FileLineChart size={16} /> },
        { name: 'Diagrammes', path: '/dashboard/diagrams', icon: <Code2 size={16} /> }
      ]
    },
    {
      name: 'Simulations',
      path: '/simulations',
      icon: <BarChart3 size={collapsed ? 20 : 18} />
    },
    {
      name: 'Optimisations IA',
      path: '/optimizations',
      icon: <BrainCircuit size={collapsed ? 20 : 18} />
    },
    {
      name: 'Connexions API',
      path: '/connections',
      icon: <Link2 size={collapsed ? 20 : 18} />
    },
    {
      name: 'Paramètres',
      icon: <Settings size={collapsed ? 20 : 18} />,
      isExpandable: true,
      section: 'settings',
      defaultPath: '/settings/profile',
      subItems: [
        { name: 'Profil', path: '/settings/profile', icon: <Users size={16} /> },
        { name: 'Préférences', path: '/settings/preferences', icon: <Settings size={16} /> }
      ]
    }
  ];

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-800 text-white h-screen flex flex-col transition-width duration-300 ease-in-out relative`}>
      {/* Logo et nom */}
      <div className={`p-4 border-b border-gray-700 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-medium">T</span>
              </div>
              <div className="flex flex-col ml-2">
                <span className="ml-2 font-bold text-lg">Twool Labs</span>
              </div>
            </div>
          </>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-medium">T</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`${collapsed ? 'hidden' : 'flex'} p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white focus:outline-hidden`}
        >
          <PanelLeft size={16} />
        </button>
      </div>

      {/* Bouton pour réétendre la sidebar quand elle est réduite */}
      {collapsed && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-gray-800 rounded-full p-1 text-gray-400 hover:text-white shadow-md focus:outline-hidden"
        >
          <PanelRight size={16} />
        </button>
      )}

      {/* Navigation */}
      <nav className="grow overflow-y-auto pt-2">
        <div className="px-2">
          {menuItems.map((item) => (
            <div key={item.name} className="mb-1">
              {collapsed ? (
                // VERSION COLLAPSÉE: LIENS DIRECTS
                <a
                  href={item.isExpandable ? item.defaultPath : item.path}
                  className={`block px-3 py-2.5 rounded-md cursor-pointer transition-colors text-center ${
                    router.pathname === item.path ||
                    (item.subItems && item.subItems.some(subItem => router.pathname === subItem.path))
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="inline-block">{item.icon}</span>
                </a>
              ) : (
                // VERSION EXPANDED: SECTION AVEC TOGGLE
                <div>
                  <div
                    className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors ${
                      router.pathname === item.path ||
                      (item.subItems && item.subItems.some(subItem => router.pathname === subItem.path))
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => {
                      if (item.isExpandable) {
                        toggleSection(item);
                      } else {
                        router.push(item.path);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>

                    {item.isExpandable && (
                      <span>
                        {expandedSection === item.section ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    )}
                  </div>

                  {/* Sous-menu */}
                  {item.isExpandable && expandedSection === item.section && (
                    <div className="mt-1 ml-6 pl-3 border-l border-gray-700">
                      {item.subItems.map((subItem) => (
                        <a
                          key={subItem.path}
                          href={subItem.path}
                          className={`flex items-center px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                            router.pathname === subItem.path
                              ? 'bg-gray-700 text-blue-400'
                              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          <span className="mr-2">{subItem.icon}</span>
                          <span className="text-sm">{subItem.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Pied de la sidebar */}
      <div className={`p-4 border-t border-gray-700 mt-auto ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center justify-between text-sm text-gray-400 hover:text-white cursor-pointer">
            <div className="flex items-center">
              <HelpCircle size={16} className="mr-2" />
              <span>Centre d'aide</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 hover:text-white cursor-pointer">
            <HelpCircle size={20} />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;