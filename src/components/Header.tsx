import React from 'react';
import UserMenu from './UserMenu';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-medium w-full">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Finestra V2</h1>
        {/* UserMenu será inserido aqui */}
        <div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
} 