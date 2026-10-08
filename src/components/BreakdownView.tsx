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
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono font-bold text-cyan-400 tracking-wider mb-0.5">
            04 / PSYCHOLOGICAL BREAKDOWN
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Linguistic & Behavioral Anatomy
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          The psychological pivots that turn faculty defensiveness into empathy
        </p>
      </div>

      {/* Comparisons */}
      <div className="space-y-4 mb-6">
        {breakdown.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-800/60 p-5 space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-center">
              {/* Draft Phrasing */}
              <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  Draft Phrasing:
                </span>
                <span className="text-xs sm:text-sm font-medium text-rose-200 italic line-through decoration-rose-400">
                  "{item.roughPhrase}"
                </span>
              </div>

              {/* Psychological Upgrade */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Psychological Upgrade:
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-200">
                  "{item.betterPhrase}"
                </span>
              </div>
            </div>

            {/* Psychological Rationale */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-300 flex items-start gap-3">
              <Brain className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Why this works: </span>
                <span className="leading-relaxed text-slate-300 font-normal">{item.psychologicalReason}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pro Tips / Checkpoints */}
      {proTips && proTips.length > 0 && (
        <div className="border-t border-slate-800 pt-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Pre-Flight Faculty Etiquette Checkpoints</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {proTips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-slate-800/70 border border-slate-700/80 rounded-xl p-3 text-slate-300 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
