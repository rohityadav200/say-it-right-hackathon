import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  ExternalLink, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Edit3, 
  Sparkles, 
  Clock, 
  Mail, 
  RefreshCw, 
  Send,
  Columns,
  Maximize2,
  FileText
} from 'lucide-react';
import { Drafts, EmailDraft, SavedDraftItem } from '../types';

interface DraftCardsProps {
  drafts: Drafts;
  recipientName: string;
  situation: string;
  onSaveDraft: (draftItem: SavedDraftItem) => void;
  isDraftSaved: (subject: string) => boolean;
}

export const DraftCards: React.FC<DraftCardsProps> = ({
  drafts,
  recipientName,
  situation,
  onSaveDraft,
  isDraftSaved,
}) => {
  const [selectedOption, setSelectedOption] = useState<'option1' | 'option2'>('option1');
  const [viewMode, setViewMode] = useState<'tabs' | 'compare'>('tabs');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSpeakingOption, setIsSpeakingOption] = useState<string | null>(null);
  
  const [editableBodies, setEditableBodies] = useState<{ [key: string]: string }>({
    option1: drafts.option1.body,
    option2: drafts.option2.body,
  });
  
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [refiningOption, setRefiningOption] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(null);
      }, 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleCopyEmail = (draft: EmailDraft, optionKey: string, includeSubject = true) => {
    const body = editableBodies[optionKey] || draft.body;
    const textToCopy = includeSubject
      ? `Subject: ${draft.subject}\n\n${body}`
      : body;
    copyToClipboard(textToCopy, `${optionKey}-clipboard`);
  };

  const handleOpenMailClient = (draft: EmailDraft, optionKey: string) => {
    const body = editableBodies[optionKey] || draft.body;
    const subject = encodeURIComponent(draft.subject);
    const bodyEncoded = encodeURIComponent(body);
    window.location.href = `mailto:?subject=${subject}&body=${bodyEncoded}`;
  };

  const handleSave = (draft: EmailDraft, optionKey: string) => {
    const body = editableBodies[optionKey] || draft.body;
    const item: SavedDraftItem = {
      id: `${Date.now()}-${optionKey}`,
      timestamp: Date.now(),
      recipient: recipientName,
      situation: situation,
      subject: draft.subject,
      chosenDraft: body,
      type: draft.title,
    };
    onSaveDraft(item);
  };

  const handleSpeak = (bodyText: string, optionKey: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingOption === optionKey) {
      window.speechSynthesis.cancel();
      setIsSpeakingOption(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(bodyText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingOption(null);
    utterance.onerror = () => setIsSpeakingOption(null);
    setIsSpeakingOption(optionKey);
    window.speechSynthesis.speak(utterance);
  };

  const handleQuickRefine = async (optionKey: string, instruction: string) => {
    setRefiningOption(optionKey);
    const currentBody = editableBodies[optionKey] || (optionKey === 'option1' ? drafts.option1.body : drafts.option2.body);
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftText: currentBody,
          instruction,
          recipient: recipientName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.revisedDraft) {
          setEditableBodies((prev) => ({
            ...prev,
            [optionKey]: data.revisedDraft,
          }));
        }
      }
    } catch (err) {
      console.error('Refine failed', err);
    } finally {
      setRefiningOption(null);
    }
  };

  const renderSingleDraftCard = (
    draft: EmailDraft,
    optionKey: 'option1' | 'option2',
    isCompact = false
  ) => {
    const currentBody = editableBodies[optionKey] || draft.body;
    const isEditing = editingOption === optionKey;
    const isRefining = refiningOption === optionKey;
    const isSaved = isDraftSaved(draft.subject);
    const isCopied = copiedKey === `${optionKey}-clipboard`;
    const wordCount = currentBody.trim().split(/\s+/).filter(Boolean).length;

    return (
      <div 
        key={optionKey}
        className={`border rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between transition-all ${
          optionKey === 'option1'
            ? 'border-indigo-200 ring-1 ring-indigo-100'
            : 'border-emerald-200 ring-1 ring-emerald-100'
        }`}
      >
        {/* Top Info Banner */}
        <div className="bg-slate-50/90 border-b border-slate-200 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider ${
                optionKey === 'option1'
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              {draft.title}
            </span>
            <span className="text-xs text-slate-600 font-medium hidden md:inline">
              <span className="font-semibold text-slate-800">Best for:</span> {draft.bestFor}
            </span>
          </div>

          {/* Prominent Direct 'Copy to Clipboard' Button at the Top */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => handleCopyEmail(draft, optionKey, true)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs ${
                isCopied
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400'
              }`}
              title="Copy subject and body to clipboard"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email Header Bar */}
        <div className="bg-white border-b border-slate-100 p-3.5 space-y-2 text-xs">
          {/* Recipient */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400 w-16">To:</span>
              <span className="font-medium text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                {recipientName || 'Recipient'}
              </span>
            </div>
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>~{wordCount} words ({draft.estimatedReadTime || '25s read'})</span>
            </div>
          </div>

          {/* Subject Line with dedicated copy */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="font-semibold text-slate-400 w-16 shrink-0">Subject:</span>
              <span className="font-semibold text-slate-900 truncate">
                {draft.subject}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(draft.subject, `${optionKey}-subject`)}
              className="shrink-0 flex items-center gap-1 text-slate-500 hover:text-indigo-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-medium transition-colors"
              title="Copy subject line only"
            >
              {copiedKey === `${optionKey}-subject` ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Subject Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Subject</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-4 sm:p-5 relative flex-1 bg-white">
          {isEditing ? (
            <textarea
              value={currentBody}
              onChange={(e) =>
                setEditableBodies((prev) => ({
                  ...prev,
                  [optionKey]: e.target.value,
                }))
              }
              rows={isCompact ? 12 : 10}
              className="w-full text-sm font-sans leading-relaxed text-slate-800 border border-indigo-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          ) : (
            <div className="text-sm font-sans text-slate-800 whitespace-pre-wrap leading-relaxed select-text font-normal">
              {currentBody}
            </div>
          )}

          {isRefining && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center gap-2 text-indigo-700 font-semibold text-sm rounded-lg">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Refining draft with academic coach...
            </div>
          )}
        </div>

        {/* Quick Refine Toolbar */}
        <div className="bg-slate-50/70 border-t border-slate-200/80 p-2.5 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 pl-1 text-[11px]">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Tweak:
          </span>
          <button
            onClick={() => handleQuickRefine(optionKey, 'Make it even more concise, removing any unnecessary wordiness.')}
            disabled={isRefining}
            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-medium transition-colors"
          >
            Trim length
          </button>
          <button
            onClick={() => handleQuickRefine(optionKey, 'Add a clear request to attend upcoming office hours.')}
            disabled={isRefining}
            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-medium transition-colors"
          >
            + Office hours
          </button>
          <button
            onClick={() => handleQuickRefine(optionKey, 'Include a polite reference to syllabus guidelines.')}
            disabled={isRefining}
            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-medium transition-colors"
          >
            + Syllabus
          </button>
        </div>

        {/* Bottom Action Footer with Primary 'Copy to Clipboard' Button */}
        <div className="bg-slate-100/90 border-t border-slate-200 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5">
            {/* Customize / Edit */}
            <button
              onClick={() => setEditingOption(isEditing ? null : optionKey)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                isEditing
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done' : 'Edit'}</span>
            </button>

            {/* Listen / Voice Readout */}
            {'speechSynthesis' in window && (
              <button
                onClick={() => handleSpeak(currentBody, optionKey)}
                className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                  isSpeakingOption === optionKey
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Hear how calm and respectful this email sounds"
              >
                {isSpeakingOption === optionKey ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            )}

            {/* Save to Drafts */}
            <button
              onClick={() => handleSave(draft, optionKey)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                isSaved
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary 'Copy to Clipboard' Button */}
            <button
              onClick={() => handleCopyEmail(draft, optionKey, true)}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg font-bold shadow-xs transition-all ${
                isCopied
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              title="Copy complete email with subject line to clipboard"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>

            {/* Open in Mail Client */}
            <button
              onClick={() => handleOpenMailClient(draft, optionKey)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
              title="Open draft directly in your default mail app"
            >
              <Send className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Open Mail</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 font-bold flex items-center justify-center text-sm border border-teal-500/20">
            03
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              The Drafts
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                2 Tailored Options
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Click <span className="font-semibold text-slate-800">"Copy to Clipboard"</span> on any draft to paste directly into Gmail, Outlook, or your campus webmail.
            </p>
          </div>
        </div>

        {/* View Mode & Option Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Toggle between Side-by-Side compare and Tab view */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('tabs')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'tabs'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Focus on one option at a time"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tabs</span>
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'compare'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Compare Option 1 and Option 2 side-by-side"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
          </div>

          {viewMode === 'tabs' && (
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedOption('option1')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedOption === 'option1'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Direct & Professional
              </button>
              <button
                onClick={() => setSelectedOption('option2')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedOption === 'option2'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Soft & Contextual
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drafts Layout */}
      {viewMode === 'compare' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {renderSingleDraftCard(drafts.option1, 'option1', true)}
          {renderSingleDraftCard(drafts.option2, 'option2', true)}
        </div>
      ) : (
        <div>
          {selectedOption === 'option1'
            ? renderSingleDraftCard(drafts.option1, 'option1', false)
            : renderSingleDraftCard(drafts.option2, 'option2', false)}
        </div>
      )}
    </div>
  );
};
