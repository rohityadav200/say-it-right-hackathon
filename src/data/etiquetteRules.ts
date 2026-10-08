export interface EtiquetteGuide {
  id: string;
  title: string;
  summary: string;
  badge: string;
  goldenRule: string;
  doText: string;
  dontText: string;
}

export const ETIQUETTE_GUIDES: EtiquetteGuide[] = [
  {
    id: 'salutation',
    title: 'The Salutation Hierarchy',
    badge: 'First Impression',
    summary: 'How you address an instructor sets the psychological boundary before they read a single sentence.',
    goldenRule: 'Default to "Dear Professor [Last Name]" or "Dear Dr. [Last Name]" unless they specifically signed their previous email with their first name.',
    doText: '"Dear Professor Chen," or "Good morning Dr. Rostova,"',
    dontText: '"Hey," "Hi Prof," "Dear Sir/Madam," or addressing with first name without permission.'
  },
  {
    id: 'emergency-vs-urgency',
    title: 'The "Never Transfer Emergency" Rule',
    badge: 'Psychology',
    summary: 'A lack of planning or misfortune on your part does not automatically mandate an immediate weekend emergency on theirs.',
    goldenRule: 'Acknowledge your own responsibility and offer options that respect their time, rather than demanding an instant exception.',
    doText: '"I understand course policies on makeup exams, but wanted to respectfully ask if any discretionary options exist."',
    dontText: '"I need you to answer this ASAP because my scholarship is on the line."'
  },
  {
    id: 'subject-line-clarity',
    title: 'The 3-Part Subject Line Formula',
    badge: 'Efficiency',
    summary: 'Professors teach 100 to 300 students across multiple courses. A vague subject line gets delayed.',
    goldenRule: '[Course Code & Section] + [Topic] + [Urgency/Action Needed]',
    doText: 'Subject: "CS 180 (Sec 02) - Inquiry regarding Midterm 1 Absence - Student #89423"',
    dontText: 'Subject: "Question" or "Help please urgent!!!" or blank subject lines.'
  },
  {
    id: 'office-hours-bridge',
    title: 'The Office Hours Bridge',
    badge: 'Dispute Resolution',
    summary: 'Complex conversations (grade reviews, personal crises) go 10x better in person or over Zoom than via email ping-pong.',
    goldenRule: 'Use email to schedule a conversation, not to argue the merit of your work.',
    doText: '"Would you have 10 minutes during your Thursday office hours so I can review your feedback on question 4?"',
    dontText: '"I disagree with your grading and want my points back right now."'
  },
  {
    id: 'grace-over-guilt',
    title: 'Context Without Oversharing',
    badge: 'Boundaries',
    summary: 'You do not need to disclose graphic medical or deeply personal trauma to be believed.',
    goldenRule: 'State the consequence of the setback on your coursework, not the intimate biological or personal narrative.',
    doText: '"Due to an unforeseen personal health setback that required urgent care this morning..."',
    dontText: 'Writing multi-paragraph diary entries detailing bodily illness or room conflict.'
  }
];
