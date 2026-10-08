import React from 'react';
import { HeartHandshake, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { Diagnosis } from '../types';

interface DiagnosisViewProps {
  diagnosis: Diagnosis;
}

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({ diagnosis }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 font-bold flex items-center justify-center text-sm border border-amber-500/20">
            01
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              The Diagnosis
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                The "Teach" Moment
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Understanding why certain words trigger hesitation or defensiveness in professors.
            </p>
          </div>
        </div>
      </div>

      {/* Intent Validation - Warm, empathetic peer mentoring */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50/40 border border-emerald-200/80 rounded-xl p-4 sm:p-4.5 mb-5 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <HeartHandshake className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
            Intent Validated
          </div>
          <p className="text-sm text-emerald-950 font-medium leading-relaxed">
            "{diagnosis.intentValidation}"
          </p>
        </div>
      </div>

      {/* Misinterpretation Critiques */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Where this draft might be misinterpreted:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {diagnosis.critiques.map((critique, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-4 transition-all hover:bg-amber-50/70"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {critique.issue}
                </h4>
              </div>

              {critique.quote && (
                <div className="text-xs font-mono bg-white/80 border border-amber-200/60 rounded px-2.5 py-1 text-slate-600 mb-2 italic">
                  "{critique.quote}"
                </div>
              )}

              <p className="text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-amber-950">How it lands: </span>
                {critique.misinterpretation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
