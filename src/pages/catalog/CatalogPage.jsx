// src/pages/catalog/CatalogPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getBranches, getCatalogWithStock } from '../../services/api';
import { Spinner, Row } from 'react-bootstrap';
import { findNearestBranch } from '../../helpers/utils';
import { useUserLocation } from '../../hooks/getUserLocation';
import Product from '../../components/Product';
import { AuthContext } from '../../context/AuthContext';
import { TenantContext } from '../../context/TenantContext';
import DropdownComponent from '../../components/Dropdown';

export default function CatalogPage() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [userData, setUserData] = useState(null);

  const { getUserData } = useContext(AuthContext);
  const { tenantUIConfig } = useContext(TenantContext);

  const tenantStyles = {
    primaryColor: tenantUIConfig?.primaryColor || '#1976d2',
    secondaryColor: tenantUIConfig?.secondaryColor || '#FFFF00',
  };

  const getCatalog = async () => {
    if (selectedBranch) {
      const catalog = await getCatalogWithStock(selectedBranch.id);
      setCatalog(catalog);
    }
  }

  // Usar el hook de geolocalización del navegador
  const { position, error: locationError } = useUserLocation();

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        // Obtener sucursales
        const data = await getBranches();
        if (!isMounted) return;
        
        const branches = Array.isArray(data.data) ? data.data : [];
        const mapped = branches.map(b => ({
          id: b.id,
          name: b.tenant?.name ?? "Estación",
          address: b.address,
          lat: parseFloat(b.latitud),
          lng: parseFloat(b.longitud),
        })).filter(st => !isNaN(st.lat) && !isNaN(st.lng));
        
        setBranches(mapped);
        
        // Si no hay sucursales, no hay nada más que hacer
        if (mapped.length === 0) {
          setLoading(false);
          return;
        }
        
        // Usar la posición del hook de geolocalización
        if (position && !locationError) {
          const [lat, lng] = position;
          const nearest = findNearestBranch(lat, lng, mapped);
          setSelectedBranch(nearest);
        } else {
          // Fallback: usar la primera sucursal si hay error o no hay ubicación
          const firstBranch = { ...mapped[0], distance: null };
          setSelectedBranch(firstBranch);
        }
      } catch (error) {
        console.error("Error al cargar las sucursales:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [position, locationError]); // Agregar position y locationError como dependencias

  useEffect(() => {
    if (selectedBranch) {
      getCatalogWithStock(selectedBranch.id).then(data => {
        setCatalog(data);
        setLoading(false);
      }).catch(error => {
        console.error("Error al obtener el catálogo:", error);
        setLoading(false);
      });
    }
  }, [selectedBranch]);

  useEffect(() => {
    getUserData().then(data => {
      setUserData(data)
    })
  }, [getUserData]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

  return (
    <div className="p-4">
      <div className="mb-4 w-100 d-flex justify-content-between align-items-center">
        <h2 className="mb-4" style={{ color: tenantStyles.primaryColor }}>Productos</h2>

        <DropdownComponent
          items={branches.map(branch => ({
            id: branch.id,
            label: branch.address
          }))}
          selectedItemId={selectedBranch?.id}
          setSelectedItemId={(id) => setSelectedBranch(branches.find(branch => branch.id === id))}
          tenantStyles={tenantStyles}
        />
      </div>

      <Row xs={1} sm={2} md={3} lg={3} className="g-4">
        {catalog.filter(item => item.stock > 0).map(item => (
          <Product
            key={item.id}
            item={item}
            isUserVerified={userData?.isVerified}
            selectedBranchId={selectedBranch?.id}
            refreshCatalog={getCatalog}
            tenantUIConfig={tenantUIConfig}
          />
        ))}
      </Row>

      {catalog.filter(item => item.stock > 0).length === 0 && (
        <div className="text-center mt-5">
          <h3>No hay productos disponibles</h3>
          <p>Por favor, seleccione otra estación</p>
        </div>
      )}
    </div>
  );
}
