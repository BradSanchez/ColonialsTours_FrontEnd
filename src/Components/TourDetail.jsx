import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { 
  MapPin, Clock, DollarSign, Star, Heart, Users, Calendar, 
  Shield, Award, Camera, MessageCircle, Share2, ChevronLeft,
  Check, X, Info, Globe, Wifi, Coffee
} from 'react-feather';
import apiService from '../services/api';
import ReviewSection from './ReviewSection';
import ReviewRating from './ReviewRating';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState({ adults: 1, children: 0, infants: 0 });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    loadTourDetail();
  }, [id]);

  const loadTourDetail = async () => {
    try {
      setLoading(true);
      const response = await apiService.request(`/tours/${id}`);
      setTour(response.tour);
    } catch (error) {
      console.error('Error loading tour detail');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await apiService.request('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          tourId: id,
          date: selectedDate,
          guests: guestCount
        })
      });
      alert('¡Reserva realizada con éxito!');
      setShowBookingModal(false);
    } catch (error) {
      alert('Error al realizar la reserva');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour no encontrado</h2>
          <button 
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Volver a Tours
          </button>
        </div>
      </div>
    );
  }

  const tourImages = tour.images && Array.isArray(tour.images) && tour.images.length > 0 
    ? tour.images 
    : tour.image_url 
    ? [tour.image_url]
    : ['https://via.placeholder.com/800x600'];

  console.log('Tour data:', tour);
  console.log('Tour images array:', tour.images);
  console.log('Processed tourImages:', tourImages);
  console.log('Number of images:', tourImages.length);
  console.log('Guide profile image:', tour.guide_profile_image);
  console.log('Guide name:', tour.guide_name);



  const amenities = [
    { icon: Globe, text: 'Guía en español e inglés' },
    { icon: Camera, text: 'Sesión de fotos incluida' },
    { icon: Coffee, text: 'Degustación gastronómica' },
    { icon: Shield, text: 'Seguro incluido' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <div className="sticky top-0 bg-white border-b z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/tours')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={20} />
            <span>Volver</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
              <Share2 size={16} />
              <span>Compartir</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
              <Heart size={16} />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 h-96 rounded-xl overflow-hidden">
          {/* Imagen principal */}
          <div className="flex-2">
            <img 
              src={tourImages[0]} 
              alt={tour.title}
              className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all rounded-l-xl"
              onClick={() => setShowAllPhotos(true)}
            />
          </div>
          
          {/* Grid de 4 imágenes pequeñas */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            {tourImages.slice(1, 5).map((img, index) => (
              <div key={index} className="relative">
                <img 
                  src={img} 
                  alt={`${tour.title} ${index + 2}`}
                  className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all"
                  onClick={() => setShowAllPhotos(true)}
                />
                {index === 3 && tourImages.length > 5 && (
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  >
                    <span className="text-white font-semibold">+{tourImages.length - 5} fotos más</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title and Host */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <ReviewRating tourId={id} />
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{tour.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-xl">
              {tour.guide_profile_image && tour.guide_profile_image !== 'undefined' && tour.guide_profile_image !== 'null' ? (
                <img 
                  src={tour.guide_profile_image} 
                  alt={tour.guide_name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center"
                style={{ display: tour.guide_profile_image && tour.guide_profile_image !== 'undefined' && tour.guide_profile_image !== 'null' ? 'none' : 'flex' }}
              >
                <span className="text-white font-semibold text-lg">
                  {tour.guide_name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              <div>
                <p className="font-semibold">Anfitrión: {tour.guide_name}</p>
                <p className="text-sm text-gray-600">Guía certificado • 3 años de experiencia</p>
              </div>
              <div className="ml-auto">
                <Award className="text-orange-500" size={24} />
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Clock className="mx-auto mb-2 text-blue-600" size={24} />
              <p className="font-semibold">{tour.duration}</p>
              <p className="text-sm text-gray-600">Duración</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Users className="mx-auto mb-2 text-green-600" size={24} />
              <p className="font-semibold">Hasta 12</p>
              <p className="text-sm text-gray-600">Participantes</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Globe className="mx-auto mb-2 text-purple-600" size={24} />
              <p className="font-semibold">ES, EN</p>
              <p className="text-sm text-gray-600">Idiomas</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold mb-4">Acerca de esta experiencia</h2>
            <p className="text-gray-700 leading-relaxed">{tour.description}</p>
          </div>

          {/* What's Included */}
          {tour.includes && JSON.parse(tour.includes).length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Qué incluye</h2>
              <div className="grid grid-cols-1 gap-3">
                {JSON.parse(tour.includes).map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check size={20} className="text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          {tour.itinerary && JSON.parse(tour.itinerary).length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Itinerario</h2>
              <div className="space-y-4">
                {JSON.parse(tour.itinerary).map((item, index) => (
                  <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-orange-600 min-w-[80px]">{item.time}</span>
                    <span className="text-gray-700">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <ReviewSection tourId={id} />
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-2xl font-bold">${tour.price}</span>
                <span className="text-gray-600"> por persona</span>
              </div>
              <ReviewRating tourId={id} compact />
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Fecha</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Huéspedes</label>
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span>Adultos</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setGuestCount(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                        className="w-8 h-8 border rounded-full flex items-center justify-center"
                      >
                        -
                      </button>
                      <span>{guestCount.adults}</span>
                      <button 
                        onClick={() => setGuestCount(prev => ({ ...prev, adults: prev.adults + 1 }))}
                        className="w-8 h-8 border rounded-full flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Niños (2-12)</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setGuestCount(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                        className="w-8 h-8 border rounded-full flex items-center justify-center"
                      >
                        -
                      </button>
                      <span>{guestCount.children}</span>
                      <button 
                        onClick={() => setGuestCount(prev => ({ ...prev, children: prev.children + 1 }))}
                        className="w-8 h-8 border rounded-full flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              disabled={!selectedDate}
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
            >
              Reservar ahora
            </button>

            <div className="text-center text-sm text-gray-600 mb-4">
              No se te cobrará todavía
            </div>

            <div className="space-y-2 text-sm">
              {guestCount.adults > 0 && (
                <div className="flex justify-between">
                  <span>${tour.price} x {guestCount.adults} adultos</span>
                  <span>${(parseFloat(tour.price) * guestCount.adults).toFixed(2)}</span>
                </div>
              )}
              {guestCount.children > 0 && (
                <div className="flex justify-between">
                  <span>${(parseFloat(tour.price) * 0.5).toFixed(2)} x {guestCount.children} niños</span>
                  <span>${(parseFloat(tour.price) * 0.5 * guestCount.children).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tarifa de servicio</span>
                <span>$5.00</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${(parseFloat(tour.price) * guestCount.adults + parseFloat(tour.price) * 0.5 * guestCount.children + 5).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Confirmar Reserva</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Tour:</span>
                <span className="font-semibold">{tour.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span>{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Huéspedes:</span>
                <span>{guestCount.adults + guestCount.children} personas</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${(parseFloat(tour.price) * guestCount.adults + parseFloat(tour.price) * 0.5 * guestCount.children + 5).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-2 border rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={handleBooking}
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;