import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Zap, 
  RotateCcw,
  CheckCircle2,
  Mic, 
  MicOff,
  ArrowRight,
  User,
  BookMarked,
  Info
} from 'lucide-react';
import { CoachingRequest, RecipientRole, ScenarioPreset } from '../types';
import { SCENARIO_PRESETS } from '../data/presets';
import { scanRoughDraft } from '../utils/toneScanner';

interface InputStudioProps {
  onSubmit: (request: CoachingRequest) => void;
  isLoading: boolean;
  selectedPreset: ScenarioPreset | null;
  onSelectPreset: (preset: ScenarioPreset) => void;
  onOpenSimulator?: () => void;
}

const RECIPIENT_ROLES: RecipientRole[] = [
  'HOD (Head of Department)',
  'Professor / Faculty',
  'Project Guide / Research Supervisor',
  'Placement Officer (TPO)',
  'Dean of Academic Affairs',
  'Teaching Assistant / Lab Incharge',
  'Group Project Teammate',
];

export const InputStudio: React.FC<InputStudioProps> = ({
  onSubmit,
  isLoading,
  selectedPreset,
  onSelectPreset,
}) => {
  const [recipient, setRecipient] = useState<string>('Dr. T. Chithralekha (HOD)');
  const [role, setRole] = useState<RecipientRole>('HOD (Head of Department)');
  const [courseCode, setCourseCode] = useState<string>('Dept of Computer Science · Reg: 24PUCS042');
  const [situation, setSituation] = useState<string>(
    'I have been selected for the 8-Hour Build With AI Hackathon at Pondicherry University today. I need On-Duty (OD) attendance approval for 2 lab sessions.'
  );
  const [roughDraft, setRoughDraft] = useState<string>(
    'Respected madam, I am participating in hackathon today so please give me OD attendance for compiler lab. Kindly do the needful asap madam.'
  );
  const [urgency, setUrgency] = useState<'urgent' | 'moderate' | 'calm'>('urgent');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [showToneDetails, setShowToneDetails] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setRoughDraft((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!recipient.trim() || !situation.trim() || !roughDraft.trim() || isLoading) return;

    onSubmit({
      recipient,
      role,
      courseCode,
      situation,
      roughDraft,
      urgency,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-5 sm:p-7 relative overflow-hidden transition-all">
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1-Click Quick Preset Chips */}
      <div className="mb-5 pb-4 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick Scenarios
          </span>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Click any template to auto-populate
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SCENARIO_PRESETS.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                }`}
              >
                <span>{preset.tag || preset.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {/* Recipient Details Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Recipient Role */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-cyan-400" />
              Recipient Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RecipientRole)}
              className="w-full text-xs sm:text-sm font-medium bg-slate-800/90 border border-slate-700/90 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            >
              {RECIPIENT_ROLES.map((r) => (
                <option key={r} value={r} className="bg-slate-900 text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Recipient Name / Title
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Dr. T. Chithralekha (HOD)"
              required
              className="w-full text-xs sm:text-sm font-medium bg-slate-800/90 border border-slate-700/90 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          {/* Department / Course / Roll Number */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <BookMarked className="w-3 h-3 text-indigo-400" />
              Dept / Reg No. / Course
            </label>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="e.g. Dept of CSE · Reg: 24PUCS042"
              className="w-full text-xs sm:text-sm font-medium bg-slate-800/90 border border-slate-700/90 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* Situation Input */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>The Situation / Goal</span>
            <span className="text-[10px] text-slate-500 font-normal">What happened & what you need</span>
          </label>
          <input
            type="text"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g. Selected for AI Hackathon today; need On-Duty (OD) attendance for lab sessions."
            required
            className="w-full text-xs sm:text-sm font-medium bg-slate-800/90 border border-slate-700/90 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>

        {/* Rough Draft Textarea with Live Tone Radar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Your Rough Draft</span>
              <span className="text-[10px] text-slate-500 font-normal">(Raw thoughts or what you'd casually say)</span>
            </label>

            <div className="flex items-center gap-2">
              {/* Voice Dictation Button */}
              {('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-400/50'
                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Speak draft"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3 h-3" />
                      <span>Listening...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3 text-cyan-400" />
                      <span>Voice</span>
                    </>
                  )}
                </button>
              )}

              <span className="text-slate-500 font-mono text-[11px]">
                {roughDraft.length} chars
              </span>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={roughDraft}
              onChange={(e) => setRoughDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Respected madam, I am participating in hackathon today so please give me OD attendance asap madam."
              required
              className="w-full text-xs sm:text-sm font-sans bg-slate-800/90 border border-slate-700/90 rounded-xl p-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all leading-relaxed"
            />
          </div>

          {/* Simple, Non-Intrusive Live Tone Radar Pill */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            {toneWarnings.length > 0 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowToneDetails(!showToneDetails)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tone Radar: {toneWarnings.length} friction trigger{toneWarnings.length > 1 ? 's' : ''} detected</span>
                  <span className="text-[10px] underline ml-1">{showToneDetails ? 'Hide' : 'Inspect'}</span>
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium text-emerald-400/90">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tone Radar: No high-stress triggers found</span>
              </div>
            )}

            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Press ⌘+Enter to polish
            </span>
          </div>

          {/* Expandable Tone Radar Details */}
          {showToneDetails && toneWarnings.length > 0 && (
            <div className="mt-2.5 border border-amber-500/30 bg-amber-500/10 rounded-xl p-3 text-xs space-y-2">
              <div className="font-bold text-amber-300 flex items-center justify-between">
                <span>Identified High-Friction Words:</span>
              </div>
              <div className="space-y-1.5 pt-1 border-t border-amber-500/20">
                {toneWarnings.map((w, idx) => (
                  <div key={idx} className="text-amber-100 flex items-start gap-2">
                    <span className="font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30 shrink-0">
                      "{w.keyword}"
                    </span>
                    <span className="text-xs">
                      {w.message} — <span className="text-amber-200 font-semibold">{w.suggestion}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Urgency Pill & Submission Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-800">
          {/* Stress Level Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Urgency:
            </span>
            <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
              <button
                type="button"
                onClick={() => setUrgency('urgent')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  urgency === 'urgent'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Urgent ⚡
              </button>
              <button
                type="button"
                onClick={() => setUrgency('moderate')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  urgency === 'moderate'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Moderate
              </button>
              <button
                type="button"
                onClick={() => setUrgency('calm')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  urgency === 'calm'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Calm
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-semibold transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              type="submit"
              disabled={isLoading || !roughDraft.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Polishing Email...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Polish My Email</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-200 hidden sm:inline" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
