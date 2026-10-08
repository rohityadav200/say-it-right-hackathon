import React from 'react';
import { Brain, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';
import { BreakdownItem } from '../types';

interface BreakdownViewProps {
  breakdown: BreakdownItem[];
  proTips: string[];
}

export const BreakdownView: React.FC<BreakdownViewProps> = ({
  breakdown,
  proTips,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-700 font-bold flex items-center justify-center text-sm border border-purple-500/20">
            04
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              The Breakdown
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                Psychological Anatomy
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Why these specific word choices influence instructor empathy and cooperation.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-side Psychological phrase comparisons */}
      <div className="space-y-4 mb-6">
        {breakdown.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-purple-200/70 bg-gradient-to-r from-purple-50/40 via-white to-indigo-50/30 p-4.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              {/* Rough phrase */}
              <div className="flex-1 min-w-0 bg-red-50/70 border border-red-200/70 rounded-lg p-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 block mb-1">
                  Instead of:
                </span>
                <span className="text-xs sm:text-sm font-medium text-red-950 italic line-through decoration-red-400">
                  "{item.roughPhrase}"
                </span>
              </div>

              <div className="hidden sm:flex items-center justify-center text-slate-400">
                <ArrowRight className="w-5 h-5 text-indigo-500" />
              </div>

              {/* Polished phrase */}
              <div className="flex-1 min-w-0 bg-emerald-50/70 border border-emerald-200/70 rounded-lg p-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  We used:
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-950">
                  "{item.betterPhrase}"
                </span>
              </div>
            </div>

            {/* Psychological Reason */}
            <div className="bg-white/90 border border-purple-100 rounded-lg p-3 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
              <Brain className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-purple-950">Psychological impact: </span>
                <span className="leading-relaxed">{item.psychologicalReason}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pro Tips Section */}
      {proTips && proTips.length > 0 && (
        <div className="border-t border-slate-100 pt-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Academic Etiquette Checkpoints
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
            {proTips.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-slate-50 border border-slate-100 rounded-lg p-2.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="font-medium text-slate-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
