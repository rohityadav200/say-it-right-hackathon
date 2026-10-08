/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { PlaybookView } from './components/PlaybookView';
import { EtiquetteView } from './components/EtiquetteView';
import { SavedDraftsView } from './components/SavedDraftsView';
import { ProfessorInboxSimulator } from './components/ProfessorInboxSimulator';
import { 
  CoachingRequest, 
  CoachingResult, 
  SavedDraftItem, 
  ScenarioPreset 
} from './types';
import { SCENARIO_PRESETS } from './data/presets';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'coach' | 'playbook' | 'etiquette' | 'saved'>('coach');
  const [loading, setLoading] = useState<boolean>(false);
  const [coachingResult, setCoachingResult] = useState<CoachingResult | null>(null);
  const [showSimulatorModal, setShowSimulatorModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states initialized with realistic Indian academic context
  const [recipient, setRecipient] = useState<string>('Dr. Radhika Sundaram (Course In-Charge)');
  const [situation, setSituation] = useState<string>('Missed Continuous Internal Assessment (CIA-1) exam due to high viral fever');
  const [roughDraft, setRoughDraft] = useState<string>(
    "Respected Madam, I am so sorry I missed CIA exam yesterday because I had severe fever and had to visit the clinic. Can I please get a re-test? I am really worried about losing my internal marks and grade."
  );

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

  // Initial load: generate initial coaching for quick immediate feedback
  useEffect(() => {
    executeCoaching(recipient, situation, roughDraft);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(prev => (prev === message ? null : prev));
    }, 2800);
  };

  const executeCoaching = async (rec: string, sit: string, rough: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: rec,
          situation: sit,
          roughDraft: rough,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCoaching(recipient, situation, roughDraft);
  };

  const handleSelectQuickExample = (example: { recipient: string; situation: string; roughDraft: string }) => {
    setRecipient(example.recipient);
    setSituation(example.situation);
    setRoughDraft(example.roughDraft);
    showToast(`Loaded scenario: ${example.situation.slice(0, 36)}...`);
    executeCoaching(example.recipient, example.situation, example.roughDraft);
  };

  const handleSelectPlaybookPreset = (preset: ScenarioPreset) => {
    setRecipient(preset.recipientName);
    setSituation(preset.situation);
    setRoughDraft(preset.roughDraft);
    setActiveTab('coach');
    showToast(`Loaded playbook: ${preset.title}`);
    executeCoaching(preset.recipientName, preset.situation, preset.roughDraft);
  };

  const handleSaveDraft = (draft: { recipient: string; situation: string; subject: string; body: string; type: string }) => {
    const newItem: SavedDraftItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      recipient: draft.recipient,
      situation: draft.situation,
      subject: draft.subject,
      chosenDraft: draft.body,
      type: draft.type,
    };
    setSavedDrafts(prev => [newItem, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedDrafts.length}
        onOpenSimulator={() => setShowSimulatorModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'coach' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (Input Section) */}
            <div className="lg:col-span-5 sticky lg:top-24">
              <InputSection
                recipient={recipient}
                setRecipient={setRecipient}
                situation={situation}
                setSituation={setSituation}
                roughDraft={roughDraft}
                setRoughDraft={setRoughDraft}
                loading={loading}
                onSubmit={handleSubmit}
                onSelectQuickExample={handleSelectQuickExample}
              />
            </div>

            {/* Right Column (Output Section) */}
            <div className="lg:col-span-7">
              <OutputSection
                loading={loading}
                result={coachingResult}
                recipientName={recipient}
                situation={situation}
                onSaveDraft={handleSaveDraft}
                onOpenSimulator={() => setShowSimulatorModal(true)}
                onToast={showToast}
              />
            </div>
          </div>
        )}

        {activeTab === 'playbook' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Common Academic Situations</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tested strategies for requests like attendance exemption, recommendations, and lab access.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('coach')}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium cursor-pointer"
              >
                Back to Coach
              </button>
            </div>
            <PlaybookView
              onLoadPreset={handleSelectPlaybookPreset}
            />
          </div>
        )}

        {activeTab === 'etiquette' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Academic Hierarchy & Etiquette</h2>
                <p className="text-sm text-gray-500 mt-1">
                  How university leadership, department chairs, and faculty interpret titles, tone, and timing.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('coach')}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium cursor-pointer"
              >
                Back to Coach
              </button>
            </div>
            <EtiquetteView />
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Saved Drafts</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Your bookmarked letters and email templates.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('coach')}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium cursor-pointer"
              >
                Back to Coach
              </button>
            </div>
            <SavedDraftsView
              savedDrafts={savedDrafts}
              onDeleteDraft={(id: string) => setSavedDrafts(prev => prev.filter(d => d.id !== id))}
              onClearAll={() => setSavedDrafts([])}
              onGoToCoach={() => setActiveTab('coach')}
            />
          </div>
        )}
      </main>

      {/* Professor Inbox Simulator Modal */}
      {showSimulatorModal && coachingResult && (
        <ProfessorInboxSimulator
          request={{
            recipient,
            role: 'Professor / Faculty',
            situation,
            roughDraft,
            urgency: 'moderate',
          }}
          result={coachingResult}
          onClose={() => setShowSimulatorModal(false)}
        />
      )}

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up pointer-events-none">
          <div className="px-4 py-2.5 rounded-full bg-gray-900/95 text-white text-xs sm:text-sm font-medium shadow-xl flex items-center gap-2 backdrop-blur-md border border-gray-700/50">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            Say It Right · Built to reduce university communication anxiety and build student-faculty rapport.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini AI Coach Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
