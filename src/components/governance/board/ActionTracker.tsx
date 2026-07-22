// BLKOUT Action Tracker
// Track and manage board action items

import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, AlertCircle, CheckCircle, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Action {
  id: string;
  action_description: string;
  assigned_to: string;
  assigned_member_name?: string;
  deadline: string;
  priority: string;
  status: string;
  meeting_id?: string;
  meeting_date?: string;
  notes?: string;
  created_at: string;
}

export default function ActionTracker() {
  const [actions, setActions] = useState<Action[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, [filter]);

  const loadActions = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('board_actions')
        .select(`
          *,
          board_members!board_actions_assigned_to_fkey(full_name),
          board_meetings(meeting_date)
        `)
        .order('deadline', { ascending: true, nullsFirst: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data } = await query;

      const actionsWithNames = data?.map(a => ({
        ...a,
        assigned_member_name: a.board_members?.full_name,
        meeting_date: a.board_meetings?.meeting_date
      })) || [];

      setActions(actionsWithNames);
    } catch (error) {
      console.error('Error loading actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateActionStatus = async (actionId: string, newStatus: string) => {
    try {
      const updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('board_actions')
        .update(updates)
        .eq('id', actionId);

      if (error) throw error;

      loadActions();
    } catch (error) {
      console.error('Error updating action:', error);
      alert('Failed to update action');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (deadline: string, status: string) => {
    return status !== 'completed' && new Date(deadline) < new Date();
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
      carried_forward: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-liberation-black-power to-liberation-pride-purple-deep rounded-xl p-8 border border-liberation-gold-divine/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-liberation-gold-divine mb-2 flex items-center gap-2">
              <CheckSquare className="h-8 w-8" />
              Action Tracker
            </h1>
            <p className="text-liberation-silver">
              Monitor and manage board action items
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-5 w-5 text-liberation-gold-divine" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-liberation-gold-divine text-liberation-black-power'
                : 'bg-white/5 text-liberation-silver hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-liberation-gold-divine text-liberation-black-power'
                : 'bg-white/5 text-liberation-silver hover:bg-white/10'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'in_progress'
                ? 'bg-liberation-gold-divine text-liberation-black-power'
                : 'bg-white/5 text-liberation-silver hover:bg-white/10'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-liberation-gold-divine text-liberation-black-power'
                : 'bg-white/5 text-liberation-silver hover:bg-white/10'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-liberation-silver">
            Loading actions...
          </div>
        ) : actions.length === 0 ? (
          <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Actions</h3>
            <p className="text-liberation-silver">
              {filter === 'all' ? 'No actions found' : `No ${filter.replace('_', ' ')} actions`}
            </p>
          </div>
        ) : (
          actions.map((action) => (
            <div
              key={action.id}
              className={`bg-liberation-black-power/50 border rounded-xl p-6 ${
                isOverdue(action.deadline, action.status)
                  ? 'border-red-500/50 bg-red-500/5'
                  : 'border-liberation-gold-divine/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs px-3 py-1 rounded-full border ${getPriorityColor(action.priority)}`}>
                      {action.priority}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(action.status)}`}>
                      {action.status.replace('_', ' ')}
                    </span>
                    {isOverdue(action.deadline, action.status) && (
                      <span className="text-xs px-3 py-1 rounded-full border bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className="text-white text-lg font-medium mb-2">
                    {action.action_description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-liberation-silver/70">
                    <span>
                      Assigned to: <span className="text-liberation-gold-divine">{action.assigned_member_name}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {formatDate(action.deadline)}
                    </span>
                    {action.meeting_date && (
                      <span>From meeting: {formatDate(action.meeting_date)}</span>
                    )}
                  </div>
                  {action.notes && (
                    <p className="text-liberation-silver text-sm mt-3 bg-white/5 rounded p-3">
                      {action.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Update Buttons */}
              {action.status !== 'completed' && (
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  {action.status === 'pending' && (
                    <button
                      onClick={() => updateActionStatus(action.id, 'in_progress')}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
                    >
                      Start Working
                    </button>
                  )}
                  <button
                    onClick={() => updateActionStatus(action.id, 'completed')}
                    className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete
                  </button>
                  <button
                    onClick={() => updateActionStatus(action.id, 'carried_forward')}
                    className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors text-sm font-medium"
                  >
                    Carry Forward
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
