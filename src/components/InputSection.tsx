import React, { useState } from 'react';
import { 
  Sparkles, 
  Loader2, 
  Send, 
  AlertCircle, 
  Zap, 
  HelpCircle,
  FileText,
  UserCheck
} from 'lucide-react';

interface QuickStarter {
  label: string;
  category: 'Exams' | 'OD' | 'Project' | 'Placement' | 'Attendance' | 'LOR';
  recipient: string;
  situation: string;
  roughDraft: string;
}

interface InputSectionProps {
  recipient: string;
  setRecipient: (val: string) => void;
  situation: string;
  setSituation: (val: string) => void;
  roughDraft: string;
  setRoughDraft: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSelectQuickExample: (example: { recipient: string; situation: string; roughDraft: string }) => void;
}

const INDIAN_ACADEMIC_STARTERS: QuickStarter[] = [
  {
    label: "Missed CIA Exam",
    category: "Exams",
    recipient: "Prof. K. Venkatesh (Internal Exam Coordinator)",
    situation: "Missed Continuous Internal Assessment (CIA-1) exam due to high fever",
    roughDraft: "Sir I am so sorry I missed CIA exam today because local train got cancelled and I got fever. Please sir conduct re-test for me otherwise my internal marks and CGPA will be ruined please sir."
  },
  {
    label: "Hackathon OD Leave",
    category: "OD",
    recipient: "Dr. T. Chithralekha (Head of Department - HOD)",
    situation: "Selected for 24-Hour AI Hackathon; need On-Duty (OD) attendance for lab sessions",
    roughDraft: "Respected madam, I am participating in hackathon today so please give me OD attendance for compiler lab. Kindly do the needful asap madam."
  },
  {
    label: "Project Review Delay",
    category: "Project",
    recipient: "Dr. Radhika Sundaram (Project Supervisor)",
    situation: "Model inference code had deadlock bug; need 48 hours to complete project demo",
    roughDraft: "Respected guide madam, our project model code was crashing last night so we could not make ppt. Can you please postpone our review to Friday madam? We will surely finish it."
  },
  {
    label: "Placement Exam Clash",
    category: "Placement",
    recipient: "Mr. Rajesh Verma (Training & Placement Officer)",
    situation: "Final campus technical interview clashes with semester practical lab exam at 2:30 PM",
    roughDraft: "Sir my placement interview and lab exam are at same time 2:30 PM. I cannot miss both. Please change my interview slot immediately otherwise I will lose this job offer."
  },
  {
    label: "Low Attendance (<75%)",
    category: "Attendance",
    recipient: "Prof. Ananya Iyer (Dean of Academic Affairs)",
    situation: "Attendance dropped to 71% due to viral illness; submitting medical slips for condonation",
    roughDraft: "Respected Madam, I beg to submit that my attendance is 71% because of viral illness. Please condone my attendance shortage and allow me to write end semester exam madam."
  },
  {
    label: "Recommendation (LOR)",
    category: "LOR",
    recipient: "Dr. P. Sivakumar (Professor)",
    situation: "Requesting recommendation letter for GATE & Master's program admissions",
    roughDraft: "Dear Sir, I am your former student. I am applying for MS abroad and urgently need 3 LORs. Could you please give me a recommendation letter this week? Kindly do the needful."
  }
];

const RECIPIENT_SHORTCUTS = [
  "Dr. Radhika Sundaram (Course In-Charge)",
  "Dr. T. Chithralekha (HOD)",
  "Prof. K. Venkatesh (Exam Coordinator)",
  "Mr. Rajesh Verma (Placement Officer)",
  "Prof. Ananya Iyer (Dean)",
];

export const InputSection: React.FC<InputSectionProps> = ({
  recipient,
  setRecipient,
  situation,
  setSituation,
  roughDraft,
  setRoughDraft,
  loading,
  onSubmit,
  onSelectQuickExample,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredStarters = activeFilter === 'All'
    ? INDIAN_ACADEMIC_STARTERS
    : INDIAN_ACADEMIC_STARTERS.filter(s => s.category === activeFilter);

  const wordCount = roughDraft.trim().split(/\s+/).filter(Boolean).length;
  const isFormValid = recipient.trim().length > 0 && situation.trim().length > 0 && roughDraft.trim().length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Communication Coach</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Say It Right
          </h1>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">
            Turn your stress-draft into a respectful, clear, and persuasive message.
          </p>
        </div>

        {/* Quick Starters / Common College Situations */}
        <div className="mb-6 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Quick Academic Starters:
            </span>
            <span className="text-[11px] text-gray-400">Click to auto-load</span>
          </div>

          {/* Starters grid */}
          <div className="flex flex-wrap gap-2">
            {INDIAN_ACADEMIC_STARTERS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectQuickExample(item)}
                disabled={loading}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 border border-gray-200 hover:border-indigo-200 font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
          {/* Input 1: Who are you messaging? */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="recipient-input"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Who are you messaging?
              </label>
              <span className="text-[11px] text-gray-400">Professors, HODs, TPO, Dean</span>
            </div>
            <input
              id="recipient-input"
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Dr. Radhika Sundaram, Dr. T. Chithralekha (HOD)"
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
            {/* Quick role shortcuts */}
            <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-gray-500">
              <span className="text-gray-400">Examples:</span>
              {RECIPIENT_SHORTCUTS.slice(0, 3).map((sc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRecipient(sc)}
                  className="text-indigo-600 hover:underline hover:text-indigo-800 cursor-pointer"
                >
                  {sc.split(' ')[0]} {sc.split(' ')[1]}
                  {i < 2 ? ' ·' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: What is the situation? */}
          <div>
            <label 
              htmlFor="situation-input"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              What is the situation?
            </label>
            <input
              id="situation-input"
              type="text"
              required
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g. Missed CIA internal exam due to sudden viral illness"
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Input 3: Dump your rough thoughts here */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="rough-draft-textarea"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Dump your rough thoughts here
              </label>
              <span className="text-xs text-gray-400">
                Don't worry about sounding professional yet
              </span>
            </div>
            <textarea
              id="rough-draft-textarea"
              required
              rows={5}
              value={roughDraft}
              onChange={(e) => setRoughDraft(e.target.value)}
              placeholder="Type exactly what you're thinking or panicking about. Vent or write bullet points. We'll reshape it into polite, persuasive communication."
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-y leading-relaxed"
            />
            <div className="mt-1.5 flex items-center justify-between text-xs text-gray-400">
              <span className="font-medium text-gray-500">{wordCount} words typed</span>
              <span>100% Private & Confidential</span>
            </div>
          </div>

          {/* Action Button: Coach Me */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer ${
                loading
                  ? 'bg-indigo-400 text-white cursor-wait'
                  : isFormValid
                  ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white shadow-indigo-200 hover:shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing tone & crafting drafts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Coach Me</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Empathy & safety footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2.5 text-xs text-gray-500">
        <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0" />
        <span>
          Calibrated to faculty expectations: eliminates demand-tone and panic friction while protecting your academic standing.
        </span>
      </div>
    </div>
  );
};
