import React from 'react';
import { Check, X, Trash2, ExternalLink, Info } from 'lucide-react';

function hostFromUrl(url) {
  try {
    return new URL(url).host;
  } catch {
    return '';
  }
}

export default function NotificationsTable({
  items,
  mode, // "pending" | "approved"
  onApprove,
  onReject,
  onDelete,
  currentUserId,
}) {
  if (!items?.length) {
    return (
      <div className="text-center py-10 px-6 rounded-lg bg-gray-50 border border-dashed border-gray-300">
        <Info className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-4 text-sm font-medium text-gray-600">No {mode} notifications</p>
        <p className="text-sm text-gray-500">This section is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-3">Details</th>
            <th className="px-6 py-3">Category</th>
            {mode === 'approved' && <th className="px-6 py-3">Approved By</th>}
            {mode === 'approved' && <th className="px-6 py-3">Ends On</th>}
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((n) => (
            <tr
              key={n._id}
              className="hover:bg-purple-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 max-w-sm">
                <p className="font-semibold text-gray-800 truncate">{n.title}</p>
                {n.body && <p className="text-gray-500 text-xs mt-1">{n.body}</p>}
                {n.sourceUrl && (
                  <a
                    className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-800 text-xs font-medium mt-2 transition-colors"
                    href={n.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{hostFromUrl(n.sourceUrl)}</span>
                  </a>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                  {n.category}
                </span>
              </td>

              {mode === 'approved' && (
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {n.approvedBy?.name || 'N/A'}
                </td>
              )}

              {mode === 'approved' && (
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {n.endsAt ? new Date(n.endsAt).toLocaleDateString() : '—'}
                </td>
              )}

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex justify-center items-center gap-2">
                  {mode === 'pending' && (
                    <>
                      <button
                        onClick={() => onApprove(n._id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 hover:bg-green-200 hover:scale-110 transition-all duration-200"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onReject(n._id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 hover:bg-red-200 hover:scale-110 transition-all duration-200"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {mode === 'approved' && (
                    <button
                      onClick={() => onDelete(n._id)}
                      disabled={String(n.approvedBy?._id) !== String(currentUserId)}
                      title={
                        String(n.approvedBy?._id) === String(currentUserId)
                          ? 'Delete this notification'
                          : 'Only the approver can delete'
                      }
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}