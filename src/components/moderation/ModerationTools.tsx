// BLKOUT Moderation Tools Widget
// Chrome Extension Download Links for Curators & Admins

import React from 'react';
import { Download, Calendar, Newspaper, Info, CheckCircle } from 'lucide-react';

interface ModerationToolsProps {
  userRole?: 'admin' | 'curator' | 'member';
  className?: string;
}

export const ModerationTools: React.FC<ModerationToolsProps> = ({
  userRole = 'member',
  className = ''
}) => {
  // Only show to admins and curators
  if (userRole === 'member') {
    return null;
  }

  const downloadExtension = (type: 'events' | 'news') => {
    const fileName = type === 'events'
      ? 'blkout-events-curator-v1.0.0.zip'
      : 'blkout-news-curator-v1.0.0.zip';

    // Download from public folder
    const link = document.createElement('a');
    link.href = `/extensions/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-liberation-pride-purple/10 rounded-lg flex items-center justify-center">
          <Download className="w-5 h-5 text-liberation-pride-purple" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Curator Tools
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chrome extensions for content curation
          </p>
        </div>
      </div>

      {/* Extensions */}
      <div className="space-y-4">
        {/* Events Extension */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-liberation-pride-purple/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Events Curator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Auto-extract event data from Eventbrite, Meetup, Facebook Events, and more
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3" />
                  Schema.org
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3" />
                  Image Upload
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3" />
                  Auto-tags
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadExtension('events')}
                  className="inline-flex items-center gap-2 bg-liberation-pride-purple text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-liberation-pride-purple/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Extension
                </button>
                <a
                  href="https://events-blkout.vercel.app/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  View Dashboard →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* News Extension */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-liberation-pride-purple/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Newspaper className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                News Curator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Auto-extract article data from news sites with Smart content warning detection
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3" />
                  JSON-LD
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3" />
                  Image Upload
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3" />
                  Content Warnings
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadExtension('news')}
                  className="inline-flex items-center gap-2 bg-liberation-pride-purple text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-liberation-pride-purple/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Extension
                </button>
                <a
                  href="https://news-blkout.vercel.app/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  View Dashboard →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Installation Instructions:
            </p>
            <ol className="space-y-1 text-blue-800 dark:text-blue-200 list-decimal list-inside">
              <li>Download the extension ZIP file</li>
              <li>Extract the ZIP to a folder (e.g., Documents/BLKOUT Extensions)</li>
              <li>Open Chrome and go to <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">chrome://extensions/</code></li>
              <li>Enable "Developer mode" (toggle in top-right corner)</li>
              <li>Click "Load unpacked" and select the extracted folder</li>
              <li>Extension will appear in your toolbar - start curating!</li>
            </ol>
            <a
              href="/docs/extension-installation"
              target="_blank"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline mt-2 font-medium"
            >
              View detailed guide
              <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Stats (if curator) */}
      {userRole === 'curator' && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-liberation-pride-purple">0</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Submitted Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">--</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Approval Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">--</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Queue Size</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModerationTools;
