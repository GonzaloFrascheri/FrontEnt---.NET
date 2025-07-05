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
  const [branchesLoaded, setBranchesLoaded] = useState(false);
  
  // Usar el hook de geolocalización
  const { position, error: locationError } = useUserLocation();
  
  // Usar el contexto de autenticación para saber si el usuario está logueado
  const { user, loading: authLoading, loginSuccess, setLoginSuccess } = useContext(AuthContext);

  // Función para cargar las branches
  const loadBranches = async () => {
    console.log("Starting loadBranches function");
    try {
      console.log("Fetching branches from API");
      const data = await getBranches();
      console.log("Branches API response:", data);
      
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
      
      console.log("Processed branches:", mappedBranches.length);
      setBranches(mappedBranches);
      setBranchesLoaded(true);
      
      // Si no hay sucursales, no hay nada más que hacer
      if (mappedBranches.length === 0) {
        console.log("No branches found");
        setLoading(false);
        return;
      }
      
      // Usar la posición del hook de geolocalización
      if (position && !locationError) {
        console.log("Using geolocation to find nearest branch");
        const [lat, lng] = position;
        const nearest = findNearestBranch(lat, lng, mappedBranches);
        setSelectedBranch(nearest);
      } else {
        console.log("Using first branch as fallback");
        // Fallback: usar la primera sucursal si hay error o no hay ubicación
        const firstBranch = { ...mappedBranches[0], distance: null };
        setSelectedBranch(firstBranch);
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error al cargar las sucursales:", error);
      setLoading(false);
      return false;
    }
  };

  // Efecto para monitorear cambios en loginSuccess
  useEffect(() => {
    console.log("LocationContext: loginSuccess effect triggered", { loginSuccess });
    
    if (loginSuccess && user) {
      console.log("Login success detected, loading branches");
      loadBranches().then(success => {
        if (success) {
          console.log("Branches loaded successfully after login, resetting loginSuccess flag");
          setLoginSuccess(false);
        }
      });
    }
  }, [loginSuccess, user, setLoginSuccess]);

  // Cargar las sucursales cuando el usuario está logueado o cuando cambia la posición
  useEffect(() => {
    console.log("LocationContext main useEffect triggered", { 
      user: !!user, 
      authLoading, 
      position: !!position
    });
    
    // Si AuthContext aún está cargando, mantener loading en true
    if (authLoading) {
      console.log("AuthContext still loading, waiting...");
      setLoading(true);
      return;
    }
    
    // Si no hay usuario (después de que AuthContext terminó de cargar), limpiar datos
    if (!user) {
      console.log("No user, clearing branch data");
      setBranches([]);
      setSelectedBranch(null);
      setBranchesLoaded(false);
      setLoading(false);
      return;
    }
    
    // Solo cargar sucursales si AuthContext terminó de cargar, hay usuario y no se han cargado ya
    if (!branchesLoaded) {
      console.log("Branches not loaded yet, calling loadBranches");
      loadBranches();
    } else if (position && !locationError && branches.length > 0) {
      // Si ya tenemos branches pero cambió la posición, actualizar la sucursal seleccionada
      console.log("Position changed, updating selected branch");
      const [lat, lng] = position;
      const nearest = findNearestBranch(lat, lng, branches);
      setSelectedBranch(nearest);
    }
  }, [user, authLoading, position, locationError, branchesLoaded, branches]);

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
