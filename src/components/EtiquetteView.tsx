import React from 'react';
import { ETIQUETTE_GUIDES } from '../data/etiquetteRules';
import { Compass, CheckCircle2, XCircle, Lightbulb, GraduationCap, AlertOctagon } from 'lucide-react';

export const EtiquetteView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4 text-teal-400" />
          University Etiquette Constitution
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
          The Unwritten Rules of Academic Communication
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          High school teachers remind you; university professors evaluate your professionalism. Understanding their perspective transforms your emails from awkward obstacles into career-building relationships.
        </p>
      </div>

      {/* The 5 Key Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ETIQUETTE_GUIDES.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {guide.badge}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 mb-2">
                {guide.title}
              </h3>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                {guide.summary}
              </p>

              {/* Golden Rule */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 mb-4 text-xs text-amber-950">
                <span className="font-bold flex items-center gap-1.5 mb-1 text-amber-900">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  The Golden Rule:
                </span>
                {guide.goldenRule}
              </div>

              {/* Do vs Don't */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 bg-emerald-50/60 border border-emerald-200/70 rounded-lg p-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900">Do say: </span>
                    <span className="text-emerald-950 font-medium italic">{guide.doText}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-red-50/60 border border-red-200/70 rounded-lg p-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-900">Don't say: </span>
                    <span className="text-red-950 font-medium italic">{guide.dontText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The Syllabus Pre-Flight Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <h3 className="text-base font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          The 3-Point Pre-Flight Checklist Before You Hit Send
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Always review these three items before firing off an email:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
            <span className="font-bold text-indigo-600 block mb-1">1. Did I check the syllabus?</span>
            <p className="text-slate-600 leading-relaxed">
              If the syllabus explicitly states "Lowest quiz dropped; no makeups," acknowledge it in your note: "I know the syllabus specifies no standard makeups..."
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
            <span className="font-bold text-indigo-600 block mb-1">2. Am I asking or demanding?</span>
            <p className="text-slate-600 leading-relaxed">
              Replace any directive ("Can you fix this ASAP") with an open polite inquiry ("I would appreciate the chance to review this during office hours").
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
            <span className="font-bold text-indigo-600 block mb-1">3. Course code & Student ID?</span>
            <p className="text-slate-600 leading-relaxed">
              Instructors with 250 students will delay answering emails if they have to hunt down which section you are in. Always sign with your student ID!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
