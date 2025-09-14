import React, { useState } from 'react';
import { Upload, Calendar, FileText, Tag, AlertTriangle } from 'lucide-react';
import { api } from '../api'; // Assuming you have api setup for multipart

const categories = [
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

export default function ActivityForm({ onCreated }) {
  const [form, setForm] = useState({
    category: 'Conference',
    title: '',
    description: '',
    date: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Proof of completion is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('category', form.category);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('date', form.date);
      fd.append('proof', file);

      // Using your api helper for consistency
      await api.post('/api/activities', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onCreated?.();
      setForm({ category: 'Conference', title: '', description: '', date: '' });
      setFile(null);
      // Reset the file input visually
      if (document.getElementById('proof-file-input')) {
        document.getElementById('proof-file-input').value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to submit the activity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-xl space-y-5"
    >
      {error && (
        <div className="rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <label className="block text-sm font-medium text-gray-700">
          <span className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-gray-400" />
            <span>Category</span>
          </span>
          <select
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 transition-colors duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* Date */}
        <label className="block text-sm font-medium text-gray-700">
          <span className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Date of Completion</span>
          </span>
          <input
            type="date"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 transition-colors duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </label>
      </div>


      {/* Title */}
      <label className="block text-sm font-medium text-gray-700">
        <span className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>Activity Title</span>
        </span>
        <input
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 placeholder-gray-400 transition-colors duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          name="title"
          placeholder="e.g., Smart India Hackathon 2025"
          value={form.title}
          onChange={handleChange}
          required
        />
      </label>

      {/* Description */}
      <label className="block text-sm font-medium text-gray-700">
        <span className="mb-1 block">Description (Optional)</span>
        <textarea
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 placeholder-gray-400 transition-colors duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          name="description"
          rows={3}
          placeholder="Briefly describe the activity and your role..."
          value={form.description}
          onChange={handleChange}
        />
      </label>

      {/* File Upload */}
      <label className="block text-sm font-medium text-gray-700">
        <span className="flex items-center gap-2 mb-1">
          <Upload className="w-4 h-4 text-gray-400" />
          <span>Proof of Completion (Required)</span>
        </span>
        <input
          id="proof-file-input"
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 cursor-pointer
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-100 file:text-purple-700
            hover:file:bg-purple-200 file:transition-colors file:duration-200"
        />
        <p className="text-xs text-gray-400 mt-1">Accepted formats: PDF, PNG, JPG.</p>
      </label>

      {/* Submit Button */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 bg-purple-700 text-white text-sm font-medium hover:bg-purple-800 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Activity'}
        </button>
      </div>
    </form>
  );
}