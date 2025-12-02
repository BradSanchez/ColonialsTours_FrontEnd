import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { TrendingUp, Users, MapPin, DollarSign, Trash2, Eye, Check, X, Plus, Edit3, User, Settings, Star, MessageSquare, Shield, Activity, Mail, LogOut, ChevronDown } from 'react-feather';
import ImageUpload from './ImageUpload';
import MultiImageUpload from './MultiImageUpload';
import SettingsModal from './SettingsModal';
import apiService from '../services/api';

// Componente Toast
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
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className={`p-1 rounded-full ${
          type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {type === 'success' && <Check size={16} className="text-green-600" />}
          {type === 'error' && <X size={16} className="text-red-600" />}
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

const AdminDashboard = () => {
  const { user, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [editingTour, setEditingTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [footerSettings, setFooterSettings] = useState({
    companyName: 'Colonials Tours',
    description: 'Descubre la historia y cultura de la Zona Colonial con nuestros tours especializados.',
    phone: '+1 (809) 555-0123',
    email: 'info@colonialstours.com',
    address: 'Calle Las Damas, Zona Colonial, Santo Domingo',
    facebook: 'https://facebook.com/colonialstours',
    instagram: 'https://instagram.com/colonialstours',
    twitter: 'https://twitter.com/colonialstours'
  });
  const [adminProfile, setAdminProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    profileImage: user?.profile_image || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [guideRequests, setGuideRequests] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    loadStats();
    loadAdminProfile();
  }, [user]);

  const loadAdminProfile = async () => {
    try {
      const response = await apiService.request('/user/profile');
      if (response.success) {
        setAdminProfile({
          name: response.user.name || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          address: response.user.address || '',
          profileImage: response.user.profile_image || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error cargando perfil admin');
    }
  };

  const loadReviews = async () => {
    setLoading(true);
    try {
      // Simulando datos de reseñas
      setReviews([
        { id: 1, user: 'María García', tour: 'Tour Colonial', rating: 5, comment: 'Excelente experiencia', date: '2024-01-15', status: 'approved' },
        { id: 2, user: 'Carlos López', tour: 'Tour Gastronómico', rating: 4, comment: 'Muy buena comida', date: '2024-01-14', status: 'pending' },
        { id: 3, user: 'Ana Martín', tour: 'Tour Nocturno', rating: 3, comment: 'Podría mejorar', date: '2024-01-13', status: 'approved' }
      ]);
    } catch (error) {
      console.error('Error loading reviews');
    } finally {
      setLoading(false);
    }
  };

  const loadNewsletters = async () => {
    setLoading(true);
    try {
      const response = await apiService.request('/admin/newsletters');
      const newsletterData = response.newsletters || [];
      setNewsletters(newsletterData);
      setStats(prev => ({ ...prev, totalNewsletters: newsletterData.length }));
    } catch (error) {
      console.error('Error loading newsletters');
      // Datos de ejemplo si falla la API
      const fallbackData = [
        { id: 1, email: 'maria@example.com', subscribed_at: '2024-01-15T10:30:00Z', status: 'active' },
        { id: 2, email: 'carlos@example.com', subscribed_at: '2024-01-14T15:20:00Z', status: 'active' },
        { id: 3, email: 'ana@example.com', subscribed_at: '2024-01-13T09:45:00Z', status: 'active' }
      ];
      setNewsletters(fallbackData);
      setStats(prev => ({ ...prev, totalNewsletters: fallbackData.length }));
    } finally {
      setLoading(false);
    }
  };

  const loadGuideRequests = async () => {
    setLoading(true);
    try {
      const response = await apiService.request('/admin/guide-requests');
      setGuideRequests(response.requests || []);
    } catch (error) {
      console.error('Error loading guide requests:', error);
      setGuideRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const approveGuideRequest = async (requestId) => {
    try {
      await apiService.request(`/admin/guide-requests/${requestId}/approve`, { method: 'POST' });
      loadGuideRequests();
      showToast('Solicitud aprobada exitosamente');
    } catch (error) {
      showToast('Error aprobando solicitud', 'error');
    }
  };

  const rejectGuideRequest = async (requestId) => {
    try {
      await apiService.request(`/admin/guide-requests/${requestId}/reject`, { method: 'POST' });
      loadGuideRequests();
      showToast('Solicitud rechazada');
    } catch (error) {
      showToast('Error rechazando solicitud', 'error');
    }
  };

  const loadFooterSettings = async () => {
    try {
      const saved = localStorage.getItem('footerSettings');
      if (saved) {
        setFooterSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading footer settings');
    }
  };

  const updateFooterSettings = async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('footerSettings', JSON.stringify(footerSettings));
      showToast('Configuración del footer actualizada');
    } catch (error) {
      showToast('Error actualizando configuración', 'error');
    }
  };

  const moderateReview = async (reviewId, action) => {
    try {
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, status: action } : review
      ));
      showToast(`Reseña ${action === 'approved' ? 'aprobada' : 'rechazada'}`);
    } catch (error) {
      showToast('Error moderando reseña', 'error');
    }
  };

  const deleteNewsletter = async (newsletterId) => {
    setConfirmDialog({
      title: '¿Eliminar Suscripción?',
      message: 'Esta acción eliminará permanentemente la suscripción del newsletter.',
      onConfirm: async () => {
        try {
          await apiService.request(`/admin/newsletters/${newsletterId}`, { method: 'DELETE' });
          loadNewsletters();
          showToast('Suscripción eliminada exitosamente');
        } catch (error) {
          showToast('Error eliminando suscripción', 'error');
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const loadTestimonials = async () => {
    try {
      const saved = localStorage.getItem('testimonials');
      if (saved) {
        setTestimonials(JSON.parse(saved));
      } else {
        const defaultTestimonials = [
          { id: 1, name: 'María G.', comment: 'El tour histórico fue increíble. Nuestro guía conocía cada detalle de los edificios y la historia colonial. ¡Altamente recomendado!', rating: 5, active: true },
          { id: 2, name: 'Carlos R.', comment: 'La comida en el tour gastronómico fue excepcional. Probé platos que nunca hubiera encontrado por mi cuenta. ¡Volveré!', rating: 5, active: true },
          { id: 3, name: 'Laura M.', comment: 'El mapa interactivo fue muy útil para planificar nuestro día. Pudimos ver todos los lugares importantes sin perdernos.', rating: 5, active: true }
        ];
        setTestimonials(defaultTestimonials);
        localStorage.setItem('testimonials', JSON.stringify(defaultTestimonials));
      }
    } catch (error) {
      console.error('Error loading testimonials');
    }
  };

  const saveTestimonial = async (testimonialData) => {
    try {
      let updatedTestimonials;
      if (editingTestimonial?.id) {
        updatedTestimonials = testimonials.map(t => 
          t.id === editingTestimonial.id ? { ...testimonialData, id: editingTestimonial.id } : t
        );
      } else {
        const newId = Math.max(...testimonials.map(t => t.id), 0) + 1;
        updatedTestimonials = [...testimonials, { ...testimonialData, id: newId, active: true }];
      }
      setTestimonials(updatedTestimonials);
      localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
      setEditingTestimonial(null);
      showToast('Testimonio guardado exitosamente');
    } catch (error) {
      showToast('Error guardando testimonio', 'error');
    }
  };

  const deleteTestimonial = async (testimonialId) => {
    setConfirmDialog({
      title: '¿Eliminar Testimonio?',
      message: 'Esta acción no se puede deshacer',
      onConfirm: () => {
        const updatedTestimonials = testimonials.filter(t => t.id !== testimonialId);
        setTestimonials(updatedTestimonials);
        localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
        showToast('Testimonio eliminado exitosamente');
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const updateAdminProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profileData = {
        name: adminProfile.name,
        email: adminProfile.email,
        phone: adminProfile.phone,
        address: adminProfile.address,
        profileImage: adminProfile.profileImage
      };
      
      if (adminProfile.newPassword) {
        if (adminProfile.newPassword !== adminProfile.confirmPassword) {
          showToast('Las contraseñas no coinciden', 'error');
          return;
        }
        profileData.currentPassword = adminProfile.currentPassword;
        profileData.newPassword = adminProfile.newPassword;
      }
      
      const response = await apiService.request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      
      if (response.success) {
        const updatedUser = { ...user, ...response.user, profile_image: response.user.profile_image };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showToast('Perfil actualizado exitosamente');
        setAdminProfile(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setShowProfileModal(false);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      showToast('Error actualizando perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [statsResponse, newslettersResponse] = await Promise.all([
        apiService.request('/admin/stats'),
        apiService.request('/admin/newsletters')
      ]);
      setStats({
        ...statsResponse.stats,
        totalNewsletters: newslettersResponse.newsletters?.length || 0
      });
    } catch (error) {
      console.error('Error loading stats');
      setStats(prev => ({ ...prev, totalNewsletters: 0 }));
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.request('/admin/users');
      setUsers(response.users);
    } catch (error) {
      console.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const loadTours = async () => {
    setLoading(true);
    try {
      const response = await apiService.request('/admin/tours');
      setTours(response.tours);
    } catch (error) {
      console.error('Error loading tours');
    } finally {
      setLoading(false);
    }
  };

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const response = await apiService.request('/admin/purchases');
      setPurchases(response.purchases);
    } catch (error) {
      console.error('Error loading purchases');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setConfirmDialog({
      title: '¿Eliminar Usuario?',
      message: 'Esta acción no se puede deshacer',
      onConfirm: async () => {
        try {
          await apiService.request(`/admin/users/${userId}`, { method: 'DELETE' });
          loadUsers();
          loadStats();
          showToast('Usuario eliminado exitosamente');
        } catch (error) {
          showToast('Error eliminando usuario', 'error');
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const deleteTour = async (tourId) => {
    setConfirmDialog({
      title: '¿Eliminar Tour?',
      message: 'Esta acción no se puede deshacer',
      onConfirm: async () => {
        try {
          await apiService.request(`/admin/tours/${tourId}`, { method: 'DELETE' });
          loadTours();
          loadStats();
          showToast('Tour eliminado exitosamente');
        } catch (error) {
          showToast('Error eliminando tour', 'error');
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const createTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.request('/tours', {
        method: 'POST',
        body: JSON.stringify({
          ...editingTour,
          images: editingTour.images || []
        })
      });
      setEditingTour(null);
      loadTours();
      loadStats();
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
      showToast('Tour actualizado exitosamente');
    } catch (error) {
      showToast('Error actualizando tour', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'tours') loadTours();
    if (activeTab === 'purchases') loadPurchases();
    if (activeTab === 'reviews') loadReviews();
    if (activeTab === 'testimonials') loadTestimonials();
    if (activeTab === 'newsletters') loadNewsletters();
    if (activeTab === 'guide-requests') loadGuideRequests();
    if (activeTab === 'settings') loadFooterSettings();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-100 relative z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-500 text-sm">Panel de administración</p>
            </div>
          </div>
          <div className="relative z-50 dropdown-container">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowProfileDropdown(!showProfileDropdown); }}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {user?.profile_image ? (
                <img 
                  src={user.profile_image} 
                  alt="Admin"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
              )}
              <div className="text-left">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('CLICK EN MI PERFIL');
                    setShowProfileModal(true); 
                    setShowProfileDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left cursor-pointer"
                >
                  <User size={16} />
                  Mi Perfil
                </div>
                <button
                  onClick={() => { setShowSettingsModal(true); setShowProfileDropdown(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <Settings size={16} />
                  Configuración
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => { logout(); setShowProfileDropdown(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Usuarios</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                <p className="text-xs text-green-600 mt-1">↗ Activos</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tours</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTours || 0}</p>
                <p className="text-xs text-green-600 mt-1">↗ Disponibles</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <MapPin className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Compras</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPurchases || 0}</p>
                <p className="text-xs text-purple-600 mt-1">↗ Completadas</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ingresos</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue || 0}</p>
                <p className="text-xs text-yellow-600 mt-1">↗ Total</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Suscriptores</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalNewsletters || 0}</p>
                <p className="text-xs text-orange-600 mt-1">↗ Newsletter</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <Mail className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-8">
          {[
            { id: 'stats', label: 'Dashboard', icon: TrendingUp },
            { id: 'users', label: 'Usuarios', icon: Users },
            { id: 'tours', label: 'Tours', icon: MapPin },
            { id: 'purchases', label: 'Reservas', icon: DollarSign },
            { id: 'guide-requests', label: 'Solicitudes Guía', icon: Shield },
            { id: 'reviews', label: 'Reseñas', icon: Star },
            { id: 'testimonials', label: 'Testimonios', icon: MessageSquare },
            { id: 'newsletters', label: 'Suscriptores', icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-white/50 text-gray-600 hover:text-gray-900 hover:bg-white/70'
                }`}
              >
                <Icon size={16} />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {activeTab === 'stats' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Resumen General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="text-blue-600" size={24} />
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Total</span>
                  </div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Usuarios Registrados</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalUsers || 0}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <MapPin className="text-green-600" size={24} />
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Activos</span>
                  </div>
                  <p className="text-sm font-medium text-green-700 mb-1">Tours Creados</p>
                  <p className="text-3xl font-bold text-green-900">{stats.totalTours || 0}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="text-purple-600" size={24} />
                    <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">Total</span>
                  </div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Compras Realizadas</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.totalPurchases || 0}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="text-yellow-600" size={24} />
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">USD</span>
                  </div>
                  <p className="text-sm font-medium text-yellow-700 mb-1">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-yellow-900">${stats.totalRevenue || 0}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-bold mb-4">Gestión de Usuarios</h3>
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Nombre</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Rol</th>
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b">
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">{user.role}</td>
                          <td className="p-2">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="p-2">
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tours' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Gestión de Tours</h3>
                  <p className="text-gray-500 mt-1">Administra todos los tours de la plataforma</p>
                </div>
                <button
                  onClick={() => setEditingTour({ title: '', description: '', price: '', duration: '', location: '', category: '', images: [] })}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <Plus size={18} /> Nuevo Tour
                </button>
              </div>
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        <th className="text-left p-4 font-semibold text-gray-700">Tour</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Precio</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Guía</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Fecha</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tours.map(tour => (
                        <tr key={tour.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {tour.image_url && (
                                <img src={tour.image_url} alt={tour.title} className="w-12 h-12 rounded-lg object-cover" />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{tour.title}</p>
                                <p className="text-sm text-gray-500">{tour.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-green-600">${tour.price}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-700">{tour.guide_name}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-500 text-sm">{new Date(tour.created_at).toLocaleDateString()}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingTour({...tour, images: tour.images || (tour.image_url ? [tour.image_url] : [])})}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => deleteTour(tour.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'purchases' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h3>
                  <p className="text-gray-500 mt-1">Administra todas las reservas y compras</p>
                </div>
              </div>
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        <th className="text-left p-4 font-semibold text-gray-700">Reserva</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Usuario</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Tours</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Total</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Estado</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Fecha</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map(purchase => (
                        <tr key={purchase.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <span className="font-medium text-gray-900">#{purchase.id}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User size={14} className="text-blue-600" />
                              </div>
                              <span className="text-gray-700">{purchase.user_name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">{purchase.tour_titles}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-green-600">${purchase.total}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              purchase.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {purchase.status === 'completed' ? 'Completada' : 'Pendiente'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-500 text-sm">{new Date(purchase.created_at).toLocaleDateString()}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                                <Check size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'guide-requests' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Solicitudes de Guía</h3>
                  <p className="text-gray-500 mt-1">Gestiona las solicitudes para convertirse en guía</p>
                </div>
              </div>
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <div className="space-y-4">
                  {guideRequests.map(request => (
                    <div key={request.id} className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{request.name}</h4>
                            <p className="text-sm text-gray-500">{request.email}</p>
                            <p className="text-xs text-gray-400">Solicitado: {new Date(request.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status === 'pending' ? 'Pendiente' :
                             request.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                          </span>
                          {request.status === 'pending' && (
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => approveGuideRequest(request.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
                              >
                                <Check size={14} /> Aprobar
                              </button>
                              <button
                                onClick={() => rejectGuideRequest(request.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                              >
                                <X size={14} /> Rechazar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {guideRequests.length === 0 && (
                    <div className="text-center py-12">
                      <Shield className="mx-auto text-gray-300 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
                      <p className="text-gray-500">No hay solicitudes pendientes para ser guía</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Moderación de Reseñas</h3>
                  <p className="text-gray-500 mt-1">Revisa y modera comentarios de usuarios</p>
                </div>
              </div>
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.user}</h4>
                            <p className="text-sm text-gray-500">{review.tour}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />
                            ))}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            review.status === 'approved' ? 'bg-green-100 text-green-800' :
                            review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {review.status === 'approved' ? 'Aprobada' :
                             review.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        {review.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => moderateReview(review.id, 'approved')}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
                            >
                              <Check size={14} /> Aprobar
                            </button>
                            <button
                              onClick={() => moderateReview(review.id, 'rejected')}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                            >
                              <X size={14} /> Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}



          {activeTab === 'testimonials' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Testimonios</h3>
                  <p className="text-gray-500 mt-1">Gestiona los testimonios que aparecen en la página principal</p>
                </div>
                <button
                  onClick={() => setEditingTestimonial({ name: '', comment: '', rating: 5 })}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <Plus size={18} /> Nuevo Testimonio
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map(testimonial => (
                  <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">{testimonial.comment}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTestimonial(testimonial)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'newsletters' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Suscripciones Newsletter</h3>
                  <p className="text-gray-500 mt-1">Gestiona las suscripciones al boletín</p>
                </div>
              </div>
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Fecha Suscripción</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Estado</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletters.map(newsletter => (
                        <tr key={newsletter.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Mail size={14} className="text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900">{newsletter.email}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-500 text-sm">{new Date(newsletter.subscribed_at).toLocaleDateString()}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              newsletter.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {newsletter.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  const modal = document.createElement('div');
                                  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                                  modal.innerHTML = `
                                    <div class="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                                      <div class="text-center">
                                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                          </svg>
                                        </div>
                                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Visor de Detalles</h3>
                                        <p class="text-gray-600 mb-6">Esta funcionalidad estará disponible pronto. Podrás ver información detallada del suscriptor.</p>
                                        <button onclick="this.closest('.fixed').remove()" class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                                          Entendido
                                        </button>
                                      </div>
                                    </div>
                                  `;
                                  document.body.appendChild(modal);
                                }}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => deleteNewsletter(newsletter.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {newsletters.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Mail className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay suscripciones</h3>
                  <p className="text-gray-500">Aún no hay usuarios suscritos al newsletter</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Configuración del Sitio</h3>
                <p className="text-gray-500 mt-1">Gestiona la información que aparece en el footer</p>
              </div>
              
              <form onSubmit={updateFooterSettings} className="space-y-6">
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de la Empresa</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
                      <input
                        type="text"
                        value={footerSettings.companyName}
                        onChange={(e) => setFooterSettings({...footerSettings, companyName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        value={footerSettings.phone}
                        onChange={(e) => setFooterSettings({...footerSettings, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={footerSettings.email}
                        onChange={(e) => setFooterSettings({...footerSettings, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                      <input
                        type="text"
                        value={footerSettings.address}
                        onChange={(e) => setFooterSettings({...footerSettings, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={footerSettings.description}
                      onChange={(e) => setFooterSettings({...footerSettings, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociales</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                      <input
                        type="url"
                        value={footerSettings.facebook}
                        onChange={(e) => setFooterSettings({...footerSettings, facebook: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                      <input
                        type="url"
                        value={footerSettings.instagram}
                        onChange={(e) => setFooterSettings({...footerSettings, instagram: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                      <input
                        type="url"
                        value={footerSettings.twitter}
                        onChange={(e) => setFooterSettings({...footerSettings, twitter: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Settings size={18} />
                    Guardar Configuración
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Confirmación */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
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
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-200 hover:shadow-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Edición/Creación de Tours */}
      {editingTour && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingTour.id ? 'Editar Tour' : 'Crear Nuevo Tour'}
              </h2>
            </div>
            <form onSubmit={editingTour.id ? updateTour : createTour} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Imágenes del Tour</label>
                <MultiImageUpload 
                  onImagesChange={(images) => setEditingTour({...editingTour, images: images})}
                  currentImages={editingTour.images || (editingTour.image_url ? [editingTour.image_url] : [])}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título del Tour</label>
                <input
                  type="text"
                  value={editingTour.title}
                  onChange={(e) => setEditingTour({...editingTour, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Tour Colonial Centro Histórico"
                  required
                />
              </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                value={editingTour.description}
                onChange={(e) => setEditingTour({...editingTour, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={editingTour.category}
                  onChange={(e) => setEditingTour({...editingTour, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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
        </div>
      )}
      
      {/* Modal de Testimonio */}
      {editingTestimonial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-semibold mb-4">
              {editingTestimonial.id ? 'Editar Testimonio' : 'Nuevo Testimonio'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              saveTestimonial({
                name: formData.get('name'),
                comment: formData.get('comment'),
                rating: parseInt(formData.get('rating'))
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input
                  name="name"
                  defaultValue={editingTestimonial.name}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comentario</label>
                <textarea
                  name="comment"
                  defaultValue={editingTestimonial.comment}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Calificación</label>
                <select
                  name="rating"
                  defaultValue={editingTestimonial.rating}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num} estrella{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="flex-1 py-2 border rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Mi Perfil de Administrador</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={updateAdminProfile} className="p-6 space-y-8">
              {/* Foto de Perfil */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Foto de Perfil</label>
                <div className="flex items-start gap-6">
                  {adminProfile.profileImage ? (
                    <img 
                      src={adminProfile.profileImage} 
                      alt="Perfil Admin"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="text-white" size={32} />
                    </div>
                  )}
                  <div className="flex-1">
                    <ImageUpload 
                      onImageUpload={(url) => setAdminProfile({...adminProfile, profileImage: url})}
                      currentImage={adminProfile.profileImage}
                    />
                  </div>
                </div>
              </div>

              {/* Información Personal */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={adminProfile.name}
                      onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={adminProfile.phone}
                      onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={adminProfile.address}
                      onChange={(e) => setAdminProfile({...adminProfile, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Calle, Ciudad, País"
                    />
                  </div>
                </div>
              </div>

              {/* Cambio de Contraseña */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                    <input
                      type="password"
                      value={adminProfile.currentPassword}
                      onChange={(e) => setAdminProfile({...adminProfile, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Contraseña actual"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={adminProfile.newPassword}
                      onChange={(e) => setAdminProfile({...adminProfile, newPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nueva contraseña"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                    <input
                      type="password"
                      value={adminProfile.confirmPassword}
                      onChange={(e) => setAdminProfile({...adminProfile, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Confirmar contraseña"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Deja en blanco si no deseas cambiar la contraseña</p>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Settings size={18} />
                  )}
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
      
      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminDashboard;