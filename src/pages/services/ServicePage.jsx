import React, { useContext, useState, useEffect }  from 'react'
import { TenantContext } from '../../context/TenantContext'
import { getBranches, getServicesCatalog } from '../../services/api'
import DropdownComponent from '../../components/Dropdown'
import { findNearestBranch, getUserLocationByIP } from '../../helpers/utils';
import { Spinner, Row } from 'react-bootstrap';
import Service from '../../components/Service';

const ServicePage = () => {
  const { tenantUIConfig } = useContext(TenantContext);

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesCatalog, setServicesCatalog] = useState([]);

  useEffect(() => {
    getBranches().then(data => {
      const branches = Array.isArray(data.data) ? data.data : [];
      const mapped = branches.map(b => ({
        id: b.id,
        address: b.address,
        lat: parseFloat(b.latitud),
        lng: parseFloat(b.longitud),
      })).filter(st => !isNaN(st.lat) && !isNaN(st.lng));
      setBranches(mapped);

      getUserLocationByIP().then(location => {
        if (location) {
          setUserLocation(location);
        }
      });
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
  }, [userLocation, branches]);

  useEffect(() => {
    if (selectedBranch) {
      getServicesCatalog(selectedBranch.id).then(data => {
        setServicesCatalog(data)
        setIsLoading(false);
      });
    }
  }, [selectedBranch]);

  if (isLoading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

  return (
    <div className="p-4">
      <div className="mb-4 w-100 d-flex justify-content-between align-items-center">
        <h2 className="mb-4" style={{ color: tenantUIConfig?.primaryColor }}>Servicios</h2>

        <DropdownComponent
          items={branches.map(branch => ({
            id: branch.id,
            label: branch.address
          }))}
          selectedItemId={selectedBranch?.id}
          setSelectedItemId={(id) => setSelectedBranch(branches.find(branch => branch.id === id))}
          tenantStyles={tenantUIConfig}
        />
      </div>

      <Row xs={1} sm={2} md={3} lg={3} className="g-4">
        {servicesCatalog.map(service => (
          <Service
            key={service.id}
            service={service}
            selectedBranchId={selectedBranch?.id}
            tenantUIConfig={tenantUIConfig}
          />
        ))}
      </Row>

      {servicesCatalog.length === 0 && (
        <div className="text-center mt-5">
          <h3>No hay servicios disponibles</h3>
          <p>Por favor, seleccione otra estación</p>
        </div>
      )}
    </div>
  )
}

export default ServicePage
