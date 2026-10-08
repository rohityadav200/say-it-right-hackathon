import React from 'react';
import { AlertCircle, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Diagnosis } from '../types';

interface DiagnosisViewProps {
  diagnosis: Diagnosis;
}

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({ diagnosis }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono font-bold text-cyan-400 tracking-wider mb-0.5">
            01 / THE DIAGNOSIS
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            The "Teach" Moment
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Why honest thoughts get misinterpreted by busy professors
        </p>
      </div>

      {/* Intent Validation - Empathetic peer mentor */}
      <div className="border border-emerald-500/30 bg-emerald-950/30 rounded-xl p-5 mb-6 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            Intent Validated
          </div>
          <p className="text-sm text-emerald-100 font-medium leading-relaxed">
            "{diagnosis.intentValidation}"
          </p>
        </div>
      </div>

      {/* Identified Misinterpretation Friction Points */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Friction Points in Your Draft</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(diagnosis.critiques || []).map((critique, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-700/80 bg-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-600 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {critique.issue}
                  </h4>
                </div>

                {critique.quote && (
                  <div className="text-xs font-mono bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 mb-3 italic">
                    "{critique.quote}"
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-amber-300">How it lands: </span>
                  {critique.misinterpretation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
