import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { X, Info, Link as LinkIcon, Lightbulb } from 'lucide-react';

export default function NotificationBanner() {
  const [items, setItems] = useState([]);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);

  const dismissedKey = 'dismissedNotifications';
  const getDismissed = () => JSON.parse(localStorage.getItem(dismissedKey) || '[]');
  const setDismissed = (arr) => localStorage.setItem(dismissedKey, JSON.stringify(arr));

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/notifications/approved');
      setItems(data);
    } catch (err) {
      // Silently fail, banner just won't show
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDismiss = (id) => {
    const arr = getDismissed();
    if (!arr.includes(id)) arr.push(id);
    setDismissed(arr);
    // Force a re-render by updating the items state
    setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    setInsight('');
  };

  const onWhy = async (id) => {
    setInsight('loading');
    try {
      const { data } = await api.get(`/api/notifications/${id}/insights`);
      setInsight(data.insights || 'No specific insights available for this notification.');
    } catch {
      setInsight('Could not load insights.');
    }
  };

  const isToday = (d) => {
    if (!d) return false;
    const t = new Date(d);
    const now = new Date();
    return (
      t.getFullYear() === now.getFullYear() &&
      t.getMonth() === now.getMonth() &&
      t.getDate() === now.getDate()
    );
  };

  if (loading) return null;

  const dismissed = new Set(getDismissed());
  const visibleNotifications = items.filter((n) => !dismissed.has(n._id));

  if (!visibleNotifications.length) return null;

  // For this component, we'll just show the most recent one.
  const visible = visibleNotifications[0];

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md animate-fade-in">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-purple-900">{visible.title}</h3>
          {visible.body && <p className="text-gray-600 mt-1">{visible.body}</p>}

          {visible.endsAt && isToday(visible.endsAt) && (
            <div className="mt-3 p-3 flex items-center gap-2 border border-yellow-300 bg-yellow-50 rounded-lg text-sm text-yellow-800 font-medium">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span>Deadline Today: Submit your activity record to get approved.</span>
            </div>
          )}

          {visible.sourceUrl && (
            <div className="mt-3 text-sm">
              <a
                className="text-purple-600 hover:text-purple-800 hover:underline font-medium inline-flex items-center gap-1.5 transition-colors"
                href={visible.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon className="w-4 h-4" />
                <span>
                  {(() => {
                    try {
                      return `View Source (${new URL(visible.sourceUrl).host})`;
                    } catch {
                      return 'View Source';
                    }
                  })()}
                </span>
              </a>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onWhy(visible._id)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <Info className="w-4 h-4" />
              <span>Why this helps</span>
            </button>
            <button
              type="button"
              onClick={() => onDismiss(visible._id)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 border border-gray-300"
            >
              <X className="w-4 h-4" />
              <span>Dismiss</span>
            </button>
          </div>

          {insight && (
            <div className="mt-3 text-gray-700 bg-purple-100/50 rounded-lg p-3 border border-purple-200 text-sm animate-fade-in">
              {insight === 'loading' ? 'Generating insights...' : insight}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}