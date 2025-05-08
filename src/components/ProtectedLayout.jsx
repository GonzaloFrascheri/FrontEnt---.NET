// src/components/ProtectedLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

export default function ProtectedLayout() {
  return (
    <div className="app">
      <div className="app__overlay" />
      <NavBar />

      <main className="app__content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
