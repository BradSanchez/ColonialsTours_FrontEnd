import React, { useState } from 'react';
import Dropdown from './Dropdown';

const DropdownExample = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const countries = [
    { value: 'mx', label: 'México' },
    { value: 'us', label: 'Estados Unidos' },
    { value: 'ca', label: 'Canadá' },
    { value: 'es', label: 'España' },
    { value: 'fr', label: 'Francia' }
  ];

  const categories = [
    { value: 'adventure', label: 'Aventura' },
    { value: 'culture', label: 'Cultural' },
    { value: 'nature', label: 'Naturaleza' },
    { value: 'beach', label: 'Playa' },
    { value: 'city', label: 'Ciudad' }
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Ejemplo de Dropdowns</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            País de destino
          </label>
          <Dropdown
            options={countries}
            value={selectedCountry}
            onChange={(option) => setSelectedCountry(option.value)}
            placeholder="Selecciona un país"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría del tour
          </label>
          <Dropdown
            options={categories}
            value={selectedCategory}
            onChange={(option) => setSelectedCategory(option.value)}
            placeholder="Selecciona una categoría"
          />
        </div>

        {(selectedCountry || selectedCategory) && (
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">Selección actual:</h3>
            {selectedCountry && (
              <p className="text-orange-700">
                País: {countries.find(c => c.value === selectedCountry)?.label}
              </p>
            )}
            {selectedCategory && (
              <p className="text-orange-700">
                Categoría: {categories.find(c => c.value === selectedCategory)?.label}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownExample;