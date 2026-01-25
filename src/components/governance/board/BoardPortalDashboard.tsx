// BLKOUT Board Portal Dashboard
// Inspired by Zeck.app and UK charity governance best practices
// Main dashboard for board members

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckSquare,
  FileText,
  Users,
  AlertCircle,
  TrendingUp,
  Clock,
  Vote,
  Shield
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BoardMember {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

interface Meeting {
  id: string;
  meeting_date: string;
  meeting_type: string;
  status: string;
  location: string;
}

interface Action {
  id: string;
  action_description: string;
  deadline: string;
  status: string;
  priority: string;
}

interface Decision {
  id: string;
  proposal_title: string;
  decision_outcome: string;
  created_at: string;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
}

interface DashboardStats {
  upcomingMeetings: number;
  pendingActions: number;
  activeProposals: number;
  totalMembers: number;
}

export default function BoardPortalDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    upcomingMeetings: 0,
    pendingActions: 0,
    activeProposals: 0,
    totalMembers: 0
  });
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [myActions, setMyActions] = useState<Action[]>([]);
  const [recentDecisions, setRecentDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMember, setCurrentMember] = useState<BoardMember | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get current user's board member record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberData } = await supabase
        .from('board_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      setCurrentMember(memberData);

      // Load stats
      const [meetingsCount, actionsCount, proposalsCount, membersCount] = await Promise.all([
        supabase.from('board_meetings')
          .select('id', { count: 'exact', head: true })
          .gte('meeting_date', new Date().toISOString())
          .eq('status', 'scheduled'),

        supabase.from('board_actions')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_to', memberData?.id)
          .in('status', ['pending', 'in_progress']),

        supabase.from('board_decisions')
          .select('id', { count: 'exact', head: true })
          .eq('decision_outcome', 'pending'),

        supabase.from('board_members')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true)
      ]);

      setStats({
        upcomingMeetings: meetingsCount.count || 0,
        pendingActions: actionsCount.count || 0,
        activeProposals: proposalsCount.count || 0,
        totalMembers: membersCount.count || 0
      });

      // Load upcoming meetings
      const { data: meetings } = await supabase
        .from('board_meetings')
        .select('*')
        .gte('meeting_date', new Date().toISOString())
        .eq('status', 'scheduled')
        .order('meeting_date', { ascending: true })
        .limit(5);

      setUpcomingMeetings(meetings || []);

      // Load my actions
      if (memberData) {
        const { data: actions } = await supabase
          .from('board_actions')
          .select('*')
          .eq('assigned_to', memberData.id)
          .in('status', ['pending', 'in_progress'])
          .order('deadline', { ascending: true })
          .limit(5);

        setMyActions(actions || []);
      }

      // Load recent decisions
      const { data: decisions } = await supabase
        .from('board_decisions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentDecisions(decisions || []);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-liberation-gold-divine">Loading board portal...</div>
      </div>
    );
  }

  if (!currentMember) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Access Restricted</h2>
          <p className="text-gray-300">
            You must be an active board member to access this portal.
            Please contact the board secretary for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-liberation-black-power to-liberation-purple-spirit rounded-xl p-8 border border-liberation-gold-divine/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-liberation-gold-divine mb-2">
              Board Portal
            </h1>
            <p className="text-liberation-silver text-lg">
              Welcome back, {currentMember.full_name}
            </p>
            <p className="text-liberation-gold-divine/70 text-sm mt-1">
              {currentMember.role.replace('_', ' ').toUpperCase()}
            </p>
          </div>
          <Shield className="h-16 w-16 text-liberation-gold-divine/30" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 text-blue-400" />
            <span className="text-3xl font-bold text-white">{stats.upcomingMeetings}</span>
          </div>
          <p className="text-liberation-silver text-sm">Upcoming Meetings</p>
        </div>

        <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckSquare className="h-8 w-8 text-orange-400" />
            <span className="text-3xl font-bold text-white">{stats.pendingActions}</span>
          </div>
          <p className="text-liberation-silver text-sm">My Pending Actions</p>
        </div>

        <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Vote className="h-8 w-8 text-green-400" />
            <span className="text-3xl font-bold text-white">{stats.activeProposals}</span>
          </div>
          <p className="text-liberation-silver text-sm">Active Proposals</p>
        </div>

        <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-purple-400" />
            <span className="text-3xl font-bold text-white">{stats.totalMembers}</span>
          </div>
          <p className="text-liberation-silver text-sm">Board Members</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Meetings */}
        <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-liberation-gold-divine flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Meetings
            </h2>
          </div>
          <div className="space-y-3">
            {upcomingMeetings.length === 0 ? (
              <p className="text-liberation-silver/70 text-sm text-center py-4">
                No upcoming meetings scheduled
              </p>
            ) : (
              upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors border border-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white capitalize">
                          {meeting.meeting_type.replace('_', ' ')}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </div>
                      <p className="text-liberation-silver text-sm mb-2">{meeting.location}</p>
                      <div className="flex items-center gap-3 text-xs text-liberation-silver/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(meeting.meeting_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(meeting.meeting_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Actions */}
        <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-liberation-gold-divine flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              My Actions
            </h2>
          </div>
          <div className="space-y-3">
            {myActions.length === 0 ? (
              <p className="text-liberation-silver/70 text-sm text-center py-4">
                No pending actions
              </p>
            ) : (
              myActions.map((action) => (
                <div
                  key={action.id}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white text-sm flex-1">{action.action_description}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ml-2 ${getPriorityColor(action.priority)}`}>
                      {action.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-liberation-silver/70">
                    <span className={`px-2 py-0.5 rounded-full border ${getStatusColor(action.status)}`}>
                      {action.status.replace('_', ' ')}
                    </span>
                    {action.deadline && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due: {formatDate(action.deadline)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Decisions */}
      <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-liberation-gold-divine flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Recent Decisions
          </h2>
        </div>
        <div className="space-y-3">
          {recentDecisions.length === 0 ? (
            <p className="text-liberation-silver/70 text-sm text-center py-4">
              No recent decisions
            </p>
          ) : (
            recentDecisions.map((decision) => (
              <div
                key={decision.id}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-white font-medium flex-1">{decision.proposal_title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ml-2 ${getStatusColor(decision.decision_outcome)}`}>
                    {decision.decision_outcome}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-liberation-silver/70">
                  <span className="text-green-400">For: {decision.votes_for}</span>
                  <span className="text-red-400">Against: {decision.votes_against}</span>
                  <span className="text-gray-400">Abstain: {decision.votes_abstain}</span>
                  <span className="ml-auto">{formatDate(decision.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-liberation-purple-spirit/20 border border-liberation-purple-spirit/30 rounded-xl p-4 hover:bg-liberation-purple-spirit/30 transition-colors">
          <Calendar className="h-8 w-8 text-liberation-purple-spirit mx-auto mb-2" />
          <span className="text-white text-sm font-medium block">Schedule Meeting</span>
        </button>
        <button className="bg-liberation-gold-divine/20 border border-liberation-gold-divine/30 rounded-xl p-4 hover:bg-liberation-gold-divine/30 transition-colors">
          <Vote className="h-8 w-8 text-liberation-gold-divine mx-auto mb-2" />
          <span className="text-white text-sm font-medium block">New Proposal</span>
        </button>
        <button className="bg-liberation-red-liberation/20 border border-liberation-red-liberation/30 rounded-xl p-4 hover:bg-liberation-red-liberation/30 transition-colors">
          <FileText className="h-8 w-8 text-liberation-red-liberation mx-auto mb-2" />
          <span className="text-white text-sm font-medium block">View Documents</span>
        </button>
        <button className="bg-liberation-green-africa/20 border border-liberation-green-africa/30 rounded-xl p-4 hover:bg-liberation-green-africa/30 transition-colors">
          <Users className="h-8 w-8 text-liberation-green-africa mx-auto mb-2" />
          <span className="text-white text-sm font-medium block">Board Directory</span>
        </button>
      </div>
    </div>
  );
}
