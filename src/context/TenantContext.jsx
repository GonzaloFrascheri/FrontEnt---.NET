import React, { createContext, useState, useEffect } from 'react';
import { getTenantUIConfig as apiGetTenantUIConfig, getGeneralParameters as apiGetGeneralParameters } from '../services/api';

export const TenantContext = createContext();

export function TenantProvider({ children }) {
    const [tenantUIConfig, setTenantUIConfig] = useState(null);
    const [generalParameters, setGeneralParameters] = useState(null);
    const [loading, setLoading] = useState(true);
    // Nuevo estado para controlar si el tenant existe
    const [tenantExists, setTenantExists] = useState(true);
    // Mensaje de error opcional
    const [errorMessage, setErrorMessage] = useState('');

    const getTenantUIConfig = async () => {
        try {
            setLoading(true);
            const tenantUIConfig = await apiGetTenantUIConfig();
            setTenantUIConfig(tenantUIConfig);
            // Si llegamos aquí, el tenant existe
            setTenantExists(true);
        } catch (error) {
            console.error('Error fetching tenant UI config:', error);
            
            // Verificar si es un error 400 (tenant no existe)
            if (error.response && error.response.status === 400) {
                setTenantExists(false);
                // Obtener el mensaje de error del backend si está disponible
                if (error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('El tenant al que quieres ingresar no existe');
                }
            }
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
            loading,
            tenantExists,
            errorMessage
        }}>
            {children}
        </TenantContext.Provider>
    );
}
