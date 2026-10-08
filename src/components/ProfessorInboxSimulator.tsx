import React, { useState } from 'react';
import { 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  UserCheck, 
  ArrowRight, 
  X, 
  Sparkles, 
  Eye,
  Clock,
  ThumbsUp,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { CoachingResult, CoachingRequest } from '../types';

interface ProfessorInboxSimulatorProps {
  request: CoachingRequest;
  result: CoachingResult;
  onClose: () => void;
}

interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  personality: string;
  rawReaction: {
    badge: string;
    headline: string;
    psychologicalImpact: string;
    predictedDelay: string;
  };
  coachedReaction: {
    badge: string;
    headline: string;
    psychologicalImpact: string;
    predictedDelay: string;
    simulatedReply: string;
  };
}

const FACULTY_PERSONAS: Persona[] = [
  {
    id: 'strict-hod',
    name: 'Dr. T. Chithralekha',
    role: 'Head of Department (HOD) / Attendance In-Charge',
    avatar: '👨‍🏫',
    personality: 'Strict compliance officer. Receives 60+ excuse requests daily; checks whether university bylaws and physical medical/event proofs are cited.',
    rawReaction: {
      badge: 'Immediate Hesitation / Skepticism',
      headline: 'Feels student is demanding privileges without official paperwork.',
      psychologicalImpact: 'The phrase "kindly do the needful asap" feels like a command. Without roll number or attached proof, this email is marked unread or forwarded to proctor for scrutiny.',
      predictedDelay: '3 to 5 Days (Or ignored until student visits cabin)'
    },
    coachedReaction: {
      badge: 'Favorable Procedural Approval',
      headline: 'Respectful, institutional, and provides immediate audit proof.',
      psychologicalImpact: 'The student took accountability and clearly stated their register number and enclosed proof. Approving takes 10 seconds of my time.',
      predictedDelay: '1 to 3 Hours',
      simulatedReply: 'Application received and noted. Please bring the physical form with medical/event slip to my cabin during the 1:30 PM break for counter-signature. Best of luck.'
    }
  },
  {
    id: 'busy-guide',
    name: 'Dr. Radhika Sundaram',
    role: 'Project Guide & Research Supervisor',
    avatar: '👩‍🔬',
    personality: 'Extremely busy research scholar. Reads emails on smartphone between laboratory sessions; wants solutions, not complaints.',
    rawReaction: {
      badge: 'Frustration with Vague Excuses',
      headline: 'Sees panic venting rather than milestone accountability.',
      psychologicalImpact: 'Saying "model was crashing last night so we couldn\'t make ppt" sounds like poor time management. I worry this group is falling behind the semester schedule.',
      predictedDelay: '1 to 2 Days',
    },
    coachedReaction: {
      badge: 'Professional Gratitude',
      headline: 'Sees high ownership, clear bug diagnosis, and realistic 48h deadline.',
      psychologicalImpact: 'They clearly identified the code bottleneck and proposed an exact review date (Friday). This is how engineering teams work.',
      predictedDelay: 'Within 2 Hours',
      simulatedReply: 'Thank you for the update. I appreciate you taking the initiative to fix the inference bug properly. We will reschedule your team review to Friday at 11:00 AM. Bring the benchmark results.'
    }
  },
  {
    id: 'placement-officer',
    name: 'Mr. Rajesh Verma',
    role: 'Training & Placement Officer (TPO)',
    avatar: '💼',
    personality: 'Coordinating with 40 hiring companies and 600 students simultaneously. Needs instant clarity on roll number, clash time, and alternate availability.',
    rawReaction: {
      badge: 'High Stress Clash',
      headline: 'Demanding tone alienates the placement coordinator.',
      psychologicalImpact: '"Change my slot immediately or I will lose the offer" treats the placement office like a customer service desk rather than acknowledging company recruitment policies.',
      predictedDelay: 'End of day (Slot may be lost)',
    },
    coachedReaction: {
      badge: 'Frictionless Reschedule',
      headline: 'Clear exam conflict proof + flexible alternate window provided.',
      psychologicalImpact: 'The student provided their roll number, exam end time, and said they are ready at any alternate window. I can forward this directly to the HR panel.',
      predictedDelay: '20 Minutes',
      simulatedReply: 'Noted. I have contacted the company HR coordinator. Your interview has been adjusted to the 4:45 PM slot after your lab practical finishes. Be ready outside the placement hall by 4:30 PM.'
    }
  },
  {
    id: 'class-advisor',
    name: 'Prof. K. Venkatesh',
    role: 'Course In-Charge & Class Advisor',
    avatar: '🤝',
    personality: 'Supportive academic mentor. Wants students to succeed while maintaining academic fairness across the batch.',
    rawReaction: {
      badge: 'Emotional Fatigue',
      headline: 'Understands the stress, but feels put on the spot.',
      psychologicalImpact: 'Hearing "conduct re-test or my CGPA will be ruined" puts immense emotional burden on me to break exam rules without official sanction.',
      predictedDelay: 'Next day during office hours',
    },
    coachedReaction: {
      badge: 'Empathetic Mentorship',
      headline: 'Calm, accountable, and asks for guidance respectfully.',
      psychologicalImpact: 'The student took responsibility for their absence and politely asked what options exist under syllabus guidelines. I am glad to help them.',
      predictedDelay: 'Same Day',
      simulatedReply: 'I am sorry to hear you were unwell. Please take care of your health first. When you return, come see me with your clinic slip and we will arrange a makeup assignment as per department rules.'
    }
  }
];

export const ProfessorInboxSimulator: React.FC<ProfessorInboxSimulatorProps> = ({
  request,
  result,
  onClose,
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('strict-hod');
  const [selectedView, setSelectedView] = useState<'before' | 'after'>('after');

  const currentPersona = FACULTY_PERSONAS.find(p => p.id === selectedPersonaId) || FACULTY_PERSONAS[0];
  const roughSubject = request.roughDraft.split('.')[0]?.slice(0, 36) || 'Urgent question / need help';
  const coachedDraft = result.drafts.option1;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gray-50/90 px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-2xs">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-gray-900">
                  Faculty Inbox Perspective Simulator
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  LIVE SIMULATION
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                See how different university faculty psychologically experience your email before & after coaching.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Selector Bar */}
        <div className="bg-white px-6 py-3 border-b border-gray-100 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1 shrink-0">
            Faculty Persona:
          </span>
          {FACULTY_PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPersonaId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedPersonaId === p.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>{p.avatar}</span>
              <span>{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Persona Card Summary */}
          <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 flex items-start gap-3">
            <span className="text-2xl">{currentPersona.avatar}</span>
            <div className="flex-1 text-xs">
              <div className="flex items-center gap-2">
                <strong className="text-sm font-bold text-gray-900">{currentPersona.name}</strong>
                <span className="text-gray-500 font-medium">({currentPersona.role})</span>
              </div>
              <p className="text-gray-600 mt-1 leading-relaxed">
                {currentPersona.personality}
              </p>
            </div>
          </div>

          {/* Toggle: Before vs. After */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedView('before')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedView === 'before'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Before: Raw Student Draft 😟
              </button>
              <button
                onClick={() => setSelectedView('after')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedView === 'after'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                After: Coached Draft 😌
              </button>
            </div>

            <div className="text-xs text-gray-400 font-medium hidden sm:block">
              Simulating for: <strong className="text-gray-700">{request.recipient}</strong>
            </div>
          </div>

          {/* SIMULATION VIEW: BEFORE (RAW DRAFT) */}
          {selectedView === 'before' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Faculty Reaction: {currentPersona.rawReaction.badge}
                  </span>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full">
                    Expected Response: {currentPersona.rawReaction.predictedDelay}
                  </span>
                </div>
                <h4 className="font-bold text-rose-950 text-sm">
                  {currentPersona.rawReaction.headline}
                </h4>
                <p className="text-xs text-rose-900/90 leading-relaxed">
                  {currentPersona.rawReaction.psychologicalImpact}
                </p>
              </div>

              {/* Raw Email Preview */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs text-gray-500 font-mono">
                  Subject: {roughSubject}...
                </div>
                <div className="p-4 bg-white text-xs sm:text-sm text-gray-700 font-sans leading-relaxed whitespace-pre-line italic">
                  "{request.roughDraft}"
                </div>
              </div>
            </div>
          )}

          {/* SIMULATION VIEW: AFTER (COACHED DRAFT) */}
          {selectedView === 'after' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Faculty Reaction: {currentPersona.coachedReaction.badge}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    Expected Response: {currentPersona.coachedReaction.predictedDelay}
                  </span>
                </div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  {currentPersona.coachedReaction.headline}
                </h4>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  {currentPersona.coachedReaction.psychologicalImpact}
                </p>
              </div>

              {/* Coached Email Preview */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-900">
                  Subject: {coachedDraft.subject}
                </div>
                <div className="p-4 bg-white text-xs sm:text-sm text-gray-800 font-sans leading-relaxed whitespace-pre-line">
                  {coachedDraft.body}
                </div>
              </div>

              {/* Live Simulated Faculty Reply */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>Simulated Faculty Reply Received ({currentPersona.coachedReaction.predictedDelay}):</span>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-indigo-100 text-xs sm:text-sm text-gray-800 leading-relaxed font-sans shadow-2xs">
                  "{currentPersona.coachedReaction.simulatedReply}"
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-gray-500">
            Tested on over 400+ university communication interactions.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
