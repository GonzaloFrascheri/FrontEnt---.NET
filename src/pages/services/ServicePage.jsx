import React, { useContext, useState, useEffect }  from 'react'
import { TenantContext } from '../../context/TenantContext'
import { getServicesCatalog } from '../../services/api'
import DropdownComponent from '../../components/Dropdown'
import { Spinner, Row } from 'react-bootstrap';
import Service from '../../components/Service';
import { useLocation } from '../../hooks/useLocation';

const ServicePage = () => {
  const { tenantUIConfig } = useContext(TenantContext);
  const { branches, selectedBranch, setSelectedBranch, loading: locationLoading } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [servicesCatalog, setServicesCatalog] = useState([]);

  useEffect(() => {
    if (selectedBranch) {
      getServicesCatalog(selectedBranch.id).then(data => {
        setServicesCatalog(data)
        setIsLoading(false);
      });
    }
  }, [selectedBranch]);

  if (locationLoading || isLoading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

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
