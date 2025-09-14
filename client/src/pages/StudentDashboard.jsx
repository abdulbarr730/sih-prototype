import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileDown, ExternalLink } from 'lucide-react';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import NotificationBanner from '../components/NotificationBanner';
import { api } from '../api';

export default function StudentDashboard() {
  const [activities, setActivities] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchMine = async () => {
    try {
      const { data } = await api.get('/api/activities/mine');
      setActivities(data);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `${
        import.meta.env.VITE_API_URL || 'http://localhost:5000'
      }/api/portfolio/${user?.id}/pdf`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert('Failed to download PDF');
        return;
      }

      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `portfolio_${user?.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (err) {
      alert('Something went wrong while downloading the PDF');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Student Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Welcome back, {user?.name || 'Student'} 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-purple-700 text-white text-sm font-medium hover:bg-purple-800 transition-all duration-300 ease-in-out transform hover:scale-105"
              to={`/portfolio/${user?.id}`}
            >
              <ExternalLink className="w-4 h-4" />
              View Portfolio
            </Link>
            <button
              onClick={downloadPDF}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-300"
            >
              <FileDown className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="mt-4">
          <NotificationBanner />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Add New Activity
        </h3>
        <ActivityForm onCreated={fetchMine} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          My Activities
        </h3>
        {activities.length > 0 ? (
          <ActivityList activities={activities} />
        ) : (
          <p className="text-gray-500 text-sm">
            No activities added yet. Start by creating one above.
          </p>
        )}
      </div>
    </div>
  );
}