import React from 'react';
import { Target, Compass, Lightbulb, ShieldCheck, Zap } from 'lucide-react';
import { Strategy } from '../types';

interface StrategyViewProps {
  strategy: Strategy;
}

export const StrategyView: React.FC<StrategyViewProps> = ({ strategy }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono font-bold text-violet-400 tracking-wider mb-0.5">
            02 / THE STRATEGY
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Optimal Tone Blueprint
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          The psychological frequency that earns faculty grace and swift cooperation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Target Tone Box with Gradient Glow */}
        <div className="bg-gradient-to-br from-indigo-900/90 via-violet-900/80 to-slate-900 border border-indigo-500/30 text-white rounded-xl p-5 flex flex-col justify-between shadow-lg shadow-indigo-950/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 mb-2">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Tone</span>
            </div>
            <div className="text-xl font-extrabold text-amber-300 tracking-tight leading-snug">
              {strategy.optimalTone}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-800/60 text-xs text-indigo-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Calibrated for faculty cooperation</span>
          </div>
        </div>

        {/* Tone Rationale Box */}
        <div className="md:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Why this tone is psychologically optimal</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {strategy.toneExplanation}
            </p>
          </div>

          {strategy.keyRule && (
            <div className="mt-4 pt-3.5 border-t border-slate-700/80 flex items-start gap-2.5 text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Golden Rule: </span>
                <span>{strategy.keyRule}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
