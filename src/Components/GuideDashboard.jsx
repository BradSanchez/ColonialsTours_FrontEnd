import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { MapPin, DollarSign, Clock, Plus, Edit3, Trash2, Eye } from 'react-feather';
import MultiImageUpload from './MultiImageUpload';
import apiService from '../services/api';

const GuideDashboard = () => {
  const { user, logout } = useAuthContext();
  const [tours, setTours] = useState([]);
  const [editingTour, setEditingTour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user?.role !== 'guide') {
      window.location.href = '/';
      return;
    }
    loadMyTours();
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadMyTours = async () => {
    setLoading(true);
    try {
      const response = await apiService.request('/guide/tours');
      setTours(response.tours || []);
    } catch (error) {
      console.error('Error loading tours');
    } finally {
      setLoading(false);
    }
  };

  const createTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.request('/guide/tours', {
        method: 'POST',
        body: JSON.stringify({
          ...editingTour,
          images: editingTour.images || [],
          imageUrl: editingTour.images?.[0] || ''
        })
      });
      setEditingTour(null);
      loadMyTours();
      showToast('Tour creado exitosamente');
    } catch (error) {
      showToast('Error creando tour', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.request(`/guide/tours/${editingTour.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...editingTour,
          images: editingTour.images || [],
          imageUrl: editingTour.images?.[0] || editingTour.image_url
        })
      });
      setEditingTour(null);
      loadMyTours();
      showToast('Tour actualizado exitosamente');
    } catch (error) {
      showToast('Error actualizando tour', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteTour = async (tourId) => {
    if (!confirm('¿Estás seguro de eliminar este tour?')) return;
    
    try {
      await apiService.request(`/guide/tours/${tourId}`, { method: 'DELETE' });
      loadMyTours();
      showToast('Tour eliminado exitosamente');
    } catch (error) {
      showToast('Error eliminando tour', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Guía</h1>
            <p className="text-gray-600">Gestiona tus tours y experiencias</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hola, {user?.name}</span>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Create Tour Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mis Tours</h2>
            <p className="text-gray-600">Administra tus experiencias turísticas</p>
          </div>
          <button
            onClick={() => setEditingTour({ 
              title: '', 
              description: '', 
              price: '', 
              duration: '', 
              location: '', 
              images: [] 
            })}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={18} />
            Crear Nuevo Tour
          </button>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando tours...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => (
              <div key={tour.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative">
                  <img 
                    src={tour.images?.[0] || tour.image_url || 'https://via.placeholder.com/400x200'} 
                    alt={tour.title}
                    className="w-full h-48 object-cover"
                  />
                  {tour.images?.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                      +{tour.images.length - 1} fotos
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{tour.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
                  
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
                      <DollarSign size={14} className="mr-2" />
                      ${tour.price}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(`/tours/${tour.id}`, '_blank')}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-1"
                    >
                      <Eye size={14} />
                      Ver
                    </button>
                    <button
                      onClick={() => setEditingTour({
                        ...tour, 
                        images: tour.images || (tour.image_url ? [tour.image_url] : [])
                      })}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm flex items-center justify-center gap-1"
                    >
                      <Edit3 size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => deleteTour(tour.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tours.length === 0 && !loading && (
          <div className="text-center py-12">
            <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes tours creados</h3>
            <p className="text-gray-500 mb-6">Crea tu primer tour para comenzar a recibir reservas</p>
            <button
              onClick={() => setEditingTour({ 
                title: '', 
                description: '', 
                price: '', 
                duration: '', 
                location: '', 
                images: [] 
              })}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Crear Mi Primer Tour
            </button>
          </div>
        )}
      </div>

      {/* Tour Modal */}
      {editingTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingTour.id ? 'Editar Tour' : 'Crear Nuevo Tour'}
              </h2>
            </div>
            
            <form onSubmit={editingTour.id ? updateTour : createTour} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Imágenes del Tour
                </label>
                <MultiImageUpload 
                  onImagesChange={(images) => setEditingTour({...editingTour, images})}
                  currentImages={editingTour.images || []}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Tour
                </label>
                <input
                  type="text"
                  value={editingTour.title}
                  onChange={(e) => setEditingTour({...editingTour, title: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Tour Colonial Centro Histórico"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={editingTour.description}
                  onChange={(e) => setEditingTour({...editingTour, description: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Describe tu experiencia turística..."
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingTour.price}
                    onChange={(e) => setEditingTour({...editingTour, price: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración
                  </label>
                  <input
                    type="text"
                    value={editingTour.duration}
                    onChange={(e) => setEditingTour({...editingTour, duration: e.target.value})}
                    placeholder="ej: 3h"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={editingTour.location}
                    onChange={(e) => setEditingTour({...editingTour, location: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTour(null)}
                  className="flex-1 py-3 border rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : editingTour.id ? 'Actualizar' : 'Crear'} Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideDashboard;