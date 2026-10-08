import { ScenarioPreset } from '../types';

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'missed-midterm-alarm',
    title: 'Slept Through Alarm & Missed Midterm',
    category: 'Exams & Grades',
    recipientName: 'Professor Smith',
    role: 'Professor',
    courseCode: 'CS 180',
    situation: 'I slept through my alarm and missed the midterm exam. I am panicking and terrified I will fail.',
    roughDraft: 'Prof smith I am so so sorry I missed the exam today I oversleep because my alarm didn\'t go off. Is there any way I can retake it please I need to pass this class.',
    stressLevel: 'Panicked',
    tag: 'High Stakes'
  },
  {
    id: 'last-minute-extension',
    title: 'Requesting Extension 24h Before Due Date',
    category: 'Deadlines & Absence',
    recipientName: 'Dr. Katherine Reynolds',
    role: 'Professor',
    courseCode: 'HIST 210',
    situation: 'I got overwhelmed with three other exams and food poisoning. The 10-page essay is due tomorrow night and I have only finished 3 pages.',
    roughDraft: 'Hi Dr Reynolds, sorry to bother you so late but is there any chance I could get an extension on the paper? I have been super sick and have 3 midterms this week and literally haven\'t slept in 40 hours. Please let me know asap thanks.',
    stressLevel: 'Stressed',
    tag: 'Extension Request'
  },
  {
    id: 'grade-dispute-rubric',
    title: 'Questioning a Harsh Grade Without Being Defensive',
    category: 'Exams & Grades',
    recipientName: 'TA Marcus Vance',
    role: 'Teaching Assistant (TA)',
    courseCode: 'ENG 102',
    situation: 'I spent 20 hours on the project and received a C-. The feedback said "lacks depth" but didn\'t point to where. I want to ask for reconsideration or a regrade without sounding entitled.',
    roughDraft: 'Hey Marcus, I just saw my grade for project 2 and honestly I don\'t think a C- is fair at all. I followed all the guidelines and spent way more time than other people who got A\'s. Can you regrade this or tell me why you took off so many points??',
    stressLevel: 'Stressed',
    tag: 'Grade Inquiry'
  },
  {
    id: 'lor-out-of-the-blue',
    title: 'Asking for Letter of Rec (Haven\'t Spoken in 6 Months)',
    category: 'Opportunities & Recs',
    recipientName: 'Prof. David Chen',
    role: 'Professor',
    courseCode: 'CHEM 220',
    situation: 'I took his Organic Chemistry class two semesters ago and got an A, but I never went to office hours. Now grad school applications are due in a month and I need his letter.',
    roughDraft: 'Dear Professor Chen, remember me from CHEM 220 in the fall? I got an A in your class. I\'m applying to grad school and I need letters of recommendation. Would you be able to write one for me? The deadline is November 15. Let me know.',
    stressLevel: 'Awkward',
    tag: 'Letter of Rec'
  },
  {
    id: 'cold-email-research-pi',
    title: 'Cold Emailing a Professor for Undergraduate Lab Research',
    category: 'Opportunities & Recs',
    recipientName: 'Dr. Elena Rostova',
    role: 'Research PI / Lab Director',
    courseCode: 'Neuroscience Dept',
    situation: 'I want to join her cognitive neurology lab for the upcoming term. I read one of her papers, but I have no prior lab research experience.',
    roughDraft: 'Hi Dr Rostova, I am a sophomore and really love neuroscience. I really need research experience for medical school and wondered if you had any open spots in your lab for next semester? I am a very hard worker. Please let me know if I can join.',
    stressLevel: 'Eager',
    tag: 'Research Cold Email'
  },
  {
    id: 'let-down-group-project',
    title: 'Apologizing to Team After Dropping the Ball',
    category: 'Interpersonal & Teams',
    recipientName: 'Maya & Alex (Team 4)',
    role: 'Group Project Teammate',
    courseCode: 'MKTG 310',
    situation: 'I was supposed to finish the slides by 5 PM yesterday before our rehearsal, but I had a family emergency and went totally unresponsive for 12 hours.',
    roughDraft: 'Hey guys so sorry my phone died and I had family stuff happen yesterday so I couldn\'t do the slides. I know you\'re mad but it was out of my control. Did you already do them or should I still work on them?',
    stressLevel: 'Awkward',
    tag: 'Team Accountability'
  },
  {
    id: 'ghosted-email-followup',
    title: 'Polite Follow-up on an Unanswered Email (5 Days Later)',
    category: 'Deadlines & Absence',
    recipientName: 'Prof. Miller',
    role: 'Professor',
    courseCode: 'MATH 240',
    situation: 'I emailed him 5 business days ago asking an important question about prerequisite course waivers, but he never replied.',
    roughDraft: 'Prof Miller, did you get my email from last Monday? You didn\'t respond and the registration deadline is in 2 days so I really need an answer right now.',
    stressLevel: 'Stressed',
    tag: 'Nudge / Follow-up'
  }
];
