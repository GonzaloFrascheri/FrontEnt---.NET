// src/context/PointsContext.jsx
import React, { createContext, useState, useEffect } from 'react';

/**
 * Contexto para el saldo de puntos del usuario.
 * En esta fase usamos datos mock, luego se reemplaza por llamada real.
 */
export const PointsContext = createContext({
  balance: 0,
  refreshBalance: () => {}
});

export function PointsProvider({ children }) {
  const [balance, setBalance] = useState(0);

  // Carga inicial mockeada
  useEffect(() => {
    const mockBalance = 1234; 
    setBalance(mockBalance);
  }, []);

  // Función para “refrescar” el balance (simula un nuevo fetch)
  const refreshBalance = () => {
    const newMock = Math.floor(Math.random() * 1000) + 500;
    setBalance(newMock);
  };

  return (
    <PointsContext.Provider value={{ balance, refreshBalance }}>
      {children}
    </PointsContext.Provider>
  );
}
