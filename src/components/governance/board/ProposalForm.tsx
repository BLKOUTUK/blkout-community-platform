// BLKOUT Proposal Form
// Submit new proposals for board consideration

import React, { useState } from 'react';
import { Vote, Save, FileText, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProposalFormData {
  proposal_title: string;
  proposal_content: string;
  impact_areas: string[];
  financial_impact: string;
  voting_deadline_date: string;
  voting_deadline_time: string;
  rationale: string;
}

const IMPACT_AREAS = [
  'Governance',
  'Financial',
  'Community',
  'Operations',
  'Partnerships',
  'Technology',
  'Events',
  'Communications',
  'Membership',
  'Safeguarding'
];

export default function ProposalForm() {
  const [formData, setFormData] = useState<ProposalFormData>({
    proposal_title: '',
    proposal_content: '',
    impact_areas: [],
    financial_impact: '',
    voting_deadline_date: '',
    voting_deadline_time: '',
    rationale: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleImpactArea = (area: string) => {
    setFormData({
      ...formData,
      impact_areas: formData.impact_areas.includes(area)
        ? formData.impact_areas.filter(a => a !== area)
        : [...formData.impact_areas, area]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user's board member ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: member } = await supabase
        .from('board_members')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!member) throw new Error('Not a board member');

      // Combine date and time
      const votingDeadline = new Date(`${formData.voting_deadline_date}T${formData.voting_deadline_time}`);

      // Generate resolution number
      const { data: resolutionData } = await supabase.rpc('generate_resolution_number');
      const resolutionNumber = resolutionData;

      // Create proposal
      const { error } = await supabase
        .from('board_decisions')
        .insert({
          proposal_title: formData.proposal_title,
          proposal_content: formData.proposal_content,
          proposed_by: member.id,
          voting_deadline: votingDeadline.toISOString(),
          voting_opens_at: new Date().toISOString(),
          decision_outcome: 'pending',
          impact_areas: formData.impact_areas,
          financial_impact: formData.financial_impact ? parseFloat(formData.financial_impact) : null,
          rationale: formData.rationale,
          resolution_number: resolutionNumber
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Reset form
        setFormData({
          proposal_title: '',
          proposal_content: '',
          impact_areas: [],
          financial_impact: '',
          voting_deadline_date: '',
          voting_deadline_time: '',
          rationale: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-liberation-black-power to-liberation-purple-spirit rounded-xl p-8 border border-liberation-gold-divine/30">
        <h1 className="text-3xl font-bold text-liberation-gold-divine mb-2 flex items-center gap-2">
          <Vote className="h-8 w-8" />
          Submit Proposal
        </h1>
        <p className="text-liberation-silver">
          Propose decisions for board consideration and voting
        </p>
      </div>

      <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
        {success && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6 text-green-400">
            Proposal submitted successfully! Board members will be notified.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Proposal Title */}
          <div>
            <label className="block text-liberation-silver text-sm mb-2 font-medium">
              Proposal Title *
            </label>
            <input
              type="text"
              required
              value={formData.proposal_title}
              onChange={(e) => setFormData({ ...formData, proposal_title: e.target.value })}
              placeholder="e.g., Approve new partnership with community organization"
              className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-3 text-white placeholder-liberation-silver/50"
            />
          </div>

          {/* Proposal Content */}
          <div>
            <label className="block text-liberation-silver text-sm mb-2 font-medium">
              <FileText className="inline h-4 w-4 mr-1" />
              Proposal Details *
            </label>
            <textarea
              required
              value={formData.proposal_content}
              onChange={(e) => setFormData({ ...formData, proposal_content: e.target.value })}
              placeholder="Provide full details of the proposal, including background, benefits, and any risks..."
              rows={8}
              className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-3 text-white placeholder-liberation-silver/50"
            />
            <p className="text-xs text-liberation-silver/70 mt-1">
              Be clear and comprehensive - this will be reviewed by all board members
            </p>
          </div>

          {/* Rationale */}
          <div>
            <label className="block text-liberation-silver text-sm mb-2 font-medium">
              Rationale / Justification
            </label>
            <textarea
              value={formData.rationale}
              onChange={(e) => setFormData({ ...formData, rationale: e.target.value })}
              placeholder="Why is this proposal important? What problem does it solve?"
              rows={4}
              className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-3 text-white placeholder-liberation-silver/50"
            />
          </div>

          {/* Impact Areas */}
          <div>
            <label className="block text-liberation-silver text-sm mb-3 font-medium">
              Impact Areas (select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {IMPACT_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleImpactArea(area)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    formData.impact_areas.includes(area)
                      ? 'bg-liberation-gold-divine/20 border-2 border-liberation-gold-divine text-liberation-gold-divine'
                      : 'bg-white/5 border border-white/20 text-liberation-silver hover:bg-white/10'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Financial Impact */}
          <div>
            <label className="block text-liberation-silver text-sm mb-2 font-medium">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Financial Impact (if applicable)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-liberation-silver">£</span>
              <input
                type="number"
                step="0.01"
                value={formData.financial_impact}
                onChange={(e) => setFormData({ ...formData, financial_impact: e.target.value })}
                placeholder="0.00"
                className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg pl-8 pr-4 py-3 text-white placeholder-liberation-silver/50"
              />
            </div>
            <p className="text-xs text-liberation-silver/70 mt-1">
              Enter the estimated cost or financial benefit of this proposal
            </p>
          </div>

          {/* Voting Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-liberation-silver text-sm mb-2 font-medium">
                Voting Deadline Date *
              </label>
              <input
                type="date"
                required
                value={formData.voting_deadline_date}
                onChange={(e) => setFormData({ ...formData, voting_deadline_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-liberation-silver text-sm mb-2 font-medium">
                Voting Deadline Time *
              </label>
              <input
                type="time"
                required
                value={formData.voting_deadline_time}
                onChange={(e) => setFormData({ ...formData, voting_deadline_time: e.target.value })}
                className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-3 text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-liberation-gold-divine hover:bg-liberation-gold-divine/90 text-liberation-black-power font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {loading ? 'Submitting...' : 'Submit Proposal for Voting'}
            </button>
          </div>

          <div className="text-xs text-liberation-silver/70 space-y-1">
            <p>📋 All board members will be notified of your proposal</p>
            <p>🗳️ Voting will open immediately and close at the specified deadline</p>
            <p>✅ Proposals require a majority vote to pass</p>
          </div>
        </form>
      </div>
    </div>
  );
}
