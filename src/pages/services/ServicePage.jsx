import React, { useContext, useState, useEffect }  from 'react'
import { TenantContext } from '../../context/TenantContext'
import { getBranches } from '../../services/api'
import DropdownComponent from '../../components/Dropdown'
import { findNearestBranch, getUserLocationByIP } from '../../helpers/utils';
import { Spinner } from 'react-bootstrap';

const ServicePage = () => {
  const { tenantUIConfig } = useContext(TenantContext);

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

  return (
    <div className="p-4">
      <div className="mb-4 w-100 d-flex justify-content-between align-items-center">
        <h2 className="mb-4" style={{ color: tenantUIConfig.primaryColor }}>Productos</h2>

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
    </div>
  )
}

export default ServicePage
