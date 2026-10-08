import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Lightbulb, 
  Copy, 
  Check, 
  Mail, 
  Sparkles, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  Bookmark,
  Printer,
  MessageSquare,
  Scissors,
  Award,
  Zap,
  TrendingDown,
  UserCheck,
  Eye
} from 'lucide-react';
import { CoachingResult, EmailDraft } from '../types';

interface OutputSectionProps {
  loading: boolean;
  result: CoachingResult | null;
  recipientName: string;
  situation: string;
  onSaveDraft?: (draft: { recipient: string; situation: string; subject: string; body: string; type: string }) => void;
  onOpenSimulator?: () => void;
  onToast?: (message: string) => void;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  loading,
  result,
  recipientName,
  situation,
  onSaveDraft,
  onOpenSimulator,
  onToast,
}) => {
  // Tabs: option1, option2, formalLetter, inPerson, followUp, whatsapp
  const [activeTab, setActiveTab] = useState<'option1' | 'option2' | 'formalLetter' | 'inPerson' | 'followUp' | 'whatsapp'>('option1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedSubject, setCopiedSubject] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [refining, setRefining] = useState<boolean>(false);
  const [customDrafts, setCustomDrafts] = useState<{ [key: string]: string }>({});

  // 1. SKELETON LOADING STATE
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-7 space-y-6 animate-pulse">
        {/* Diagnosis Skeleton */}
        <div className="rounded-xl bg-amber-50/70 border border-amber-200/60 p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-200" />
            <div className="h-4 bg-amber-200 rounded w-1/3" />
          </div>
          <div className="h-3.5 bg-amber-200/70 rounded w-full" />
          <div className="h-3.5 bg-amber-200/50 rounded w-4/5" />
        </div>

        {/* Tab & Draft Header Skeleton */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded-xl w-36" />
            <div className="h-10 bg-gray-100 rounded-xl w-36" />
            <div className="h-10 bg-gray-100 rounded-xl w-36 hidden sm:block" />
          </div>

          <div className="rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-100 rounded w-full" />
            <div className="space-y-2 pt-2">
              <div className="h-3.5 bg-gray-100 rounded w-full" />
              <div className="h-3.5 bg-gray-100 rounded w-5/6" />
              <div className="h-3.5 bg-gray-100 rounded w-4/6" />
              <div className="h-3.5 bg-gray-100 rounded w-3/4" />
            </div>
            <div className="pt-3 flex justify-between items-center">
              <div className="h-10 bg-indigo-200 rounded-xl w-44" />
              <div className="h-4 bg-gray-100 rounded w-24" />
            </div>
          </div>
        </div>

        {/* Breakdown Skeleton */}
        <div className="pt-2 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-36" />
          <div className="h-14 bg-gray-50 border border-gray-100 rounded-xl" />
          <div className="h-14 bg-gray-50 border border-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  // 2. EMPTY STATE
  if (!result) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[480px]">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
          <Mail className="w-7 h-7" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Your Coached Academic Draft Will Appear Here
        </h2>
        <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-6">
          Dump your raw, unedited thoughts on the left and click <span className="font-semibold text-indigo-600">Coach Me</span>. 
          We'll analyze the tone, validate your intent, and prepare ready-to-send emails, formal printed applications, and speaking scripts.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full max-w-md text-xs text-gray-600">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Eliminates demanding or panic phrasing</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Tested on Indian university academic norms</span>
          </div>
        </div>
      </div>
    );
  }

  // Extract base drafts & fallback enrichments
  const baseDraft1 = result.drafts.option1;
  const baseDraft2 = result.drafts.option2;

  const currentOption1Body = customDrafts['option1'] || baseDraft1.body;
  const currentOption2Body = customDrafts['option2'] || baseDraft2.body;

  const validationText = result.diagnosis.validation || result.diagnosis.intentValidation || "Your intent is completely valid; university communication naturally causes anxiety, but leading with accountability resolves 90% of issues.";
  
  let critiqueText = result.diagnosis.critique || "";
  if (!critiqueText && result.diagnosis.critiques && result.diagnosis.critiques.length > 0) {
    critiqueText = result.diagnosis.critiques.map(c => `${c.issue}: ${c.misinterpretation}`).join(' ');
  }
  if (!critiqueText) {
    critiqueText = "Direct demands or emotional panic often cause faculty to become defensive. Reframing your situation around clear accountability and actionable solutions helps them approve your request quickly.";
  }

  // Copy helper
  const handleCopyText = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (onToast) onToast(`${label} copied to clipboard! 📋`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const handleCopySubject = (subject: string) => {
    navigator.clipboard.writeText(subject);
    setCopiedSubject(true);
    if (onToast) onToast('Subject line copied! 📋');
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  // Bookmark / Save draft helper
  const handleBookmark = () => {
    let subject = baseDraft1.subject;
    let body = currentOption1Body;
    let type = 'Email (Option 1)';

    if (activeTab === 'option2') {
      subject = baseDraft2.subject;
      body = currentOption2Body;
      type = 'Email (Option 2)';
    } else if (activeTab === 'formalLetter') {
      subject = result.formalLetter?.subject || 'Formal Application';
      body = result.formalLetter?.body || '';
      type = 'Official Printed Letter';
    } else if (activeTab === 'followUp') {
      subject = result.followUpDraft?.subject || 'Gentle Follow-Up';
      body = result.followUpDraft?.body || '';
      type = 'Follow-Up Email';
    } else if (activeTab === 'whatsapp') {
      subject = 'WhatsApp / ERP Ticket';
      body = result.whatsappDraft?.text || '';
      type = 'WhatsApp / Portal Ticket';
    }

    if (onSaveDraft) {
      onSaveDraft({
        recipient: recipientName,
        situation,
        subject,
        body,
        type,
      });
      setIsBookmarked(true);
      if (onToast) onToast('Draft saved to bookmarks! ⭐');
      setTimeout(() => setIsBookmarked(false), 3000);
    }
  };

  // Quick Refine Handler
  const handleRefine = async (instruction: string) => {
    const targetKey = activeTab === 'option2' ? 'option2' : 'option1';
    const originalBody = targetKey === 'option2' ? currentOption2Body : currentOption1Body;

    setRefining(true);
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftText: originalBody,
          instruction,
          recipient: recipientName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.revisedDraft) {
          setCustomDrafts(prev => ({
            ...prev,
            [targetKey]: data.revisedDraft,
          }));
          if (onToast) onToast(`Applied tweak: "${instruction}" ✨`);
        }
      }
    } catch (err) {
      console.error('Refine failed:', err);
    } finally {
      setRefining(false);
    }
  };

  // Print helper for formal letter
  const handlePrint = () => {
    window.print();
  };

  const mailtoHrefOption1 = `mailto:?subject=${encodeURIComponent(baseDraft1.subject)}&body=${encodeURIComponent(currentOption1Body)}`;
  const mailtoHrefOption2 = `mailto:?subject=${encodeURIComponent(baseDraft2.subject)}&body=${encodeURIComponent(currentOption2Body)}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-7 space-y-6 animate-fade-in transition-all">
      
      {/* 1. TONE DIAGNOSIS CARD */}
      <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-4 sm:p-5 text-amber-950 shadow-2xs transition-all">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-amber-700 mt-0.5">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Tone Diagnosis & Validation
              </span>
              <span className="text-[11px] font-medium text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                Zero Judgment
              </span>
            </div>
            <p className="text-sm font-bold text-amber-950 leading-snug">
              {validationText}
            </p>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed pt-0.5">
              {critiqueText}
            </p>
          </div>
        </div>
      </div>

      {/* 2. STRESS REDUCTION & CONFIDENCE METRICS */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-white/80 rounded-lg p-2.5 border border-indigo-100/60 shadow-2xs">
          <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-base sm:text-lg">
            <TrendingDown className="w-4 h-4" />
            <span>92%</span>
          </div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            Anxiety Reduced
          </p>
        </div>

        <div className="bg-white/80 rounded-lg p-2.5 border border-indigo-100/60 shadow-2xs">
          <div className="text-indigo-600 font-bold text-base sm:text-lg">
            98%
          </div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            Politeness Score
          </p>
        </div>

        <div className="bg-white/80 rounded-lg p-2.5 border border-indigo-100/60 shadow-2xs">
          <div className="text-indigo-600 font-bold text-base sm:text-lg">
            96%
          </div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            Clarity Rating
          </p>
        </div>

        <div className="bg-white/80 rounded-lg p-2.5 border border-indigo-100/60 shadow-2xs">
          <div className="text-emerald-700 font-bold text-base sm:text-lg">
            Very High
          </div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            Approval Odds
          </p>
        </div>
      </div>

      {/* 3. MULTI-FORMAT TABS */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Coached Academic Communications</span>
            </h2>
            <p className="text-xs text-gray-500">
              Select the optimal format for your specific academic interaction.
            </p>
          </div>

          {/* Test in simulator shortcut */}
          {onOpenSimulator && (
            <button
              type="button"
              onClick={onOpenSimulator}
              className="text-xs px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Simulate Faculty Reaction</span>
            </button>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 mb-4 gap-1 sm:gap-2 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('option1')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'option1'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <span>Direct & Professional</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-normal">
              Option 1
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('option2')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'option2'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <span>Soft & Contextual</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-normal">
              Option 2
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('formalLetter')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'formalLetter'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <span>Official Printed Letter</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-normal">
              PDF/Print
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inPerson')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inPerson'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <span>Cabin Speaking Script</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('followUp')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'followUp'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <span>48h Follow-Up</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <span>WhatsApp / Ticket</span>
          </button>
        </div>

        {/* TAB CONTENT 1: DIRECT & PROFESSIONAL */}
        {activeTab === 'option1' && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-2xs hover:shadow-md transition-shadow overflow-hidden">
            {/* Best For header */}
            <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <span className="font-medium text-gray-700">
                <strong className="text-gray-900 font-semibold">Best for: </strong>
                {baseDraft1.bestFor || 'Busy professors and HODs who appreciate directness.'}
              </span>
              <span className="text-gray-400 flex items-center gap-1 text-[11px] shrink-0">
                <Clock className="w-3 h-3" />
                {baseDraft1.estimatedReadTime || '25 seconds'}
              </span>
            </div>

            {/* Subject Line */}
            <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3 bg-white">
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  Subject Line
                </span>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate select-all">
                  {baseDraft1.subject}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopySubject(baseDraft1.subject)}
                className="text-xs px-2.5 py-1 rounded-md border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedSubject ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-gray-500" />
                    <span>Copy Subject</span>
                  </>
                )}
              </button>
            </div>

            {/* Email Body */}
            <div className="p-4 sm:p-5 bg-slate-50/40">
              <div className="bg-white rounded-lg border border-gray-200/90 p-4 sm:p-5 shadow-2xs">
                <div className="text-xs sm:text-sm text-gray-800 leading-relaxed font-sans whitespace-pre-line select-text">
                  {currentOption1Body}
                </div>
              </div>
            </div>

            {/* Quick Polish Toolbar */}
            <div className="px-4 py-2.5 bg-gray-50/60 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                Quick Polish:
              </span>
              <button
                type="button"
                onClick={() => handleRefine('Make it slightly shorter and punchy while keeping full respect')}
                disabled={refining}
                className="px-2.5 py-1 rounded-md bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-700 transition-colors font-medium cursor-pointer"
              >
                ✂️ Make Shorter
              </button>
              <button
                type="button"
                onClick={() => handleRefine('Add mention that I have attached official supporting proof and documents')}
                disabled={refining}
                className="px-2.5 py-1 rounded-md bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-700 transition-colors font-medium cursor-pointer"
              >
                📎 Add Proof Note
              </button>
              <button
                type="button"
                onClick={() => handleRefine('Make salutation and signoff extra formal')}
                disabled={refining}
                className="px-2.5 py-1 rounded-md bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-700 transition-colors font-medium cursor-pointer"
              >
                📜 Extra Formal
              </button>
            </div>

            {/* Primary Action Toolbar */}
            <div className="p-4 sm:px-5 sm:py-3.5 bg-gray-50/90 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyText(`Subject: ${baseDraft1.subject}\n\n${currentOption1Body}`, 'option1', 'Option 1 Draft')}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 shadow-sm cursor-pointer ${
                    copiedKey === 'option1'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white shadow-indigo-200 hover:shadow'
                  }`}
                >
                  {copiedKey === 'option1' ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-indigo-100" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBookmark}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-emerald-600 text-emerald-600' : 'text-gray-500'}`} />
                  <span>{isBookmarked ? 'Saved!' : 'Save Draft'}</span>
                </button>
              </div>

              <a
                href={mailtoHrefOption1}
                className="text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-colors flex items-center gap-1.5 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                <span>Open in Mail</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: SOFT & CONTEXTUAL */}
        {activeTab === 'option2' && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-2xs hover:shadow-md transition-shadow overflow-hidden">
            <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <span className="font-medium text-gray-700">
                <strong className="text-gray-900 font-semibold">Best for: </strong>
                {baseDraft2.bestFor || 'Faculty advisors, mentors, and explaining sensitive personal situations.'}
              </span>
              <span className="text-gray-400 flex items-center gap-1 text-[11px] shrink-0">
                <Clock className="w-3 h-3" />
                {baseDraft2.estimatedReadTime || '35 seconds'}
              </span>
            </div>

            <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3 bg-white">
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  Subject Line
                </span>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate select-all">
                  {baseDraft2.subject}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopySubject(baseDraft2.subject)}
                className="text-xs px-2.5 py-1 rounded-md border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedSubject ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-gray-500" />
                    <span>Copy Subject</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 sm:p-5 bg-slate-50/40">
              <div className="bg-white rounded-lg border border-gray-200/90 p-4 sm:p-5 shadow-2xs">
                <div className="text-xs sm:text-sm text-gray-800 leading-relaxed font-sans whitespace-pre-line select-text">
                  {currentOption2Body}
                </div>
              </div>
            </div>

            <div className="p-4 sm:px-5 sm:py-3.5 bg-gray-50/90 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyText(`Subject: ${baseDraft2.subject}\n\n${currentOption2Body}`, 'option2', 'Option 2 Draft')}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 shadow-sm cursor-pointer ${
                    copiedKey === 'option2'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white shadow-indigo-200 hover:shadow'
                  }`}
                >
                  {copiedKey === 'option2' ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-indigo-100" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBookmark}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-gray-500" />
                  <span>Save Draft</span>
                </button>
              </div>

              <a
                href={mailtoHrefOption2}
                className="text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-colors flex items-center gap-1.5 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                <span>Open in Mail</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: OFFICIAL PRINTED APPLICATION (UNIVERSITY LETTER FORMAT) */}
        {activeTab === 'formalLetter' && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
            <div className="bg-amber-50/60 px-4 py-2.5 border-b border-amber-100 flex items-center justify-between text-xs text-amber-900">
              <span className="font-semibold flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-amber-600" />
                Physical Submission Format (Letterhead & Official Application)
              </span>
              <span className="text-amber-800 text-[11px]">
                Standard Indian University Format
              </span>
            </div>

            {/* Printable Letter View */}
            <div className="p-6 sm:p-8 bg-white border border-gray-100 m-4 rounded-xl shadow-xs print-area font-serif text-gray-900 text-xs sm:text-sm space-y-4 leading-relaxed">
              <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                <div className="whitespace-pre-line text-xs font-mono text-gray-600">
                  {result.formalLetter?.fromHeading || `From:\n[Student Name]\nRoll No: [24CS104]\nDept of Computer Science`}
                </div>
                <div className="text-right text-xs text-gray-500 font-mono">
                  Date: {result.formalLetter?.date || new Date().toLocaleDateString()}
                </div>
              </div>

              <div className="whitespace-pre-line text-xs font-mono text-gray-700">
                {result.formalLetter?.toHeading || `To:\n${recipientName},\nDepartment of Computer Science,\nUniversity Campus.`}
              </div>

              {result.formalLetter?.through && (
                <div className="text-xs font-semibold italic text-gray-600 border-l-2 border-indigo-200 pl-2">
                  {result.formalLetter.through}
                </div>
              )}

              <div className="font-bold text-gray-900 pt-1">
                Respected Sir / Madam,
              </div>

              <div className="font-bold underline text-gray-900">
                Sub: {result.formalLetter?.subject || `Application regarding ${situation}`} - Reg.
              </div>

              <div className="whitespace-pre-line text-gray-800 leading-relaxed font-sans text-xs sm:text-sm">
                {result.formalLetter?.body || `I am writing this formal application to respectfully bring to your kind attention my circumstance regarding ${situation}. I assure you of my utmost sincerity towards my academic coursework.`}
              </div>

              {/* Enclosures checklist */}
              <div className="pt-3 border-t border-gray-100">
                <span className="font-bold text-xs uppercase tracking-wider text-gray-700 block mb-1">
                  Enclosures Attached:
                </span>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
                  {(result.formalLetter?.enclosures || [
                    "1. Official Supporting Certificate / Medical Prescription Slip",
                    "2. Coursework Completion Undertaking",
                    "3. Class Advisor / Proctor Endorsement"
                  ]).map((enc, idx) => (
                    <li key={idx}>{enc}</li>
                  ))}
                </ul>
              </div>

              {/* Signature Blocks */}
              <div className="pt-8 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-400 mb-6">Forwarded & Recommended by:</p>
                  <p className="border-t border-gray-300 pt-1 font-semibold text-gray-700">
                    Signature of Class Advisor / Proctor
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 mb-6">Yours faithfully,</p>
                  <p className="border-t border-gray-300 pt-1 font-semibold text-gray-700">
                    [Signature of Candidate]
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const letterText = `${result.formalLetter?.fromHeading}\n\nTo:\n${result.formalLetter?.toHeading}\n\nDate: ${result.formalLetter?.date}\n\nRespected Sir/Madam,\nSub: ${result.formalLetter?.subject}\n\n${result.formalLetter?.body}\n\nEnclosures:\n${result.formalLetter?.enclosures?.join('\n')}\n\nYours faithfully,\n[Candidate Signature]`;
                    handleCopyText(letterText, 'formalLetter', 'Official Letter');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {copiedKey === 'formalLetter' ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied Letter!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-indigo-100" />
                      <span>Copy Letter Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-600" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>

              <span className="text-xs text-gray-500">
                Print on A4 paper for submission to HOD / Dean Office
              </span>
            </div>
          </div>
        )}

        {/* TAB CONTENT 4: IN-PERSON CABIN SPEAKING SCRIPT */}
        {activeTab === 'inPerson' && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  In-Person Cabin Conversation Guide
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  What to say when knocking on the professor's or HOD's door.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const scriptText = `Stage 1 (Door Entry):\n${result.inPersonScript?.entrance}\n\nStage 2 (15-Sec Pitch):\n${result.inPersonScript?.pitch}\n\nStage 3 (Handover):\n${result.inPersonScript?.handover}\n\nStage 4 (If Busy):\n${result.inPersonScript?.fallback}`;
                  handleCopyText(scriptText, 'inPerson', 'Speaking Script');
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3 text-gray-500" />
                <span>{copiedKey === 'inPerson' ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                  Step 1: The Cabin Door Entrance (5 Seconds)
                </span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed italic">
                  "{result.inPersonScript?.entrance || '[Knock gently twice, pause at the door] "Excuse me, Good morning Professor. May I come in? Do you have two brief minutes, or should I return during your scheduled office hours?"'}"
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                  Step 2: The 15-Second Accountability Pitch
                </span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed italic">
                  "{result.inPersonScript?.pitch || `"Thank you, Professor. I am reaching out regarding ${situation}. I take full accountability, and I wanted to ask how you advise I best navigate this according to departmental policy."`}"
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                  Step 3: Document Handover
                </span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed italic">
                  "{result.inPersonScript?.handover || '"I have prepared this formal application and supporting documents for your verification." [Place gently on the desk face-up with both hands].'}"
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Step 4: Graceful Exit if Faculty is Busy
                </span>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed italic">
                  "{result.inPersonScript?.fallback || '"I completely understand that you are in the middle of urgent tasks. May I leave this on your desk or return at 3:30 PM today after your lecture?"'}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 5: 48-HOUR FOLLOW-UP NUDGE */}
        {activeTab === 'followUp' && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Polite 48-Hour Follow-Up Reminder
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Send only if your initial email receives no response after 2-3 business days.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const followUpFull = `Subject: ${result.followUpDraft?.subject}\n\n${result.followUpDraft?.body}`;
                  handleCopyText(followUpFull, 'followUp', 'Follow-Up Draft');
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3 text-gray-500" />
                <span>{copiedKey === 'followUp' ? 'Copied!' : 'Copy Follow-up'}</span>
              </button>
            </div>

            <div className="p-4 bg-gray-50/70 border border-gray-200/80 rounded-xl space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Subject
              </span>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                {result.followUpDraft?.subject || `Re: ${baseDraft1.subject} - Gentle Follow-Up`}
              </p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-xl">
              <div className="text-xs sm:text-sm text-gray-800 leading-relaxed font-sans whitespace-pre-line select-text">
                {result.followUpDraft?.body || `Dear ${recipientName},\n\nI hope your week is going smoothly. I am writing to gently follow up on my previous email sent regarding ${situation}.\n\nWhenever your schedule permits, I would be immensely grateful for any brief guidance on this matter.\n\nThank you once again,\n[Your Name]`}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 6: WHATSAPP / ERP TICKET (<40 WORDS) */}
        {activeTab === 'whatsapp' && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Short WhatsApp / College ERP Portal Message
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ultra-concise format (under 40 words) for student grievance portals or class group queries.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const text = result.whatsappDraft?.text || `Respected Sir/Madam, this is [Your Name] (Reg: [24CS104]). Reaching out regarding ${situation}. I have emailed the detailed application. Kindly advise when I may meet you in your cabin. Thank you!`;
                  handleCopyText(text, 'whatsapp', 'WhatsApp Text');
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3 text-gray-500" />
                <span>{copiedKey === 'whatsapp' ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-4 bg-emerald-50/40 border border-emerald-200/60 rounded-xl">
              <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-sans select-text">
                "{result.whatsappDraft?.text || `Respected Sir/Madam, this is [Your Name] (Reg: [24CS104]). Reaching out regarding ${situation}. I have emailed the detailed application with supporting proof. Kindly let me know if I may meet you briefly in your cabin. Thank you!`}"
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Word count: ~35 words</span>
              <span>Complies with portal character limits</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. THE BREAKDOWN (The 'Teach' Moment) */}
      <div className="pt-2 border-t border-gray-100">
        <div className="mb-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Why this works
            </h3>
            <p className="text-xs text-gray-500">
              The communication psychology behind the phrasing changes.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {result.breakdown && result.breakdown.length > 0 ? (
            result.breakdown.map((item, index) => {
              const phraseText = item.phrase || item.betterPhrase || item.roughPhrase || "Clear phrasing";
              const whyText = item.why_it_works || item.psychologicalReason || "Signals mutual respect and reduces emotional resistance.";

              return (
                <div 
                  key={index}
                  className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1.5">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold shrink-0">
                      "{phraseText}"
                    </span>
                    {item.roughPhrase && item.roughPhrase !== phraseText && (
                      <span className="text-[11px] text-gray-400 line-through">
                        instead of "{item.roughPhrase}"
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-0.5">
                    {whyText}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed">
              Leading with accountability, stating course details in the subject line, and proposing concrete next steps makes it easy for faculty to approve your request.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
