import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Compass, 
  Bookmark, 
  Eye, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'coach' | 'playbook' | 'etiquette' | 'saved';
  setActiveTab: (tab: 'coach' | 'playbook' | 'etiquette' | 'saved') => void;
  savedCount: number;
  onOpenSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenSimulator,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div 
          onClick={() => setActiveTab('coach')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                Say It Right
              </span>
              <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                AI Coach
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">
              Calm, respectful communication for university students
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="flex items-center bg-gray-100/80 p-1 rounded-xl text-xs font-semibold text-gray-600">
            <button
              type="button"
              onClick={() => setActiveTab('coach')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'coach'
                  ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Coach
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('playbook')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer hidden md:block ${
                activeTab === 'playbook'
                  ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Playbook
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('etiquette')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer hidden md:block ${
                activeTab === 'etiquette'
                  ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Etiquette
            </button>

            {savedCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'saved'
                    ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>Saved</span>
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              </button>
            )}
          </nav>

          {/* Perspective Simulator Modal trigger */}
          <button
            type="button"
            onClick={onOpenSimulator}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-2xs"
            title="Preview how a busy professor reads this email on mobile"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Inbox View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
