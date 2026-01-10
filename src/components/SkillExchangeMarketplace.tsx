/**
 * Skill Exchange Marketplace
 * Community-driven skill sharing platform
 * Liberation values: Mutual aid, time banking, skill sovereignty
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Heart,
  MessageCircle,
  ChevronRight,
  Plus,
  Star,
  Award
} from 'lucide-react';

interface SkillExchange {
  id: string;
  user_id: string;
  user_name?: string;
  skill_name: string;
  skill_category: string;
  skill_type: 'offering' | 'seeking';
  description: string;
  experience_level: string;
  availability: any;
  preferred_format: string[];
  compensation_type: string;
  suggested_exchange?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
}

const SKILL_CATEGORIES = [
  { value: 'technical', label: 'Technical Skills', icon: '💻' },
  { value: 'creative', label: 'Creative Arts', icon: '🎨' },
  { value: 'organizing', label: 'Community Organizing', icon: '📢' },
  { value: 'wellness', label: 'Wellness & Care', icon: '🌿' },
  { value: 'education', label: 'Education & Teaching', icon: '📚' },
  { value: 'business', label: 'Business & Admin', icon: '💼' },
  { value: 'trades', label: 'Trades & Making', icon: '🔨' },
  { value: 'care_work', label: 'Care Work', icon: '❤️' },
  { value: 'other', label: 'Other', icon: '✨' }
];

const COMPENSATION_TYPES = [
  { value: 'free', label: 'Free (Community Gift)', icon: '🎁' },
  { value: 'time_exchange', label: 'Time Exchange', icon: '⏱️' },
  { value: 'sliding_scale', label: 'Sliding Scale', icon: '📊' },
  { value: 'mutual_aid_suggested', label: 'Mutual Aid Suggested', icon: '🤝' },
  { value: 'negotiable', label: 'Negotiable', icon: '💬' }
];

export default function SkillExchangeMarketplace() {
  const [activeView, setActiveView] = useState<'offering' | 'seeking'>('offering');
  const [skills, setSkills] = useState<SkillExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // In production, fetch from API
    setSkills([
      {
        id: '1',
        user_id: 'user1',
        user_name: 'Alex J.',
        skill_name: 'Web Development (React, TypeScript)',
        skill_category: 'technical',
        skill_type: 'offering',
        description: 'I can teach React and TypeScript to build modern web apps. Beginner-friendly, trauma-informed teaching approach.',
        experience_level: 'expert',
        availability: { days: ['weekends'], times: 'afternoons' },
        preferred_format: ['online', 'recorded'],
        compensation_type: 'time_exchange',
        suggested_exchange: 'Looking to learn graphic design in exchange',
        is_active: true,
        created_at: '2026-01-05T10:00:00Z'
      },
      {
        id: '2',
        user_id: 'user2',
        user_name: 'Jordan T.',
        skill_name: 'Trauma-Informed Facilitation',
        skill_category: 'organizing',
        skill_type: 'offering',
        description: 'Certified facilitator offering workshops on trauma-informed meeting practices and consensus decision-making.',
        experience_level: 'advanced',
        availability: { days: ['evenings'], timezone: 'GMT' },
        preferred_format: ['online', 'in_person'],
        compensation_type: 'mutual_aid_suggested',
        suggested_exchange: '£20-50 sliding scale per workshop',
        location: 'London',
        is_active: true,
        created_at: '2026-01-08T14:30:00Z'
      }
    ]);
    setLoading(false);
  }, []);

  const filteredSkills = skills.filter(skill => {
    const matchesType = skill.skill_type === activeView;
    const matchesSearch = skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || skill.skill_category === categoryFilter;
    return matchesType && matchesSearch && matchesCategory;
  });

  const handlePostSkill = (formData: any) => {
    // In production, POST to API
    console.log('Posting skill:', formData);
    setShowPostForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Community Skill Exchange
          </h1>
          <p className="text-lg text-gray-600">
            Share knowledge, build skills, grow together through mutual aid
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveView('offering')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeView === 'offering'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Skills Offered
            </button>
            <button
              onClick={() => setActiveView('seeking')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeView === 'seeking'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Skills Wanted
            </button>
          </div>

          <button
            onClick={() => setShowPostForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Post a Skill
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeView === 'offering' ? 'skills offered' : 'skills wanted'}...`}
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
            {SKILL_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => {
            const category = SKILL_CATEGORIES.find(c => c.value === skill.skill_category);
            const compensation = COMPENSATION_TYPES.find(c => c.value === skill.compensation_type);

            return (
              <Card key={skill.id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {category?.icon} {category?.label}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {skill.experience_level}
                    </span>
                  </div>
                  <CardTitle className="text-lg mb-2">{skill.skill_name}</CardTitle>
                  <p className="text-sm text-gray-600">by {skill.user_name || 'Community Member'}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {skill.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {skill.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {skill.location}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {skill.preferred_format.join(', ')}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{compensation?.icon}</span>
                      <span className="text-gray-700">{compensation?.label}</span>
                    </div>

                    {skill.suggested_exchange && (
                      <p className="text-sm text-purple-700 italic">
                        "{skill.suggested_exchange}"
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Connect
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600 mb-2">No skills found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Post Skill Form Modal (simplified - would be a proper modal in production) */}
        {showPostForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Post a Skill</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">I want to:</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="type" value="offering" defaultChecked />
                        Offer a skill
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="type" value="seeking" />
                        Learn a skill
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Skill Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Web Development, Graphic Design, Community Organizing"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      {SKILL_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your skill, teaching approach, or what you'd like to learn..."
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Compensation Model</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      {COMPENSATION_TYPES.map(comp => (
                        <option key={comp.value} value={comp.value}>
                          {comp.icon} {comp.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      onClick={(e) => { e.preventDefault(); handlePostSkill({}); }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Post Skill
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
