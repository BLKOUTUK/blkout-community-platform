/**
 * Bulk Event Submission Component
 * Upload multiple events via CSV or JSON file
 */

import React, { useState } from 'react';
import { Upload, Download, FileText, XCircle } from 'lucide-react';
import { liberationDB } from '@/lib/supabase';
import { expandRecurringEvent } from '../utils/expandRecurringEvent';

interface BulkEventSubmissionProps {
  onSubmit: () => void;
}

interface UploadStatus {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const BulkEventSubmission: React.FC<BulkEventSubmissionProps> = ({ onSubmit }) => {
  const [bulkEventFile, setBulkEventFile] = useState<File | null>(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

  const handleBulkEventUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBulkEventFile(file);
      setUploadStatus(null);
    }
  };

  const processBulkEventSubmission = async () => {
    if (!bulkEventFile) return;

    setBulkProcessing(true);
    setUploadStatus({ type: 'info', message: 'Processing events...' });

    try {
      const text = await bulkEventFile.text();
      let events: any[] = [];

      if (bulkEventFile.name.endsWith('.json')) {
        const parsed = JSON.parse(text);
        events = Array.isArray(parsed) ? parsed : parsed.events || [];
      } else if (bulkEventFile.name.endsWith('.csv')) {
        // Enhanced CSV parsing for events with recurrence support
        const lines = text.split('\n').slice(1); // Skip header
        const parsedEvents = lines.filter(line => line.trim()).map(line => {
          const [title, description, excerpt, category, type, startDate, endDate, recurrencePattern, recurrenceInterval, daysOfWeek, organizerName, organizerEmail] = line.split(',');
          return {
            title: title?.trim().replace(/^"|"$/g, ''),
            description: description?.trim().replace(/^"|"$/g, ''),
            excerpt: excerpt?.trim().replace(/^"|"$/g, ''),
            category: category?.trim(),
            type: type?.trim(),
            startDate: startDate?.trim().replace(/^"|"$/g, ''),
            endDate: endDate?.trim().replace(/^"|"$/g, '') || null,
            recurrencePattern: recurrencePattern?.trim() || 'none',
            recurrenceInterval: parseInt(recurrenceInterval?.trim() || '1'),
            daysOfWeek: daysOfWeek?.trim().replace(/^"|"$/g, '') || '',
            organizer: {
              name: organizerName?.trim().replace(/^"|"$/g, ''),
              email: organizerEmail?.trim().replace(/^"|"$/g, ''),
              communityMember: true
            }
          };
        });

        // Expand recurring events into individual occurrences
        events = [];
        parsedEvents.forEach(eventData => {
          const expandedEvents = expandRecurringEvent(eventData);
          events.push(...expandedEvents);
        });
      }

      if (events.length === 0) {
        throw new Error('No valid events found in file');
      }

      // Submit events individually to Supabase
      for (const event of events) {
        await liberationDB.submitEventToQueue({
          title: event.title,
          description: event.description,
          category: event.category,
          type: event.type,
          date: event.date,
          organizer: event.organizer?.name || 'Unknown'
        });
      }

      setUploadStatus({
        type: 'success',
        message: `Successfully submitted ${events.length} events for moderation`
      });
      setBulkEventFile(null);
      onSubmit();
    } catch (error) {
      console.error('Failed to process bulk event submission:', error);
      setUploadStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to process events'
      });
    } finally {
      setBulkProcessing(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Bulk Event Submission</h3>
      <p className="text-gray-300 mb-6">
        Upload multiple events at once using CSV or JSON format. Events will be sent to moderation queue for approval.
      </p>

      <div className="space-y-6">
        {/* Template Downloads */}
        <TemplateDownloads />

        {/* File Upload */}
        <FileUploadArea onFileSelect={handleBulkEventUpload} />

        {/* File Info & Process */}
        {bulkEventFile && (
          <FilePreview
            file={bulkEventFile}
            processing={bulkProcessing}
            onClear={() => { setBulkEventFile(null); setUploadStatus(null); }}
            onProcess={processBulkEventSubmission}
          />
        )}

        {/* Status Messages */}
        {uploadStatus && <StatusMessage status={uploadStatus} />}

        {/* CSV Format Example */}
        <CSVFormatExample />
      </div>
    </div>
  );
};

// Template Downloads Component
const TemplateDownloads: React.FC = () => (
  <div className="flex flex-wrap gap-3 mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
    <div className="flex items-center gap-2 text-orange-800">
      <Download className="h-4 w-4" />
      <span className="text-sm font-medium">Download CSV Templates:</span>
    </div>
    <a
      href="/templates/event-submission-template.csv"
      download="event-submission-template.csv"
      className="flex items-center gap-1 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors"
    >
      <FileText className="h-3 w-3" />
      Events Template
    </a>
    <div className="text-orange-700 text-xs ml-2">
      Use this format: title, description, excerpt, category, type, startDate, endDate, recurrencePattern, recurrenceInterval, daysOfWeek, organizerName, organizerEmail
    </div>
  </div>
);

// File Upload Area Component
interface FileUploadAreaProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onFileSelect }) => (
  <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
    <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
    <p className="text-white/70 mb-4">Upload CSV or JSON file with multiple events</p>
    <input
      type="file"
      accept=".csv,.json"
      onChange={onFileSelect}
      className="hidden"
      id="bulk-event-upload"
    />
    <label
      htmlFor="bulk-event-upload"
      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors cursor-pointer font-medium"
    >
      <Upload className="w-4 h-4" />
      Choose File
    </label>
  </div>
);

// File Preview Component
interface FilePreviewProps {
  file: File;
  processing: boolean;
  onClear: () => void;
  onProcess: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, processing, onClear, onProcess }) => (
  <div className="bg-white/5 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-white font-medium">{file.name}</span>
      <button onClick={onClear} className="text-red-400 hover:text-red-300">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
    <p className="text-white/70 text-sm mb-4">
      {(file.size / 1024).toFixed(1)} KB • {file.type || 'Unknown type'}
    </p>
    <button
      onClick={onProcess}
      disabled={processing}
      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
    >
      {processing ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing Events...
        </span>
      ) : (
        'Process Bulk Submission'
      )}
    </button>
  </div>
);

// Status Message Component
interface StatusMessageProps {
  status: UploadStatus;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ status }) => {
  const styles = {
    success: 'bg-green-500/20 border-green-500/30 text-green-300',
    error: 'bg-red-500/20 border-red-500/30 text-red-300',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-300'
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[status.type]}`}>
      <p className="text-sm">{status.message}</p>
    </div>
  );
};

// CSV Format Example Component
const CSVFormatExample: React.FC = () => (
  <div className="bg-black/20 rounded-lg p-4">
    <h4 className="text-white font-medium mb-2">CSV Format Examples:</h4>
    <div className="space-y-3">
      <div>
        <p className="text-xs text-gray-400 mb-1">Single Event:</p>
        <pre className="text-xs text-gray-300 overflow-x-auto">
{`title,description,excerpt,category,type,startDate,endDate,recurrencePattern,recurrenceInterval,daysOfWeek,organizerName,organizerEmail
"Community Workshop","Full description","Brief excerpt","education","virtual","2024-02-01T18:00","","none","1","","Organizer","email@example.com"`}
        </pre>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Recurring Event (Weekly for 3 months):</p>
        <pre className="text-xs text-gray-300 overflow-x-auto">
{`"Weekly Healing Circle","Trauma-informed healing space","Weekly healing circle","health","support-group","2025-10-20T14:00","2025-12-20T14:00","weekly","1","","Community Healing","healing@community.org"`}
        </pre>
      </div>
      <div className="text-xs text-gray-400">
        <p><strong>Recurrence Patterns:</strong> none, daily, weekly, monthly, yearly</p>
        <p><strong>Leave endDate empty for single events</strong></p>
      </div>
    </div>
  </div>
);

export default BulkEventSubmission;
