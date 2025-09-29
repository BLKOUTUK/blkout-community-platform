// BLKOUT Liberation Platform - Comprehensive Admin Dashboard
// Authentication, moderation, and story management interface

import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, Download, Plus, Eye, CheckCircle, XCircle, BarChart3, Settings, Chrome, Key, UserCheck, Calendar, MapPin, Clock, Upload, Mail, Lock, EyeOff, PenTool } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';  // REMOVED - NO AUTH
import { communityAPI } from '@/services/community-api';
import { BulkStorySubmission } from './BulkStorySubmission';
import { IVORFeedbackCollection } from './IVORFeedbackCollection';
import { voicesAPI, type VoicesArticle, type VoicesArticleSubmission } from '@/services/voices-api';
import { liberationDB, type ModerationItem as SupabaseModerationItem } from '@/lib/supabase';
import type { NewsArticle, CommunityEvent, EventSubmission, EventModerationItem } from '@/types/liberation';

interface AdminStats {
  pendingStories: number;
  approvedToday: number;
  totalCurators: number;
  weeklySubmissions: number;
  pendingEvents: number;
  eventsApprovedToday: number;
  totalEventOrganizers: number;
  weeklyEventSubmissions: number;
}

interface ModerationItem {
  id: string;
  title: string;
  url: string;
  submittedBy: string;
  submittedAt: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  votes: number;
  excerpt: string;
}

export const AdminDashboard: React.FC = () => {
  // NO AUTH - Admin is always accessible
  const user = { email: 'admin@blkout.uk', role: 'admin' };
  const isAdmin = true;
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    pendingStories: 0,
    approvedToday: 0,
    totalCurators: 0,
    weeklySubmissions: 0
  });
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);
  const [eventModerationQueue, setEventModerationQueue] = useState<EventModerationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSingleSubmission, setShowSingleSubmission] = useState(false);
  const [showSingleEventSubmission, setShowSingleEventSubmission] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    // NO AUTH - Admin access is open
    console.log('No authentication required - admin access is open');
    setIsSigningIn(false);
  };

  // Admin Authentication Guard
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
            <p className="text-gray-300">Sign in with admin credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSigningIn}
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={isSigningIn}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isSigningIn}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSigningIn || !email || !password}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSigningIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-xs">
              <strong>Admin Access</strong><br />
              Sign in with any email and password: <code className="text-yellow-300">blkOUT2025!</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [queueData, eventQueueData, statsData] = await Promise.all([
        communityAPI.getModerationQueue(),
        liberationDB.getModerationQueue('event'), // Use Supabase for events
        liberationDB.getAdminStats()
      ]);

      setModerationQueue(queueData);

      // Transform Supabase events to expected format
      const transformedEvents = eventQueueData.map((item: SupabaseModerationItem) => ({
        id: item.id,
        title: item.title,
        submittedBy: item.moderator_id,
        submittedAt: item.submitted_at,
        category: item.category,
        type: item.content_data?.event_type || 'in-person',
        date: item.content_data?.event_date || item.submitted_at,
        description: item.description,
        organizer: item.content_data?.organizer || 'Unknown',
        status: item.status
      }));

      setEventModerationQueue(transformedEvents);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStory = async (storyId: string) => {
    try {
      await communityAPI.approveStoryForNewsroom(storyId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to approve story:', error);
    }
  };

  const handleRejectStory = async (storyId: string) => {
    try {
      await communityAPI.rejectStory(storyId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to reject story:', error);
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      await liberationDB.approveSubmission(eventId, 'Approved for community calendar');
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to approve event:', error);
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    try {
      await liberationDB.rejectSubmission(eventId, 'Does not meet community guidelines');
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to reject event:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'moderation', label: 'Story Moderation', icon: Eye },
    { id: 'submissions', label: 'Story Submissions', icon: Plus },
    { id: 'event-moderation', label: 'Event Moderation', icon: Calendar },
    { id: 'event-submissions', label: 'Event Submissions', icon: Users },
    { id: 'voices', label: 'Voices Editorial', icon: PenTool },
    { id: 'extension', label: 'Chrome Extension', icon: Chrome },
    { id: 'ivor', label: 'IVOR Training', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-yellow-400" />
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-400">
                <UserCheck className="w-5 h-5" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button
                onClick={() => console.log('No auth - logout not needed')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Admin Mode
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stories Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Pending Stories</p>
                    <p className="text-3xl font-bold text-white">{stats.pendingStories}</p>
                  </div>
                  <Eye className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Stories Approved Today</p>
                    <p className="text-3xl font-bold text-white">{stats.approvedToday}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              {/* Events Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Pending Events</p>
                    <p className="text-3xl font-bold text-white">{stats.pendingEvents}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Events Approved Today</p>
                    <p className="text-3xl font-bold text-white">{stats.eventsApprovedToday}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              {/* Community Stats */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Total Curators</p>
                    <p className="text-3xl font-bold text-white">{stats.totalCurators}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Event Organizers</p>
                    <p className="text-3xl font-bold text-white">{stats.totalEventOrganizers}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Weekly Story Submissions</p>
                    <p className="text-3xl font-bold text-white">{stats.weeklySubmissions}</p>
                  </div>
                  <FileText className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Weekly Event Submissions</p>
                    <p className="text-3xl font-bold text-white">{stats.weeklyEventSubmissions}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-pink-400" />
                </div>
              </div>

              {/* System Status Card */}
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-lg p-6 border border-green-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-sm font-medium">Backend API</p>
                    <p className="text-lg font-bold text-white">Railway v1.1.0</p>
                    <p className="text-xs text-green-400">✅ Chrome Extension Ready</p>
                  </div>
                  <div className="text-green-400">
                    <Settings className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('moderation')}
                  className="flex items-center gap-3 p-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors text-left"
                >
                  <Eye className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="font-semibold text-white">Story Review</h3>
                    <p className="text-sm text-gray-300">{stats.pendingStories} pending stories</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('event-moderation')}
                  className="flex items-center gap-3 p-4 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition-colors text-left"
                >
                  <Calendar className="w-6 h-6 text-orange-400" />
                  <div>
                    <h3 className="font-semibold text-white">Event Review</h3>
                    <p className="text-sm text-gray-300">{stats.pendingEvents} pending events</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('submissions')}
                  className="flex items-center gap-3 p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-left"
                >
                  <Plus className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-white">Add Content</h3>
                    <p className="text-sm text-gray-300">Stories & events</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('extension')}
                  className="flex items-center gap-3 p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-left"
                >
                  <Chrome className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="font-semibold text-white">Extension Setup</h3>
                    <p className="text-sm text-gray-300">Download & configure</p>
                  </div>
                </button>

              </div>
            </div>
          </div>
        )}

        {/* Story Moderation Queue Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Story Moderation Queue</h2>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
                <p className="text-gray-300 mt-4">Loading story moderation queue...</p>
              </div>
            ) : moderationQueue.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
                <p className="text-gray-300">No stories pending moderation.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {moderationQueue.map((item) => (
                  <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-300 text-sm mb-3">{item.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>By {item.submittedBy}</span>
                          <span>•</span>
                          <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">{item.category}</span>
                          <span>•</span>
                          <span>{item.votes} votes</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleApproveStory(item.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve to Newsroom
                        </button>

                        <button
                          onClick={() => handleRejectStory(item.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:text-yellow-300 text-sm underline"
                    >
                      View original article →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Event Moderation Queue Tab */}
        {activeTab === 'event-moderation' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Event Moderation Queue</h2>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
                <p className="text-gray-300 mt-4">Loading event moderation queue...</p>
              </div>
            ) : eventModerationQueue.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
                <p className="text-gray-300">No events pending moderation.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventModerationQueue.map((item) => (
                  <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                          <span className="px-2 py-1 bg-orange-500/20 rounded text-orange-300 text-xs font-semibold">
                            {item.category.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs font-semibold">
                            {item.type.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-gray-300 text-sm mb-3">{item.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>By {item.organizer}</span>
                          </div>
                          <span>•</span>
                          <span>Submitted by {item.submittedBy}</span>
                          <span>•</span>
                          <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleApproveEvent(item.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve to Calendar
                        </button>

                        <button
                          onClick={() => handleRejectEvent(item.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>

                    {item.flagReason && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-3">
                        <p className="text-red-300 text-sm">
                          <strong>Flag Reason:</strong> {item.flagReason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Story Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Story Submissions</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSingleSubmission(!showSingleSubmission)}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    showSingleSubmission
                      ? 'bg-yellow-500 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Single Submission
                </button>
                <button
                  onClick={() => setShowSingleSubmission(false)}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    !showSingleSubmission
                      ? 'bg-yellow-500 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Bulk Submission
                </button>
              </div>
            </div>

            {showSingleSubmission ? (
              <SingleStorySubmission onSubmit={loadDashboardData} />
            ) : (
              <BulkStorySubmission onSubmit={loadDashboardData} />
            )}
          </div>
        )}

        {/* Event Submissions Tab */}
        {activeTab === 'event-submissions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Event Submissions</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSingleEventSubmission(!showSingleEventSubmission)}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    showSingleEventSubmission
                      ? 'bg-orange-500 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Single Event
                </button>
                <button
                  onClick={() => setShowSingleEventSubmission(false)}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    !showSingleEventSubmission
                      ? 'bg-orange-500 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Bulk Events
                </button>
              </div>
            </div>

            {showSingleEventSubmission ? (
              <SingleEventSubmission onSubmit={loadDashboardData} />
            ) : (
              <BulkEventSubmission onSubmit={loadDashboardData} />
            )}
          </div>
        )}

        {/* Chrome Extension Tab */}
        {activeTab === 'extension' && (
          <ChromeExtensionManager />
        )}

        {/* Voices Editorial Tab */}
        {activeTab === 'voices' && (
          <VoicesEditorialManager />
        )}

        {/* IVOR Training Tab */}
        {activeTab === 'ivor' && (
          <IVORFeedbackCollection />
        )}
      </div>
    </div>
  );
};

// Single Story Submission Component
const SingleStorySubmission: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: '',
    excerpt: '',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await communityAPI.submitSingleStory({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });

      setFormData({ title: '', url: '', category: '', excerpt: '', tags: '' });
      onSubmit();
    } catch (error) {
      console.error('Failed to submit story:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Add Single Story</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Story title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="https://..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="">Select category</option>
              <option value="liberation">Liberation</option>
              <option value="community">Community</option>
              <option value="culture">Culture</option>
              <option value="politics">Politics</option>
              <option value="health">Health</option>
              <option value="economics">Economics</option>
              <option value="environment">Environment</option>
              <option value="technology">Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Brief description of the story..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black font-semibold rounded-lg transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Story'}
        </button>
      </form>
    </div>
  );
};


// Chrome Extension Manager Component
const ChromeExtensionManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Chrome Extension</h2>

      {/* Download Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <Chrome className="w-8 h-8 text-blue-400" />
          <div>
            <h3 className="text-xl font-semibold text-white">BLKOUT Community Submission Tool v1.0.1</h3>
            <p className="text-gray-300">✅ Fixed: No admin credentials required - public community submissions</p>
          </div>
        </div>

        <div className="flex gap-4">
          <a
            href="/blkout-extension-v1.0.2-clean.zip"
            download="blkout-extension-v1.0.2-clean.zip"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Download v1.0.2 Enhanced (.zip)
          </a>
          <a
            href="/blkout-extension-v1.0.2-clean.tar.gz"
            download="blkout-extension-v1.0.2-clean.tar.gz"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Download (.tar.gz)
          </a>
        </div>
      </div>

      {/* What's New */}
      <div className="bg-green-900/20 backdrop-blur-md rounded-lg p-6 border border-green-500/30 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">🚀 Enhanced Content Detection (v1.0.2)!</h3>
        <div className="space-y-2 text-gray-300">
          <p>• ✅ Enhanced scraping with better content selectors</p>
          <p>• ✅ Added Reuters, Al Jazeera, HuffPost support</p>
          <p>• ✅ Improved Twitter/X, LinkedIn, Instagram detection</p>
          <p>• ✅ Added Sky News, Channel 4, ITV support</p>
          <p>• ✅ Smarter event detection with enhanced keywords</p>
          <p>• ✅ Meta description fallback for better content quality</p>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Installation Instructions</h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">1</div>
            <div>
              <h4 className="font-semibold text-white">Download & Extract Extension</h4>
              <p className="text-gray-300">Click the download button above to get the extension package, then extract the zip file</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">2</div>
            <div>
              <h4 className="font-semibold text-white">Enable Developer Mode</h4>
              <p className="text-gray-300">Go to chrome://extensions/ and toggle "Developer mode" in the top right</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">3</div>
            <div>
              <h4 className="font-semibold text-white">Load Extension</h4>
              <p className="text-gray-300">Click "Load unpacked" and select the extracted extension folder</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">4</div>
            <div>
              <h4 className="font-semibold text-white">Start Using - No Auth Required! ✅</h4>
              <p className="text-gray-300">Extension now works without admin credentials - supports public community submissions</p>
            </div>
          </div>
        </div>

        {/* Troubleshooting Section */}
        <div className="mt-6 p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
          <h4 className="font-semibold text-white mb-2">⚠️ Troubleshooting "Cannot Load Extension"</h4>
          <div className="space-y-1 text-sm text-gray-300">
            <p>• Make sure you select the extracted folder (not the .zip file)</p>
            <p>• The folder must contain manifest.json file</p>
            <p>• This v1.0.2 clean package removes problematic Zone.Identifier files</p>
            <p>• Try refreshing the chrome://extensions/ page if needed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Single Event Submission Component
const SingleEventSubmission: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    excerpt: '',
    category: '' as 'mutual-aid' | 'organizing' | 'education' | 'celebration' | 'support' | 'action' | '',
    type: '' as 'virtual' | 'in-person' | 'hybrid' | '',
    date: '',
    endDate: '',
    locationDetails: '',
    organizerName: '',
    organizerEmail: '',
    organizerOrganization: '',
    registrationRequired: false,
    capacity: '',
    registrationUrl: '',
    accessibilityFeatures: '',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const eventSubmission: EventSubmission = {
        title: formData.title,
        description: formData.description,
        excerpt: formData.excerpt,
        category: formData.category as any,
        type: formData.type as any,
        date: formData.date,
        endDate: formData.endDate || undefined,
        location: {
          type: formData.type as any,
          details: formData.locationDetails
        },
        organizer: {
          name: formData.organizerName,
          email: formData.organizerEmail,
          organization: formData.organizerOrganization,
          communityMember: true
        },
        registration: {
          required: formData.registrationRequired,
          capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
          registrationUrl: formData.registrationUrl || undefined
        },
        accessibilityFeatures: formData.accessibilityFeatures.split(',').map(f => f.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      await liberationDB.submitEventToQueue({
        title: eventSubmission.title,
        description: eventSubmission.description,
        category: eventSubmission.category,
        type: eventSubmission.type,
        date: eventSubmission.date,
        organizer: eventSubmission.organizer.name
      });

      setFormData({
        title: '', description: '', excerpt: '', category: '' as any, type: '' as any,
        date: '', endDate: '', locationDetails: '', organizerName: '', organizerEmail: '',
        organizerOrganization: '', registrationRequired: false, capacity: '', registrationUrl: '',
        accessibilityFeatures: '', tags: ''
      });
      onSubmit();
    } catch (error) {
      console.error('Failed to submit event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Add Single Event</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Date</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Full event description..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select category</option>
              <option value="mutual-aid">Mutual Aid</option>
              <option value="organizing">Organizing</option>
              <option value="education">Education</option>
              <option value="celebration">Celebration</option>
              <option value="support">Support</option>
              <option value="action">Action</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select type</option>
              <option value="virtual">Virtual</option>
              <option value="in-person">In-Person</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Organizer Name</label>
            <input
              type="text"
              value={formData.organizerName}
              onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Organizer name"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-lg transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Event'}
        </button>
      </form>
    </div>
  );
};

// Recurring Event Expansion Logic
const expandRecurringEvent = (eventData: any): any[] => {
  const { recurrencePattern, startDate, endDate, recurrenceInterval = 1, daysOfWeek } = eventData;

  if (!recurrencePattern || recurrencePattern === 'none' || !endDate) {
    // Single occurrence event
    return [{
      title: eventData.title,
      description: eventData.description,
      excerpt: eventData.excerpt,
      category: eventData.category,
      type: eventData.type,
      date: eventData.startDate,
      organizer: eventData.organizer,
      location: { type: eventData.type },
      registration: { required: false },
      accessibilityFeatures: [],
      tags: []
    }];
  }

  const events: any[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let currentDate = new Date(start);

  // Generate recurring events
  while (currentDate <= end) {
    events.push({
      title: eventData.title,
      description: eventData.description,
      excerpt: eventData.excerpt,
      category: eventData.category,
      type: eventData.type,
      date: currentDate.toISOString(),
      organizer: eventData.organizer,
      location: { type: eventData.type },
      registration: { required: false },
      accessibilityFeatures: [],
      tags: [`recurring-${recurrencePattern}`]
    });

    // Calculate next occurrence
    switch (recurrencePattern.toLowerCase()) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + recurrenceInterval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * recurrenceInterval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + recurrenceInterval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + recurrenceInterval);
        break;
      default:
        // Unknown pattern, break to avoid infinite loop
        break;
    }

    // Safety check to prevent infinite loops
    if (events.length > 100) {
      console.warn('Stopping event generation at 100 occurrences to prevent infinite loop');
      break;
    }
  }

  return events;
};

// Bulk Event Submission Component
const BulkEventSubmission: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const [bulkEventFile, setBulkEventFile] = useState<File | null>(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const handleBulkEventUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBulkEventFile(file);
      setUploadStatus(null);
    }
  };

  const processBulkEventSubmission = async () => {
    if (!bulkEventFile) return;

    setBulkProcessing(true);
    setUploadStatus({ type: 'info', message: 'Processing events...' });

    try {
      const text = await bulkEventFile.text();
      let events: any[] = [];

      if (bulkEventFile.name.endsWith('.json')) {
        const parsed = JSON.parse(text);
        events = Array.isArray(parsed) ? parsed : parsed.events || [];
      } else if (bulkEventFile.name.endsWith('.csv')) {
        // Enhanced CSV parsing for events with recurrence support
        const lines = text.split('\n').slice(1); // Skip header
        const parsedEvents = lines.filter(line => line.trim()).map(line => {
          const [title, description, excerpt, category, type, startDate, endDate, recurrencePattern, recurrenceInterval, daysOfWeek, organizerName, organizerEmail] = line.split(',');
          return {
            title: title?.trim().replace(/^"|"$/g, ''),
            description: description?.trim().replace(/^"|"$/g, ''),
            excerpt: excerpt?.trim().replace(/^"|"$/g, ''),
            category: category?.trim() as any,
            type: type?.trim() as any,
            startDate: startDate?.trim().replace(/^"|"$/g, ''),
            endDate: endDate?.trim().replace(/^"|"$/g, '') || null,
            recurrencePattern: recurrencePattern?.trim() || 'none',
            recurrenceInterval: parseInt(recurrenceInterval?.trim() || '1'),
            daysOfWeek: daysOfWeek?.trim().replace(/^"|"$/g, '') || '',
            organizer: {
              name: organizerName?.trim().replace(/^"|"$/g, ''),
              email: organizerEmail?.trim().replace(/^"|"$/g, ''),
              communityMember: true
            }
          };
        });

        // Expand recurring events into individual occurrences
        events = [];
        parsedEvents.forEach(eventData => {
          const expandedEvents = expandRecurringEvent(eventData);
          events.push(...expandedEvents);
        });
      }

      if (events.length === 0) {
        throw new Error('No valid events found in file');
      }

      // Submit events individually to Supabase to avoid CORS issues
      for (const event of events) {
        await liberationDB.submitEventToQueue({
          title: event.title,
          description: event.description,
          category: event.category,
          type: event.type,
          date: event.date,
          organizer: event.organizer?.name || 'Unknown'
        });
      }

      setUploadStatus({
        type: 'success',
        message: `Successfully submitted ${events.length} events for moderation`
      });
      setBulkEventFile(null);
      onSubmit();
    } catch (error) {
      console.error('Failed to process bulk event submission:', error);
      setUploadStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to process events'
      });
    } finally {
      setBulkProcessing(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Bulk Event Submission</h3>
      <p className="text-gray-300 mb-6">
        Upload multiple events at once using CSV or JSON format. Events will be sent to moderation queue for approval.
      </p>

      <div className="space-y-6">
        {/* Template Downloads */}
        <div className="flex flex-wrap gap-3 mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-800">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Download CSV Templates:</span>
          </div>
          <a
            href="/templates/event-submission-template.csv"
            download="event-submission-template.csv"
            className="flex items-center gap-1 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors"
          >
            <FileText className="h-3 w-3" />
            Events Template
          </a>
          <div className="text-orange-700 text-xs ml-2">
            Use this format: title, description, excerpt, category, type, startDate, endDate, recurrencePattern, recurrenceInterval, daysOfWeek, organizerName, organizerEmail
          </div>
        </div>
        {/* File Upload */}
        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
          <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
          <p className="text-white/70 mb-4">Upload CSV or JSON file with multiple events</p>
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleBulkEventUpload}
            className="hidden"
            id="bulk-event-upload"
          />
          <label
            htmlFor="bulk-event-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors cursor-pointer font-medium"
          >
            <Upload className="w-4 h-4" />
            Choose File
          </label>
        </div>

        {/* File Info & Process */}
        {bulkEventFile && (
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{bulkEventFile.name}</span>
              <button
                onClick={() => { setBulkEventFile(null); setUploadStatus(null); }}
                className="text-red-400 hover:text-red-300"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white/70 text-sm mb-4">
              {(bulkEventFile.size / 1024).toFixed(1)} KB • {bulkEventFile.type || 'Unknown type'}
            </p>
            <button
              onClick={processBulkEventSubmission}
              disabled={bulkProcessing}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {bulkProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Events...
                </span>
              ) : (
                'Process Bulk Submission'
              )}
            </button>
          </div>
        )}

        {/* Status Messages */}
        {uploadStatus && (
          <div className={`p-4 rounded-lg ${
            uploadStatus.type === 'success' ? 'bg-green-500/20 border border-green-500/30' :
            uploadStatus.type === 'error' ? 'bg-red-500/20 border border-red-500/30' :
            'bg-blue-500/20 border border-blue-500/30'
          }`}>
            <p className={`text-sm ${
              uploadStatus.type === 'success' ? 'text-green-300' :
              uploadStatus.type === 'error' ? 'text-red-300' :
              'text-blue-300'
            }`}>
              {uploadStatus.message}
            </p>
          </div>
        )}

        {/* CSV Format Example */}
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">CSV Format Examples:</h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Single Event:</p>
              <pre className="text-xs text-gray-300 overflow-x-auto">
{`title,description,excerpt,category,type,startDate,endDate,recurrencePattern,recurrenceInterval,daysOfWeek,organizerName,organizerEmail
"Community Workshop","Full description","Brief excerpt","education","virtual","2024-02-01T18:00","","none","1","","Organizer","email@example.com"`}
              </pre>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Recurring Event (Weekly for 3 months):</p>
              <pre className="text-xs text-gray-300 overflow-x-auto">
{`"Weekly Healing Circle","Trauma-informed healing space","Weekly healing circle","health","support-group","2025-10-20T14:00","2025-12-20T14:00","weekly","1","","Community Healing","healing@community.org"`}
              </pre>
            </div>
            <div className="text-xs text-gray-400">
              <p><strong>Recurrence Patterns:</strong> none, daily, weekly, monthly, yearly</p>
              <p><strong>Leave endDate empty for single events</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Voices Editorial Manager Component
const VoicesEditorialManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [voicesArticles, setVoicesArticles] = useState<VoicesArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<VoicesArticle | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: 'opinion' as 'opinion' | 'analysis' | 'editorial' | 'community' | 'liberation',
    tags: '',
    featured: false,
    published: false
  });

  const loadVoicesArticles = async () => {
    setLoading(true);
    try {
      const articles = await voicesAPI.getAllArticles();
      setVoicesArticles(articles);
    } catch (error) {
      console.error('Failed to load voices articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVoicesArticles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const articleData: VoicesArticleSubmission = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        author: formData.author,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        featured: formData.featured,
        published: formData.published
      };

      if (activeView === 'create') {
        await voicesAPI.createArticle(articleData);
      } else if (activeView === 'edit' && selectedArticle) {
        await voicesAPI.updateArticle(selectedArticle.id, articleData);
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        category: 'opinion',
        tags: '',
        featured: false,
        published: false
      });

      setActiveView('list');
      setSelectedArticle(null);
      await loadVoicesArticles();
    } catch (error) {
      console.error('Failed to submit article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: VoicesArticle) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      tags: article.tags?.join(', ') || '',
      featured: article.featured,
      published: article.published
    });
    setActiveView('edit');
  };

  const handlePublishToggle = async (articleId: string, published: boolean) => {
    try {
      await voicesAPI.togglePublished(articleId, published);
      await loadVoicesArticles();
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Voices Editorial</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeView === 'list'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            All Articles
          </button>
          <button
            onClick={() => {
              setActiveView('create');
              setFormData({
                title: '',
                content: '',
                excerpt: '',
                author: '',
                category: 'opinion',
                tags: '',
                featured: false,
                published: false
              });
            }}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeView === 'create'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Create Article
          </button>
        </div>
      </div>

      {/* Article List View */}
      {activeView === 'list' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading articles...</p>
            </div>
          ) : voicesArticles.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
              <PenTool className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No articles yet</h3>
              <p className="text-gray-300 mb-4">Start building your editorial voice by creating your first article.</p>
              <button
                onClick={() => setActiveView('create')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Create First Article
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {voicesArticles.map((article) => (
                <div key={article.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                        {article.featured && (
                          <span className="px-2 py-1 bg-yellow-500/20 rounded text-yellow-300 text-xs font-semibold">
                            FEATURED
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          article.published
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {article.published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                        <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-300 text-xs font-semibold">
                          {article.category.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm mb-3">{article.excerpt}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>By {article.author}</span>
                        <span>•</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        {article.tags && article.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{article.tags.join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(article)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <PenTool className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handlePublishToggle(article.id, !article.published)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          article.published
                            ? 'bg-gray-600 hover:bg-gray-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {article.published ? (
                          <>
                            <XCircle className="w-4 h-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Publish
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Article Form */}
      {(activeView === 'create' || activeView === 'edit') && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            {activeView === 'create' ? 'Create New Article' : 'Edit Article'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Article title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Author name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Brief article summary..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Write your article content here... (Markdown supported)"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                >
                  <option value="opinion">Opinion</option>
                  <option value="analysis">Analysis</option>
                  <option value="editorial">Editorial</option>
                  <option value="community">Community Voice</option>
                  <option value="liberation">Liberation Thought</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2 text-purple-500 focus:ring-purple-400"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-300">Featured Article</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="mr-2 text-purple-500 focus:ring-purple-400"
                  />
                  <label htmlFor="published" className="text-sm text-gray-300">Publish Immediately</label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : (activeView === 'create' ? 'Create Article' : 'Update Article')}
              </button>

              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;