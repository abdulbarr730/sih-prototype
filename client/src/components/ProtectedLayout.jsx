import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// This helper function is needed to pass user data to the Navbar
function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export default function ProtectedLayout() {
  const user = getUser();

  return (
    // The background is removed, but the layout structure remains
    <div className="min-h-screen">
      {/* The Navbar is still here and receives the user prop correctly */}
      <Navbar user={user} />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}