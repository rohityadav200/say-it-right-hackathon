import React, { useState } from 'react';
import { SavedDraftItem } from '../types';
import { Bookmark, Trash2, Copy, Check, ExternalLink, Clock, Mail, FileText, ArrowRight } from 'lucide-react';

interface SavedDraftsViewProps {
  savedDrafts: SavedDraftItem[];
  onDeleteDraft: (id: string) => void;
  onClearAll: () => void;
  onGoToCoach?: () => void;
}

export const SavedDraftsView: React.FC<SavedDraftsViewProps> = ({
  savedDrafts,
  onDeleteDraft,
  onClearAll,
  onGoToCoach,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('All');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenMail = (subject: string, body: string) => {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const types = ['All', ...Array.from(new Set(savedDrafts.map(d => d.type || 'Email')))];

  const filteredDrafts = filterType === 'All'
    ? savedDrafts
    : savedDrafts.filter(d => (d.type || 'Email') === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600" />
            <span>Saved Academic Drafts</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review and copy polished drafts saved during your AI coaching sessions.
          </p>
        </div>

        {savedDrafts.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Tabs if multiple types exist */}
      {savedDrafts.length > 0 && types.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {savedDrafts.length === 0 ? (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">
            No saved drafts yet
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Whenever you polish an email or formal letter in the Coach Studio, click "Save Draft" to keep a copy here.
          </p>
          {onGoToCoach && (
            <button
              onClick={onGoToCoach}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Coach Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDrafts.map((draft) => {
            const formattedDate = new Date(draft.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={draft.id}
                className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-shadow space-y-4"
              >
                {/* Top Card Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        To: {draft.recipient}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {draft.type || 'Email'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Regarding: {draft.situation}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                    <button
                      onClick={() => onDeleteDraft(draft.id)}
                      className="text-gray-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subject Line */}
                <div className="bg-gray-50/80 px-3.5 py-2 rounded-lg border border-gray-200/60 text-xs">
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">
                    Subject Line
                  </span>
                  <span className="font-semibold text-gray-900">
                    {draft.subject}
                  </span>
                </div>

                {/* Draft Content */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-gray-100 text-xs sm:text-sm text-gray-800 leading-relaxed font-sans whitespace-pre-line select-text">
                  {draft.chosenDraft}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleCopy(`Subject: ${draft.subject}\n\n${draft.chosenDraft}`, draft.id)}
                    className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                      copiedId === draft.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {copiedId === draft.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Draft</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenMail(draft.subject, draft.chosenDraft)}
                    className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                    <span>Open in Mail</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
