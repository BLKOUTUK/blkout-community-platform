// BLKOUT Board Navigation Hub
// Main navigation between board management features

import React from 'react';
import {
  Calendar,
  FileText,
  Vote,
  CheckSquare,
  Users,
  Clock,
  BookOpen,
  Shield
} from 'lucide-react';
import BoardPortalDashboard from './BoardPortalDashboard';
import MeetingScheduler from './MeetingScheduler';
import MeetingAgenda from './MeetingAgenda';
import MinutesEditor from './MinutesEditor';
import ActionTracker from './ActionTracker';
import ProposalForm from './ProposalForm';
import BoardVotingInterface from './BoardVotingInterface';
import DecisionRegister from './DecisionRegister';

type BoardView = 'dashboard' | 'schedule' | 'agenda' | 'minutes' | 'actions' | 'propose' | 'vote' | 'decisions';

export default function BoardNavigationHub() {
  const [activeView, setActiveView] = React.useState<BoardView>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <BoardPortalDashboard />;
      case 'schedule':
        return <MeetingScheduler />;
      case 'agenda':
        return <MeetingAgenda />;
      case 'minutes':
        return <MinutesEditor />;
      case 'actions':
        return <ActionTracker />;
      case 'propose':
        return <ProposalForm />;
      case 'vote':
        return <BoardVotingInterface />;
      case 'decisions':
        return <DecisionRegister />;
      default:
        return <BoardPortalDashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'schedule', label: 'Schedule Meeting', icon: Calendar },
    { id: 'agenda', label: 'Build Agenda', icon: BookOpen },
    { id: 'minutes', label: 'Minutes', icon: FileText },
    { id: 'actions', label: 'Actions', icon: CheckSquare },
    { id: 'propose', label: 'New Proposal', icon: Vote },
    { id: 'vote', label: 'Vote', icon: Vote },
    { id: 'decisions', label: 'Decision Register', icon: BookOpen }
  ];

  return (
    <div className="space-y-6">
      {/* Board Navigation */}
      <div className="bg-liberation-black-power/50 border border-liberation-gold-divine/20 rounded-xl p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as BoardView)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeView === item.id
                    ? 'bg-liberation-gold-divine text-liberation-black-power'
                    : 'bg-white/5 text-liberation-silver hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active View */}
      {renderView()}
    </div>
  );
}
