import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  UserCheck, 
  GraduationCap, 
  AlertTriangle, 
  Zap, 
  Flame,
  CheckCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { CoachingRequest, RecipientRole, ScenarioPreset } from '../types';
import { SCENARIO_PRESETS } from '../data/presets';
import { scanRoughDraft } from '../utils/toneScanner';

interface InputStudioProps {
  onSubmit: (request: CoachingRequest) => void;
  isLoading: boolean;
  selectedPreset: ScenarioPreset | null;
  onSelectPreset: (preset: ScenarioPreset) => void;
}

const RECIPIENT_ROLES: RecipientRole[] = [
  'Professor',
  'Teaching Assistant (TA)',
  'Academic Advisor',
  'Research PI / Lab Director',
  'Campus Recruiter / Hiring Manager',
  'Group Project Teammate',
];

export const InputStudio: React.FC<InputStudioProps> = ({
  onSubmit,
  isLoading,
  selectedPreset,
  onSelectPreset,
}) => {
  const [recipient, setRecipient] = useState<string>('Professor Smith');
  const [role, setRole] = useState<RecipientRole>('Professor');
  const [courseCode, setCourseCode] = useState<string>('CS 180');
  const [situation, setSituation] = useState<string>(
    'I slept through my alarm and missed the midterm exam. I am panicking and terrified I will fail.'
  );
  const [roughDraft, setRoughDraft] = useState<string>(
    'Prof smith I am so so sorry I missed the exam today I oversleep because my alarm didn\'t go off. Is there any way I can retake it please I need to pass this class.'
  );
  const [urgency, setUrgency] = useState<'urgent' | 'moderate' | 'calm'>('urgent');

  // Real-time tone scanner
  const toneWarnings = scanRoughDraft(roughDraft);

  const handleApplyPreset = (preset: ScenarioPreset) => {
    onSelectPreset(preset);
    setRecipient(preset.recipientName);
    setRole(preset.role);
    setCourseCode(preset.courseCode);
    setSituation(preset.situation);
    setRoughDraft(preset.roughDraft);
    if (preset.stressLevel === 'Panicked') setUrgency('urgent');
    else if (preset.stressLevel === 'Stressed') setUrgency('moderate');
    else setUrgency('calm');
  };

  const handleClear = () => {
    setRecipient('');
    setCourseCode('');
    setSituation('');
    setRoughDraft('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !situation.trim() || !roughDraft.trim()) return;

    onSubmit({
      recipient,
      role,
      courseCode,
      situation,
      roughDraft,
      urgency,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
      {/* Quick Scenario Preset Chips */}
      <div className="mb-6 pb-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Quick University Situations:
          </span>
          <span className="text-xs text-indigo-600 font-semibold hidden sm:inline">
            Click to load realistic student drafts
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SCENARIO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedPreset?.id === preset.id
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-xs ring-1 ring-indigo-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Role, Recipient Name & Course Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Recipient Role */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Recipient Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RecipientRole)}
              className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {RECIPIENT_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Recipient Name / Title
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Professor Smith"
              required
              className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Course Code & Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Course / Context <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="e.g. CS 180 (Sec 02)"
              className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Situation */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              The Situation <span className="text-slate-400 font-normal">(What happened & what do you actually need?)</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">Be totally honest here</span>
          </div>
          <input
            type="text"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g. I slept through my alarm and missed the midterm. I am panicking."
            required
            className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Row 3: Rough Draft Textarea with Live Tone Scanner */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Rough Draft <span className="text-slate-400 font-normal">(The raw message you almost sent)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                {roughDraft.length} chars
              </span>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={roughDraft}
              onChange={(e) => setRoughDraft(e.target.value)}
              placeholder="Type your unfiltered message here: what you feel, what you're worried about..."
              required
              className="w-full text-sm font-sans bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Real-time Tone Scanner Feedback Chips */}
          {toneWarnings.length > 0 && (
            <div className="mt-2.5 bg-amber-50/80 border border-amber-200 rounded-xl p-3">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Live Tone Radar: Potential friction points detected
              </div>
              <div className="space-y-1.5">
                {toneWarnings.map((w, idx) => (
                  <div key={idx} className="text-xs text-amber-950 flex items-start gap-1.5">
                    <span className="font-semibold px-1.5 py-0.2 rounded bg-amber-200/70 text-amber-900 text-[11px] shrink-0">
                      {w.keyword}
                    </span>
                    <span>
                      {w.message}{' '}
                      <span className="text-amber-800 font-medium">({w.suggestion})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Row 4: Urgency / Panic Tag & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          {/* Stress Level Radio Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stress Level:
            </span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setUrgency('urgent')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  urgency === 'urgent'
                    ? 'bg-red-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Panicked 😰
              </button>
              <button
                type="button"
                onClick={() => setUrgency('moderate')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  urgency === 'moderate'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Stressed 😫
              </button>
              <button
                type="button"
                onClick={() => setUrgency('calm')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  urgency === 'calm'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Calm Inquiry 🙂
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs px-3 py-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-medium transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              type="submit"
              disabled={isLoading || !roughDraft.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white shadow-md shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Mentoring & Rewriting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Coach My Message</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
