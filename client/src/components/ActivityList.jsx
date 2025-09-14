import React from 'react';
import { FileText, Info } from 'lucide-react';

export default function ActivityList({ activities }) {
  if (!activities?.length) {
    return (
      <div className="text-center py-10 px-6 rounded-lg bg-gray-50 border border-dashed border-gray-300">
        <Info className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-4 text-sm font-medium text-gray-600">You haven't added any activities yet.</p>
        <p className="text-sm text-gray-500">Use the form above to submit your first one.</p>
      </div>
    );
  }

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Proof</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {activities.map((a) => (
            <tr
              key={a._id}
              className="hover:bg-purple-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                {a.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-600">
                {a.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {a.date ? new Date(a.date).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(
                    a.status
                  )}`}
                >
                  {a.status || 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {a.proofPath ? (
                  <a
                    className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-800 font-medium transition-all duration-200 transform hover:scale-105"
                    href={`${
                      import.meta.env.VITE_API_URL || 'http://localhost:5000'
                    }${a.proofPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View</span>
                  </a>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}