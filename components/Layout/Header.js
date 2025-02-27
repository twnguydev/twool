import React from 'react';
import { UserRoundCheck } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-lg font-semibold">
          Workflow Builder
        </div>
        <div className="flex items-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md mr-4">
            Créer un workflow
          </button>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <UserRoundCheck />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
