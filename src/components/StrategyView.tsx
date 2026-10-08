import React from 'react';
import { Target, Compass, Lightbulb, ShieldCheck } from 'lucide-react';
import { Strategy } from '../types';

interface StrategyViewProps {
  strategy: Strategy;
}

export const StrategyView: React.FC<StrategyViewProps> = ({ strategy }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-500/20">
            02
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              The Strategy
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                Optimal Tone Blueprint
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              The calibrated psychological frame that maximizes cooperation and respect.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Optimal Tone Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4.5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Target className="w-3.5 h-3.5" />
              Target Tone
            </div>
            <div className="text-lg font-extrabold text-amber-300 tracking-tight leading-snug">
              {strategy.optimalTone}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-800/80 text-xs text-indigo-200/90 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Calibrated for academic authority & peer rapport
          </div>
        </div>

        {/* Tone Explanation Card */}
        <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4.5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              Why this specific tone works:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {strategy.toneExplanation}
            </p>
          </div>

          {strategy.keyRule && (
            <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-start gap-2 text-xs bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 text-amber-950">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Golden Rule: </span>
                {strategy.keyRule}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
