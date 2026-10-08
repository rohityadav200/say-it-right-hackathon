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
    id: 'retire-beg-to-state',
    title: 'Retiring "I Beg to State That..."',
    badge: 'Modern Professionalism',
    summary: 'Colonial-era formulas like "I beg to state" or "Most humbly and respectfully I submit" sound dated and submissive rather than professionally confident.',
    goldenRule: 'Replace archaic pleading with respectful, clear intent: "I am writing to respectfully request..." or "I am writing to bring to your kind attention..."',
    doText: '"Dear Dr. Chithralekha, I am writing to respectfully request On-Duty attendance approval for..."',
    dontText: '"Respected Madam, I beg to submit that I am student of your dept..."'
  },
  {
    id: 'do-the-needful-trap',
    title: 'The "Kindly Do the Needful" Trap',
    badge: 'Actionable Clarity',
    summary: 'Indian students often end emails with "Kindly do the needful ASAP". Faculty and HODs find this vague and passive-aggressive because it pushes the administrative burden back onto them.',
    goldenRule: 'State the exact next step you need: whether it is a signature on an OD form, a 10-minute meeting in their cabin, or verification of an attached medical certificate.',
    doText: '"Could you kindly sign the attached OD form, or advise if I should visit your cabin after 3 PM today?"',
    dontText: '"Please look into this and kindly do the needful ASAP."'
  },
  {
    id: 'reg-number-protocol',
    title: 'The Register Number & Section Protocol',
    badge: 'Administrative Courtesy',
    summary: 'In Indian colleges and central universities, faculty teach 120+ students across multiple sections. Emails without your Register / Roll Number get ignored.',
    goldenRule: 'Always format your sign-off with: Full Name · Register/Roll Number · Department & Section · Contact Number.',
    doText: 'Signature: Mukesh Kumar · Reg No: 24PUCS042 · M.Tech Computer Science (Sem 1) · Mobile: +91 98765 43210',
    dontText: 'Signing off with just your first name: "Regards, Mukesh"'
  },
  {
    id: 'cabin-visit-etiquette',
    title: 'The Faculty Cabin Etiquette Bridge',
    badge: 'Discretion & Empathy',
    summary: 'In Indian universities, internal marks adjustments, condonation approvals, and project reviews are rarely decided purely over email. The email is a polite bridge to a cabin meeting.',
    goldenRule: 'Use your email to explain the situation, attach proofs (medical slips, hackathon acceptance letters), and request a 5-minute slot during their cabin/office hours.',
    doText: '"I have attached the hackathon selection email and would be grateful to visit your cabin briefly at your convenience."',
    dontText: '"Sir change my marks and reply to this email right now."'
  },
  {
    id: 'salutation-hierarchy',
    title: 'Addressing Faculty, HODs & Deans',
    badge: 'First Impressions',
    summary: 'Navigating titles in Indian academia: PhD holders should be addressed as "Dr. [Last Name]" or "Professor [Last Name]". Avoid casual "Hi Sir" or "Hey Prof".',
    goldenRule: 'For Faculty: "Dear Dr. [Surname]" or "Respected Professor [Surname]". For HODs: "Dear Head of Department / Dr. [Surname]". Avoid "Dear Sir/Madam" if you already know their name.',
    doText: '"Dear Dr. Venkatesh," or "Dear Professor Swaminathan,"',
    dontText: '"Hey sir," "Hi Prof," or "Dear Sir/Madam"'
  }
];
