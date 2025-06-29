import React, { createContext, useState, useEffect } from 'react';
import { getTenantUIConfig as apiGetTenantUIConfig, getGeneralParameters as apiGetGeneralParameters } from '../services/api';

export const TenantContext = createContext();

export function TenantProvider({ children }) {
    const [tenantUIConfig, setTenantUIConfig] = useState(null);
    const [generalParameters, setGeneralParameters] = useState(null);

    const getTenantUIConfig = async () => {
        const tenantUIConfig = await apiGetTenantUIConfig();
        setTenantUIConfig(tenantUIConfig);
    }

    const getGeneralParameters = async () => {
        const generalParameters = await apiGetGeneralParameters();
        setGeneralParameters(generalParameters);
    }

    useEffect(() => {
      getTenantUIConfig();
      getGeneralParameters();
    }, []);

    return (
        <TenantContext.Provider value={{
          getTenantUIConfig, getGeneralParameters,
          tenantUIConfig, generalParameters
        }}>
            {children}
        </TenantContext.Provider>
    );
}
