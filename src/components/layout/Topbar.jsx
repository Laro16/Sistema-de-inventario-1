import React from 'react';

export default function Topbar() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      {/* Buscador o texto izquierdo */}
      <div className="flex items-center w-64">
        <span className="text-gray-500 text-sm hidden md:inline">Panel de Control</span>
      </div>

      {/* Información del usuario en el lado derecho */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right hidden sm:flex">
          <span className="text-sm font-semibold text-gray-700">Administrador</span>
          <span className="text-xs text-gray-500">Transportes Del Sur</span>
        </div>
        {/* Avatar redondo */}
        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          A
        </div>
      </div>
    </header>
  );
}
