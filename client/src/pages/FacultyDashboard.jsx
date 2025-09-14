import React, { useEffect, useState } from 'react';
import PendingActivityList from '../components/PendingActivityList';
import NotificationsTable from '../components/NotificationsTable';
import NotificationForm from '../components/NotificationForm';
import { api } from '../api';
import { Bell, ClipboardList, LoaderCircle, AlertTriangle } from 'lucide-react';

export default function FacultyDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [notifPending, setNotifPending] = useState([]);
  const [notifApproved, setNotifApproved] = useState([]);
  const [notifLoading, setNotifLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/activities/pending');
      setItems(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    setNotifLoading(true);
    try {
      const [p, a] = await Promise.all([
        api.get('/api/notifications/pending'),
        api.get('/api/notifications/approved'),
      ]);
      setNotifPending(p.data);
      setNotifApproved(a.data);
    } catch (err) {
      // Handle notification loading error if necessary
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadNotifications();
  }, []);

  // --- Activity Actions ---
  const approve = async (id) => {
    await api.patch(`/api/activities/${id}/approve`);
    load();
  };
  const reject = async (id) => {
    const reason = prompt('Reason for rejection (optional):') || undefined;
    await api.patch(`/api/activities/${id}/reject`, { reason });
    load();
  };

  // --- Notification Actions ---
  const approveNotif = async (id) => {
    const endsAt = prompt('Set a completion date (YYYY-MM-DD, optional):') || undefined;
    await api.patch(`/api/notifications/${id}/approve`, endsAt ? { endsAt } : {});
    loadNotifications();
  };
  const rejectNotif = async (id) => {
    const reason = prompt('Reason for rejection (optional):') || undefined;
    await api.patch(`/api/notifications/${id}/reject`, { reason });
    loadNotifications();
  };
  const deleteNotif = async (id) => {
    if (window.confirm('Are you sure you want to delete this approved notification?')) {
      await api.delete(`/api/notifications/${id}`);
      loadNotifications();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
          <ClipboardList className="w-6 h-6 text-purple-600" />
          <span>Faculty Dashboard</span>
        </h2>
        {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xl font-semibold flex items-center gap-3 text-gray-800 mb-4">
              <Bell className="w-5 h-5 text-purple-600" />
              <span>Broadcast Notification</span>
            </h3>
            <NotificationForm onCreated={loadNotifications} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
            <h4 className="font-semibold text-gray-800 mb-3">Pending Notifications</h4>
            {notifLoading ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <LoaderCircle className="animate-spin w-4 h-4" />
                <span>Loading...</span>
              </div>
            ) : (
              <NotificationsTable
                items={notifPending}
                mode="pending"
                onApprove={approveNotif}
                onReject={rejectNotif}
              />
            )}
          </div>
          
          <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
            <h4 className="font-semibold text-gray-800 mb-3">Approved Notifications</h4>
            {notifLoading ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <LoaderCircle className="animate-spin w-4 h-4" />
                <span>Loading...</span>
              </div>
            ) : (
              <NotificationsTable
                items={notifApproved}
                mode="approved"
                onDelete={deleteNotif}
                currentUserId={user?.id}
              />
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 lg:h-full">
          <h3 className="text-xl font-semibold flex items-center gap-3 text-gray-800 mb-4">
            <ClipboardList className="w-5 h-5 text-purple-600" />
            <span>Pending Student Activities</span>
          </h3>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <LoaderCircle className="animate-spin w-4 h-4" />
              <span>Loading activities...</span>
            </div>
          ) : (
            <PendingActivityList items={items} onApprove={approve} onReject={reject} />
          )}
        </div>
      </div>
    </div>
  );
}