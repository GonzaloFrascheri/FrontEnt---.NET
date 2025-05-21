// src/pages/map/StationsMapPage.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import estacion from '../../assets/estacion.png';

// helper component para ajustar los bounds al montar
function FitBounds({ stations }) {
  const map = useMap();
  useEffect(() => {
    if (!stations.length) return;
    const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, stations]);
  return null;
}

export default function StationsMapPage() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // TODO: reemplaza este mock por fetch('/api/stations')
    setStations([
      { id: 1, name: 'Est. Cerro',      lat: -34.9225, lng: -56.1605, address: 'Av. 8 de Octubre 1234' },
      { id: 2, name: 'Est. Pocitos',    lat: -34.9150, lng: -56.1540, address: 'Rbla. República de México 300' },
      { id: 3, name: 'Est. Carrasco',   lat: -34.8323, lng: -55.9771, address: 'Av. Luis Giannattasio 4500' },
    ]);
  }, []);

  // icono de 48×48, anchor en la base
  const stationIcon = L.icon({
    iconUrl: estacion,
    iconSize:   [48, 48],
    iconAnchor: [24, 48],    // la base del icono (centro abajo)
    popupAnchor: [0, -48],   // popup justo encima del icono
  });

  return (
    <div className="px-3">
      <h2 className="text-center my-4">Mapa de Estaciones</h2>
      <MapContainer
        center={[-34.91, -56.15]}
        zoom={12}
        style={{ height: '70vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Ajusta el zoom para que se vean todos los puntos */}
        <FitBounds stations={stations} />

        <MarkerClusterGroup>
          {stations.map(st => (
            <Marker
              key={st.id}
              position={[st.lat, st.lng]}
              icon={stationIcon}
            >
              <Popup>
                <strong>{st.name}</strong><br/>
                {st.address}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
