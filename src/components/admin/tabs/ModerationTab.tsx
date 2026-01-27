/**
 * Moderation Tab Component
 * Story moderation queue for reviewing and approving/rejecting submissions
 */

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { ModerationItem } from '../types';

interface ModerationTabProps {
  moderationQueue: ModerationItem[];
  loading: boolean;
  onRefresh: () => void;
  onApprove: (storyId: string) => void;
  onReject: (storyId: string) => void;
}

export const ModerationTab: React.FC<ModerationTabProps> = ({
  moderationQueue,
  loading,
  onRefresh,
  onApprove,
  onReject
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Story Moderation Queue</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : moderationQueue.length === 0 ? (
        <EmptyState />
      ) : (
        <ModerationList
          items={moderationQueue}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
    </div>
  );
};

// Loading State Component
const LoadingState: React.FC = () => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
    <p className="text-gray-300 mt-4">Loading story moderation queue...</p>
  </div>
);

// Empty State Component
const EmptyState: React.FC = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
    <p className="text-gray-300">No stories pending moderation.</p>
  </div>
);

// Moderation List Component
interface ModerationListProps {
  items: ModerationItem[];
  onApprove: (storyId: string) => void;
  onReject: (storyId: string) => void;
}

const ModerationList: React.FC<ModerationListProps> = ({ items, onApprove, onReject }) => (
  <div className="space-y-4">
    {items.map((item) => (
      <ModerationCard
        key={item.id}
        item={item}
        onApprove={() => onApprove(item.id)}
        onReject={() => onReject(item.id)}
      />
    ))}
  </div>
);

// Moderation Card Component
interface ModerationCardProps {
  item: ModerationItem;
  onApprove: () => void;
  onReject: () => void;
}

const ModerationCard: React.FC<ModerationCardProps> = ({ item, onApprove, onReject }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
        <p className="text-gray-300 text-sm mb-3">{item.excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>By {item.submittedBy}</span>
          <span>•</span>
          <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
          <span>•</span>
          <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">{item.category}</span>
          <span>•</span>
          <span>{item.votes} votes</span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={onApprove}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Approve to Newsroom
        </button>

        <button
          onClick={onReject}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
      </div>
    </div>

    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-yellow-400 hover:text-yellow-300 text-sm underline"
    >
      View original article →
    </a>
  </div>
);

export default ModerationTab;
