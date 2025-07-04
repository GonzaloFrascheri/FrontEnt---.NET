import React, { useContext, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import estacion from '../../assets/estacion.png';
import { TenantContext } from '../../context/TenantContext';
import { useLocation } from '../../hooks/useLocation';

function FitBounds({ stations }) {
  const map = useMap();
  useEffect(() => {
    if (!stations.length) return;
    const bounds = L.latLngBounds(stations.map(s => [parseFloat(s.lat), parseFloat(s.lng)]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, stations]);
  return null;
}

export default function StationsMapPage() {
  const { tenantUIConfig } = useContext(TenantContext);
  const { branches: stations, loading } = useLocation();


  const stationIcon = L.icon({
    iconUrl: estacion,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });

  return (
    <div className="px-3">
      <h2 className="my-4" style={{ color: tenantUIConfig?.primaryColor }}>Mapa de Estaciones</h2>
      <MapContainer
        center={[-34.91, -56.15]}
        zoom={12}
        style={{ height: '70vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <FitBounds stations={stations} />
        <MarkerClusterGroup>
          {stations.map(st => (
            <Marker
              key={st.id}
              position={[st.lat, st.lng]}
              icon={stationIcon}
            >
              <Popup>
                <strong>{st.name}</strong><br />
                {st.address}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
