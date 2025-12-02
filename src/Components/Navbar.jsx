import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Map, Menu, User, LogOut, Settings, TrendingUp, ChevronDown } from 'react-feather';
import SettingsModal from './SettingsModal';

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const isInDashboard = location.pathname === '/admin' || location.pathname === '/guide';

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, [user]);

  React.useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    };
    
    const handleUserUpdate = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleUserUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-50" onClick={() => setIsDropdownOpen(false)}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <a href="/" className="flex items-center py-4 px-2">
                <Map className="text-amber-600 mr-2" size={24} />
                <span className="font-semibold text-gray-500 text-lg">Colonials Tours</span>
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <a href="/" className="py-4 px-2 text-gray-500 font-medium hover:text-amber-600 transition duration-300">
                Inicio
              </a>
              <a href="/tours" className="py-4 px-2 text-gray-500 font-medium hover:text-amber-600 transition duration-300">
                Tours
              </a>
              <a href="/mapa" className="py-4 px-2 text-gray-500 font-medium hover:text-amber-600 transition duration-300">
                Mapa
              </a>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {currentUser?.profile_image ? (
                    <img 
                      src={currentUser.profile_image} 
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      key={currentUser.profile_image}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <ChevronDown size={14} className="text-gray-600" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                      <p className="text-xs text-gray-500">{currentUser?.email}</p>
                    </div>
                    <a 
                      href="/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} />
                      Mi Perfil
                    </a>
                    {isInDashboard ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Abriendo modal de configuración');
                          setShowSettingsModal(true);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <Settings size={16} />
                        Configuración
                      </button>
                    ) : (
                      <a 
                        href="/settings" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings size={16} />
                        Configuración
                      </a>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => { logout(); setIsDropdownOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/login" className="py-2 px-4 font-medium text-gray-500 rounded hover:bg-amber-500 hover:text-white transition duration-300">
                  Iniciar Sesión
                </a>
                <a href="/register" className="py-2 px-4 font-medium text-white bg-amber-600 rounded hover:bg-amber-500 transition duration-300">
                  Registrarse
                </a>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              className="outline-none mobile-menu-button" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} mobile-menu md:hidden`}>
        <ul className="bg-white border-t">
          <li><a href="/" className="block text-sm px-4 py-3 hover:bg-amber-50 transition duration-300">Inicio</a></li>
          <li><a href="/tours" className="block text-sm px-4 py-3 hover:bg-amber-50 transition duration-300">Tours</a></li>
          <li><a href="/mapa" className="block text-sm px-4 py-3 hover:bg-amber-50 transition duration-300">Mapa</a></li>
          {user ? (
            <>
              <li><a href="/profile" className="block text-sm px-4 py-3 hover:bg-amber-50 transition duration-300">Mi Perfil</a></li>
              {isInDashboard ? (
                <li>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSettingsModal(true);
                    }}
                    className="block w-full text-left text-sm px-4 py-3 hover:bg-amber-50 transition duration-300"
                  >
                    Configuración
                  </button>
                </li>
              ) : (
                <li><a href="/settings" className="block text-sm px-4 py-3 hover:bg-amber-50 transition duration-300">Configuración</a></li>
              )}
              <li><button onClick={logout} className="block w-full text-left text-sm px-4 py-3 hover:bg-red-50 text-red-600 transition duration-300">Cerrar Sesión</button></li>
            </>
          ) : (
            <>
              <li><a href="/login" className="block text-sm px-4 py-3 hover:bg-amber-50 transition duration-300">Iniciar Sesión</a></li>
              <li><a href="/register" className="block text-sm px-4 py-3 hover:bg-amber-50 transition duration-300">Registrarse</a></li>
            </>
          )}
        </ul>
      </div>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
    </nav>
  );
};

export default Navbar;