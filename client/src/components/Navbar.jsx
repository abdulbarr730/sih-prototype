import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, UserCircle2, LayoutDashboard } from 'lucide-react';

const CrediFolioLogo = ({ size = 'w-8 h-8', className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`${size} ${className}`}
    viewBox="0 0 100 100"
    fill="none"
  >
    <path
      d="M50 0L20 15V85L50 100L80 85V15L50 0Z"
      fill="#7C3AED"
      stroke="#4C1D95"
      strokeWidth="2"
    />
    <rect
      x="25"
      y="45"
      width="50"
      height="40"
      rx="5"
      fill="#FFFFFF"
      stroke="#4C1D95"
      strokeWidth="2"
    />
    <path
      d="M50 20L30 30L50 40L70 30L50 20Z"
      fill="#4C1D95"
      stroke="#4C1D95"
      strokeWidth="2"
    />
  </svg>
);

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'student') return '/student';
    if (user?.role === 'faculty') return '/faculty';
    return '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={getDashboardLink()} className="flex items-center gap-3">
          <CrediFolioLogo />
          <span className="font-bold text-xl text-gray-800">CrediFolio</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCircle2 className="w-5 h-5 text-gray-500" />
              <div className="text-sm">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200"></div>

            <Link
              to={getDashboardLink()}
              className="hidden sm:inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium hover:bg-purple-200 transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}