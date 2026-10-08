import { ScenarioPreset } from '../types';

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'od-hackathon-attendance',
    title: 'On-Duty (OD) Leave for 24-Hour AI Hackathon',
    category: 'On-Duty (OD) & Attendance',
    recipientName: 'Dr. T. Chithralekha (HOD)',
    role: 'HOD (Head of Department)',
    courseCode: 'Department of Computer Science · Reg: 24CS104',
    situation: 'Selected for the national AI Hackathon at university innovation hub. Need On-Duty (OD) attendance approval for Friday theory and practical lab sessions.',
    roughDraft: 'Respected madam, I am participating in hackathon today so please give me OD attendance for compiler lab. Kindly do the needful asap madam.',
    stressLevel: 'Stressed',
    tag: 'Hackathon OD Request'
  },
  {
    id: 'missed-internal-cia-exam',
    title: 'Missed CIA / Internal Assessment Due to Medical Emergency',
    category: 'Internal Exams & CIA',
    recipientName: 'Prof. K. Venkatesh (Exam Coordinator)',
    role: 'Professor / Faculty',
    courseCode: 'CS 302 (Data Structures) · Reg: 23CS088',
    situation: 'Missed the 9:00 AM Continuous Internal Assessment (CIA-1) exam due to high viral fever and urgent clinic visit. Terrified of losing internal marks.',
    roughDraft: 'Sir I am so sorry I missed CIA exam today because local train got cancelled and I got fever. Please sir conduct re-test for me otherwise my internal marks and CGPA will be ruined please sir.',
    stressLevel: 'Panicked',
    tag: 'CIA Re-test Request'
  },
  {
    id: 'project-guide-synopsis-delay',
    title: 'Major Project Guide Review Delay (Need 48h for Working Demo)',
    category: 'Project Guide & Lab',
    recipientName: 'Dr. Radhika Sundaram (Project Supervisor)',
    role: 'Project Guide / Research Supervisor',
    courseCode: 'B.Tech Major Project · Phase II · Team 14',
    situation: 'Project review is scheduled for tomorrow morning, but model inference code had a critical deadlock bug. Need 48 hours to finalize the demo video and benchmark report.',
    roughDraft: 'Respected guide madam, our project model code was crashing last night so we could not make ppt. Can you please postpone our review to Friday madam? We will surely finish it.',
    stressLevel: 'Stressed',
    tag: 'Guide Review Extension'
  },
  {
    id: 'tpo-placement-exam-clash',
    title: 'Campus Placement Interview Clashing with Semester Practical Exam',
    category: 'Placements & Recs',
    recipientName: 'Mr. Rajesh Verma (Training & Placement Officer)',
    role: 'Placement Officer (TPO)',
    courseCode: 'Campus Placement Cell · Roll: 22IT045',
    situation: 'Final technical interview slot is scheduled at 2:30 PM, which exactly overlaps with mandatory Operating Systems lab practical exam.',
    roughDraft: 'Sir my placement interview and lab exam are at same time 2:30 PM. I cannot miss both. Please change my interview slot immediately otherwise I will lose this job offer.',
    stressLevel: 'Panicked',
    tag: 'TPO Reschedule'
  },
  {
    id: 'lor-higher-studies-ms',
    title: 'Letter of Recommendation (LOR) for GATE & Master\'s Admissions',
    category: 'Placements & Recs',
    recipientName: 'Dr. P. Sivakumar (Professor)',
    role: 'Professor / Faculty',
    courseCode: 'Advanced Database Systems · Batch 2021-2025',
    situation: 'Secured an Outstanding (O) grade in his Database Systems course last year. Applying for M.Tech / MS programs and need a recommendation letter before the application deadline.',
    roughDraft: 'Dear Sir, I am your former student. I am applying for MS abroad and urgently need 3 LORs. Could you please give me a recommendation letter this week? Kindly do the needful.',
    stressLevel: 'Awkward',
    tag: 'Academic LOR'
  },
  {
    id: 'attendance-condonation-shortage',
    title: 'Medical Certificate Submission for Low Attendance (<75%)',
    category: 'On-Duty (OD) & Attendance',
    recipientName: 'Prof. Ananya Iyer (Dean of Academic Affairs)',
    role: 'Dean of Academic Affairs',
    courseCode: 'B.Tech CSE · Semester 6 · Reg: 22CS119',
    situation: 'Attendance fell to 71% due to typhoid fever and hospital recovery last month. Need condonation approval with official medical certificate and prescription attached.',
    roughDraft: 'Respected Madam, I beg to submit that my attendance is 71% because of typhoid fever. Please condone my attendance shortage and allow me to write end semester exam madam.',
    stressLevel: 'Panicked',
    tag: 'Attendance Condonation'
  },
  {
    id: 'grade-rubric-clarification',
    title: 'Internal Marks Totaling & Rubric Evaluation Clarification',
    category: 'Internal Exams & CIA',
    recipientName: 'Dr. Arvind Menon (Course In-Charge)',
    role: 'Professor / Faculty',
    courseCode: 'CS 401 (Computer Networks) · Reg: 23CS052',
    situation: 'Discrepancy in the question 3b rubric marks on the returned CIA paper. Want to politely request paper verification during cabin hours without questioning grading integrity.',
    roughDraft: 'Hello sir, I checked my CIA paper and you gave me only 2 marks for question 3 where I wrote the full routing algorithm correctly. I think my marks were totaled wrong. Please check and increase my marks.',
    stressLevel: 'Awkward',
    tag: 'Marks Verification'
  },
  {
    id: 'prereq-waiver-meeting',
    title: 'Prerequisite Course Waiver & Cabin Office Hours Appointment',
    category: 'Administration & Dean',
    recipientName: 'Prof. Meenakshi Sundaram (Academic Advisor)',
    role: 'Professor / Faculty',
    courseCode: 'Academic Advisory Cell · Dept of CS',
    situation: 'Need departmental approval to take Advanced Machine Learning concurrently with prerequisite Statistics in order to graduate on schedule.',
    roughDraft: 'Madam, I want to take Machine Learning next semester but I have not finished Stats yet. I need to graduate on time so please sign my waiver form. Tell me when you are in your cabin.',
    stressLevel: 'Stressed',
    tag: 'Course Waiver Request'
  }
];
