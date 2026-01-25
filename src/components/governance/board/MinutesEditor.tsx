// BLKOUT Minutes Editor
// Record and approve meeting minutes

import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle, Edit, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Meeting {
  id: string;
  meeting_date: string;
  meeting_type: string;
  location: string;
  minutes_draft: string;
  minutes_approved: boolean;
  minutes_approved_at: string;
  attendees: any[];
  apologies: any[];
  agenda: any[];
}

export default function MinutesEditor() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [minutesDraft, setMinutesDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);

      const { data } = await supabase
        .from('board_meetings')
        .select('*')
        .eq('status', 'completed')
        .order('meeting_date', { ascending: false })
        .limit(20);

      setMeetings(data || []);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setMinutesDraft(meeting.minutes_draft || generateMinutesTemplate(meeting));
  };

  const generateMinutesTemplate = (meeting: Meeting) => {
    const date = new Date(meeting.meeting_date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `# BLKOUT Board Meeting Minutes
## ${meeting.meeting_type.toUpperCase().replace('_', ' ')}
**Date:** ${date}
**Location:** ${meeting.location}

### Attendees
${meeting.attendees?.map((a: any) => `- ${a.name}`).join('\n') || '- [List attendees]'}

### Apologies
${meeting.apologies?.map((a: any) => `- ${a.name}`).join('\n') || '- [List apologies]'}

### Agenda Items
${meeting.agenda?.map((item: any, index: number) => `
${index + 1}. **${item.title}**
   - Presenter: ${item.presenter || 'N/A'}
   - Discussion:
   - Decisions:
   - Actions:
`).join('\n') || ''}

### Summary of Decisions
- [Decision 1]
- [Decision 2]

### Action Items
- [ ] Action 1 - Assigned to: [Name] - Deadline: [Date]
- [ ] Action 2 - Assigned to: [Name] - Deadline: [Date]

### Next Meeting
**Date:** [Date]
**Time:** [Time]
**Location:** [Location]

---
*Minutes prepared by: [Name]*
*Date: ${new Date().toLocaleDateString('en-GB')}*
`;
  };

  const saveDraft = async () => {
    if (!selectedMeeting) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('board_meetings')
        .update({
          minutes_draft: minutesDraft,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedMeeting.id);

      if (error) throw error;

      alert('Draft saved successfully');
      loadMeetings();
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const approveMinutes = async () => {
    if (!selectedMeeting) return;

    const confirmed = window.confirm(
      'Are you sure you want to approve these minutes? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: member } = await supabase
        .from('board_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!member) throw new Error('Not a board member');

      const { error } = await supabase
        .from('board_meetings')
        .update({
          minutes_draft: minutesDraft,
          minutes_approved: true,
          minutes_approved_at: new Date().toISOString(),
          minutes_approved_by: member.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedMeeting.id);

      if (error) throw error;

      alert('Minutes approved successfully');
      loadMeetings();
      setSelectedMeeting(null);
    } catch (error) {
      console.error('Error approving minutes:', error);
      alert('Failed to approve minutes');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-liberation-black-power to-liberation-purple-spirit rounded-xl p-8 border border-liberation-gold-divine/30">
        <h1 className="text-3xl font-bold text-liberation-gold-divine mb-2 flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Meeting Minutes Editor
        </h1>
        <p className="text-liberation-silver">
          Record and approve official board meeting minutes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meetings List */}
        <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-liberation-gold-divine mb-4">Recent Meetings</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-liberation-silver">Loading...</div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-4 text-liberation-silver/70">
                No completed meetings
              </div>
            ) : (
              meetings.map((meeting) => (
                <button
                  key={meeting.id}
                  onClick={() => selectMeeting(meeting)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    selectedMeeting?.id === meeting.id
                      ? 'bg-liberation-gold-divine/20 border border-liberation-gold-divine/30'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm capitalize">
                      {meeting.meeting_type.replace('_', ' ')}
                    </span>
                    {meeting.minutes_approved ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Edit className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                  <p className="text-liberation-silver text-xs">{formatDate(meeting.meeting_date)}</p>
                  {meeting.minutes_approved && (
                    <span className="text-xs text-green-400 mt-1 block">Approved</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
          {!selectedMeeting ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <FileText className="h-16 w-16 text-liberation-gold-divine/30 mx-auto mb-4" />
                <p className="text-liberation-silver">Select a meeting to edit minutes</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white capitalize">
                    {selectedMeeting.meeting_type.replace('_', ' ')} Minutes
                  </h2>
                  <p className="text-liberation-silver text-sm">
                    {formatDate(selectedMeeting.meeting_date)}
                  </p>
                </div>
                {selectedMeeting.minutes_approved && (
                  <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-medium">Approved</span>
                  </div>
                )}
              </div>

              <textarea
                value={minutesDraft}
                onChange={(e) => setMinutesDraft(e.target.value)}
                disabled={selectedMeeting.minutes_approved}
                className="w-full h-[500px] bg-white/5 border border-liberation-gold-divine/30 rounded-lg p-4 text-white font-mono text-sm resize-none disabled:opacity-50"
                placeholder="Enter meeting minutes..."
              />

              {!selectedMeeting.minutes_approved && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={saveDraft}
                    disabled={saving}
                    className="flex-1 bg-liberation-purple-spirit/20 border border-liberation-purple-spirit/30 hover:bg-liberation-purple-spirit/30 text-liberation-purple-spirit font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button
                    onClick={approveMinutes}
                    disabled={saving}
                    className="flex-1 bg-liberation-gold-divine hover:bg-liberation-gold-divine/90 text-liberation-black-power font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="h-5 w-5" />
                    {saving ? 'Approving...' : 'Approve Minutes'}
                  </button>
                </div>
              )}

              <div className="mt-4 text-xs text-liberation-silver/70">
                <p>💡 Minutes can be edited in Markdown format</p>
                <p>📌 Once approved, minutes cannot be edited</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
