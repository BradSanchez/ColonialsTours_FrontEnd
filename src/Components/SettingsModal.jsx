import React, { useState, useEffect } from 'react';
import { X, Settings, Save } from 'react-feather';

const SettingsModal = ({ isOpen, onClose }) => {
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

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('footerSettings');
      if (saved) {
        setFooterSettings(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('footerSettings', JSON.stringify(footerSettings));
    
    // Mostrar toast de éxito
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl shadow-lg';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        Configuración guardada exitosamente
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings className="text-orange-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Configuración del Sitio</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de la Empresa</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
                <input
                  type="text"
                  value={footerSettings.companyName}
                  onChange={(e) => setFooterSettings({...footerSettings, companyName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={footerSettings.phone}
                  onChange={(e) => setFooterSettings({...footerSettings, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={footerSettings.email}
                  onChange={(e) => setFooterSettings({...footerSettings, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input
                  type="text"
                  value={footerSettings.address}
                  onChange={(e) => setFooterSettings({...footerSettings, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                value={footerSettings.description}
                onChange={(e) => setFooterSettings({...footerSettings, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="3"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociales</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={footerSettings.facebook}
                  onChange={(e) => setFooterSettings({...footerSettings, facebook: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={footerSettings.instagram}
                  onChange={(e) => setFooterSettings({...footerSettings, instagram: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={footerSettings.twitter}
                  onChange={(e) => setFooterSettings({...footerSettings, twitter: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Save size={18} />
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;