import React, { useState } from 'react';
import { SCENARIO_PRESETS } from '../data/presets';
import { ScenarioPreset } from '../types';
import { BookOpen, Sparkles, ArrowRight, Zap, ShieldAlert, Award } from 'lucide-react';

interface PlaybookViewProps {
  onLoadPreset: (preset: ScenarioPreset) => void;
}

export const PlaybookView: React.FC<PlaybookViewProps> = ({ onLoadPreset }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Exams & Grades',
    'Deadlines & Absence',
    'Opportunities & Recs',
    'Interpersonal & Teams',
  ];

  const filtered =
    selectedCategory === 'All'
      ? SCENARIO_PRESETS
      : SCENARIO_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          University Email Playbook
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
          Master the Hardest Moments in College Communication
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          From sleeping through an 8 AM midterm to negotiating a grade or asking for a letter of recommendation out of the blue. Click any scenario below to load it into the Coach Studio.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((preset) => (
          <div
            key={preset.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {preset.category}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    preset.stressLevel === 'Panicked'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : preset.stressLevel === 'Stressed'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {preset.stressLevel}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                {preset.title}
              </h3>

              <div className="text-xs text-slate-500 mb-3 font-medium">
                <span className="font-semibold text-slate-700">To:</span> {preset.recipientName} ({preset.role}) • {preset.courseCode}
              </div>

              {/* Rough Draft Snippet */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs font-mono text-slate-600 line-clamp-2 italic">
                "{preset.roughDraft}"
              </div>
            </div>

            <button
              onClick={() => onLoadPreset(preset)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-800 text-xs font-bold transition-all shadow-xs"
            >
              <span>Load into Coach & Solve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
