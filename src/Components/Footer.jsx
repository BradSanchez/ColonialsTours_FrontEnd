import React, { useState, useEffect } from "react";
import { Map, Menu, Compass, ArrowRight, Star, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'react-feather';

function Footer(){
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
    const saved = localStorage.getItem('footerSettings');
    if (saved) {
      setFooterSettings(JSON.parse(saved));
    }
  }, []);

    return(
          <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{footerSettings.companyName}</h3>
              <p className="text-gray-400">{footerSettings.description}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="/tours" className="text-gray-400 hover:text-white transition duration-300">
                    Tours
                  </a>
                </li>
                <li>
                  <a href="/mapa" className="text-gray-400 hover:text-white transition duration-300">
                    Mapa interactivo
                  </a>
                </li>
                <li>
                  <a href="/lugares" className="text-gray-400 hover:text-white transition duration-300">
                    Lugares de interés
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" /> {footerSettings.email}
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> {footerSettings.phone}
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" /> {footerSettings.address}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                {footerSettings.facebook && (
                  <a href={footerSettings.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {footerSettings.instagram && (
                  <a href={footerSettings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
                {footerSettings.twitter && (
                  <a href={footerSettings.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">© 2025 {footerSettings.companyName}. Todos los derechos reservados.</p>
              <div className="flex gap-4">
               {/*  <a href="/admin" className="text-xs text-gray-500 hover:text-gray-300 transition duration-300">
                  Dashboard
                </a> */}
                <a href="/login" className="text-xs text-gray-500 hover:text-gray-300 transition duration-300">
                  Admin
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
}
export default Footer