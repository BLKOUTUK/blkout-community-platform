// BLKOUT Decision Register
// Complete register of all board decisions

import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Decision {
  id: string;
  resolution_number: string;
  proposal_title: string;
  proposal_content: string;
  decision_outcome: string;
  decision_date: string;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  proposed_by: string;
  proposer_name?: string;
  implementation_status: string;
  financial_impact?: number;
  impact_areas?: string[];
  created_at: string;
}

export default function DecisionRegister() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDecisions();
  }, []);

  useEffect(() => {
    filterDecisions();
  }, [searchTerm, outcomeFilter, decisions]);

  const loadDecisions = async () => {
    try {
      setLoading(true);

      const { data } = await supabase
        .from('board_decisions')
        .select(`
          *,
          board_members!board_decisions_proposed_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      const decisionsWithNames = data?.map(d => ({
        ...d,
        proposer_name: d.board_members?.full_name
      })) || [];

      setDecisions(decisionsWithNames);
    } catch (error) {
      console.error('Error loading decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDecisions = () => {
    let filtered = [...decisions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.proposal_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.resolution_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.proposal_content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Outcome filter
    if (outcomeFilter !== 'all') {
      filtered = filtered.filter(d => d.decision_outcome === outcomeFilter);
    }

    setFilteredDecisions(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    const colors = {
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      deferred: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      withdrawn: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[outcome as keyof typeof colors] || colors.pending;
  };

  const exportToCSV = () => {
    const headers = ['Resolution Number', 'Title', 'Outcome', 'Date', 'For', 'Against', 'Abstain', 'Proposed By'];
    const rows = filteredDecisions.map(d => [
      d.resolution_number || '',
      d.proposal_title,
      d.decision_outcome,
      d.decision_date ? formatDate(d.decision_date) : '',
      d.votes_for,
      d.votes_against,
      d.votes_abstain,
      d.proposer_name || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `board-decisions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-liberation-black-power to-liberation-pride-purple-deep rounded-xl p-8 border border-liberation-gold-divine/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-liberation-gold-divine mb-2 flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Decision Register
            </h1>
            <p className="text-liberation-silver">
              Complete record of all board decisions and resolutions
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="bg-liberation-gold-divine hover:bg-liberation-gold-divine/90 text-liberation-black-power px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-liberation-silver/50" />
            <input
              type="text"
              placeholder="Search decisions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-liberation-gold-divine/30 rounded-lg text-white placeholder-liberation-silver/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-liberation-gold-divine" />
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/5 border border-liberation-gold-divine/30 rounded-lg text-white"
            >
              <option value="all">All Outcomes</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
              <option value="deferred">Deferred</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-liberation-silver">
          Showing {filteredDecisions.length} of {decisions.length} decisions
        </div>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-liberation-silver">
            Loading decisions...
          </div>
        ) : filteredDecisions.length === 0 ? (
          <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-12 text-center">
            <FileText className="h-16 w-16 text-liberation-gold-divine/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Decisions Found</h3>
            <p className="text-liberation-silver">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredDecisions.map((decision) => (
            <div
              key={decision.id}
              className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6 hover:border-liberation-gold-divine/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {decision.resolution_number && (
                      <span className="bg-liberation-gold-divine/20 text-liberation-gold-divine px-3 py-1 rounded-full text-xs font-bold">
                        {decision.resolution_number}
                      </span>
                    )}
                    <span className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 ${getOutcomeColor(decision.decision_outcome)}`}>
                      {getOutcomeIcon(decision.decision_outcome)}
                      {decision.decision_outcome}
                    </span>
                    {decision.implementation_status && decision.implementation_status !== 'pending' && (
                      <span className="text-xs px-3 py-1 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {decision.implementation_status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {decision.proposal_title}
                  </h3>
                  <p className="text-liberation-silver text-sm mb-3">
                    {decision.proposal_content.substring(0, 200)}
                    {decision.proposal_content.length > 200 && '...'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-liberation-silver/70">
                    <span>
                      Proposed by <span className="text-liberation-gold-divine">{decision.proposer_name}</span>
                    </span>
                    {decision.decision_date && (
                      <span>Decided: {formatDate(decision.decision_date)}</span>
                    )}
                    {decision.financial_impact && (
                      <span className="text-green-400">
                        £{decision.financial_impact.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Vote Breakdown */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="bg-green-500/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{decision.votes_for}</div>
                  <div className="text-green-400 text-xs">For</div>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-400">{decision.votes_against}</div>
                  <div className="text-red-400 text-xs">Against</div>
                </div>
                <div className="bg-gray-500/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-400">{decision.votes_abstain}</div>
                  <div className="text-gray-400 text-xs">Abstain</div>
                </div>
              </div>

              {/* Impact Areas */}
              {decision.impact_areas && decision.impact_areas.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {decision.impact_areas.map((area, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-liberation-pride-purple-deep/20 text-liberation-pride-purple-deep rounded-full border border-liberation-pride-purple-deep/30"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
