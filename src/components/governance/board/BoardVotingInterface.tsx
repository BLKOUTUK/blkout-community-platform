// BLKOUT Board Voting Interface
// Secure voting on board proposals

import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Minus, Vote, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Decision {
  id: string;
  proposal_title: string;
  proposal_content: string;
  resolution_number: string;
  voting_deadline: string;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  decision_outcome: string;
  proposed_by: string;
  proposer_name?: string;
}

interface MyVote {
  vote: string;
  rationale: string;
}

export default function BoardVotingInterface() {
  const [activeProposals, setActiveProposals] = useState<Decision[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, MyVote>>({});
  const [loading, setLoading] = useState(true);
  const [currentMemberId, setCurrentMemberId] = useState<string>('');

  useEffect(() => {
    loadVotingData();
  }, []);

  const loadVotingData = async () => {
    try {
      setLoading(true);

      // Get current user's board member ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberData } = await supabase
        .from('board_members')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!memberData) return;
      setCurrentMemberId(memberData.id);

      // Load active proposals
      const { data: proposals } = await supabase
        .from('board_decisions')
        .select(`
          *,
          board_members!board_decisions_proposed_by_fkey(full_name)
        `)
        .eq('decision_outcome', 'pending')
        .gte('voting_deadline', new Date().toISOString())
        .order('voting_deadline', { ascending: true });

      const proposalsWithNames = proposals?.map(p => ({
        ...p,
        proposer_name: p.board_members?.full_name
      })) || [];

      setActiveProposals(proposalsWithNames);

      // Load my existing votes
      const { data: votes } = await supabase
        .from('board_votes')
        .select('decision_id, vote, rationale')
        .eq('board_member_id', memberData.id);

      const votesMap: Record<string, MyVote> = {};
      votes?.forEach(v => {
        votesMap[v.decision_id] = {
          vote: v.vote,
          rationale: v.rationale || ''
        };
      });
      setMyVotes(votesMap);

    } catch (error) {
      console.error('Error loading voting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (decisionId: string, vote: 'for' | 'against' | 'abstain', rationale: string) => {
    try {
      // Insert or update vote
      const { error } = await supabase
        .from('board_votes')
        .upsert({
          decision_id: decisionId,
          board_member_id: currentMemberId,
          vote,
          rationale
        });

      if (error) throw error;

      // Update vote counts
      await updateVoteCounts(decisionId);

      // Update local state
      setMyVotes({
        ...myVotes,
        [decisionId]: { vote, rationale }
      });

      alert('Vote cast successfully!');
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Failed to cast vote');
    }
  };

  const updateVoteCounts = async (decisionId: string) => {
    // Count votes
    const { data: votes } = await supabase
      .from('board_votes')
      .select('vote')
      .eq('decision_id', decisionId);

    const counts = {
      for: votes?.filter(v => v.vote === 'for').length || 0,
      against: votes?.filter(v => v.vote === 'against').length || 0,
      abstain: votes?.filter(v => v.vote === 'abstain').length || 0
    };

    // Update decision
    await supabase
      .from('board_decisions')
      .update({
        votes_for: counts.for,
        votes_against: counts.against,
        votes_abstain: counts.abstain
      })
      .eq('id', decisionId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days remaining`;
    if (hours > 0) return `${hours} hours remaining`;
    return 'Closing soon';
  };

  const VoteButton = ({
    proposal,
    voteType,
    icon: Icon,
    label,
    color
  }: {
    proposal: Decision;
    voteType: 'for' | 'against' | 'abstain';
    icon: any;
    label: string;
    color: string;
  }) => {
    const [rationale, setRationale] = useState('');
    const [showRationale, setShowRationale] = useState(false);
    const hasVoted = myVotes[proposal.id]?.vote === voteType;

    return (
      <div className="flex-1">
        <button
          onClick={() => setShowRationale(!showRationale)}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            hasVoted
              ? `${color} ring-2 ring-white`
              : `bg-white/10 hover:bg-white/20 text-white border border-white/20`
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
        {showRationale && (
          <div className="mt-2">
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Optional: Add your rationale..."
              className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-3 py-2 text-white text-sm"
              rows={2}
            />
            <button
              onClick={() => {
                castVote(proposal.id, voteType, rationale);
                setShowRationale(false);
                setRationale('');
              }}
              className="mt-2 w-full bg-liberation-gold-divine hover:bg-liberation-gold-divine/90 text-liberation-black-power font-bold py-2 rounded-lg transition-colors text-sm"
            >
              Confirm Vote
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-liberation-gold-divine">Loading proposals...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-liberation-black-power to-liberation-purple-spirit rounded-xl p-8 border border-liberation-gold-divine/30">
        <h1 className="text-3xl font-bold text-liberation-gold-divine mb-2 flex items-center gap-2">
          <Vote className="h-8 w-8" />
          Board Voting
        </h1>
        <p className="text-liberation-silver">
          Cast your vote on active proposals. All votes are recorded securely.
        </p>
      </div>

      {activeProposals.length === 0 ? (
        <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Active Proposals</h3>
          <p className="text-liberation-silver">
            There are no proposals open for voting at this time.
          </p>
        </div>
      ) : (
        activeProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {proposal.resolution_number && (
                    <span className="bg-liberation-gold-divine/20 text-liberation-gold-divine px-3 py-1 rounded-full text-xs font-bold">
                      {proposal.resolution_number}
                    </span>
                  )}
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs border border-blue-500/30 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getTimeRemaining(proposal.voting_deadline)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {proposal.proposal_title}
                </h3>
                <p className="text-liberation-silver text-sm mb-4">
                  Proposed by {proposal.proposer_name} • Voting closes {formatDate(proposal.voting_deadline)}
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
              <p className="text-white whitespace-pre-wrap">{proposal.proposal_content}</p>
            </div>

            {/* Current Vote Counts */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{proposal.votes_for}</div>
                <div className="text-green-400 text-sm">For</div>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{proposal.votes_against}</div>
                <div className="text-red-400 text-sm">Against</div>
              </div>
              <div className="bg-gray-500/20 border border-gray-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-gray-400">{proposal.votes_abstain}</div>
                <div className="text-gray-400 text-sm">Abstain</div>
              </div>
            </div>

            {/* Voting Buttons */}
            {myVotes[proposal.id] ? (
              <div className="bg-liberation-gold-divine/20 border border-liberation-gold-divine/30 rounded-lg p-4 text-center">
                <CheckCircle className="h-6 w-6 text-liberation-gold-divine mx-auto mb-2" />
                <p className="text-liberation-gold-divine font-bold">
                  You voted: {myVotes[proposal.id].vote.toUpperCase()}
                </p>
                {myVotes[proposal.id].rationale && (
                  <p className="text-liberation-silver text-sm mt-2">
                    Rationale: {myVotes[proposal.id].rationale}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <VoteButton
                  proposal={proposal}
                  voteType="for"
                  icon={ThumbsUp}
                  label="Vote For"
                  color="bg-green-500 text-white"
                />
                <VoteButton
                  proposal={proposal}
                  voteType="against"
                  icon={ThumbsDown}
                  label="Vote Against"
                  color="bg-red-500 text-white"
                />
                <VoteButton
                  proposal={proposal}
                  voteType="abstain"
                  icon={Minus}
                  label="Abstain"
                  color="bg-gray-500 text-white"
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
