/**
 * Single Event Submission Component
 * Form for manually submitting individual events to the moderation queue
 */

import React, { useState } from 'react';
import { liberationDB } from '@/lib/supabase';
import { EventFormData, EventSubmission } from '../types';

interface SingleEventSubmissionProps {
  onSubmit: () => void;
}

const initialFormData: EventFormData = {
  title: '',
  description: '',
  excerpt: '',
  category: '',
  type: '',
  date: '',
  endDate: '',
  locationDetails: '',
  organizerName: '',
  organizerEmail: '',
  organizerOrganization: '',
  registrationRequired: false,
  capacity: '',
  registrationUrl: '',
  accessibilityFeatures: '',
  tags: ''
};

export const SingleEventSubmission: React.FC<SingleEventSubmissionProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const eventSubmission: EventSubmission = {
        title: formData.title,
        description: formData.description,
        excerpt: formData.excerpt,
        category: formData.category as EventSubmission['category'],
        type: formData.type as EventSubmission['type'],
        date: formData.date,
        endDate: formData.endDate || undefined,
        location: {
          type: formData.type as EventSubmission['type'],
          details: formData.locationDetails
        },
        organizer: {
          name: formData.organizerName,
          email: formData.organizerEmail,
          organization: formData.organizerOrganization,
          communityMember: true
        },
        registration: {
          required: formData.registrationRequired,
          capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
          registrationUrl: formData.registrationUrl || undefined
        },
        accessibilityFeatures: formData.accessibilityFeatures.split(',').map(f => f.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      await liberationDB.submitEventToQueue({
        title: eventSubmission.title,
        description: eventSubmission.description,
        category: eventSubmission.category,
        type: eventSubmission.type,
        date: eventSubmission.date,
        organizer: eventSubmission.organizer.name
      });

      setFormData(initialFormData);
      onSubmit();
    } catch (error) {
      console.error('Failed to submit event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { value: 'mutual-aid', label: 'Mutual Aid' },
    { value: 'organizing', label: 'Organizing' },
    { value: 'education', label: 'Education' },
    { value: 'celebration', label: 'Celebration' },
    { value: 'support', label: 'Support' },
    { value: 'action', label: 'Action' }
  ];

  const eventTypes = [
    { value: 'virtual', label: 'Virtual' },
    { value: 'in-person', label: 'In-Person' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Add Single Event</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Date</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Full event description..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as EventFormData['category'] })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as EventFormData['type'] })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select type</option>
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Organizer Name</label>
            <input
              type="text"
              value={formData.organizerName}
              onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Organizer name"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-lg transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Event'}
        </button>
      </form>
    </div>
  );
};

export default SingleEventSubmission;
