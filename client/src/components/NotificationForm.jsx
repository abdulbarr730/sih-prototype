import React, { useState } from 'react';
import { api } from '../api';
import { BellPlus, AlertTriangle } from 'lucide-react';

const categories = [
  'General',
  'Conference',
  'Hackathon',
  'Workshop',
  'Certification',
  'Club Activity',
  'Volunteering',
  'Competition',
  'Leadership Role',
  'Internship',
  'Community Service',
  'Other',
];

export default function NotificationForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'General',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form };
      await api.post('/api/notifications', payload);
      setForm({ title: '', body: '', category: 'General' });
      onCreated?.();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
          <span className="mb-1 block">Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 placeholder-gray-400 transition-colors duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., Upcoming Hackathon"
          />
        </label>
        
        {/* Category */}
        <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
          <span className="mb-1 block">Category</span>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 transition-colors duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Body */}
      <label className="block text-sm font-medium text-gray-700">
        <span className="mb-1 block">Body (Optional)</span>
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          rows={4}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 placeholder-gray-400 transition-colors duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter additional details for the students..."
        />
      </label>

      {/* Submit */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-purple-700 text-white text-sm font-medium hover:bg-purple-800 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Broadcasting...' : 'Broadcast Notification'}
        </button>
      </div>
    </form>
  );
}