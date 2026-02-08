// BLKOUT Board Expression of Interest Form
// Submit your interest in joining the BLKOUT board

import React, { useState } from 'react';
import { Users, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface BoardEOIFormData {
  full_name: string;
  email: string;
  blkouthub_username: string;
  blkouthub_status: 'active' | 'reactivating' | 'new';
  positions_interested: string[];
  statement_of_interest: string;
  relevant_experience: string;
  can_commit_hours: boolean;
  how_heard_about: string;
}

const BOARD_POSITIONS = [
  { id: 'chair', title: 'Chair', description: 'Lead our governance with vision' },
  { id: 'treasurer', title: 'Treasurer', description: 'Steward our community resources' },
  { id: 'secretary', title: 'Secretary', description: 'Keep our house in order' },
  { id: 'technology_director', title: 'Technology Director', description: 'Guide our digital future' },
  { id: 'community_director', title: 'Community Director', description: 'Amplify grassroots voices' },
];

const BLKOUTHUB_STATUS_OPTIONS = [
  { value: 'active', label: 'Active BLKOUTHUB member' },
  { value: 'reactivating', label: 'Reactivating my membership' },
  { value: 'new', label: 'Joining BLKOUTHUB now' },
];

export default function BoardEOIForm() {
  const [formData, setFormData] = useState<BoardEOIFormData>({
    full_name: '',
    email: '',
    blkouthub_username: '',
    blkouthub_status: 'active',
    positions_interested: [],
    statement_of_interest: '',
    relevant_experience: '',
    can_commit_hours: false,
    how_heard_about: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePosition = (positionId: string) => {
    setFormData({
      ...formData,
      positions_interested: formData.positions_interested.includes(positionId)
        ? formData.positions_interested.filter(p => p !== positionId)
        : [...formData.positions_interested, positionId]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.positions_interested.length === 0) {
      setError('Please select at least one position you are interested in.');
      setLoading(false);
      return;
    }

    if (!formData.can_commit_hours) {
      setError('Please confirm you can commit 4-6 hours per month.');
      setLoading(false);
      return;
    }

    try {
      // Submit to Supabase
      const { error: submitError } = await supabase
        .from('board_eoi_submissions')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          blkouthub_username: formData.blkouthub_username,
          blkouthub_status: formData.blkouthub_status,
          positions_interested: formData.positions_interested,
          statement_of_interest: formData.statement_of_interest,
          relevant_experience: formData.relevant_experience,
          can_commit_hours: formData.can_commit_hours,
          how_heard_about: formData.how_heard_about,
          submitted_at: new Date().toISOString(),
          status: 'pending'
        });

      if (submitError) throw submitError;

      setSuccess(true);
    } catch (err) {
      console.error('Error submitting EOI:', err);
      setError('Failed to submit your expression of interest. Please try again or contact governance@blkoutuk.com');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
          Thank You, Beloved!
        </h3>
        <p className="text-green-700 dark:text-green-300 mb-6">
          Your expression of interest has been received. We'll be in touch soon with next steps.
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-left">
          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">What happens next?</h4>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
            <li>• Attend the info session on BLKOUTHUB (Feb 22-23, 2026)</li>
            <li>• Our governance team will review all applications</li>
            <li>• Shortlisted candidates will be contacted for conversations</li>
            <li>• Board elections will take place at our AGM</li>
          </ul>
        </div>
        <p className="text-sm text-green-600 dark:text-green-400 mt-4">
          Questions? Contact us at governance@blkoutuk.com
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg mr-4">
          <Users className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Board Member Expression of Interest
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Deadline: February 21, 2026
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        {/* BLKOUTHUB Membership */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            BLKOUTHUB Membership Status *
          </label>
          <div className="space-y-2">
            {BLKOUTHUB_STATUS_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="blkouthub_status"
                  value={option.value}
                  checked={formData.blkouthub_status === option.value}
                  onChange={(e) => setFormData({ ...formData, blkouthub_status: e.target.value as 'active' | 'reactivating' | 'new' })}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-3">
            Board candidates must be BLKOUTHUB members. Join or reactivate at{' '}
            <a href="https://blkouthub.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              blkouthub.com
            </a>
          </p>
        </div>

        {/* BLKOUTHUB Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            BLKOUTHUB Username
          </label>
          <input
            type="text"
            value={formData.blkouthub_username}
            onChange={(e) => setFormData({ ...formData, blkouthub_username: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Your BLKOUTHUB username (if you have one)"
          />
        </div>

        {/* Positions of Interest */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Position(s) of Interest * <span className="font-normal">(select all that apply)</span>
          </label>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {BOARD_POSITIONS.map((position) => (
              <button
                key={position.id}
                type="button"
                onClick={() => togglePosition(position.id)}
                className={`p-4 rounded-lg text-left transition-all ${
                  formData.positions_interested.includes(position.id)
                    ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-bold">{position.title}</div>
                <div className={`text-sm ${formData.positions_interested.includes(position.id) ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {position.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Statement of Interest */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Why are you interested in joining the board? *
          </label>
          <textarea
            required
            value={formData.statement_of_interest}
            onChange={(e) => setFormData({ ...formData, statement_of_interest: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Tell us what draws you to this work and what you hope to contribute..."
          />
        </div>

        {/* Relevant Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Relevant experience, skills, or perspectives you'd bring
          </label>
          <textarea
            value={formData.relevant_experience}
            onChange={(e) => setFormData({ ...formData, relevant_experience: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="No formal qualifications required. Lived experience as a Black queer man counts. Share what you bring..."
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Remember: Heart for the work is essential. Formal qualifications are optional.
          </p>
        </div>

        {/* How heard about */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How did you hear about this opportunity?
          </label>
          <input
            type="text"
            value={formData.how_heard_about}
            onChange={(e) => setFormData({ ...formData, how_heard_about: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., Social media, BLKOUTHUB, newsletter, friend..."
          />
        </div>

        {/* Commitment Confirmation */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.can_commit_hours}
              onChange={(e) => setFormData({ ...formData, can_commit_hours: e.target.checked })}
              className="w-5 h-5 text-purple-600 focus:ring-purple-500 mt-0.5 rounded"
            />
            <span className="ml-3 text-gray-700 dark:text-gray-300">
              <strong>I confirm I can commit 4-6 hours per month</strong> to board responsibilities, including monthly meetings (2 hours), strategic planning sessions, and connecting BLKOUT with my networks.
            </span>
          </label>
        </div>

        {/* Info Session Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
            📅 Board Information Session
          </h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Join our information session on BLKOUTHUB (February 22-23, 2026) to learn more about board responsibilities and ask questions. All candidates are encouraged to attend.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-4 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          {loading ? 'Submitting...' : 'Submit Expression of Interest'}
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Questions? Contact us at{' '}
          <a href="mailto:governance@blkoutuk.com" className="text-purple-600 hover:underline">
            governance@blkoutuk.com
          </a>
        </p>
      </form>
    </div>
  );
}
