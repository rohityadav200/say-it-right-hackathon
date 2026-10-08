import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Edit3, 
  Sparkles, 
  Clock, 
  Mail, 
  RefreshCw, 
  Columns,
  MessageSquare,
  ExternalLink
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
  const [viewMode, setViewMode] = useState<'compare' | 'tabs'>('compare');
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

  const handleCopyWhatsApp = (draft: EmailDraft, optionKey: string) => {
    const body = editableBodies[optionKey] || draft.body;
    const textToCopy = `*Subject: ${draft.subject}*\n\n${body}`;
    copyToClipboard(textToCopy, `${optionKey}-whatsapp`);
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
    optionKey: 'option1' | 'option2'
  ) => {
    const currentBody = editableBodies[optionKey] || draft.body;
    const isEditing = editingOption === optionKey;
    const isRefining = refiningOption === optionKey;
    const isSaved = isDraftSaved(draft.subject);
    const isCopied = copiedKey === `${optionKey}-clipboard`;
    const isWaCopied = copiedKey === `${optionKey}-whatsapp`;
    const isSubjCopied = copiedKey === `${optionKey}-subject`;

    const isOption1 = optionKey === 'option1';

    return (
      <div 
        key={optionKey}
        className="border border-slate-800 rounded-3xl overflow-hidden bg-slate-900/90 shadow-2xl flex flex-col justify-between transition-all hover:border-slate-700 relative"
      >
        {/* Card Header Bar */}
        <div className="bg-slate-800/80 border-b border-slate-700/80 px-4 sm:px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isOption1 ? 'bg-cyan-400' : 'bg-violet-400'}`}></span>
            <div>
              <span className="text-xs font-bold text-white tracking-wide block">
                {draft.title}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {draft.bestFor}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{draft.estimatedReadTime || '30 sec read'}</span>
          </div>
        </div>

        {/* Email Meta Bar (To & Subject) */}
        <div className="px-4 sm:px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-mono text-[11px] font-bold text-slate-500 w-14">To:</span>
            <span className="text-slate-200 font-medium truncate">{recipientName}</span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <span className="font-mono text-[11px] font-bold text-slate-500 w-14 shrink-0 pt-0.5">Subject:</span>
              <span className="text-cyan-300 font-semibold font-mono text-xs break-words">
                {draft.subject}
              </span>
            </div>

            <button
              onClick={() => copyToClipboard(draft.subject, `${optionKey}-subject`)}
              className="text-[10px] text-slate-400 hover:text-cyan-300 font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80 transition-colors shrink-0"
              title="Copy subject line"
            >
              {isSubjCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Email Body Area */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                rows={9}
                value={currentBody}
                onChange={(e) =>
                  setEditableBodies((prev) => ({
                    ...prev,
                    [optionKey]: e.target.value,
                  }))
                }
                className="w-full text-xs sm:text-sm font-sans bg-slate-950 border border-indigo-500/50 rounded-xl p-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-400 leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingOption(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                >
                  Done Editing
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed whitespace-pre-wrap select-text font-sans bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 mb-4 min-h-[160px]">
              {currentBody}
            </div>
          )}

          {/* Quick Refine Pills */}
          <div className="pt-2 pb-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Tweak:
            </span>
            <button
              disabled={isRefining}
              onClick={() => handleQuickRefine(optionKey, 'Make it even more concise and direct')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            >
              Shorter
            </button>
            <button
              disabled={isRefining}
              onClick={() => handleQuickRefine(optionKey, 'Add a polite mention of attending office hours')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            >
              + Office Hours
            </button>
            <button
              disabled={isRefining}
              onClick={() => handleQuickRefine(optionKey, 'Soften tone and express genuine gratitude')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            >
              + Warmer
            </button>
            {isRefining && (
              <span className="text-[10px] text-cyan-400 font-mono animate-pulse flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Refining...
              </span>
            )}
          </div>

          {/* PROMINENT PRIMARY ACTION: COPY TO CLIPBOARD BUTTON */}
          <div className="space-y-2">
            <button
              onClick={() => handleCopyEmail(draft, optionKey, true)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                isCopied
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/50 shadow-emerald-600/30'
                  : isOption1
                  ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-indigo-500/25'
                  : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-purple-500/25'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-white animate-bounce" />
                  <span className="font-extrabold tracking-wide">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-cyan-200" />
                  <span className="font-bold tracking-wide">Copy to Clipboard</span>
                </>
              )}
            </button>

            {/* Secondary Actions Bar */}
            <div className="flex items-center justify-between gap-1 pt-1 text-[11px]">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopyWhatsApp(draft, optionKey)}
                  className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-all ${
                    isWaCopied
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="Copy formatted for WhatsApp/Teams"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  <span>{isWaCopied ? 'Copied WA!' : 'WhatsApp'}</span>
                </button>

                <button
                  onClick={() => handleOpenMailClient(draft, optionKey)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1"
                  title="Open draft in your email client"
                >
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span>Mail App</span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingOption(isEditing ? null : optionKey)}
                  className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80 transition-colors"
                  title="Edit text inline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleSpeak(currentBody, optionKey)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isSpeakingOption === optionKey
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80'
                  }`}
                  title="Listen to draft"
                >
                  {isSpeakingOption === optionKey ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => handleSave(draft, optionKey)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isSaved
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80'
                  }`}
                  title={isSaved ? 'Saved in browser' : 'Save draft'}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-extrabold text-sm text-white">
            2 Ready-to-Send Drafts
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            — calibrated for different styles
          </span>
        </div>

        {/* View Mode Toggle: Compare vs Tabs */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex bg-slate-800 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setViewMode('compare')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'compare'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('tabs')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'tabs'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Single Card</span>
            </button>
          </div>

          {viewMode === 'tabs' && (
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setSelectedOption('option1')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedOption === 'option1'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Option 1: Direct
              </button>
              <button
                onClick={() => setSelectedOption('option2')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedOption === 'option2'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Option 2: Contextual
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Draft Cards Grid */}
      {viewMode === 'compare' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {renderSingleDraftCard(drafts.option1, 'option1')}
          {renderSingleDraftCard(drafts.option2, 'option2')}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {selectedOption === 'option1'
            ? renderSingleDraftCard(drafts.option1, 'option1')
            : renderSingleDraftCard(drafts.option2, 'option2')}
        </div>
      )}
    </div>
  );
};
