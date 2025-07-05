import React, { createContext, useState, useEffect } from 'react';
import { getTenantUIConfig as apiGetTenantUIConfig, getGeneralParameters as apiGetGeneralParameters } from '../services/api';

export const TenantContext = createContext();

export function TenantProvider({ children }) {
    const [tenantUIConfig, setTenantUIConfig] = useState(null);
    const [generalParameters, setGeneralParameters] = useState(null);
    const [loading, setLoading] = useState(true);

    const getTenantUIConfig = async () => {
        try {
            setLoading(true);
            const tenantUIConfig = await apiGetTenantUIConfig();
            setTenantUIConfig(tenantUIConfig);
        } catch (error) {
            console.error('Error fetching tenant UI config:', error);
        } finally {
            setLoading(false);
        }
    }

    const getGeneralParameters = async () => {
        try {
            // Solo intentar cargar los parámetros generales si hay un token (usuario logueado)
            const token = localStorage.getItem('auth_token');
            if (!token) return null;
            
            const generalParameters = await apiGetGeneralParameters();
            setGeneralParameters(generalParameters);
            return generalParameters;
        } catch (error) {
            console.error('Error fetching general parameters:', error);
            return null;
        }
    }

    // Función para verificar y cargar datos si es necesario
    const ensureTenantUIConfig = async () => {
        if (!tenantUIConfig && !loading) {
            await getTenantUIConfig();
        }
    }

    const ensureGeneralParameters = async () => {
        if (!generalParameters) {
            await getGeneralParameters();
        }
    }

    useEffect(() => {
        getTenantUIConfig();
        // Solo cargar los parámetros generales si hay un token (usuario logueado)
        const token = localStorage.getItem('auth_token');
        if (token) {
            getGeneralParameters();
        }
    }, []);

    return (
        <TenantContext.Provider value={{
            getTenantUIConfig,
            getGeneralParameters,
            ensureTenantUIConfig,
            ensureGeneralParameters,
            tenantUIConfig,
            generalParameters,
            loading
        }}>
            {children}
        </TenantContext.Provider>
    );
}
