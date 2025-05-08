import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function ProtectedLayout() {
  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}