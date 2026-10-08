export type RecipientRole = 
  | 'Professor'
  | 'Teaching Assistant (TA)'
  | 'Academic Advisor'
  | 'Department Chair / Dean'
  | 'Campus Recruiter / Hiring Manager'
  | 'Research PI / Lab Director'
  | 'Group Project Teammate';

export interface CoachingRequest {
  recipient: string;
  role: RecipientRole;
  courseCode?: string;
  situation: string;
  roughDraft: string;
  urgency: 'urgent' | 'moderate' | 'calm';
}

export interface Critique {
  issue: string;
  misinterpretation: string;
  quote?: string;
}

export interface Diagnosis {
  intentValidation: string;
  critiques: Critique[];
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

export interface BreakdownItem {
  roughPhrase: string;
  betterPhrase: string;
  psychologicalReason: string;
}

export interface CoachingResult {
  diagnosis: Diagnosis;
  strategy: Strategy;
  drafts: Drafts;
  breakdown: BreakdownItem[];
  proTips: string[];
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
  category: 'Exams & Grades' | 'Deadlines & Absence' | 'Opportunities & Recs' | 'Interpersonal & Teams';
  recipientName: string;
  role: RecipientRole;
  courseCode: string;
  situation: string;
  roughDraft: string;
  stressLevel: 'Panicked' | 'Stressed' | 'Awkward' | 'Eager';
  tag: string;
}
