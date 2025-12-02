import React from 'react';
import { MapPin, Clock, Star, ArrowRight } from 'react-feather';

const LugaresInteres = () => {
  const lugares = [
    {
      id: 1,
      name: 'Alcázar de Colón',
      description: 'Residencia del virrey Diego Colón, hijo de Cristóbal Colón, construida entre 1510-1514.',
      image: 'https://cdn.abacus.ai/images/ef0d2c8f-7280-418c-ab46-34604952f390.png',
      category: 'Histórico',
      horario: '9:00 AM - 5:00 PM',
      entrada: 'RD$ 30'
    },
    {
      id: 2,
      name: 'Catedral Primada',
      description: 'Primera catedral de América, construida entre 1514-1540 con estilo gótico y renacentista.',
      image: 'https://cdn.abacus.ai/images/b0d3ed17-1d20-4396-865a-39b3bd7ef7c3.png',
      category: 'Religioso',
      horario: '6:00 AM - 6:00 PM',
      entrada: 'Gratuita'
    },
    {
      id: 3,
      name: 'Calle Las Damas',
      description: 'Primera calle pavimentada de América, con impresionantes edificios coloniales.',
      image: 'https://cdn.abacus.ai/images/968eb585-5414-40b7-8268-0f477ae7de61.png',
      category: 'Histórico',
      horario: '24 horas',
      entrada: 'Gratuita'
    },
    {
      id: 4,
      name: 'Fortaleza Ozama',
      description: 'Primera fortaleza europea en América, construida en 1502.',
      image: 'https://via.placeholder.com/400x300',
      category: 'Histórico',
      horario: '9:00 AM - 5:00 PM',
      entrada: 'RD$ 15'
    },
    {
      id: 5,
      name: 'Museo de las Casas Reales',
      description: 'Museo de historia colonial y arqueología.',
      image: 'https://via.placeholder.com/400x300',
      category: 'Museo',
      horario: '9:00 AM - 5:00 PM',
      entrada: 'RD$ 20'
    },
    {
      id: 6,
      name: 'Casa del Cordón',
      description: 'Primera casa de piedra de América.',
      image: 'https://via.placeholder.com/400x300',
      category: 'Histórico',
      horario: '9:00 AM - 4:00 PM',
      entrada: 'RD$ 10'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Lugares de Interés</h1>
          <p className="text-gray-600 mt-2">Descubre los sitios más emblemáticos de la Zona Colonial</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Grid de lugares */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lugares.map(lugar => (
            <div key={lugar.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <img 
                src={lugar.image} 
                alt={lugar.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lugar.category === 'Histórico' ? 'bg-blue-100 text-blue-800' :
                    lugar.category === 'Religioso' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {lugar.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{lugar.name}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{lugar.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={14} className="mr-2" />
                    {lugar.horario}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-2" />
                    Entrada: {lugar.entrada}
                  </div>
                </div>
                
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                  Ver en Mapa
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">¿Quieres explorar todos estos lugares?</h2>
          <p className="text-orange-100 mb-6">
            Únete a nuestros tours guiados y descubre la historia completa de cada sitio
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/tours" 
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-medium hover:bg-orange-50 transition-colors"
            >
              Ver Tours Disponibles
            </a>
            <a 
              href="/mapa" 
              className="border border-white text-white px-6 py-3 rounded-xl font-medium hover:bg-white hover:text-orange-600 transition-colors"
            >
              Explorar en Mapa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LugaresInteres;