/**
 * Submissions Tab Component
 * Manages story and event submission interfaces
 */

import React, { useState } from 'react';
import { SingleStorySubmission } from '../submissions/SingleStorySubmission';
import { BulkStorySubmission } from '../BulkStorySubmission';

interface SubmissionsTabProps {
  onSubmit: () => void;
  curatorId?: string;
}

export const SubmissionsTab: React.FC<SubmissionsTabProps> = ({ onSubmit, curatorId = 'admin' }) => {
  const [showSingleSubmission, setShowSingleSubmission] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Story Submissions</h2>
        <div className="flex gap-3">
          <ToggleButton
            active={showSingleSubmission}
            onClick={() => setShowSingleSubmission(true)}
            label="Single Submission"
          />
          <ToggleButton
            active={!showSingleSubmission}
            onClick={() => setShowSingleSubmission(false)}
            label="Bulk Submission"
          />
        </div>
      </div>

      {showSingleSubmission ? (
        <SingleStorySubmission onSubmit={onSubmit} />
      ) : (
        <BulkStorySubmission curatorId={curatorId} onSubmissionComplete={() => onSubmit()} />
      )}
    </div>
  );
};

// Toggle Button Component
interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium rounded-lg transition-colors ${
      active
        ? 'bg-yellow-500 text-black'
        : 'bg-white/10 text-white hover:bg-white/20'
    }`}
  >
    {label}
  </button>
);

export default SubmissionsTab;
