// src/pages/catalog/CatalogPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getBranches, getCatalogWithStock } from '../../services/api';
import { Spinner, Row, Dropdown } from 'react-bootstrap';
import { findNearestBranch } from '../../helpers/utils';
import Product from '../../components/Product';
import { AuthContext } from '../../context/AuthContext';

export default function CatalogPage() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userData, setUserData] = useState(null);

  const { getUserData } = useContext(AuthContext);

  const getUserLocationByIP = async () => {
    try {
      const response = await fetch('http://ip-api.com/json/');
      const data = await response.json();

      if (data.status === 'success' && data.lat && data.lon) {
        setUserLocation({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lon),
          method: 'ip'
        });
        return true;
      }
    } catch (error) {
      console.warn('Error obteniendo ubicación por IP (backup):', error);
    }

    return false;
  };

  useEffect(() => {
    getBranches().then(data => {
      const branches = Array.isArray(data.data) ? data.data : [];
      const mapped = branches.map(b => ({
        id: b.id,
        name: b.tenant?.name ?? "Estación",
        address: b.address,
        lat: parseFloat(b.latitud),
        lng: parseFloat(b.longitud),
      })).filter(st => !isNaN(st.lat) && !isNaN(st.lng));
      setBranches(mapped);

      getUserLocationByIP();
    });
  }, []);

  useEffect(() => {
    if (branches.length > 0) {
      if (userLocation) {
        const nearest = findNearestBranch(userLocation.lat, userLocation.lng, branches);
        setSelectedBranch(nearest);
      } else {
        const firstBranch = { ...branches[0], distance: null };
        setSelectedBranch(firstBranch);
      }
    }
    setLoading(false);
  }, [userLocation, branches]);

  useEffect(() => {
    if (selectedBranch) {
      getCatalogWithStock(selectedBranch.id).then(data => {
        setCatalog(data)
      });
    }

    setLoading(false);
  }, [selectedBranch]);

  useEffect(() => {
    getUserData().then(data => {
      setUserData(data)
    })
  }, [getUserData])

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

  return (
    <div className="p-4">

      <div className="mb-4 w-100 d-flex justify-content-between align-items-center">
        <h2 className="mb-4">Productos</h2>

        <Dropdown>
          <Dropdown.Toggle>
            {selectedBranch?.address}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {branches.map(branch => (
              <Dropdown.Item key={branch.id} value={branch.id} onClick={() => {
                setSelectedBranch(branch)
              }}>
                {branch.address}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>


      <Row xs={1} sm={2} md={3} lg={3} className="g-4">
        {catalog.filter(item => item.stock > 0).map(item => (
          <Product key={item.id} item={item} isUserVerified={userData?.isVerified} />
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
