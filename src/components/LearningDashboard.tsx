/**
 * Learning Platform Dashboard
 * Main interface for BLKOUT learning and skill development
 * Liberation-focused education with IVOR AI integration
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import {
  BookOpen,
  Award,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  MessageCircle,
  Download,
  Share2,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LearningModule {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty_level: string;
  estimated_duration_minutes: number;
  liberation_values: Record<string, number>;
  enrollment_count: number;
  completion_count: number;
  average_rating: number;
  featured_image_url?: string;
}

interface UserProgress {
  id: string;
  module_id: string;
  status: string;
  progress_percentage: number;
  started_at: string;
  completed_at?: string;
  quiz_score?: number;
  certificate_issued: boolean;
}

interface SkillExchange {
  id: string;
  user_id: string;
  skill_name: string;
  skill_type: 'offering' | 'seeking';
  description: string;
  experience_level: string;
  compensation_type: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  cooperative_ownership: 'Cooperative Ownership',
  democratic_governance: 'Democratic Governance',
  digital_sovereignty: 'Digital Sovereignty',
  trauma_informed_care: 'Trauma-Informed Care',
  economic_justice: 'Economic Justice',
  community_organizing: 'Community Organizing',
  cultural_heritage: 'Cultural Heritage',
  mental_wellness: 'Mental Wellness',
  skill_development: 'Skill Development',
  leadership: 'Leadership'
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

export default function LearningDashboard() {
  const [activeTab, setActiveTab] = useState('my-learning');
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [skillExchanges, setSkillExchanges] = useState<SkillExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    try {
      setLoading(true);

      // Load available modules from Supabase
      const { data: modulesData, error: modulesError } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (modulesError) {
        console.error('Error loading modules:', modulesError);
      } else {
        setModules(modulesData || []);
      }

      // Get current user for progress tracking
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Load user progress from Supabase
        const { data: progressData, error: progressError } = await supabase
          .from('learning_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError) {
          console.error('Error loading progress:', progressError);
        } else {
          setUserProgress(progressData || []);
        }
      }

    } catch (error) {
      console.error('Error loading learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollModule = async (moduleId: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('Please sign in to enroll in courses');
        return;
      }

      // Create enrollment record in Supabase
      const { data, error } = await supabase
        .from('learning_progress')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          status: 'in_progress',
          progress_percentage: 0,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          alert('You are already enrolled in this course');
        } else {
          throw error;
        }
      } else {
        // Update enrollment count on module
        await supabase.rpc('increment_enrollment', { module_id: moduleId });
        loadLearningData();
        alert('Successfully enrolled!');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll. Please try again.');
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || module.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const inProgressModules = userProgress.filter(p => p.status === 'in_progress');
  const completedModules = userProgress.filter(p => p.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Liberation Learning Platform
          </h1>
          <p className="text-lg text-gray-600">
            Build skills, share knowledge, and grow together in community
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{inProgressModules.length}</p>
                </div>
                <BookOpen className="h-12 w-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completedModules.length}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Certificates</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {userProgress.filter(p => p.certificate_issued).length}
                  </p>
                </div>
                <Award className="h-12 w-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Score</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {Math.round(userProgress.filter(p => p.quiz_score).reduce((sum, p) => sum + (p.quiz_score || 0), 0) / userProgress.filter(p => p.quiz_score).length || 0)}%
                  </p>
                </div>
                <Star className="h-12 w-12 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="my-learning">My Learning</TabsTrigger>
            <TabsTrigger value="discover">Discover Courses</TabsTrigger>
            <TabsTrigger value="skills">Skill Exchange</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          </TabsList>

          {/* My Learning Tab */}
          <TabsContent value="my-learning">
            <div className="space-y-6">
              {inProgressModules.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inProgressModules.map(progress => {
                      const module = modules.find(m => m.id === progress.module_id);
                      if (!module) return null;

                      return (
                        <Card key={progress.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-start justify-between">
                              <span>{module.title}</span>
                              <span className={`px-2 py-1 rounded text-xs ${DIFFICULTY_COLORS[module.difficulty_level]}`}>
                                {module.difficulty_level}
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <Progress value={progress.progress_percentage} className="h-2" />
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{Math.round(progress.progress_percentage)}% complete</span>
                                <span className="text-gray-600 flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {module.estimated_duration_minutes} min
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                  <MessageCircle className="h-4 w-4" />
                                  Continue with IVOR
                                </button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {completedModules.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Completed Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {completedModules.map(progress => {
                      const module = modules.find(m => m.id === progress.module_id);
                      if (!module) return null;

                      return (
                        <Card key={progress.id} className="bg-green-50 border-green-200">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="font-semibold">{module.title}</h3>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            {progress.quiz_score && (
                              <p className="text-sm text-gray-600 mb-2">Score: {progress.quiz_score}%</p>
                            )}
                            {progress.certificate_issued && (
                              <button className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                <Download className="h-4 w-4" />
                                Download Certificate
                              </button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Discover Courses Tab */}
          <TabsContent value="discover">
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map(module => {
                  const isEnrolled = userProgress.some(p => p.module_id === module.id);

                  return (
                    <Card key={module.id} className="hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <span className={`px-2 py-1 rounded text-xs ${DIFFICULTY_COLORS[module.difficulty_level]}`}>
                            {module.difficulty_level}
                          </span>
                          <span className="text-xs text-gray-500">
                            {CATEGORY_LABELS[module.category]}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {module.description}
                        </p>

                        {/* Liberation Values */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Liberation Values:</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(module.liberation_values || {})
                              .filter(([_, value]) => value >= 7)
                              .map(([key]) => (
                                <span key={key} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                  {key.replace(/_/g, ' ')}
                                </span>
                              ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {module.estimated_duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {module.enrollment_count} enrolled
                          </span>
                          {module.average_rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {module.average_rating.toFixed(1)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => !isEnrolled && handleEnrollModule(module.id)}
                          disabled={isEnrolled}
                          className={`w-full px-4 py-2 rounded transition-colors flex items-center justify-center gap-2 ${
                            isEnrolled
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isEnrolled ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Enrolled
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Start Learning with IVOR
                            </>
                          )}
                        </button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Skill Exchange Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Community Skill Exchange</CardTitle>
                <p className="text-gray-600">Share your skills and learn from others</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Skill marketplace coming soon! Offer your skills or find someone to learn from.
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                    Post a Skill
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentorship Tab */}
          <TabsContent value="mentorship">
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Connections</CardTitle>
                <p className="text-gray-600">Find a mentor or become one</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Mentorship program launching soon! Build long-term learning relationships.
                  </p>
                  <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors">
                    Join Waitlist
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
