export type RecipientRole = 
  | 'Professor / Faculty'
  | 'HOD (Head of Department)'
  | 'Project Guide / Research Supervisor'
  | 'Placement Officer (TPO)'
  | 'Dean of Academic Affairs'
  | 'Teaching Assistant / Lab Incharge'
  | 'Group Project Teammate';

export interface CoachingRequest {
  recipient: string;
  role?: RecipientRole | string;
  courseCode?: string;
  situation: string;
  roughDraft: string;
  urgency?: 'urgent' | 'moderate' | 'calm';
}

export interface Critique {
  issue: string;
  misinterpretation: string;
  quote?: string;
}

export interface Diagnosis {
  intentValidation?: string;
  validation?: string;
  critique?: string;
  critiques?: Critique[];
}

export interface Strategy {
  optimalTone: string;
  toneExplanation: string;
  keyRule: string;
}

export interface EmailDraft {
  title: string;
  bestFor: string;
  subject: string;
  body: string;
  estimatedReadTime?: string;
}

export interface Drafts {
  option1: EmailDraft;
  option2: EmailDraft;
}

export interface FormalLetter {
  toHeading: string;
  through?: string;
  fromHeading: string;
  date: string;
  subject: string;
  salutation: string;
  body: string;
  enclosures: string[];
  signOff: string;
}

export interface InPersonScript {
  entrance: string;
  pitch: string;
  handover: string;
  fallback: string;
}

export interface FollowUpDraft {
  delay: string;
  subject: string;
  body: string;
}

export interface WhatsAppDraft {
  text: string;
  wordCount: number;
}

export interface StressMetrics {
  beforeAnxiety: number; // e.g. 88
  afterAnxiety: number;  // e.g. 6
  clarityScore: number;  // e.g. 98
  politenessScore: number; // e.g. 96
  responseLikelihood: string; // e.g. "94% - Very High"
}

export interface BreakdownItem {
  phrase?: string;
  why_it_works?: string;
  roughPhrase?: string;
  betterPhrase?: string;
  psychologicalReason?: string;
}

export interface CoachingResult {
  diagnosis: Diagnosis;
  strategy: Strategy;
  drafts: Drafts;
  breakdown: BreakdownItem[];
  proTips?: string[];
  formalLetter?: FormalLetter;
  inPersonScript?: InPersonScript;
  followUpDraft?: FollowUpDraft;
  whatsappDraft?: WhatsAppDraft;
  stressMetrics?: StressMetrics;
}

export interface SavedDraftItem {
  id: string;
  timestamp: number;
  recipient: string;
  situation: string;
  subject: string;
  chosenDraft: string;
  type: string;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  category: 'Internal Exams & CIA' | 'On-Duty (OD) & Attendance' | 'Project Guide & Lab' | 'Placements & Recs' | 'Administration & Dean';
  recipientName: string;
  role: RecipientRole;
  courseCode: string;
  situation: string;
  roughDraft: string;
  stressLevel: 'Panicked' | 'Stressed' | 'Awkward' | 'Eager';
  tag: string;
}
