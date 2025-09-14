import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { FileDown, User, Mail, BookOpen, LoaderCircle, AlertTriangle } from 'lucide-react';

export default function PortfolioPage() {
  const { studentId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/portfolio/${studentId}`);
        setData(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentId]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const pdfUrl = `${
        import.meta.env.VITE_API_URL || 'http://localhost:5000'
      }/api/portfolio/${studentId}/pdf`;
      const res = await fetch(pdfUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('PDF download failed');
      }
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `portfolio_${studentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(href);
    } catch (err) {
      alert('Could not download the PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <LoaderCircle className="w-8 h-8 animate-spin text-purple-600" />
        <p className="mt-4 text-sm">Loading Portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <AlertTriangle className="w-8 h-8 mx-auto text-red-500" />
        <p className="mt-3 font-medium text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-4">
          <User className="w-6 h-6 text-purple-600" />
          <span>Student Portfolio</span>
        </h2>
        <div className="space-y-2">
          <div className="font-semibold text-xl text-gray-900">{data?.student?.name}</div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Mail className="w-4 h-4" />
            <span>{data?.student?.email}</span>
          </div>
          {data?.student?.department && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <BookOpen className="w-4 h-4" />
              <span>{data.student.department}</span>
            </div>
          )}
        </div>
        <div className="mt-6 border-t border-gray-200 pt-4">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-purple-700 text-white text-sm font-medium hover:bg-purple-800 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <FileDown className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Approved Activities</h3>
        {data?.activities?.length ? (
          <ul className="space-y-4">
            {data.activities.map((a) => (
              <li
                key={a._id}
                className="p-4 rounded-lg bg-gray-50 border border-gray-200 transition-all duration-200 hover:bg-purple-50 hover:border-purple-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                      {a.category}
                    </span>
                    <p className="font-semibold text-gray-800">{a.title}</p>
                  </div>
                  {a.date && (
                    <p className="text-sm text-gray-500 flex-shrink-0 ml-4">
                      {new Date(a.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {a.description && (
                  <p className="text-gray-600 text-sm mt-2">{a.description}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No approved activities to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}