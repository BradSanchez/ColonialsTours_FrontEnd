import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Filter } from 'react-feather';
import MapPreview from './MapPreview';
import apiService from '../services/api';

const Mapa = () => {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', label: 'Todos los lugares' }]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    loadPlaces();
    loadCategories();
  }, []);

  useEffect(() => {
    filterPlaces();
  }, [places, selectedCategory, searchTerm]);

  const loadPlaces = async () => {
    setLoading(true);
    // Usar datos hardcodeados directamente
    const fallbackPlaces = [
      { id: 1, name: 'Alcázar de Colón', lat: 18.4765, lng: -69.8835, category: 'historico', description: 'Residencia del virrey Diego Colón' },
      { id: 2, name: 'Catedral Primada', lat: 18.4729, lng: -69.8833, category: 'religioso', description: 'Primera catedral de América' },
      { id: 3, name: 'Calle Las Damas', lat: 18.4748, lng: -69.8838, category: 'historico', description: 'Primera calle pavimentada de América' },
      { id: 4, name: 'Fortaleza Ozama', lat: 18.4751, lng: -69.8821, category: 'historico', description: 'Primera fortaleza europea en América' },
      { id: 5, name: 'Sabina Bar', lat: 18.4735, lng: -69.8825, category: 'vida_nocturna', description: 'Bar moderno con ambiente acogedor en la Zona Colonial' },
      { id: 6, name: 'Parada 77 Bar', lat: 18.4745, lng: -69.8840, category: 'vida_nocturna', description: 'Bar con música en vivo y cócteles artesanales' },
      { id: 7, name: "Onno's Bar", lat: 18.4740, lng: -69.8830, category: 'vida_nocturna', description: 'Bar y discoteca en el corazón de la Zona Colonial' },
      { id: 8, name: 'Museo de las Casas Reales', lat: 18.4742, lng: -69.8834, category: 'museo', description: 'Museo de historia colonial y arqueología' },
      { id: 9, name: 'Casa de Bastidas', lat: 18.4756, lng: -69.8834, category: 'museo', description: 'Museo de la Familia Dominicana' },
      { id: 10, name: 'Museo Mundo de Ámbar', lat: 18.4738, lng: -69.8829, category: 'museo', description: 'Colección de ámbar dominicano y fósiles' },
      { id: 11, name: 'Museo de la Resistencia', lat: 18.4744, lng: -69.8837, category: 'museo', description: 'Historia de la resistencia dominicana' },
      { id: 12, name: 'Museo Memorial de la Resistencia Dominicana', lat: 18.4746, lng: -69.8839, category: 'museo', description: 'Memoria histórica de la dictadura trujillista' },
      { id: 13, name: 'Casa del Cordón', lat: 18.4750, lng: -69.8832, category: 'museo', description: 'Primera casa de piedra de América' },
      { id: 14, name: 'Museo Larimar', lat: 18.4739, lng: -69.8831, category: 'museo', description: 'Gemas y joyería de larimar dominicano' }
    ];
    setPlaces(fallbackPlaces);
    setLoading(false);
  };

  const loadCategories = async () => {
    setCategories([
      { id: 'all', label: 'Todos los lugares' },
      { id: 'historico', label: 'Sitios Históricos' },
      { id: 'religioso', label: 'Sitios Religiosos' },
      { id: 'museo', label: 'Museos' },
      { id: 'vida_nocturna', label: 'Vida Nocturna' }
    ]);
  };

  const handlePlaceClick = (place) => {
    setSelectedPlaceId(place.id);
    if (mapRef) {
      mapRef.selectPlace(place);
    }
  };

  const filterPlaces = () => {
    let filtered = places;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(place => place.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPlaces(filtered);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Mapa Interactivo</h1>
          <p className="text-gray-600 mt-2">Explora los lugares más importantes de la Zona Colonial</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar lugares..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de lugares */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Lugares de Interés ({filteredPlaces.length})
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredPlaces.map((place, index) => (
                  <div 
                    key={place.id || index} 
                    onClick={() => handlePlaceClick(place)}
                    className={`bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-all cursor-pointer ${
                      selectedPlaceId === place.id ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-orange-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{place.description}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          place.category === 'historico' ? 'bg-blue-100 text-blue-800' :
                          place.category === 'religioso' ? 'bg-purple-100 text-purple-800' :
                          place.category === 'museo' ? 'bg-green-100 text-green-800' :
                          place.category === 'vida_nocturna' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {place.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Navigation className="text-orange-600" size={20} />
                  Zona Colonial - Santo Domingo
                </h2>
              </div>
              <div className="h-96">
                <MapPreview 
                  places={filteredPlaces} 
                  height={384} 
                  selectedPlaceId={selectedPlaceId}
                  onMapReady={setMapRef}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">¿Sabías que...?</h2>
              <p className="text-orange-100 mb-4">
                La Zona Colonial de Santo Domingo fue declarada Patrimonio de la Humanidad por la UNESCO en 1990. 
                Es el asentamiento europeo más antiguo de América, fundado en 1498.
              </p>
              <a 
                href="/tours" 
                className="inline-block bg-white text-orange-600 px-6 py-3 rounded-xl font-medium hover:bg-orange-50 transition-colors"
              >
                Explorar Tours Guiados
              </a>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{places.length}</div>
              <div className="text-orange-100">Lugares de Interés</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapa;