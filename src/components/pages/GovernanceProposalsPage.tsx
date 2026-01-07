import React, { useState, useEffect } from 'react';
import { Vote, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer_id: string;
  status: 'draft' | 'active' | 'closed';
  category: string;
  voting_deadline: string;
  created_at: string;
  support_votes: number;
  oppose_votes: number;
  abstain_votes: number;
  total_votes: number;
  support_percentage: number;
}

export default function GovernanceProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'platform',
    voting_duration_days: 7
  });

  useEffect(() => {
    loadProposals();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      // Load member data
      const { data: memberData } = await supabase
        .from('governance_members')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setMember(memberData);
    }
  };

  const loadProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('governance_proposals')
        .select('*')
        .in('status', ['active', 'closed'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async () => {
    if (!member || !member.can_propose) {
      alert('You need proposer permissions to create proposals');
      return;
    }

    try {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + newProposal.voting_duration_days);

      const { error } = await supabase
        .from('governance_proposals')
        .insert({
          title: newProposal.title,
          description: newProposal.description,
          category: newProposal.category,
          proposer_id: member.id,
          status: 'active',
          voting_deadline: deadline.toISOString()
        });

      if (error) throw error;

      setShowCreateForm(false);
      setNewProposal({ title: '', description: '', category: 'platform', voting_duration_days: 7 });
      loadProposals();
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to create proposal');
    }
  };

  const castVote = async (proposalId: string, voteChoice: 'support' | 'oppose' | 'abstain') => {
    if (!member || !member.can_vote) {
      alert('You need voting permissions');
      return;
    }

    try {
      const { error } = await supabase
        .from('governance_votes')
        .insert({
          proposal_id: proposalId,
          voter_id: member.id,
          vote_choice: voteChoice
        });

      if (error) {
        if (error.code === '23505') {
          alert('You have already voted on this proposal');
        } else {
          throw error;
        }
        return;
      }

      // Reload proposals to show updated counts
      loadProposals();
      alert('Vote recorded successfully!');
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Failed to cast vote');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-yellow-500">Democratic Governance</h1>
          <p className="text-gray-400">One member, one vote. Shape our platform together.</p>
        </div>

        {/* Create Proposal Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="mb-8 bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 flex items-center gap-2"
        >
          <Vote className="w-5 h-5" />
          Create New Proposal
        </button>

        {/* Auth Status */}
        {!user && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-500">Sign in to vote on proposals and participate in community governance.</p>
          </div>
        )}

        {/* Proposals List */}
        <div className="space-y-6">
          {loading && <div className="text-gray-400">Loading proposals...</div>}
          {!loading && proposals.length === 0 && <div className="text-gray-400">No active proposals</div>}
          {proposals.map(proposal => {
            const totalVotes = proposal.total_votes || 0;
            const forPercent = proposal.support_percentage || 0;

            return (
              <div key={proposal.id} className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    proposal.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    proposal.status === 'passed' ? 'bg-blue-500/20 text-blue-400' :
                    proposal.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {proposal.status.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Ends: {new Date(proposal.voting_deadline).toLocaleDateString()}
                  </span>
                </div>

                {/* Title & Category */}
                <h3 className="text-2xl font-bold mb-2 text-white">{proposal.title}</h3>
                <div className="text-yellow-500 text-sm mb-4">{proposal.category}</div>

                {/* Description */}
                <p className="text-gray-300 mb-6">{proposal.description}</p>

                {/* Voting Results */}
                {totalVotes > 0 && (
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Participation: {totalVotes} votes</span>
                      <span className="text-green-400 font-semibold">{forPercent.toFixed(0)}% in favor</span>
                    </div>

                    {/* Vote Bars */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-green-500 h-full transition-all"
                            style={{width: `${totalVotes > 0 ? (proposal.support_votes / totalVotes * 100) : 0}%`}}
                          />
                        </div>
                        <span className="text-green-400 text-sm font-semibold w-12 text-right">{proposal.support_votes}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-red-500 h-full transition-all"
                            style={{width: `${totalVotes > 0 ? (proposal.oppose_votes / totalVotes * 100) : 0}%`}}
                          />
                        </div>
                        <span className="text-red-400 text-sm font-semibold w-12 text-right">{proposal.oppose_votes}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gray-500 h-full transition-all"
                            style={{width: `${totalVotes > 0 ? (proposal.abstain_votes / totalVotes * 100) : 0}%`}}
                          />
                        </div>
                        <span className="text-gray-400 text-sm font-semibold w-12 text-right">{proposal.abstain_votes}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vote Buttons */}
                {proposal.status === 'active' && member && member.can_vote && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => castVote(proposal.id, 'support')}
                      className="flex-1 bg-green-500/20 border border-green-500 text-green-400 py-2 rounded-lg font-semibold hover:bg-green-500/30 transition-colors"
                    >
                      Vote For
                    </button>
                    <button
                      onClick={() => castVote(proposal.id, 'oppose')}
                      className="flex-1 bg-red-500/20 border border-red-500 text-red-400 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
                    >
                      Vote Against
                    </button>
                    <button
                      onClick={() => castVote(proposal.id, 'abstain')}
                      className="flex-1 bg-gray-500/20 border border-gray-500 text-gray-400 py-2 rounded-lg font-semibold hover:bg-gray-500/30 transition-colors"
                    >
                      Abstain
                    </button>
                  </div>
                )}
                {proposal.status === 'active' && (!member || !member.can_vote) && (
                  <div className="text-gray-500 text-sm italic">Sign in as active member to vote</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Create Proposal Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg max-w-2xl w-full p-8 border border-yellow-500/30">
              <h2 className="text-3xl font-bold mb-6 text-yellow-500">Create Proposal</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">Title</label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                    placeholder="What are you proposing?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">Description</label>
                  <textarea
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white h-32"
                    placeholder="Explain your proposal in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">Category</label>
                  <select
                    value={newProposal.category}
                    onChange={(e) => setNewProposal({...newProposal, category: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                  >
                    <option value="platform">Platform Features</option>
                    <option value="policy">Community Policy</option>
                    <option value="financial">Financial Decisions</option>
                    <option value="partnership">Partnerships</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={createProposal}
                  className="flex-1 bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400"
                >
                  Submit Proposal
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
