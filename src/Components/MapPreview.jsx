// src/components/MapPreview.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Iconos personalizados
const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapPreview({ places, height = 420, selectedPlaceId, onMapReady }, ref) {
  const mapRef = useRef();
  const markersRef = useRef({});
  useImperativeHandle(ref, () => ({
    selectPlace: (place) => {
      const map = mapRef.current;
      const marker = markersRef.current[place.id];
      
      if (map && marker) {
        map.setView([place.lat, place.lng], 17);
        marker.openPopup();
      }
    }
  }));

  useEffect(() => {
    if (onMapReady) {
      onMapReady({
        selectPlace: (place) => {
          const map = mapRef.current;
          const marker = markersRef.current[place.id];
          
          if (map && marker) {
            map.setView([place.lat, place.lng], 17);
            marker.openPopup();
          }
        }
      });
    }
  }, [onMapReady]);

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <MapContainer
        center={[18.4735, -69.8854]}
        zoom={15}
        className="w-full h-full"
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {places.map((place, i) => {
          const isSelected = selectedPlaceId === place.id;
          return (
            <Marker 
              key={place.id || i} 
              position={[place.lat, place.lng]}
              icon={isSelected ? selectedIcon : defaultIcon}
              ref={(marker) => {
                if (marker && place.id) {
                  markersRef.current[place.id] = marker;
                }
              }}
            >
              <Popup>{place.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default forwardRef(MapPreview);