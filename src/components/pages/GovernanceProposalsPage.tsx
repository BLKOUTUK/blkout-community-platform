import React, { useState, useEffect } from 'react';
import { Vote, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer_id: string;
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'expired';
  category: string;
  voting_deadline: string;
  created_at: string;
  votes_for?: number;
  votes_against?: number;
  votes_abstain?: number;
}

export default function GovernanceProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'platform',
    voting_duration_days: 7
  });

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    // Mock data for now - will connect to Supabase
    setProposals([
      {
        id: '1',
        title: 'Add Mental Health Resources Section',
        description: 'Proposal to create dedicated mental health resources for Black queer community members',
        proposer_id: 'member-1',
        status: 'active',
        category: 'platform',
        voting_deadline: '2026-01-15',
        created_at: '2026-01-01',
        votes_for: 8,
        votes_against: 1,
        votes_abstain: 2
      }
    ]);
    setLoading(false);
  };

  const createProposal = async () => {
    console.log('Creating proposal:', newProposal);
    // Will integrate with Supabase governance_proposals table
    setShowCreateForm(false);
    loadProposals();
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

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals.map(proposal => {
            const totalVotes = (proposal.votes_for || 0) + (proposal.votes_against || 0) + (proposal.votes_abstain || 0);
            const forPercent = totalVotes > 0 ? ((proposal.votes_for || 0) / totalVotes * 100).toFixed(0) : 0;

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
                      <span className="text-green-400 font-semibold">{forPercent}% in favor</span>
                    </div>

                    {/* Vote Bars */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-green-500 h-full transition-all"
                            style={{width: `${(proposal.votes_for || 0) / totalVotes * 100}%`}}
                          />
                        </div>
                        <span className="text-green-400 text-sm font-semibold w-12 text-right">{proposal.votes_for}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-red-500 h-full transition-all"
                            style={{width: `${(proposal.votes_against || 0) / totalVotes * 100}%`}}
                          />
                        </div>
                        <span className="text-red-400 text-sm font-semibold w-12 text-right">{proposal.votes_against}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gray-500 h-full transition-all"
                            style={{width: `${(proposal.votes_abstain || 0) / totalVotes * 100}%`}}
                          />
                        </div>
                        <span className="text-gray-400 text-sm font-semibold w-12 text-right">{proposal.votes_abstain}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vote Buttons */}
                {proposal.status === 'active' && (
                  <div className="flex gap-3">
                    <button className="flex-1 bg-green-500/20 border border-green-500 text-green-400 py-2 rounded-lg font-semibold hover:bg-green-500/30">
                      Vote For
                    </button>
                    <button className="flex-1 bg-red-500/20 border border-red-500 text-red-400 py-2 rounded-lg font-semibold hover:bg-red-500/30">
                      Vote Against
                    </button>
                    <button className="flex-1 bg-gray-500/20 border border-gray-500 text-gray-400 py-2 rounded-lg font-semibold hover:bg-gray-500/30">
                      Abstain
                    </button>
                  </div>
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
