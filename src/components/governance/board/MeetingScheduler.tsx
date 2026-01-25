// BLKOUT Meeting Scheduler
// Schedule and manage board meetings

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BoardMember {
  id: string;
  full_name: string;
  role: string;
}

interface MeetingFormData {
  meeting_date: string;
  meeting_time: string;
  meeting_type: string;
  meeting_format: string;
  location: string;
  chair_id: string;
  secretary_id: string;
  quorum_required: number;
  agenda: AgendaItem[];
}

interface AgendaItem {
  id: string;
  title: string;
  duration: number;
  presenter: string;
}

export default function MeetingScheduler() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [formData, setFormData] = useState<MeetingFormData>({
    meeting_date: '',
    meeting_time: '',
    meeting_type: 'regular',
    meeting_format: 'virtual',
    location: '',
    chair_id: '',
    secretary_id: '',
    quorum_required: 3,
    agenda: []
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadBoardMembers();
  }, []);

  const loadBoardMembers = async () => {
    const { data } = await supabase
      .from('board_members')
      .select('id, full_name, role')
      .eq('is_active', true)
      .order('role');

    setBoardMembers(data || []);
  };

  const addAgendaItem = () => {
    const newItem: AgendaItem = {
      id: Date.now().toString(),
      title: '',
      duration: 15,
      presenter: ''
    };
    setFormData({
      ...formData,
      agenda: [...formData.agenda, newItem]
    });
  };

  const updateAgendaItem = (id: string, field: keyof AgendaItem, value: string | number) => {
    setFormData({
      ...formData,
      agenda: formData.agenda.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const removeAgendaItem = (id: string) => {
    setFormData({
      ...formData,
      agenda: formData.agenda.filter(item => item.id !== id)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine date and time
      const meetingDateTime = new Date(`${formData.meeting_date}T${formData.meeting_time}`);

      const { error } = await supabase
        .from('board_meetings')
        .insert({
          meeting_date: meetingDateTime.toISOString(),
          meeting_type: formData.meeting_type,
          meeting_format: formData.meeting_format,
          location: formData.location,
          chair_id: formData.chair_id,
          secretary_id: formData.secretary_id,
          quorum_required: formData.quorum_required,
          agenda: formData.agenda,
          status: 'scheduled'
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Reset form
        setFormData({
          meeting_date: '',
          meeting_time: '',
          meeting_type: 'regular',
          meeting_format: 'virtual',
          location: '',
          chair_id: '',
          secretary_id: '',
          quorum_required: 3,
          agenda: []
        });
      }, 2000);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      alert('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-liberation-gold-divine mb-6 flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Schedule Board Meeting
        </h2>

        {success && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6 text-green-400">
            Meeting scheduled successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-liberation-silver text-sm mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Meeting Date
              </label>
              <input
                type="date"
                required
                value={formData.meeting_date}
                onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-liberation-silver text-sm mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Meeting Time
              </label>
              <input
                type="time"
                required
                value={formData.meeting_time}
                onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
                className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          {/* Meeting Type and Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-liberation-silver text-sm mb-2">Meeting Type</label>
              <select
                required
                value={formData.meeting_type}
                onChange={(e) => setFormData({ ...formData, meeting_type: e.target.value })}
                className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="regular">Regular Board Meeting</option>
                <option value="emergency">Emergency Meeting</option>
                <option value="agm">Annual General Meeting</option>
                <option value="egm">Extraordinary General Meeting</option>
                <option value="special">Special Meeting</option>
              </select>
            </div>
            <div>
              <label className="block text-liberation-silver text-sm mb-2">Meeting Format</label>
              <select
                required
                value={formData.meeting_format}
                onChange={(e) => setFormData({ ...formData, meeting_format: e.target.value })}
                className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="virtual">Virtual (Online)</option>
                <option value="in_person">In Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-liberation-silver text-sm mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location / Meeting Link
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Zoom link or physical address"
              className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-2 text-white"
            />
          </div>

          {/* Chair and Secretary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-liberation-silver text-sm mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Meeting Chair
              </label>
              <select
                required
                value={formData.chair_id}
                onChange={(e) => setFormData({ ...formData, chair_id: e.target.value })}
                className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Select Chair</option>
                {boardMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.full_name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-liberation-silver text-sm mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Meeting Secretary
              </label>
              <select
                required
                value={formData.secretary_id}
                onChange={(e) => setFormData({ ...formData, secretary_id: e.target.value })}
                className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Select Secretary</option>
                {boardMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.full_name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quorum */}
          <div>
            <label className="block text-liberation-silver text-sm mb-2">
              Quorum Required
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.quorum_required}
              onChange={(e) => setFormData({ ...formData, quorum_required: parseInt(e.target.value) })}
              className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded-lg px-4 py-2 text-white"
            />
          </div>

          {/* Agenda Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-liberation-silver text-sm">Agenda Items</label>
              <button
                type="button"
                onClick={addAgendaItem}
                className="bg-liberation-gold-divine/20 border border-liberation-gold-divine/30 rounded-lg px-4 py-2 text-liberation-gold-divine hover:bg-liberation-gold-divine/30 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>
            <div className="space-y-3">
              {formData.agenda.map((item, index) => (
                <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Agenda item title"
                        value={item.title}
                        onChange={(e) => updateAgendaItem(item.id, 'title', e.target.value)}
                        className="w-full bg-white/5 border border-liberation-gold-divine/30 rounded px-3 py-2 text-white text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Duration (min)"
                        value={item.duration}
                        onChange={(e) => updateAgendaItem(item.id, 'duration', parseInt(e.target.value))}
                        className="w-24 bg-white/5 border border-liberation-gold-divine/30 rounded px-3 py-2 text-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeAgendaItem(item.id)}
                        className="px-3 py-2 bg-red-500/20 border border-red-500/30 rounded text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Presenter"
                    value={item.presenter}
                    onChange={(e) => updateAgendaItem(item.id, 'presenter', e.target.value)}
                    className="w-full mt-2 bg-white/5 border border-liberation-gold-divine/30 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-liberation-gold-divine hover:bg-liberation-gold-divine/90 text-liberation-black-power font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {loading ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </form>
      </div>
    </div>
  );
}
