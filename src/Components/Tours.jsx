import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { MapPin, Clock, DollarSign, Star, Heart, Search, Filter, Calendar, User, Phone, Mail, Bookmark } from 'react-feather';
import apiService from '../services/api';

const Tours = () => {
  const { user } = useAuthContext();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);
  const [showContactModal, setShowContactModal] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadTours();
  }, [user]);

  useEffect(() => {
    filterTours();
  }, [tours, searchTerm, selectedCategory]);

  const loadTours = async () => {
    try {
      const response = await apiService.request('/tours');
      const tours = response.tours || [];
      
      // Obtener tours guardados del localStorage como respaldo
      const savedTourIds = JSON.parse(localStorage.getItem('savedTours') || '[]');
      
      // Marcar tours como guardados si están en localStorage
      const toursWithSavedStatus = tours.map(tour => ({
        ...tour,
        is_saved: tour.is_saved || savedTourIds.includes(tour.id)
      }));
      
      setTours(toursWithSavedStatus);
    } catch (error) {
      console.error('Error loading tours');
    }
  };

  const filterTours = () => {
    let filtered = tours;
    
    if (searchTerm) {
      filtered = filtered.filter(tour => 
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tour => 
        tour.category === selectedCategory
      );
    }
    
    setFilteredTours(filtered);
  };

  const addToCart = async (tourId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    try {
      await apiService.request('/tours/cart', {
        method: 'POST',
        body: JSON.stringify({ tourId })
      });
      alert('Tour agregado al carrito');
    } catch (error) {
      alert('Error agregando al carrito');
    }
  };

  const saveTour = async (tourId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    const tour = filteredTours.find(t => t.id === tourId);
    const isSaved = tour?.is_saved;
    
    // Actualizar localStorage inmediatamente
    const savedTourIds = JSON.parse(localStorage.getItem('savedTours') || '[]');
    if (isSaved) {
      const updatedIds = savedTourIds.filter(id => id !== tourId);
      localStorage.setItem('savedTours', JSON.stringify(updatedIds));
    } else {
      const updatedIds = [...savedTourIds, tourId];
      localStorage.setItem('savedTours', JSON.stringify(updatedIds));
    }
    
    // Actualizar estado local inmediatamente
    setTours(prevTours => 
      prevTours.map(t => 
        t.id === tourId ? { ...t, is_saved: !isSaved } : t
      )
    );
    
    try {
      if (isSaved) {
        await apiService.request(`/tours/saved/${tourId}`, { method: 'DELETE' });
        alert('Tour removido de favoritos');
      } else {
        await apiService.request('/tours/save', {
          method: 'POST',
          body: JSON.stringify({ tourId })
        });
        alert('Tour guardado en favoritos');
      }
    } catch (error) {
      // Revertir cambios si hay error
      const savedTourIds = JSON.parse(localStorage.getItem('savedTours') || '[]');
      if (isSaved) {
        const updatedIds = [...savedTourIds, tourId];
        localStorage.setItem('savedTours', JSON.stringify(updatedIds));
      } else {
        const updatedIds = savedTourIds.filter(id => id !== tourId);
        localStorage.setItem('savedTours', JSON.stringify(updatedIds));
      }
      
      setTours(prevTours => 
        prevTours.map(t => 
          t.id === tourId ? { ...t, is_saved: isSaved } : t
        )
      );
      alert('Error guardando tour');
    }
  };

  const ContactModal = ({ tour, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Contactar Guía</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="text-gray-500" size={20} />
            <span>{tour.guide_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-gray-500" size={20} />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-gray-500" size={20} />
            <span>guia@colonialstours.com</span>
          </div>
          <textarea 
            placeholder="Escribe tu consulta..."
            className="w-full p-3 border rounded-lg h-24"
          />
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 border rounded-lg">Cancelar</button>
            <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg">Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );

  const TourDetailModal = ({ tour, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {tour.image_url && (
          <img src={tour.image_url} alt={tour.title} className="w-full h-64 object-cover rounded-t-2xl" />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{tour.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <DollarSign className="mx-auto mb-1 text-green-600" size={20} />
              <p className="text-sm text-gray-600">Precio</p>
              <p className="font-bold">${tour.price}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Clock className="mx-auto mb-1 text-blue-600" size={20} />
              <p className="text-sm text-gray-600">Duración</p>
              <p className="font-bold">{tour.duration}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <MapPin className="mx-auto mb-1 text-red-600" size={20} />
              <p className="text-sm text-gray-600">Ubicación</p>
              <p className="font-bold">{tour.location}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Descripción</h3>
            <p className="text-gray-600">{tour.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Guía Turístico</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>{tour.guide_name}</span>
              <button 
                onClick={() => setShowContactModal(tour)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Contactar
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Valoraciones</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-sm text-gray-600">4.8 (24 reseñas)</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm">"Excelente tour, muy recomendado"</p>
                <p className="text-xs text-gray-500 mt-1">- María G.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => saveTour(tour.id)}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
                tour.is_saved
                  ? 'border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Bookmark size={16} fill={tour.is_saved ? 'currentColor' : 'none'} /> 
              {tour.is_saved ? 'Guardado' : 'Guardar'}
            </button>
            <button 
              onClick={() => addToCart(tour.id)}
              className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Reservar Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Explorar Tours</h1>
          <p className="text-gray-600 mt-2">Descubre experiencias únicas en la Zona Colonial</p>
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
                placeholder="Buscar tours..."
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
              <option value="all">Todas las categorías</option>
              <option value="Cultural">Cultural</option>
              <option value="Histórico">Histórico</option>
              <option value="Gastronómico">Gastronómico</option>
              <option value="Aventura">Aventura</option>
              <option value="Nocturno">Nocturno</option>
              <option value="Familiar">Familiar</option>
              <option value="Arquitectónico">Arquitectónico</option>
              <option value="Religioso">Religioso</option>
            </select>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map(tour => (
            <div key={tour.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {tour.image_url && (
                <img 
                  src={tour.image_url} 
                  alt={tour.title} 
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => setSelectedTour(tour)}
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{tour.title}</h3>
                  <div className="flex text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{tour.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-2" />
                    {tour.location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={14} className="mr-2" />
                    {tour.duration}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <User size={14} className="mr-2" />
                    {tour.guide_name}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-600">${tour.price}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveTour(tour.id)}
                      className={`p-2 border rounded-lg transition-colors ${
                        tour.is_saved
                          ? 'border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Bookmark size={16} fill={tour.is_saved ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => window.location.href = `/tours/${tour.id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => addToCart(tour.id)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron tours</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedTour && (
        <TourDetailModal 
          tour={selectedTour} 
          onClose={() => setSelectedTour(null)} 
        />
      )}
      
      {showContactModal && (
        <ContactModal 
          tour={showContactModal} 
          onClose={() => setShowContactModal(null)} 
        />
      )}
    </div>
  );
};

export default Tours;