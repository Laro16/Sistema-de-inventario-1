import React from 'react';

export default function Users() {
  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200">
          + Nuevo Usuario
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        <p>Módulo de gestión de usuarios en construcción.</p>
      </div>
    </div>
  );
}
