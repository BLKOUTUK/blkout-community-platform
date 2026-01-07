import React, { useState, useEffect } from 'react';
import { User, Edit2, Save, X, Calendar, Activity, Vote, FileText, Tag, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

const INTEREST_OPTIONS = [
  'Health & Wellness', 'Arts & Culture', 'Policy & Advocacy',
  'Community Events', 'Economic Justice', 'Education',
  'Technology', 'Mental Health', 'Sports & Fitness',
  'Music & Entertainment', 'Housing', 'Employment'
];

interface Member {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  interests: string[];
  membership_status: string;
  participation_level: string;
  proposals_created: number;
  votes_cast: number;
  join_date: string;
  renewal_date?: string;
  last_active_at?: string;
  created_at: string;
}

export default function MemberPortalPage() {
  const [member, setMember] = useState<Member | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    interests: [] as string[]
  });

  useEffect(() => {
    loadMemberData();
  }, []);

  const loadMemberData = async () => {
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      // Load member profile
      const { data: memberData, error } = await supabase
        .from('governance_members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading member:', error);
      } else if (memberData) {
        setMember(memberData);
        setEditForm({
          full_name: memberData.full_name || '',
          bio: memberData.bio || '',
          interests: memberData.interests || []
        });
      }
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!member) return;

    try {
      const { error } = await supabase
        .from('governance_members')
        .update({
          full_name: editForm.full_name,
          bio: editForm.bio,
          interests: editForm.interests,
          updated_at: new Date().toISOString()
        })
        .eq('id', member.id);

      if (error) throw error;

      setEditing(false);
      loadMemberData();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const toggleInterest = (interest: string) => {
    setEditForm({
      ...editForm,
      interests: editForm.interests.includes(interest)
        ? editForm.interests.filter(i => i !== interest)
        : [...editForm.interests, interest]
    });
  };

  const calculateParticipationRate = () => {
    if (!member || member.votes_cast === 0) return 0;
    // Estimate: ~5 proposals per year for 500 members
    const estimatedProposals = 5;
    return Math.min(100, Math.round((member.votes_cast / estimatedProposals) * 100));
  };

  const getDaysUntilRenewal = () => {
    if (!member?.renewal_date) return null;
    const now = new Date();
    const renewal = new Date(member.renewal_date);
    const diffTime = renewal.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading your member portal...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-4">Member Sign In Required</h2>
          <p className="text-gray-400 mb-6">
            Sign in to access your member portal and manage your profile.
          </p>
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-4">Membership Pending</h2>
          <p className="text-gray-400 mb-6">
            Your membership application is being reviewed. You'll receive an email once approved.
          </p>
        </div>
      </div>
    );
  }

  const daysUntilRenewal = getDaysUntilRenewal();
  const participationRate = calculateParticipationRate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-yellow-500">My BLKOUT Portal</h1>
          <p className="text-gray-400">Manage your profile and participate in community governance</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <User className="w-6 h-6 text-yellow-500" />
                  Member Profile
                </h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500/30"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                {editing && (
                  <div className="flex gap-2">
                    <button
                      onClick={saveProfile}
                      className="flex items-center gap-2 bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => { setEditing(false); setEditForm({ full_name: member.full_name || '', bio: member.bio || '', interests: member.interests || [] }); }}
                      className="flex items-center gap-2 bg-gray-500/20 border border-gray-500 text-gray-400 px-4 py-2 rounded-lg hover:bg-gray-500/30"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold">
                  {member.full_name?.charAt(0) || 'M'}
                </div>
                <div>
                  {!editing && (
                    <>
                      <h3 className="text-2xl font-bold text-white">{member.full_name || 'Anonymous Member'}</h3>
                      <p className="text-gray-400">{member.email}</p>
                    </>
                  )}
                  {editing && (
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-full"
                      placeholder="Your full name"
                    />
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Bio</label>
                {!editing && (
                  <p className="text-gray-400">{member.bio || 'No bio added yet. Click Edit Profile to add one!'}</p>
                )}
                {editing && (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-24"
                    placeholder="Tell us about yourself..."
                  />
                )}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-yellow-500" />
                  Interests & Focus Areas
                </label>
                {!editing && (
                  <div className="flex flex-wrap gap-2">
                    {member.interests && member.interests.length > 0 ? (
                      member.interests.map(interest => (
                        <span key={interest} className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-full text-sm">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">No interests selected</span>
                    )}
                  </div>
                )}
                {editing && (
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(interest => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          editForm.interests.includes(interest)
                            ? 'bg-yellow-500 text-black border border-yellow-500'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-yellow-500/50'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Governance Participation */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Vote className="w-6 h-6 text-yellow-500" />
                Governance Participation
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{member.votes_cast}</div>
                  <div className="text-sm text-gray-400">Votes Cast</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-400 mb-1">{member.proposals_created}</div>
                  <div className="text-sm text-gray-400">Proposals Created</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-400 mb-1">{participationRate}%</div>
                  <div className="text-sm text-gray-400">Participation Rate</div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-semibold">Your Voting Power</span>
                  <span className="text-yellow-500 font-bold">1 Vote</span>
                </div>
                <p className="text-sm text-gray-400">
                  Democratic governance: One member, one vote. Your voice matters equally.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Membership Status */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Membership Status</h3>

              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-400 block mb-1">Status</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    member.membership_status === 'active'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {member.membership_status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <span className="text-sm text-gray-400 block mb-1">Participation Level</span>
                  <span className="text-white font-semibold capitalize">
                    {member.participation_level.replace('_', ' ')}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-400">Joined</span>
                  </div>
                  <span className="text-white">
                    {member.join_date ? new Date(member.join_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date unknown'}
                  </span>
                </div>

                {member.renewal_date && (
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-400">Renewal Due</span>
                    </div>
                    <span className="text-white">
                      {new Date(member.renewal_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {daysUntilRenewal !== null && (
                      <div className={`mt-2 text-sm ${
                        daysUntilRenewal < 30 ? 'text-red-400' :
                        daysUntilRenewal < 60 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {daysUntilRenewal > 0
                          ? `${daysUntilRenewal} days remaining`
                          : daysUntilRenewal === 0
                          ? 'Due today'
                          : `${Math.abs(daysUntilRenewal)} days overdue`
                        }
                      </div>
                    )}
                  </div>
                )}

                {member.last_active_at && (
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-400">Last Active</span>
                    </div>
                    <span className="text-white text-sm">
                      {new Date(member.last_active_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); window.location.hash = '#governance-proposals'; window.location.reload(); }}
                  className="block w-full bg-purple-500/20 border border-purple-500 text-purple-400 py-2 px-4 rounded-lg font-semibold hover:bg-purple-500/30 text-center transition-colors"
                >
                  View Active Proposals
                </a>
                {['proposer', 'facilitator', 'admin'].includes(member.participation_level) && (
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); window.location.hash = '#governance-proposals'; window.location.reload(); }}
                    className="block w-full bg-yellow-500/20 border border-yellow-500 text-yellow-400 py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500/30 text-center transition-colors"
                  >
                    Create Proposal
                  </a>
                )}
                <a
                  href="https://events.blkoutuk.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-500/20 border border-blue-500 text-blue-400 py-2 px-4 rounded-lg font-semibold hover:bg-blue-500/30 text-center transition-colors"
                >
                  Browse Events
                </a>
              </div>
            </div>
          </div>

          {/* Activity Timeline - Future enhancement */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-500" />
                Recent Activity
              </h3>
              <div className="text-gray-400 text-sm">
                <p className="mb-2">• Member since {member.join_date ? new Date(member.join_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'recently'}</p>
                {member.votes_cast > 0 && <p className="mb-2">• Cast {member.votes_cast} vote{member.votes_cast !== 1 ? 's' : ''}</p>}
                {member.proposals_created > 0 && <p className="mb-2">• Created {member.proposals_created} proposal{member.proposals_created !== 1 ? 's' : ''}</p>}
                {member.votes_cast === 0 && member.proposals_created === 0 && (
                  <p className="italic text-gray-500">No governance activity yet. Start by voting on active proposals!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Info */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Vote className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-400 mb-1">Your Permissions</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                {member.participation_level === 'observer' && (
                  <li>• <strong>Observer:</strong> You can view proposals but not vote yet. Contact admins for voting access.</li>
                )}
                {['voter', 'proposer', 'facilitator', 'admin'].includes(member.participation_level) && (
                  <li>• <strong>Vote:</strong> You can vote on all active proposals (one vote per proposal)</li>
                )}
                {['proposer', 'facilitator', 'admin'].includes(member.participation_level) && (
                  <li>• <strong>Propose:</strong> You can create new proposals for community voting</li>
                )}
                {['facilitator', 'admin'].includes(member.participation_level) && (
                  <li>• <strong>Facilitate:</strong> You can help guide discussions and consensus-building</li>
                )}
                {member.participation_level === 'admin' && (
                  <li>• <strong>Admin:</strong> You have full administrative access to governance system</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
