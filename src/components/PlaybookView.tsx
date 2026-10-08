import React, { useState } from 'react';
import { SCENARIO_PRESETS } from '../data/presets';
import { ScenarioPreset } from '../types';
import { BookOpen, ArrowRight, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PlaybookViewProps {
  onLoadPreset: (preset: ScenarioPreset) => void;
}

export const PlaybookView: React.FC<PlaybookViewProps> = ({ onLoadPreset }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Internal Exams & CIA',
    'On-Duty (OD) & Attendance',
    'Project Guide & Lab',
    'Placements & Recs',
    'Administration & Dean',
  ];

  const filtered =
    selectedCategory === 'All'
      ? SCENARIO_PRESETS
      : SCENARIO_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-blue-50/80 border border-indigo-100 text-gray-900 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold tracking-wider uppercase mb-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>University Communication Playbook</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Master the Highest-Stakes Moments in College Life
        </h2>
        <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
          From requesting emergency On-Duty (OD) attendance for hackathons to explaining missed internals and project review delays. Click any scenario below to auto-load it into the Coach Studio.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
            className="bg-white border border-gray-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all space-y-4"
          >
            <div>
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {preset.category}
                </span>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    preset.stressLevel === 'Panicked'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : preset.stressLevel === 'Stressed'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {preset.stressLevel}
                </span>
              </div>

              {/* Title & Recipient */}
              <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1 leading-snug">
                {preset.title}
              </h3>

              <div className="text-xs text-gray-500 mb-2">
                Recipient: <strong className="text-gray-700">{preset.recipientName}</strong>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                {preset.situation}
              </p>

              {/* Raw Draft Preview */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/70 text-xs text-gray-600 italic">
                "{preset.roughDraft}"
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                {preset.tag}
              </span>

              <button
                onClick={() => onLoadPreset(preset)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Load in Coach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
