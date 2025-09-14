import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Page Imports
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage'; // 👈 Import your new landing page
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import PortfolioPage from './pages/PortfolioPage';

// Component Imports
import ProtectedLayout from './components/ProtectedLayout'; // 👈 Import the new layout

// Auth Helper Functions (keep these as they are)
function isAuthed() {
  return !!localStorage.getItem('token');
}

function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function ProtectedRoute({ children, role }) {
  const user = getUser();
  if (!isAuthed()) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      {/* These routes DO NOT have the main Navbar and dark layout */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* --- Protected Routes --- */}
      {/* These routes are nested inside the ProtectedLayout, which provides the UI shell */}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty"
          element={
            <ProtectedRoute role="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio/:studentId"
          element={
            <ProtectedRoute>
              <PortfolioPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* --- Not Found Route --- */}
      <Route
        path="*"
        element={
          // Key Changes:
          // 1. Swapped the dark background (bg-gray-900) for a light gray (bg-gray-100).
          // 2. Placed the content inside a white card with padding, rounded corners, and a shadow.
          // 3. Updated the secondary text color for better readability on a light background.
          <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-3">
              <h2 className="text-4xl font-semibold text-red-500">404</h2>
              <p className="text-gray-600">Page Not Found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}