import React from 'react';

export default function Categories() {
  // Datos de ejemplo para que la pantalla no esté vacía al cargar
  const mockCategories = [
    { id: 1, name: 'Gorras', description: 'Gorras importadas de diferentes estilos', status: 'Activo' },
    { id: 2, name: 'Mochilas', description: 'Mochilas y bolsones', status: 'Activo' },
    { id: 3, name: 'Accesorios', description: 'Accesorios generales', status: 'Activo' },
    { id: 4, name: 'Repuestos', description: 'Piezas y componentes técnicos', status: 'Inactivo' },
  ];

  return (
    <div className="p-6 w-full">
      {/* Encabezado de la página */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200">
          + Nueva Categoría
        </button>
      </div>

      {/* Tabla de categorías */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      category.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                    <button className="text-red-600 hover:text-red-900">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
