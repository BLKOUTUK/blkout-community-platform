import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Trophy, Users, Calendar, ChevronRight, Image, Award, Star } from 'lucide-react';
import { CompetitionLanding } from './CompetitionLanding';
import { SubmissionForm } from './SubmissionForm';
import { CompetitionGallery } from './CompetitionGallery';
import { VotingInterface } from './VotingInterface';
import { CompetitionResults } from './CompetitionResults';

// Competition themes
export const COMPETITION_THEMES = ['Black', 'Out', 'Next'] as const;
export type CompetitionTheme = typeof COMPETITION_THEMES[number];

interface PhotoCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'landing' | 'submit' | 'gallery' | 'voting' | 'results';
  competitionId?: string;
}

export const PhotoCompetitionModal: React.FC<PhotoCompetitionModalProps> = ({
  isOpen,
  onClose,
  initialView = 'landing',
  competitionId
}) => {
  const [currentView, setCurrentView] = useState<'landing' | 'submit' | 'gallery' | 'voting' | 'results'>(initialView);
  const [selectedTheme, setSelectedTheme] = useState<CompetitionTheme>('Black');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock auth for now
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock competition data
  const currentCompetition = {
    id: competitionId || 'oct-2025',
    title: 'BLKOUT Photo Competition - October 2025',
    status: 'submission',
    themes: COMPETITION_THEMES,
    deadline: '2025-11-01',
    prizes: {
      winner: '£500 + Featured Exhibition',
      featured: '£200 + Gallery Display',
      shortlisted: 'Digital Certificate + Community Recognition'
    },
    stats: {
      totalSubmissions: 42,
      activeCurators: 5,
      communityVotes: 156
    }
  };

  const handleSubmitPhoto = async (submissionData: any) => {
    setIsLoading(true);
    try {
      // Mock submission - in production this would call the API
      console.log('Submitting photo:', submissionData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

      // Add to user submissions
      setUserSubmissions(prev => [...prev, {
        id: Date.now().toString(),
        ...submissionData,
        status: 'pending_review'
      }]);

      // Navigate to gallery after successful submission
      setCurrentView('gallery');
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <CompetitionLanding
            competition={currentCompetition}
            onEnterCompetition={() => setCurrentView('submit')}
            onViewGallery={() => setCurrentView('gallery')}
            onViewResults={() => setCurrentView('results')}
          />
        );

      case 'submit':
        return (
          <SubmissionForm
            themes={COMPETITION_THEMES}
            selectedTheme={selectedTheme}
            onThemeSelect={setSelectedTheme}
            onSubmit={handleSubmitPhoto}
            onBack={() => setCurrentView('landing')}
            isLoading={isLoading}
          />
        );

      case 'gallery':
        return (
          <CompetitionGallery
            competition={currentCompetition}
            onVote={() => setCurrentView('voting')}
            onSubmit={() => setCurrentView('submit')}
            onBack={() => setCurrentView('landing')}
          />
        );

      case 'voting':
        return (
          <VotingInterface
            competition={currentCompetition}
            onBack={() => setCurrentView('gallery')}
          />
        );

      case 'results':
        return (
          <CompetitionResults
            competition={currentCompetition}
            onBack={() => setCurrentView('landing')}
          />
        );
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-in fade-in duration-300" />

        <Dialog.Content className="fixed inset-0 md:inset-auto md:top-[50%] md:left-[50%] md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full h-full md:w-[90vw] md:h-[85vh] md:max-w-[1200px] md:max-h-[800px] bg-white dark:bg-gray-900 md:rounded-2xl shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="relative bg-gradient-to-r from-liberation-pride-purple to-liberation-pride-pink p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    BLKOUT Photo Competition
                  </h2>
                  <p className="text-white/80 text-sm">
                    Capture Liberation • Celebrate Community • Create Change
                  </p>
                </div>
              </div>

              <Dialog.Close className="text-white/80 hover:text-white transition-colors p-2">
                <X className="w-6 h-6" />
              </Dialog.Close>
            </div>

            {/* Navigation Breadcrumbs */}
            {currentView !== 'landing' && (
              <div className="mt-4 flex items-center text-sm text-white/80">
                <button
                  onClick={() => setCurrentView('landing')}
                  className="hover:text-white transition-colors"
                >
                  Competition Home
                </button>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-white capitalize">
                  {currentView === 'submit' ? 'Submit Photo' : currentView}
                </span>
              </div>
            )}
          </div>

          {/* Modal Content */}
          <div className="relative h-[calc(100%-5rem)] md:h-[calc(100%-6rem)] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="min-h-full"
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};