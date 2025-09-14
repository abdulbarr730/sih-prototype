import React from 'react';
import { Check, X, ExternalLink, Info } from 'lucide-react';

export default function PendingActivityList({ items, onApprove, onReject }) {
  if (!items?.length) {
    return (
      <div className="text-center py-10 px-6 rounded-lg bg-gray-50 border border-dashed border-gray-300">
        <Info className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-4 text-sm font-medium text-gray-600">All Clear!</p>
        <p className="text-sm text-gray-500">There are no pending activities to review.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-3">Student</th>
            <th className="px-6 py-3">Activity Details</th>
            <th className="px-6 py-3 text-center">Proof</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((a) => (
            <tr
              key={a._id}
              className="hover:bg-purple-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <p className="font-semibold text-gray-800">{a.student?.name}</p>
                <p className="text-gray-500 text-xs">{a.student?.email}</p>
              </td>

              <td className="px-6 py-4 max-w-xs">
                <p className="font-semibold text-gray-800 truncate">{a.title}</p>
                <div className="flex items-center gap-4 text-gray-500 text-xs mt-1">
                  <span className="inline-block bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-full capitalize">
                    {a.category}
                  </span>
                  <span>{a.date ? new Date(a.date).toLocaleDateString() : '—'}</span>
                </div>
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
                    <ExternalLink className="w-4 h-4" />
                    <span>View</span>
                  </a>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => onApprove(a._id)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 hover:bg-green-200 hover:scale-110 transition-all duration-200"
                    title="Approve"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onReject(a._id)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 hover:bg-red-200 hover:scale-110 transition-all duration-200"
                    title="Reject"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}