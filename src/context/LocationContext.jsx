import React, { createContext, useState, useEffect, useContext } from 'react';
import { getBranches } from '../services/api';
import { findNearestBranch } from '../helpers/utils';
import { useUserLocation } from '../hooks/getUserLocation';
import { AuthContext } from './AuthContext';

// Crear el contexto
export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Usar el hook de geolocalización
  const { position, error: locationError } = useUserLocation();
  
  // Usar el contexto de autenticación para saber si el usuario está logueado
  const { user, loading: authLoading, loginSuccess, setLoginSuccess } = useContext(AuthContext);

  // Cargar las sucursales cuando el usuario está logueado, cuando cambia la posición o cuando hay un login exitoso
  useEffect(() => {
    // Si AuthContext aún está cargando, mantener loading en true
    if (authLoading) {
      setLoading(true);
      return;
    }
    
    // Si no hay usuario (después de que AuthContext terminó de cargar), limpiar datos
    if (!user) {
      setBranches([]);
      setSelectedBranch(null);
      setLoading(false);
      return;
    }
    
    const loadBranches = async () => {
      try {
        
        const data = await getBranches();
        const branchesList = Array.isArray(data.data) ? data.data : [];
        
        const mappedBranches = branchesList
          .map(b => ({
            id: b.id,
            name: b.tenant?.name ?? "Estación",
            address: b.address,
            lat: parseFloat(b.latitud),
            lng: parseFloat(b.longitud),
          }))
          .filter(st => !isNaN(st.lat) && !isNaN(st.lng));
        
        setBranches(mappedBranches);
        
        // Si no hay sucursales, no hay nada más que hacer
        if (mappedBranches.length === 0) {
          setLoading(false);
          return;
        }
        
        // Usar la posición del hook de geolocalización
        if (position && !locationError) {
          const [lat, lng] = position;
          const nearest = findNearestBranch(lat, lng, mappedBranches);
          setSelectedBranch(nearest);
        } else {
          // Fallback: usar la primera sucursal si hay error o no hay ubicación
          const firstBranch = { ...mappedBranches[0], distance: null };
          setSelectedBranch(firstBranch);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar las sucursales:", error);
        setLoading(false);
      }
    };
    
    // Solo cargar sucursales si AuthContext terminó de cargar y hay usuario
    loadBranches();
    
    // Si se cargaron las branches debido a un login exitoso, resetear el flag
    if (loginSuccess) {
      setLoginSuccess(false);
    }
  }, [user, authLoading, position, locationError, loginSuccess, setLoginSuccess]);

  // Valor del contexto
  const contextValue = {
    branches,
    selectedBranch,
    setSelectedBranch,
    loading,
    userPosition: position
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};
