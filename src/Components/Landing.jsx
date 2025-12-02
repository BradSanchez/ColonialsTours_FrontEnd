import { useState, useEffect } from 'react';

import MapPreview from './MapPreview';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'leaflet/dist/leaflet.css';
import { Map, Menu, Compass, ArrowRight, Star, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ChevronLeft, ChevronRight } from 'react-feather';
import apiService from '../services/api';

import '../../src/App'

// Fix Leaflet marker icons (default icon issue in react-leaflet)
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function Landing() {
  const [tours, setTours] = useState([]);
  const [stats, setStats] = useState({ totalTours: 0, totalUsers: 0 });
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    loadTours();
    loadStats();
    loadTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 3) {
      const interval = setInterval(() => {
        setCurrentTestimonialIndex((prev) => 
          prev + 3 >= testimonials.length ? 0 : prev + 3
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  useEffect(() => {
    if (tours.length > 3) {
      const interval = setInterval(() => {
        setCurrentTourIndex((prev) => 
          prev + 3 >= tours.length ? 0 : prev + 3
        );
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [tours.length]);

  const loadTours = async () => {
    try {
      const response = await apiService.request('/tours');
      setTours(response.tours || []);
    } catch (error) {
      console.error('Error loading tours');
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.request('/tours');
      setStats({ 
        totalTours: response.tours?.length || 0, 
        totalUsers: 0 
      });
    } catch (error) {
      console.error('Error loading stats');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubscribing(true);
    try {
      const response = await apiService.request('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() })
      });
      
      if (response.success) {
        setSubscriptionMessage('¡Gracias por suscribirte! Recibirás nuestras ofertas especiales.');
        setEmail('');
      }
    } catch (error) {
      setSubscriptionMessage('Error al suscribirse. Inténtalo de nuevo.');
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setSubscriptionMessage(''), 5000);
    }
  };

  const loadTestimonials = () => {
    try {
      const saved = localStorage.getItem('testimonials');
      if (saved) {
        const allTestimonials = JSON.parse(saved);
        setTestimonials(allTestimonials.filter(t => t.active !== false));
      }
    } catch (error) {
      console.error('Error loading testimonials');
    }
  };

  const nextTestimonials = () => {
    if (testimonials.length > 3) {
      setCurrentTestimonialIndex((prev) => 
        prev + 3 >= testimonials.length ? 0 : prev + 3
      );
    }
  };

  const prevTestimonials = () => {
    if (testimonials.length > 3) {
      setCurrentTestimonialIndex((prev) => 
        prev === 0 ? Math.max(0, testimonials.length - 3) : Math.max(0, prev - 3)
      );
    }
  };

  // Map data
  const places = [
    { name: 'Alcázar de Colón', lat: 18.4765, lng: -69.8835 },
    { name: 'Catedral Primada', lat: 18.4729, lng: -69.8833 },
    { name: 'Calle Las Damas', lat: 18.4748, lng: -69.8838 },
    { name: 'Fortaleza Ozama', lat: 18.4751, lng: -69.8821 },
    { name: 'Panteón Nacional', lat: 18.4736, lng: -69.8849 },
    { name: 'Casa de Bastidas', lat: 18.4732, lng: -69.8846 },
    { name: 'Monasterio de San Francisco', lat: 18.4738, lng: -69.8851 },
    { name: 'Plaza de Armas', lat: 18.4730, lng: -69.8840 },
    { name: 'Museo de las Casas Reales', lat: 18.4742, lng: -69.8834 },
    { name: 'Casa del Cordón', lat: 18.4750, lng: -69.8832 },
    { name: 'Iglesia de la Merced', lat: 18.4745, lng: -69.8855 },
    { name: 'Puerta del Conde', lat: 18.4720, lng: -69.8860 },
    { name: 'Parque Colón', lat: 18.4728, lng: -69.8835 },
    { name: 'Convento de los Dominicos', lat: 18.4740, lng: -69.8845 },
    { name: 'Torre del Homenaje', lat: 18.4752, lng: -69.8820 }
  ];

  return (
    <div className="font-sans bg-gray-50">


      {/* Hero Section */}
      <div className="hero-image py-20 px-4">
        <div className="max-w-6xl mx-auto text-center text-white" data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Descubre la Zona Colonial</h1>
          <p className="text-xl md:text-2xl mb-8">El corazón histórico de Santo Domingo, primera ciudad del Nuevo Mundo</p>
          <a href="/tours" className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 inline-flex items-center">
            <Compass className="mr-2" size={20} /> Explorar Tours
          </a>
        </div>
      </div>

      {/* Highlights Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Lo más destacado</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tours.slice(0, 3).map((tour, index) => (
            <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay={index * 100}>
              {tour.image_url && (
                <img
                  src={tour.image_url}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6 flex flex-col h-48">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{tour.title}</h3>
                <p className="text-gray-600 mb-4 flex-1 overflow-hidden">{tour.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-bold text-amber-600">${tour.price}</span>
                  <a href="/login" className="text-amber-600 font-medium inline-flex items-center">
                    Reservar <ArrowRight className="ml-1 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map Preview */}
    <section className="bg-gray-100 py-12">
  <div className="max-w-6xl mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 items-start">
      <div data-aos="fade-right">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Explora en nuestro mapa interactivo
        </h2>
        <p className="text-gray-600 mb-6">
          Descubre todos los puntos de interés de la Zona Colonial con nuestro mapa detallado. Filtra por categorías como museos, restaurantes, iglesias y más.
        </p>
        <a
          href="/mapa"
          className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
        >
          <Map className="mr-2" size={20} />
          Ver Mapa Completo
        </a>
      </div>

      <div className="w-full" data-aos="fade-left">
        <div className="w-full rounded-lg shadow-lg overflow-hidden">
          <MapPreview places={places} height={420} />
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Tours Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Tours disponibles ({stats.totalTours})</h2>
          <a href="/tours" className="text-amber-600 font-medium inline-flex items-center">
            Ver todos <ArrowRight className="ml-1 w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.length > 0 ? tours.slice(currentTourIndex, currentTourIndex + 3).map((tour, index) => (
            <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay={index * 100}>
              {tour.image_url && (
                <img
                  src={tour.image_url}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{tour.title}</h3>
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded">{tour.duration}</span>
                </div>
                <p className="text-gray-600 mb-4">{tour.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">${tour.price}</span>
                  <a href="/login" className="text-white bg-amber-600 hover:bg-amber-700 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center">
                    Reservar
                  </a>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No hay tours disponibles en este momento</p>
            </div>
          )}
        </div>
        {tours.length > 3 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(tours.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTourIndex(index * 3)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  Math.floor(currentTourIndex / 3) === index ? 'bg-amber-600' : 'bg-gray-300'
                }`}
              />
            ))}
            <div className="text-xs text-gray-500 ml-2">({tours.length} tours)</div>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-amber-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Lo que dicen nuestros visitantes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? testimonials.slice(currentTestimonialIndex, currentTestimonialIndex + 3).map((testimonial, index) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="flex items-center mb-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex text-amber-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "{testimonial.comment}"
                </p>
              </div>
            )) : (
              // Testimonios por defecto si no hay datos
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No hay testimonios disponibles</p>
              </div>
            )}
          </div>
          {testimonials.length > 3 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index * 3)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    Math.floor(currentTestimonialIndex / 3) === index ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Recibe nuestras ofertas especiales</h2>
          <p className="text-gray-300 mb-6">
            Suscríbete a nuestro boletín para recibir descuentos en tours y las últimas novedades sobre la Zona Colonial.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <button 
              type="submit" 
              disabled={isSubscribing}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2 rounded-full transition duration-300 disabled:opacity-50"
            >
              {isSubscribing ? 'Suscribiendo...' : 'Suscribirse'}
            </button>
          </form>
          {subscriptionMessage && (
            <p className={`mt-4 text-sm ${
              subscriptionMessage.includes('Gracias') ? 'text-green-400' : 'text-red-400'
            }`}>
              {subscriptionMessage}
            </p>
          )}
        </div>
      </section>


    </div>
  );
}
export default Landing