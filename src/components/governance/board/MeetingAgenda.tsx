// BLKOUT Meeting Agenda Builder
// Build and manage meeting agendas

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Save, FileDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Meeting {
  id: string;
  meeting_date: string;
  meeting_type: string;
  location: string;
  agenda: AgendaItem[];
  status: string;
}

interface AgendaItem {
  id: string;
  title: string;
  duration: number;
  presenter: string;
  description?: string;
  documents?: string[];
}

export default function MeetingAgenda() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
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
        .in('status', ['scheduled', 'in_progress'])
        .order('meeting_date', { ascending: true });

      setMeetings(data || []);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setAgenda(meeting.agenda || []);
  };

  const addAgendaItem = () => {
    const newItem: AgendaItem = {
      id: Date.now().toString(),
      title: '',
      duration: 15,
      presenter: '',
      description: ''
    };
    setAgenda([...agenda, newItem]);
  };

  const updateAgendaItem = (id: string, field: keyof AgendaItem, value: any) => {
    setAgenda(agenda.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeAgendaItem = (id: string) => {
    setAgenda(agenda.filter(item => item.id !== id));
  };

  const moveItemUp = (index: number) => {
    if (index === 0) return;
    const newAgenda = [...agenda];
    [newAgenda[index - 1], newAgenda[index]] = [newAgenda[index], newAgenda[index - 1]];
    setAgenda(newAgenda);
  };

  const moveItemDown = (index: number) => {
    if (index === agenda.length - 1) return;
    const newAgenda = [...agenda];
    [newAgenda[index], newAgenda[index + 1]] = [newAgenda[index + 1], newAgenda[index]];
    setAgenda(newAgenda);
  };

  const saveAgenda = async () => {
    if (!selectedMeeting) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('board_meetings')
        .update({
          agenda,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedMeeting.id);

      if (error) throw error;

      alert('Agenda saved successfully');
      loadMeetings();
    } catch (error) {
      console.error('Error saving agenda:', error);
      alert('Failed to save agenda');
    } finally {
      setSaving(false);
    }
  };

  const exportAgenda = () => {
    if (!selectedMeeting) return;

    const totalDuration = agenda.reduce((sum, item) => sum + (item.duration || 0), 0);
    const meetingDate = new Date(selectedMeeting.meeting_date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let agendaText = `BLKOUT BOARD MEETING AGENDA\n`;
    agendaText += `${selectedMeeting.meeting_type.toUpperCase().replace('_', ' ')}\n\n`;
    agendaText += `Date: ${meetingDate}\n`;
    agendaText += `Location: ${selectedMeeting.location}\n`;
    agendaText += `Total Duration: ${totalDuration} minutes\n\n`;
    agendaText += `AGENDA ITEMS:\n\n`;

    agenda.forEach((item, index) => {
      agendaText += `${index + 1}. ${item.title}\n`;
      agendaText += `   Duration: ${item.duration} minutes\n`;
      agendaText += `   Presenter: ${item.presenter || 'TBD'}\n`;
      if (item.description) {
        agendaText += `   Description: ${item.description}\n`;
      }
      agendaText += `\n`;
    });

    const blob = new Blob([agendaText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `board-meeting-agenda-${selectedMeeting.meeting_date}.txt`;
    a.click();
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

  const totalDuration = agenda.reduce((sum, item) => sum + (item.duration || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-liberation-black-power to-liberation-pride-purple-deep rounded-xl p-8 border border-liberation-gold-divine/30">
        <h1 className="text-3xl font-bold text-liberation-gold-divine mb-2 flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Meeting Agenda Builder
        </h1>
        <p className="text-liberation-silver">
          Build and manage meeting agendas for board meetings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meetings List */}
        <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-liberation-gold-divine mb-4">Upcoming Meetings</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-liberation-silver">Loading...</div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-4 text-liberation-silver/70">
                No scheduled meetings
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
                  <span className="text-white font-medium text-sm capitalize block mb-1">
                    {meeting.meeting_type.replace('_', ' ')}
                  </span>
                  <p className="text-liberation-silver text-xs mb-1">{formatDate(meeting.meeting_date)}</p>
                  <p className="text-liberation-silver/70 text-xs">
                    {meeting.agenda?.length || 0} agenda items
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Agenda Editor */}
        <div className="lg:col-span-2 bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
          {!selectedMeeting ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-liberation-gold-divine/30 mx-auto mb-4" />
                <p className="text-liberation-silver">Select a meeting to build agenda</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white capitalize">
                    {selectedMeeting.meeting_type.replace('_', ' ')}
                  </h2>
                  <p className="text-liberation-silver text-sm">
                    {formatDate(selectedMeeting.meeting_date)}
                  </p>
                  <p className="text-liberation-gold-divine text-sm mt-1">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Total Duration: {totalDuration} minutes
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={exportAgenda}
                    className="bg-liberation-pride-purple-deep/20 border border-liberation-pride-purple-deep/30 hover:bg-liberation-pride-purple-deep/30 text-liberation-pride-purple-deep px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Export
                  </button>
                  <button
                    onClick={addAgendaItem}
                    className="bg-liberation-gold-divine/20 border border-liberation-gold-divine/30 hover:bg-liberation-gold-divine/30 text-liberation-gold-divine px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto">
                {agenda.length === 0 ? (
                  <div className="text-center py-12 text-liberation-silver/70">
                    No agenda items. Click "Add Item" to start building the agenda.
                  </div>
                ) : (
                  agenda.map((item, index) => (
                    <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveItemUp(index)}
                            disabled={index === 0}
                            className="text-liberation-silver hover:text-white disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <span className="text-liberation-gold-divine font-bold">{index + 1}</span>
                          <button
                            onClick={() => moveItemDown(index)}
                            disabled={index === agenda.length - 1}
                            className="text-liberation-silver hover:text-white disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Agenda item title"
                            value={item.title}
                            onChange={(e) => updateAgendaItem(item.id, 'title', e.target.value)}
                            className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded px-3 py-2 text-white text-sm"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              placeholder="Duration (min)"
                              value={item.duration}
                              onChange={(e) => updateAgendaItem(item.id, 'duration', parseInt(e.target.value))}
                              className="bg-white/5 border border-liberation-gold-divine/30 rounded px-3 py-2 text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Presenter"
                              value={item.presenter}
                              onChange={(e) => updateAgendaItem(item.id, 'presenter', e.target.value)}
                              className="bg-white/5 border border-liberation-gold-divine/30 rounded px-3 py-2 text-white text-sm"
                            />
                          </div>
                          <textarea
                            placeholder="Description (optional)"
                            value={item.description}
                            onChange={(e) => updateAgendaItem(item.id, 'description', e.target.value)}
                            className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded px-3 py-2 text-white text-sm"
                            rows={2}
                          />
                        </div>
                        <button
                          onClick={() => removeAgendaItem(item.id)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={saveAgenda}
                disabled={saving || agenda.length === 0}
                className="w-full bg-liberation-gold-divine hover:bg-liberation-gold-divine/90 text-liberation-black-power font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {saving ? 'Saving...' : 'Save Agenda'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
