import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { User, ShoppingCart, MapPin, Plus, Trash2, DollarSign, Heart, Settings, Clock, CreditCard, Check, X, Edit3, TrendingUp, Bookmark } from 'react-feather';
import apiService from '../services/api';
import ImageUpload from './ImageUpload';
import MultiImageUpload from './MultiImageUpload';

// Componente de notificación moderna
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };
  
  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-80 backdrop-blur-sm border ${
        type === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : type === 'error' 
          ? 'bg-red-50 border-red-200 text-red-800' 
          : 'bg-blue-50 border-blue-200 text-blue-800'
      }`}>
        <div className={`p-1 rounded-full ${
          type === 'success' ? 'bg-green-100' : type === 'error' ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          {type === 'success' && <Check size={16} className="text-green-600" />}
          {type === 'error' && <X size={16} className="text-red-600" />}
          {type === 'info' && <Check size={16} className="text-blue-600" />}
        </div>
        <span className="font-medium flex-1">{message}</span>
        <button 
          onClick={handleClose} 
          className="ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

// Modal de pago
const PaymentModal = ({ isOpen, onClose, total, onConfirm }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '4532 1234 5678 9012',
    expiryDate: '12/25',
    cvv: '123',
    cardName: 'Juan Pérez',
    paymentMethod: 'credit'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(paymentData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Procesar Pago</h3>
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <span className="text-lg font-bold">Total: ${total}</span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Número de Tarjeta</label>
            <input
              type="text"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
              placeholder="1234 5678 9012 3456"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Exp.</label>
              <input
                type="text"
                value={paymentData.expiryDate}
                onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                placeholder="MM/YY"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                value={paymentData.cvv}
                onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                placeholder="123"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nombre en Tarjeta</label>
            <input
              type="text"
              value={paymentData.cardName}
              onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
              placeholder="Juan Pérez"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Confirmar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function Profile() {
  const { user, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState('tours');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Estados para datos
  const [tours, setTours] = useState([]);
  const [myTours, setMyTours] = useState([]);
  const [cart, setCart] = useState([]);
  const [savedTours, setSavedTours] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    profileImage: user?.profile_image || ''
  });
  
  const [guideRequest, setGuideRequest] = useState(null);
  
  const [newTour, setNewTour] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    location: '',
    category: '',
    images: [],
    includes: [],
    itinerary: [],
    maxParticipants: 12,
    languages: 'ES, EN'
  });
  
  const [editingTour, setEditingTour] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadTours();
    loadCart();
    loadSavedTours();
    loadPurchaseHistory();
    loadUserProfile();
    loadMyTours();
    loadGuideRequestStatus();
  }, [user]);

  const loadGuideRequestStatus = async () => {
    if (!user) return;
    try {
      const response = await apiService.request('/user/guide-request-status');
      setGuideRequest(response.request);
    } catch (error) {
      console.error('Error loading guide request status:', error);
    }
  };

  const loadUserProfile = async () => {
    if (!user) return;
    try {
      const response = await apiService.request('/user/profile');
      if (response.success) {
        setUserProfile({
          name: response.user.name || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          address: response.user.address || '',
          profileImage: response.user.profile_image || ''
        });
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  const loadTours = async () => {
    try {
      const response = await apiService.request('/tours');
      setTours(response.tours || []);
    } catch (error) {
      showToast('Error cargando tours', 'error');
    }
  };

  const loadCart = async () => {
    if (!user) return;
    try {
      const response = await apiService.request('/tours/cart');
      setCart(response.cart || []);
    } catch (error) {
      console.error('Error cargando carrito');
      setCart([]);
    }
  };

  const loadSavedTours = async () => {
    if (!user) return;
    try {
      const response = await apiService.request('/tours/saved');
      setSavedTours(response.savedTours || []);
    } catch (error) {
      console.error('Error cargando tours guardados');
      setSavedTours([]);
    }
  };

  const loadPurchaseHistory = async () => {
    if (!user) return;
    try {
      const response = await apiService.request('/tours/history');
      setPurchaseHistory(response.purchases || []);
    } catch (error) {
      console.error('Error cargando historial');
      setPurchaseHistory([]);
    }
  };

  const loadMyTours = async () => {
    if (!user) return;
    try {
      const response = await apiService.request('/tours/my-tours');
      console.log('Mis tours response:', response);
      console.log('Tours data:', response.tours);
      if (response.tours) {
        response.tours.forEach((tour, index) => {
          console.log(`Tour ${index + 1}:`, {
            id: tour.id,
            title: tour.title,
            image_url: tour.image_url,
            images: tour.images
          });
        });
      }
      setMyTours(response.tours || []);
    } catch (error) {
      console.error('Error cargando mis tours');
      setMyTours([]);
    }
  };

  const addToCart = async (tourId) => {
    try {
      await apiService.request('/tours/cart', {
        method: 'POST',
        body: JSON.stringify({ tourId })
      });
      loadCart();
      showToast('Tour agregado al carrito');
    } catch (error) {
      showToast('Error agregando al carrito', 'error');
    }
  };

  const removeFromCart = async (tourId) => {
    try {
      await apiService.request(`/tours/cart/${tourId}`, { method: 'DELETE' });
      loadCart();
      showToast('Tour removido del carrito');
    } catch (error) {
      showToast('Error removiendo del carrito', 'error');
    }
  };

  const saveTour = async (tourId) => {
    try {
      const tour = tours.find(t => t.id === tourId);
      if (tour?.is_saved) {
        await apiService.request(`/tours/saved/${tourId}`, { method: 'DELETE' });
        showToast('Tour removido de favoritos');
      } else {
        await apiService.request('/tours/save', {
          method: 'POST',
          body: JSON.stringify({ tourId })
        });
        showToast('Tour guardado');
      }
      loadTours(); // Recargar tours para actualizar estado
      loadSavedTours();
    } catch (error) {
      showToast('Error guardando tour', 'error');
    }
  };

  const removeSavedTour = async (tourId) => {
    try {
      await apiService.request(`/tours/saved/${tourId}`, { method: 'DELETE' });
      loadSavedTours();
      showToast('Tour removido de guardados');
    } catch (error) {
      showToast('Error removiendo tour guardado', 'error');
    }
  };

  const handlePayment = async (paymentData) => {
    setLoading(true);
    try {
      await apiService.request('/tours/purchase', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
      setShowPaymentModal(false);
      loadCart();
      loadPurchaseHistory();
      showToast('¡Compra procesada exitosamente!');
    } catch (error) {
      showToast('Error procesando pago', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tourData = {
        ...(editingTour || newTour),
        images: (editingTour || newTour).images || [],
        imageUrl: (editingTour || newTour).images?.[0] || null
      };
      console.log('=== CREANDO TOUR ===');
      console.log('Datos del tour a crear:', tourData);
      console.log('Número de imágenes a enviar:', tourData.images.length);
      console.log('Array de imágenes:', tourData.images);
      
      const response = await apiService.request('/tours', {
        method: 'POST',
        body: JSON.stringify(tourData)
      });
      console.log('Respuesta del servidor al crear:', response);
      setEditingTour(null);
      setNewTour({ title: '', description: '', price: '', duration: '', location: '', category: '', images: [], includes: [], itinerary: [], maxParticipants: 12, languages: 'ES, EN' });
      loadTours();
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
      const tourData = {
        ...editingTour,
        images: editingTour.images || [],
        imageUrl: editingTour.images?.[0] || editingTour.image_url
      };
      await apiService.request(`/tours/${editingTour.id}`, {
        method: 'PUT',
        body: JSON.stringify(tourData)
      });
      setEditingTour(null);
      loadTours();
      loadMyTours();
      showToast('Tour actualizado exitosamente');
    } catch (error) {
      showToast('Error actualizando tour', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteTour = async (tourId) => {
    setConfirmDialog({
      title: '¿Eliminar Tour?',
      message: 'Esta acción no se puede deshacer. El tour será eliminado permanentemente.',
      onConfirm: async () => {
        setLoading(true);
        try {
          await apiService.request(`/tours/${tourId}`, { method: 'DELETE' });
          loadTours();
          loadMyTours();
          showToast('Tour eliminado exitosamente');
        } catch (error) {
          showToast('Error eliminando tour', 'error');
        } finally {
          setLoading(false);
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profileData = {
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        address: userProfile.address,
        profileImage: userProfile.profileImage
      };
      
      const response = await apiService.updateProfile(profileData);
      if (response.success) {
        // Actualizar usuario en localStorage
        const updatedUser = { 
          ...user, 
          ...response.user,
          profile_image: userProfile.profileImage
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showToast('Perfil actualizado exitosamente');
        
        // Actualizar el contexto de autenticación
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (error) {
      showToast('Error actualizando perfil', 'error');
    } finally {
      setLoading(false);
    }
  };



  const getTotalPrice = () => cart.reduce((total, tour) => total + parseFloat(tour.price), 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      


      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="flex gap-2 mb-8 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/20 shadow-lg">
          {[
            { id: 'tours', label: 'Explorar', icon: MapPin, color: 'from-green-500 to-emerald-600' },
            { id: 'cart', label: `Carrito${cart.length > 0 ? ` (${cart.length})` : ''}`, icon: ShoppingCart, color: 'from-blue-500 to-cyan-600', badge: cart.length },
            { id: 'saved', label: 'Guardados', icon: Heart, color: 'from-pink-500 to-rose-600' },
            { id: 'history', label: 'Historial', icon: Clock, color: 'from-purple-500 to-violet-600' },
            { id: 'profile', label: 'Perfil', icon: Settings, color: 'from-gray-500 to-slate-600' },
            ...(user?.role === 'guide' || user?.role === 'admin' ? [{ id: 'manage', label: 'Mis Tours', icon: Plus, color: 'from-orange-500 to-amber-600' }] : [])
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105` 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tours Disponibles */}
        {activeTab === 'tours' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => (
              <div key={tour.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {tour.image_url && (
                  <img src={tour.image_url} alt={tour.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{tour.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin size={14} className="mr-2" />
                      {tour.location}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duración: {tour.duration}</span>
                      <span className="text-gray-500">Guía: {tour.guide_name}</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">${tour.price}</div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(tour.id)}
                      disabled={cart.find(item => item.id === tour.id)}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 disabled:bg-gray-300 transition-colors"
                    >
                      {cart.find(item => item.id === tour.id) ? 'En Carrito' : 'Agregar'}
                    </button>
                    <button
                      onClick={() => saveTour(tour.id)}
                      className={`p-3 border rounded-xl transition-colors ${
                        tour.is_saved
                          ? 'border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Bookmark size={18} fill={tour.is_saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Carrito */}
        {activeTab === 'cart' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Mi Carrito de Tours</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">No hay tours en tu carrito</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(tour => (
                    <div key={tour.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{tour.title}</h3>
                        <p className="text-sm text-gray-600">{tour.location} • {tour.duration}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-orange-600">${tour.price}</span>
                        <button
                          onClick={() => removeFromCart(tour.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total: ${getTotalPrice()}</span>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    Proceder al Pago
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tours Guardados */}
        {activeTab === 'saved' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTours.map(tour => (
              <div key={tour.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {tour.image_url && (
                  <img src={tour.image_url} alt={tour.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{tour.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin size={14} className="mr-2" />
                      {tour.location}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duración: {tour.duration}</span>
                      <span className="text-gray-500">Guía: {tour.guide_name}</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">${tour.price}</div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(tour.id)}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
                    >
                      Agregar al Carrito
                    </button>
                    <button
                      onClick={() => removeSavedTour(tour.id)}
                      className="p-3 border border-red-200 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Historial */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Historial de Compras</h2>
            {purchaseHistory.length === 0 ? (
              <p className="text-gray-600">No tienes compras realizadas</p>
            ) : (
              <div className="space-y-4">
                {purchaseHistory.map(purchase => (
                  <div key={purchase.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Compra #{purchase.id}</p>
                        <p className="text-sm text-gray-600">{new Date(purchase.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold text-green-600">${purchase.total}</span>
                    </div>
                    <p className="text-sm text-gray-600">Tours: {purchase.tour_titles}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      purchase.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {purchase.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mi Perfil */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Mi Información Personal</h2>
            
            {/* Foto de Perfil */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">Foto de Perfil</label>
              <div className="flex items-start gap-6">
                {userProfile.profileImage ? (
                  <img 
                    src={userProfile.profileImage} 
                    alt="Perfil"
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                    <User className="text-white" size={32} />
                  </div>
                )}
                <div className="flex-1">
                  <ImageUpload 
                    onImageUpload={(imageData) => {
                      setUserProfile({...userProfile, profileImage: imageData});
                    }}
                    currentImage={userProfile.profileImage}
                    className="max-w-xs"
                  />
                  {userProfile.profileImage && (
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setUserProfile({...userProfile, profileImage: ''})}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        Eliminar Imagen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Become Guide Section */}
            {user?.role !== 'guide' && user?.role !== 'admin' && (
              <div className={`rounded-2xl p-6 text-white mb-8 ${
                guideRequest?.status === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                guideRequest?.status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                {guideRequest?.status === 'pending' ? (
                  <>
                    <h3 className="text-xl font-bold mb-2">Solicitud Pendiente</h3>
                    <p className="text-yellow-100 mb-4">Tu solicitud para ser guía está siendo revisada por un administrador.</p>
                    <div className="bg-white/20 px-4 py-2 rounded-lg inline-block">
                      <span className="font-medium">Estado: Pendiente</span>
                    </div>
                  </>
                ) : guideRequest?.status === 'rejected' ? (
                  <>
                    <h3 className="text-xl font-bold mb-2">Solicitud Rechazada</h3>
                    <p className="text-red-100 mb-4">Tu solicitud para ser guía fue rechazada. Puedes intentar nuevamente más tarde.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-2">¿Quieres ser guía turístico?</h3>
                    <p className="text-blue-100 mb-4">Comparte tus conocimientos y crea tours únicos para otros viajeros.</p>
                    <button
                      onClick={async () => {
                        try {
                          await apiService.request('/user/become-guide', { method: 'POST' });
                          showToast('Solicitud enviada correctamente');
                          loadGuideRequestStatus();
                        } catch (error) {
                          showToast(error.message || 'Error enviando solicitud', 'error');
                        }
                      }}
                      className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Solicitar ser Guía
                    </button>
                  </>
                )}
              </div>
            )}
            
            <form onSubmit={updateProfile} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={userProfile.address}
                    onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Calle, Ciudad, País"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Settings size={16} />
                  )}
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gestión de Tours */}
        {activeTab === 'manage' && (user?.role === 'guide' || user?.role === 'admin') && (
          <div className="space-y-8">
            {/* Bienvenida para nuevos usuarios */}
            {myTours.length === 0 && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">¡Crea tu primer tour!</h2>
                <p className="text-blue-100 mb-4">Comparte tus lugares favoritos y experiencias únicas creando tours personalizados.</p>
                <button
                  onClick={() => setEditingTour({ title: '', description: '', price: '', duration: '', location: '', images: [] })}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Crear Mi Primer Tour
                </button>
              </div>
            )}
            
            {/* Header con acción */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Mis Tours</h2>
                <p className="text-gray-500 mt-1">Gestiona tus tours y crea nuevos</p>
              </div>
              <button
                onClick={() => setEditingTour({ title: '', description: '', price: '', duration: '', location: '', images: [] })}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Nuevo Tour
              </button>
            </div>

            {/* Lista de Tours */}
            {myTours.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes tours creados</h3>
                <p className="text-gray-500 mb-6">Crea tu primer tour para comenzar a recibir reservas</p>
                <button
                  onClick={() => setEditingTour({ title: '', description: '', price: '', duration: '', location: '', images: [] })}
                  className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
                >
                  Crear Tour
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTours.map(tour => (
                  <div key={tour.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    {(tour.image_url || (tour.images && tour.images.length > 0)) ? (
                      <img 
                        src={tour.image_url || (tour.images && tour.images[0])} 
                        alt={tour.title} 
                        className="w-full h-40 object-cover" 
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <MapPin className="text-gray-400" size={32} />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{tour.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin size={14} className="mr-2" />
                          {tour.location}
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duración: {tour.duration}</span>
                          <span className="font-semibold text-orange-600">${tour.price}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingTour({...tour, images: tour.images || (tour.image_url ? [tour.image_url] : [])})}
                          className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit3 size={16} /> Editar
                        </button>
                        <button
                          onClick={() => deleteTour(tour.id)}
                          className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal de Edición/Creación */}
            {editingTour && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingTour.id ? 'Editar Tour' : 'Crear Nuevo Tour'}
                    </h2>
                  </div>
                  <form onSubmit={editingTour.id ? updateTour : createTour} className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Imágenes del Tour</label>
                      <MultiImageUpload 
                        onImagesChange={(images) => setEditingTour({...editingTour, images})}
                        currentImages={editingTour.images || (editingTour.image_url ? [editingTour.image_url] : [])}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título del Tour</label>
                      <input
                        type="text"
                        value={editingTour.title}
                        onChange={(e) => setEditingTour({...editingTour, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ej: Tour Colonial Centro Histórico"
                        required
                      />
                    </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={editingTour.description}
                      onChange={(e) => setEditingTour({...editingTour, description: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      rows="3"
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Precio ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingTour.price}
                        onChange={(e) => setEditingTour({...editingTour, price: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duración</label>
                      <input
                        type="text"
                        value={editingTour.duration}
                        onChange={(e) => setEditingTour({...editingTour, duration: e.target.value})}
                        placeholder="ej: 3h"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                      <input
                        type="text"
                        value={editingTour.location}
                        onChange={(e) => setEditingTour({...editingTour, location: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                      <select
                        value={editingTour.category || ''}
                        onChange={(e) => setEditingTour({...editingTour, category: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      >
                        <option value="">Seleccionar categoría</option>
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qué incluye</label>
                    <textarea
                      value={Array.isArray(editingTour.includes) ? editingTour.includes.join('\n') : ''}
                      onChange={(e) => setEditingTour({...editingTour, includes: e.target.value.split('\n').filter(item => item.trim())})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      rows="4"
                      placeholder="Guía en español e inglés\nSesión de fotos incluida\nDegustación gastronómica\nSeguro incluido"
                    />
                    <p className="text-xs text-gray-500 mt-1">Escribe cada item en una línea separada</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Itinerario</label>
                    <textarea
                      value={Array.isArray(editingTour.itinerary) ? editingTour.itinerary.map(item => `${item.time} - ${item.activity}`).join('\n') : ''}
                      onChange={(e) => {
                        const items = e.target.value.split('\n').filter(line => line.trim()).map(line => {
                          const [time, ...activityParts] = line.split(' - ');
                          return { time: time?.trim() || '', activity: activityParts.join(' - ').trim() || '' };
                        });
                        setEditingTour({...editingTour, itinerary: items});
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      rows="6"
                      placeholder="9:00 AM - Encuentro en Parque Colón\n9:15 AM - Visita a la Catedral Primada\n10:00 AM - Recorrido por Calle Las Damas"
                    />
                    <p className="text-xs text-gray-500 mt-1">Formato: Hora - Actividad (una por línea)</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Máximo participantes</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={editingTour.maxParticipants || 12}
                        onChange={(e) => setEditingTour({...editingTour, maxParticipants: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Idiomas</label>
                      <input
                        type="text"
                        value={editingTour.languages || 'ES, EN'}
                        onChange={(e) => setEditingTour({...editingTour, languages: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="ES, EN, FR"
                      />
                    </div>
                  </div>
                  
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingTour(null)}
                        className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            {editingTour.id ? <Edit3 size={18} /> : <Plus size={18} />}
                            {editingTour.id ? 'Actualizar' : 'Crear'} Tour
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}


          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={getTotalPrice()}
        onConfirm={handlePayment}
      />
      
      {/* Modal de Confirmación */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmDialog.title}</h3>
              <p className="text-gray-600">{confirmDialog.message}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmDialog.onCancel}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;