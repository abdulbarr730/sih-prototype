import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const CrediFolioLogo = ({ size = 'w-12 h-12', className = '' }) => (
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
    <path
      d="M50 40L30 30V40L50 50L70 40V30L50 40Z"
      fill="#4C1D95"
      stroke="#4C1D95"
      strokeWidth="2"
    />
    <rect x="35" y="65" width="30" height="5" rx="2" fill="#7C3AED" />
    <rect x="35" y="75" width="30" height="5" rx="2" fill="#7C3AED" />
    <path
      d="M50 20L50 85"
      stroke="#4C1D95"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M25 85L75 85"
      stroke="#4C1D95"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('student1@example.com');
  const [password, setPassword] = useState('Pass@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'faculty' ? '/faculty' : '/student');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="mb-6 flex flex-col items-center">
        <CrediFolioLogo size="w-16 h-16" />
        <h1 className="text-3xl font-bold text-gray-800 mt-2">CrediFolio</h1>
      </div>

      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md space-y-6 border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500">
            Login to continue to your portal
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm p-3 text-center">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@college.edu"
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 placeholder-gray-400 transition-colors duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 placeholder-gray-400 transition-colors duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 bg-purple-700 text-white font-medium text-sm hover:bg-purple-800 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-xs text-gray-500">
          Trouble logging in? Contact your administrator.
        </p>
      </form>
    </div>
  );
}