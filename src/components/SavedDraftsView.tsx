import React, { useState } from 'react';
import { SavedDraftItem } from '../types';
import { Bookmark, Trash2, Copy, Check, Send, Clock, Mail } from 'lucide-react';

interface SavedDraftsViewProps {
  savedDrafts: SavedDraftItem[];
  onDeleteDraft: (id: string) => void;
  onClearAll: () => void;
}

export const SavedDraftsView: React.FC<SavedDraftsViewProps> = ({
  savedDrafts,
  onDeleteDraft,
  onClearAll,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600" />
            Saved Academic Drafts
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Review and copy polished drafts saved during your coaching sessions.
          </p>
        </div>

        {savedDrafts.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {savedDrafts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">
            No saved drafts yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you coach an email and click "Save Draft", your polished message will be safely stored here in your browser.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedDrafts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    To: {item.recipient}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Subject */}
              <div className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>Subject: {item.subject}</span>
              </div>

              {/* Body */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-sans text-slate-700 whitespace-pre-wrap leading-relaxed mb-4">
                {item.chosenDraft}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => onDeleteDraft(item.id)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleCopy(
                        `Subject: ${item.subject}\n\n${item.chosenDraft}`,
                        item.id
                      )
                    }
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-all"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenMail(item.subject, item.chosenDraft)}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open in Mail</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
