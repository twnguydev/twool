import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Process Modeling', path: '/modeling' },
    { name: 'Simulations', path: '/simulations' },
    { name: 'IA Optimizations', path: '/optimizations' },
    { name: 'API Connections', path: '/connections' },
    { name: 'Settings', path: '/settings' }
  ];
  
  return (
    <aside className="w-56 bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold">
        Twool Labs
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link href={item.path} key={item.path}>
            <div className={`p-4 hover:bg-gray-700 cursor-pointer ${
              router.pathname === item.path ? 'bg-blue-600' : ''
            }`}>
              {item.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
