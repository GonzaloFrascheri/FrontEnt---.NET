// src/pages/catalog/CatalogPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getCatalogWithStock } from '../../services/api';
import { Spinner, Row } from 'react-bootstrap';
import Product from '../../components/Product';
import { AuthContext } from '../../context/AuthContext';
import { TenantContext } from '../../context/TenantContext';
import DropdownComponent from '../../components/Dropdown';
import { useLocation } from '../../hooks/useLocation';

export default function CatalogPage() {
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const { getUserData } = useContext(AuthContext);
  const { tenantUIConfig } = useContext(TenantContext);
  const { branches, selectedBranch, setSelectedBranch, loading: locationLoading } = useLocation();

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

  useEffect(() => {
    if (selectedBranch) {
      setCatalogLoading(true);
      getCatalogWithStock(selectedBranch.id).then(data => {
        setCatalog(data);
        setCatalogLoading(false);
      }).catch(error => {
        console.error("Error al obtener el catálogo:", error);
        setCatalogLoading(false);
      });
    }
  }, [selectedBranch]);

  useEffect(() => {
    getUserData().then(data => {
      setUserData(data)
    })
  }, [getUserData]);

  if (locationLoading || catalogLoading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

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
