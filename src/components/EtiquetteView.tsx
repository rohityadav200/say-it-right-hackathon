import React from 'react';
import { ETIQUETTE_GUIDES } from '../data/etiquetteRules';
import { Compass, CheckCircle2, XCircle, Lightbulb, GraduationCap } from 'lucide-react';

export const EtiquetteView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-blue-50/80 border border-indigo-100 text-gray-900 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold tracking-wider uppercase mb-2">
          <Compass className="w-4 h-4 text-indigo-600" />
          <span>Faculty & University Communication Constitution</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          The Unwritten Rules of Academic Communication
        </h2>
        <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
          High school teachers remind you; university professors evaluate your professionalism. Understanding faculty psychology turns stressful emails into relationship-building opportunities.
        </p>
      </div>

      {/* The Key Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ETIQUETTE_GUIDES.map((guide) => (
          <div
            key={guide.id}
            className="bg-white border border-gray-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {guide.badge}
                </span>
              </div>

              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">
                {guide.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed font-normal">
                {guide.summary}
              </p>

              {/* Golden Rule */}
              <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3.5 mb-4 text-xs text-amber-950">
                <span className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  The Golden Rule:
                </span>
                {guide.goldenRule}
              </div>

              {/* Do vs Don't */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900">Do say: </span>
                    <span className="text-emerald-800 font-medium italic">"{guide.doText}"</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-rose-50/60 border border-rose-200/70 rounded-xl p-3">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-900">Don't say: </span>
                    <span className="text-rose-800 font-medium italic">"{guide.dontText}"</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Standard university etiquette across accredited colleges</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
