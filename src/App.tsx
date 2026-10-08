/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputStudio } from './components/InputStudio';
import { DiagnosisView } from './components/DiagnosisView';
import { StrategyView } from './components/StrategyView';
import { DraftCards } from './components/DraftCards';
import { BreakdownView } from './components/BreakdownView';
import { PlaybookView } from './components/PlaybookView';
import { EtiquetteView } from './components/EtiquetteView';
import { SavedDraftsView } from './components/SavedDraftsView';
import { 
  CoachingRequest, 
  CoachingResult, 
  SavedDraftItem, 
  ScenarioPreset 
} from './types';
import { SCENARIO_PRESETS } from './data/presets';
import { 
  Sparkles, 
  ArrowDown, 
  GraduationCap, 
  ShieldCheck, 
  RefreshCw, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'coach' | 'playbook' | 'etiquette' | 'saved'>('coach');
  const [selectedPreset, setSelectedPreset] = useState<ScenarioPreset | null>(SCENARIO_PRESETS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [coachingResult, setCoachingResult] = useState<CoachingResult | null>(null);
  const [currentRequest, setCurrentRequest] = useState<CoachingRequest>({
    recipient: 'Professor Smith',
    role: 'Professor',
    courseCode: 'CS 180',
    situation: 'I slept through my alarm and missed the midterm exam. I am panicking and terrified I will fail.',
    roughDraft: 'Prof smith I am so so sorry I missed the exam today I oversleep because my alarm didn\'t go off. Is there any way I can retake it please I need to pass this class.',
    urgency: 'urgent'
  });

  const [savedDrafts, setSavedDrafts] = useState<SavedDraftItem[]>(() => {
    try {
      const stored = localStorage.getItem('say_it_right_saved_drafts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('say_it_right_saved_drafts', JSON.stringify(savedDrafts));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedDrafts]);

  // Run initial coaching on mount for the default scenario so student immediately sees the full 4-step experience!
  useEffect(() => {
    handleCoachingSubmit(currentRequest);
  }, []);

  const handleCoachingSubmit = async (req: CoachingRequest) => {
    setLoading(true);
    setCurrentRequest(req);
    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: req.recipient,
          situation: req.situation,
          roughDraft: req.roughDraft,
          courseCode: req.courseCode,
          urgency: req.urgency,
        }),
      });

      if (!response.ok) {
        throw new Error('Server request failed');
      }

      const data: CoachingResult = await response.json();
      setCoachingResult(data);
    } catch (err) {
      console.error('Coaching request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: ScenarioPreset) => {
    setSelectedPreset(preset);
    const newReq: CoachingRequest = {
      recipient: preset.recipientName,
      role: preset.role,
      courseCode: preset.courseCode,
      situation: preset.situation,
      roughDraft: preset.roughDraft,
      urgency: preset.stressLevel === 'Panicked' ? 'urgent' : preset.stressLevel === 'Stressed' ? 'moderate' : 'calm',
    };
    handleCoachingSubmit(newReq);
  };

  const handleSaveDraft = (item: SavedDraftItem) => {
    setSavedDrafts((prev) => {
      const exists = prev.find((d) => d.subject === item.subject);
      if (exists) return prev;
      return [item, ...prev];
    });
  };

  const handleDeleteDraft = (id: string) => {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearAllDrafts = () => {
    setSavedDrafts([]);
  };

  const isDraftSaved = (subject: string) => {
    return savedDrafts.some((d) => d.subject === subject);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedDrafts.length}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Banner with Warm Reassurance */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              Academic & Professional Etiquette Coach
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              Say what you mean — without the panic or wrong tone.
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-normal">
              When stakes are high, professors don't judge your emergency; they judge how you handle accountability. We coach you through the 4-step transformation: <span className="font-semibold text-amber-300">Diagnosis</span>, <span className="font-semibold text-amber-300">Strategy</span>, <span className="font-semibold text-amber-300">2 Drafts</span>, and the <span className="font-semibold text-amber-300">Psychology Breakdown</span>.
            </p>
          </div>
          {/* Subtle decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-indigo-600/20 to-transparent pointer-events-none hidden md:block"></div>
        </div>

        {/* Tab 1: Email Coach Studio */}
        {activeTab === 'coach' && (
          <div className="space-y-8">
            {/* Input Studio */}
            <section aria-label="Input rough message">
              <InputStudio
                onSubmit={handleCoachingSubmit}
                isLoading={loading}
                selectedPreset={selectedPreset}
                onSelectPreset={handleSelectPreset}
              />
            </section>

            {/* Results Section */}
            {loading && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">
                  Coaching your draft...
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Diagnosing potential misinterpretations, designing optimal tone strategy, and polishing Direct & Contextual drafts.
                </p>
              </div>
            )}

            {!loading && coachingResult && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Visual Step Process Flow Indicator */}
                <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5 text-amber-700">
                    <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[11px] font-bold">1</span>
                    Diagnosis
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                  <div className="flex items-center gap-1.5 text-indigo-700">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-bold">2</span>
                    Strategy
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                  <div className="flex items-center gap-1.5 text-teal-700">
                    <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-[11px] font-bold">3</span>
                    2 Tailored Drafts
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                  <div className="flex items-center gap-1.5 text-purple-700">
                    <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[11px] font-bold">4</span>
                    Psychology Breakdown
                  </div>
                </div>

                {/* Step 1: The Diagnosis */}
                <DiagnosisView diagnosis={coachingResult.diagnosis} />

                {/* Step 2: The Strategy */}
                <StrategyView strategy={coachingResult.strategy} />

                {/* Step 3: The Drafts (2 Options) */}
                <DraftCards
                  drafts={coachingResult.drafts}
                  recipientName={currentRequest.recipient}
                  situation={currentRequest.situation}
                  onSaveDraft={handleSaveDraft}
                  isDraftSaved={isDraftSaved}
                />

                {/* Step 4: The Breakdown (Psychological Anatomy) */}
                <BreakdownView
                  breakdown={coachingResult.breakdown}
                  proTips={coachingResult.proTips}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Playbook View */}
        {activeTab === 'playbook' && (
          <PlaybookView
            onLoadPreset={(preset) => {
              handleSelectPreset(preset);
              setActiveTab('coach');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Tab 3: Etiquette Constitution */}
        {activeTab === 'etiquette' && <EtiquetteView />}

        {/* Tab 4: Saved Drafts */}
        {activeTab === 'saved' && (
          <SavedDraftsView
            savedDrafts={savedDrafts}
            onDeleteDraft={handleDeleteDraft}
            onClearAll={handleClearAllDrafts}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Say It Right</span>
            <span>• Built for university students navigating high-stakes moments</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Non-judgmental mentoring</span>
            <span>•</span>
            <span>Academic etiquette</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
