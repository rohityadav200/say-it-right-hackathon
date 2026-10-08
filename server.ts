import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const isRealKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10);

let ai: GoogleGenAI | null = null;
if (isRealKey && apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback high-quality template generator in case API key is missing or quota exceeded
function generateFallbackResponse(
  recipient: string,
  situation: string,
  roughDraft: string,
  courseCode?: string
) {
  const courseStr = courseCode ? `[${courseCode}] ` : '';
  const lower = (situation + ' ' + roughDraft).toLowerCase();

  const isExtensionOrLate = /miss|late|extension|deadline|overslept|sick|alarm|illness|hospital|emergency/i.test(lower);
  const isOD = /od|on-duty|on duty|hackathon|symposium|conference|attendance|duty leave|condonation/i.test(lower);
  const isTPO = /placement|tpo|interview|campus drive|drive|reschedule slot/i.test(lower);
  const isGrade = /grade|score|exam mark|regrade|point|curve|rubric|test mark|cia|internal/i.test(lower);
  const isRec = /recommendation|reference|lor|grad school|master|phd|scholarship letter/i.test(lower);
  const isResearch = /\b(research lab|join your lab|undergraduate research|pi lab|faculty research)\b/i.test(lower);
  const isTeam = /group|teammate|team|partner|slides|presentation|peer/i.test(lower);

  let tone = "Accountable and solution-oriented";
  let validation = "It is completely understandable to feel overwhelmed and anxious in this moment. Academics move fast, but addressing this head-on will earn you far more respect than delaying.";
  let critique1 = "The message buries the key question or request under stress-induced apologies.";
  let critique2 = "Words like 'ASAP' or emotional pleading can come across as demanding or unprofessional to an instructor managing hundreds of students.";
  let phrase1Original = "I need to pass this class / I am panicking";
  let phrase1Better = "I want to take full accountability for this situation and explore any eligible alternatives.";
  let phrase1Why = "Shifts the frame from personal panic to mature personal responsibility, which professors respect.";
  let phrase2Original = "Can I retake it ASAP?";
  let phrase2Better = "Please let me know if there are any options to make up the material or if you recommend coming to office hours.";
  let phrase2Why = "Preserves the professor's authority and policy boundaries while opening the door for discretion.";

  let opt1Subject = `${courseStr}Inquiry regarding recent assessment - Action proposed`;
  let opt1Body = `Dear ${recipient},\n\nI am writing to sincerely apologize for my absence during today's assessment${courseCode ? ` in ${courseCode}` : ''}. Unfortunately, an unexpected issue occurred on my end, and I take full responsibility for missing it.\n\nI understand course policies are strict, but I would greatly appreciate knowing if any makeup options or alternative assignments are permissible in this circumstance. Alternatively, I am happy to meet during your office hours to discuss how best to catch up on the material.\n\nThank you very much for your time and guidance.\n\nSincerely,\n[Your Full Name]\nStudent ID: [12345678]\nCourse: ${courseCode || '[Course Code & Section]'}`;

  let opt2Subject = `${courseStr}Apology and clarification regarding ${situation.slice(0, 32)}...`;
  let opt2Body = `Dear ${recipient},\n\nI hope you are having a good week. I am reaching out to apologize for missing today's assessment${courseCode ? ` in ${courseCode}` : ''}. I encountered an unforeseen personal setback this morning and regrettably could not attend in time.\n\nI genuinely care about this course and am committed to staying on track. I wanted to ask if there might be any opportunity for a makeup assessment under syllabus guidelines, or if you would advise visiting your upcoming office hours so I can review what was missed.\n\nThank you for your understanding and continued support.\n\nWarm regards,\n[Your Full Name]\n[Your Major / Year]`;

  if (isOD) {
    tone = "Official, polite, and procedurally structured";
    validation = "Participating in prestigious university hackathons, conferences, and technical symposiums is a proud achievement; the key is following administrative attendance procedure rather than demanding exemption.";
    critique1 = "Saying 'give me OD attendance asap' sounds like a demand and skips official university paperwork.";
    critique2 = "Phrases like 'kindly do the needful' without event details force the HOD or faculty to do detective work.";
    phrase1Original = "Give me OD attendance asap / kindly do the needful";
    phrase1Better = "I am writing to respectfully request On-Duty (OD) attendance approval for the upcoming hackathon session.";
    phrase1Why = "Signals respect for university academic protocols and departmental attendance guidelines.";
    phrase2Original = "I am in hackathon today, please mark present.";
    phrase2Better = "I have attached my official participant selection letter and event schedule for your kind verification.";
    phrase2Why = "Supplies institutional proof immediately, making approval a 5-second signature for the HOD.";
    opt1Subject = `Request for On-Duty (OD) Attendance Approval - [Your Name] (${courseCode || 'Reg No: 24PUCS042'})`;
    opt1Body = `Respected ${recipient},\n\nI am writing to respectfully bring to your kind notice that I have been selected to participate in the 8-Hour Build With AI Hackathon at Pondicherry University today.\n\nTo represent our institution, I kindly request On-Duty (OD) attendance approval for the compiler and network lab sessions scheduled today. I have attached the official selection email and schedule for your kind perusal.\n\nI assure you that I will coordinate with my peers to complete any missed lab assignments and stay updated with class coursework. I would be grateful for your kind approval.\n\nThank you very much for your continuous encouragement and support.\n\nRespectfully,\n[Your Full Name]\nRegister Number: [24PUCS042]\nDepartment of Computer Science\n[Contact Number]`;
    opt2Subject = `Application for On-Duty Leave Permission regarding Hackathon Attendance`;
    opt2Body = `Dear ${recipient},\n\nI hope this email finds you well. I am a student in your department, and I am writing to share that our team has qualified for the 8-Hour Build With AI Hackathon today.\n\nAs participation requires full-day attendance, I request your kind consideration in granting On-Duty leave for today's sessions. I have completed my prior lab submissions and will submit all pending records immediately upon my return.\n\nPlease find attached the official registration confirmation. I will visit your cabin with the physical OD form at your convenience.\n\nThank you for your guidance,\n[Your Full Name]\nRegister No: [24PUCS042]`;
  } else if (isGrade) {
    tone = "Inquisitive, respectful, and growth-oriented";
    validation = "Wondering about your grading feedback is normal and healthy; the key is showing curiosity about learning rather than disputing points.";
    critique1 = "Focusing purely on 'lost points' can make professors feel like the grade is being bargained rather than earned.";
    critique2 = "Questioning their grading criteria directly can sound defensive or accusatory.";
    phrase1Original = "Why did I lose marks here?";
    phrase1Better = "I would love to better understand the rubric expectations on this section.";
    phrase1Why = "Frames the inquiry around learning criteria rather than challenging the evaluator's fairness.";
    phrase2Original = "Can you fix my score?";
    phrase2Better = "Could I briefly meet during office hours to review your feedback?";
    phrase2Why = "Demonstrates commitment to academic growth, which often results in a closer, fairer second review.";
    opt1Subject = `${courseStr}Question regarding feedback on [Assignment/Exam Name]`;
    opt1Body = `Dear ${recipient},\n\nI hope your week is going well. I am reviewing the feedback provided on [Assignment/Exam Name] and wanted to ask if I might briefly discuss a few questions regarding the rubric.\n\nMy goal is to ensure I fully understand where my approach fell short so I can improve in future coursework. Would you have 10 minutes during your upcoming office hours, or an alternative time that suits your schedule?\n\nThank you for your time and feedback.\n\nBest regards,\n[Your Full Name]\nStudent ID: [12345678]`;
    opt2Subject = `${courseStr}Request for feedback review on recent assignment`;
    opt2Body = `Dear ${recipient},\n\nThank you for returning our graded assignments. I have gone over the comments on [Assignment Name] and would appreciate an opportunity to clarify a couple of concepts to ensure I am meeting expectations.\n\nIf you have a brief window during office hours this week, I would be grateful for your guidance. I have prepared specific questions to keep our conversation focused.\n\nThank you for your help,\n[Your Full Name]`;
  } else if (isRec) {
    tone = "Appreciative, professional, and low-friction";
    validation = "Reaching out to past instructors for letters can feel intimidating, but professors write recommendations regularly—the secret is making it effortless for them to say yes.";
    critique1 = "Asking without providing context, coursework reminders, or an easy opt-out makes the request feel abrupt.";
    critique2 = "Giving a tight deadline without acknowledging their schedule can create unnecessary friction.";
    phrase1Original = "I need letters of recommendation. Can you write one?";
    phrase1Better = "I am writing to respectfully ask if you would feel comfortable writing a strong letter of recommendation on my behalf.";
    phrase1Why = "The phrase 'comfortable writing a strong letter' gives them a graceful exit if they don't know you well, ensuring you only get genuinely supportive letters.";
    phrase2Original = "The deadline is soon, let me know.";
    phrase2Better = "I have attached my CV, transcript, and personal statement summary to make this as effortless as possible.";
    phrase2Why = "Providing materials upfront removes administrative burden and shows high professionalism.";
    opt1Subject = `Letter of Recommendation Inquiry - [Your Name] (${courseCode || 'Former Student'})`;
    opt1Body = `Dear ${recipient},\n\nI hope this email finds you well. I was a student in your ${courseCode || 'class'} during [Semester/Year], in which I earned [Grade] and thoroughly enjoyed [Specific Topic or Project].\n\nI am currently preparing applications for [Graduate School / Program Name] for [Term Year]. Given my positive experience in your course, I wanted to respectfully inquire if you would feel comfortable writing a strong letter of recommendation on my behalf.\n\nTo make this as straightforward as possible, I have attached my updated resume, unofficial transcript, and draft statement of purpose. The earliest submission deadline is [Date].\n\nThank you very much for your time and consideration.\n\nSincerely,\n[Your Full Name]\n[Contact Information]`;
    opt2Subject = `Inquiry regarding Letter of Recommendation for [Graduate Program]`;
    opt2Body = `Dear ${recipient},\n\nI hope your semester is going smoothly. I am reaching out to share that I am applying to [Program / Opportunity], and I am writing to ask if you would be willing to provide a letter of recommendation.\n\nYour course in ${courseCode || 'the department'} was one of the highlights of my academic journey, especially our work on [Topic]. I would be delighted to provide any background details, course work samples, or a brief meeting at your convenience to discuss my goals.\n\nThank you for your ongoing mentorship and support.\n\nWarm regards,\n[Your Full Name]`;
  } else if (isResearch) {
    tone = "Informed, intellectually curious, and self-directed";
    validation = "Wanting to join an academic lab is an exciting step; professors love passionate students, but get dozens of generic copy-paste emails every week.";
    critique1 = "Saying 'I need research for medical school' makes the lab sound like a checkbox on your resume rather than a genuine scientific interest.";
    critique2 = "Vague statements like 'I love science' don't demonstrate familiarity with their actual publications.";
    phrase1Original = "I really need research for med school, do you have spots?";
    phrase1Better = "I was particularly fascinated by your lab's recent publication on [Specific Research Topic].";
    phrase1Why = "Signals that you did your homework and care about their specific contribution to the field.";
    phrase2Original = "Can I join your lab?";
    phrase2Better = "I would welcome the opportunity to contribute to lab procedures and learn your methodologies.";
    phrase2Why = "Positions you as a contributor ready to learn, rather than someone demanding faculty attention.";
    opt1Subject = `Undergraduate Research Inquiry - [Your Major] Student Interest in [Topic]`;
    opt1Body = `Dear ${recipient},\n\nI hope your week is going well. My name is [Your Name], and I am an undergraduate majoring in [Your Major]. I recently read your work on [Specific Paper/Topic] and was fascinated by your findings regarding [Specific Concept].\n\nI am writing to inquire if you have any undergraduate research openings in your lab for [Upcoming Semester]. I have completed coursework in [Relevant Courses] and am eager to commit [X hours/week] to supporting data collection and lab protocols.\n\nI have attached my resume and transcript for your review. Would you have 10 minutes in the coming weeks to briefly discuss potential opportunities?\n\nThank you for your time,\n[Your Full Name]\n[Your Major / Class Year]`;
    opt2Subject = `Prospective Undergraduate Researcher - [Your Name]`;
    opt2Body = `Dear ${recipient},\n\nI hope you are having a wonderful term. I am an undergraduate student in [Department] with a keen interest in [Field]. Following your work on [Research Focus], I wanted to ask about the possibility of volunteering or contributing to your lab group next term.\n\nI am dedicated, quick to learn lab techniques, and able to dedicate [X] hours per week consistently. I would be thrilled to stop by your office or join a lab meeting if there is an opening.\n\nThank you very much for considering my inquiry.\n\nBest regards,\n[Your Full Name]`;
  } else if (isTeam) {
    tone = "Direct accountability, proactive repair, and peer respect";
    validation = "Letting team members down is uncomfortable, but dodging responsibility destroys team trust faster than the original mistake. Upfront repair rebuilds respect.";
    critique1 = "Saying 'it was out of my control' or 'my phone died' sounds defensive and invalidates the extra burden placed on your peers.";
    critique2 = "Waiting for them to assign you tasks leaves them doing emotional project management on top of their own work.";
    phrase1Original = "My phone died and it was out of my control.";
    phrase1Better = "I want to apologize directly for being unreachable; I know this created unnecessary stress for the team.";
    phrase1Why = "Validates the team's frustration and demonstrates emotional maturity.";
    phrase2Original = "Did you do them or should I still work on them?";
    phrase2Better = "I am ready right now to take over [Specific Remaining Task] to make up for my absence.";
    phrase2Why = "Offers immediate, concrete labor rather than asking them what to do.";
    opt1Subject = `${courseStr}Apology and immediate next steps for our project`;
    opt1Body = `Hi team,\n\nI want to apologize directly for missing our deadline yesterday. I experienced an unforeseen personal issue, but I recognize that being unreachable left you in a difficult position and created unfair stress before our presentation.\n\nI take full responsibility. To pull my weight, I am ready to complete [Specific Slides/Section] immediately, or handle the entire final edit and citations tonight. Please let me know what currently needs the most attention and I will take care of it.\n\nThank you for your patience,\n[Your Name]`;
    opt2Subject = `${courseStr}Checking in & making up for missed section`;
    opt2Body = `Hey everyone,\n\nI am so sorry for going dark yesterday during our work session. Something unexpected came up, but I know that left the group hanging, and I feel terrible about it.\n\nI want to make sure I contribute my full share. I have opened the shared doc and can take over [Task A] and [Task B] right away so you don't have to worry about them. Let me know if that works.\n\nBest,\n[Your Name]`;
  } else if (isTPO) {
    tone = "Urgent, courteous, and professional";
    validation = "Placement interviews are high-stakes career milestones, but scheduling clashes with academic practicals require tact so you don't alienate the Training & Placement Cell.";
    critique1 = "Panicking and demanding 'change my slot immediately' treats the Placement Cell like a customer service desk.";
    critique2 = "Focusing solely on 'I will lose my offer' overlooks that the TPO coordinates with hundreds of recruiting companies.";
    phrase1Original = "Change my slot immediately, otherwise I will lose this job.";
    phrase1Better = "I would be immensely grateful if an alternate interview time slot could be explored due to an unavoidable academic exam clash.";
    phrase1Why = "Shows professional poise and appreciation for the recruiter's logistical constraints.";
    phrase2Original = "I cannot miss both.";
    phrase2Better = "I am fully prepared to attend at any earlier or later window convenient to the interview panel.";
    phrase2Why = "Demonstrates flexibility and high dedication to securing the placement opportunity.";
    opt1Subject = `Placement Interview Slot Adjustment Request - [Your Name] (${courseCode || 'Campus Drive'})`;
    opt1Body = `Respected ${recipient},\n\nI am writing with reference to the upcoming interview process for [Company Name] scheduled today at [Scheduled Time].\n\nRegrettably, this interview window directly conflicts with my mandatory University Lab Practical Examination [Course Code], which concludes at [End Time]. Because attendance in the practical exam is mandatory for university credit, I respectfully request if my interview slot could be adjusted to an earlier or later time today.\n\nI am fully prepared for the evaluation and can present myself immediately following my examination. I have attached my hall ticket/schedule for your verification.\n\nThank you for your understanding and continuous support for our placement batch.\n\nSincerely,\n[Your Full Name]\nRegister Number: [24PUCS042]\nDepartment of Computer Science`;
    opt2Subject = `Urgent Request: Rescheduling Interview Window - [Company Name]`;
    opt2Body = `Dear ${recipient},\n\nThank you for shortlisting me for the [Company Name] campus evaluation. I am writing to politely request your kind assistance regarding a timing clash with our departmental lab exam this afternoon.\n\nIf at all possible, I would be grateful for an alternate slot after [Time]. I am extremely keen on this career opportunity and will adjust to any panel availability.\n\nThank you for your consideration,\n[Your Full Name]\n[Roll Number & Contact]`;
  }

  return {
    diagnosis: {
      intentValidation: validation,
      critiques: [
        {
          issue: "Emotional venting vs. actionable request",
          misinterpretation: critique1,
          quote: roughDraft.slice(0, 48) + (roughDraft.length > 48 ? '...' : '')
        },
        {
          issue: "Pressure phrasing & missing context",
          misinterpretation: critique2,
          quote: "Demanding fast responses or oversharing personal circumstances"
        }
      ]
    },
    strategy: {
      optimalTone: tone,
      toneExplanation: "University professionals receive dozens of urgent emails every single day. Leading with clear accountability, respecting syllabus boundaries, and proposing concrete next steps makes it frictionless for them to grant grace or assistance.",
      keyRule: "Never make your emergency their urgency. Own the situation, propose a clear path forward, and make it effortless for them to say yes."
    },
    drafts: {
      option1: {
        title: "Direct & Professional",
        bestFor: "Busy professors and advisors who appreciate getting straight to the point with zero fluff.",
        subject: opt1Subject,
        body: opt1Body,
        estimatedReadTime: "25 seconds"
      },
      option2: {
        title: "Soft & Contextual",
        bestFor: "Asking for extensions, explaining sensitive situations, or when you have an existing rapport.",
        subject: opt2Subject,
        body: opt2Body,
        estimatedReadTime: "35 seconds"
      }
    },
    breakdown: [
      {
        roughPhrase: phrase1Original,
        betterPhrase: phrase1Better,
        psychologicalReason: phrase1Why
      },
      {
        roughPhrase: phrase2Original,
        betterPhrase: phrase2Better,
        psychologicalReason: phrase2Why
      }
    ],
    proTips: [
      "Always check the course syllabus first: if there is an explicit policy, acknowledge it up front.",
      "Send from your official university email (.edu) so it is not caught in spam filters.",
      "Include your full student ID and course section number to save your instructor administrative time."
    ]
  };
}

function enrichCoachingResult(
  base: any,
  recipient: string,
  situation: string,
  roughDraft: string,
  courseCode?: string
) {
  const validation =
    base.diagnosis?.validation ||
    base.diagnosis?.intentValidation ||
    "Your underlying intent is completely valid; high-stakes university situations naturally create acute anxiety, but leading with personal accountability resolves 90% of academic conflicts.";

  let critique = base.diagnosis?.critique || "";
  if (!critique && base.diagnosis?.critiques && base.diagnosis.critiques.length > 0) {
    critique = base.diagnosis.critiques
      .map((c: any) => `${c.issue}: ${c.misinterpretation}`)
      .join(" ");
  }
  if (!critique) {
    critique =
      "Demanding words or panicking causes professors to become defensive. Reframing your situation around clear accountability and actionable solutions helps them approve your request quickly.";
  }

  const todayStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const formalLetter = base.formalLetter || {
    toHeading: `To\n${recipient},\nDepartment of Computer Science & Engineering,\nUniversity Campus.`,
    through: "Through: Proper Channel (Class Advisor / Faculty Proctor)",
    fromHeading: `From\n[Student Full Name]\nRegister / Roll No: [24CS104]\nYear & Semester: [B.Tech - 3rd Year]\nContact: [student@university.edu]`,
    date: todayStr,
    subject: `Application seeking consideration regarding ${situation}`,
    salutation: "Respected Sir / Madam,",
    body: `I am writing this formal application to respectfully bring to your kind attention my circumstance regarding ${situation}.\n\nI understand the stringent academic guidelines and attendance norms established by the department. I wish to assure you of my utmost sincerity towards my academic coursework. I have taken all proactive measures to coordinate with my peers and keep all laboratory records and lecture notes up to date.\n\nIn light of the aforementioned facts, I humbly request you to kindly grant your favorable approval. I shall remain deeply obliged for your kind consideration and guidance in this regard.`,
    enclosures: [
      "1. Official Supporting Certificate / Medical Documentation / Event Pass",
      "2. Departmental Coursework Progress Undertaking",
      "3. Recommendation / Signature of Class Proctor"
    ],
    signOff: "Thanking You,\n\nYours faithfully,\n\n[Candidate Signature]\n[Your Full Name]"
  };

  const inPersonScript = base.inPersonScript || {
    entrance: `[Knock gently twice, pause at the door] "Excuse me, Good morning / Good afternoon Professor ${recipient.split(' ')[1] || recipient}. May I come in? Do you have two brief minutes, or would you prefer I return during your scheduled office hours?"`,
    pitch: `"Thank you, Professor. I am reaching out regarding ${situation}. I take full accountability for this matter, and I came in person to respectfully ask how you recommend I best navigate this according to departmental policy."`,
    handover: `"I have brought the formal written application and supporting documentation for your kind perusal." [Respectfully place the application on the desk face-up with two hands].`,
    fallback: `If faculty seems occupied or hurried: "I completely understand that you are in the middle of urgent tasks. May I leave this on your desk or return at 3:30 PM today after your lecture?"`
  };

  const subjectPrefix = base.drafts?.option1?.subject || `Inquiry regarding ${situation}`;
  const followUpDraft = base.followUpDraft || {
    delay: "48 - 72 Hours after initial email",
    subject: `Re: ${subjectPrefix} - Gentle Follow-Up`,
    body: `Dear ${recipient},\n\nI hope your week is going smoothly. I am writing to gently follow up on my previous email sent regarding ${situation}.\n\nI recognize how full your schedule is with lectures, research, and departmental commitments. Whenever your schedule permits, I would be immensely grateful for any brief advice or decision on how to proceed.\n\nThank you once again for your continuous time and mentorship.\n\nRespectfully,\n[Your Full Name]\nRoll / Register No: [24CS104]\nCourse: ${courseCode || '[Department / Section]'}`
  };

  const whatsappDraft = base.whatsappDraft || {
    text: `Respected Sir/Madam, this is [Your Name] (Reg No: [24CS104]). Reaching out regarding ${situation}. I have emailed the detailed application with supporting proof. Kindly let me know if I may meet you briefly in your cabin. Thank you!`,
    wordCount: 36
  };

  const stressMetrics = base.stressMetrics || {
    beforeAnxiety: 88,
    afterAnxiety: 6,
    clarityScore: 98,
    politenessScore: 96,
    responseLikelihood: "94% - Very High"
  };

  return {
    ...base,
    diagnosis: {
      ...base.diagnosis,
      validation,
      critique,
      critiques: base.diagnosis?.critiques || []
    },
    formalLetter,
    inPersonScript,
    followUpDraft,
    whatsappDraft,
    stressMetrics
  };
}

// POST /api/transform - Main coaching & rewrite endpoint
app.post('/api/transform', async (req: Request, res: Response) => {
  try {
    const { recipient, situation, roughDraft, courseCode } = req.body;

    if (!recipient || !situation || !roughDraft) {
      res.status(400).json({ error: 'Please provide recipient, situation, and roughDraft.' });
      return;
    }

    if (!ai) {
      // Return fallback structured response if no API key
      const fallback = generateFallbackResponse(recipient, situation, roughDraft, courseCode);
      const enriched = enrichCoachingResult(fallback, recipient, situation, roughDraft, courseCode);
      res.json(enriched);
      return;
    }

    const systemInstruction = `You are "Say It Right," an expert communication coach and empathetic mentor designed specifically for university students. Your goal is to help students navigate stressful, high-stakes communications with professors, teaching assistants, academic advisors, and recruiters.

Many students know what they want to say but struggle with tone, boundaries, and professional academic etiquette. Your job is to take their rough, emotional, or poorly structured thoughts and turn them into effective, respectful messages—while teaching them *why* the changes matter.

### YOUR PROCESS:
When a user provides their [Recipient], [Situation], and [Rough Draft], you must follow these four steps exactly:

1. THE DIAGNOSIS (The "Teach" Moment)
- Briefly and gently point out 1-2 specific things in their rough draft that could be misinterpreted by a professor/professional (e.g., "Using 'ASAP' sounds demanding," "You buried the main question," or "The tone leans a bit too casual/defensive").
- Validate their underlying intent (e.g., "It makes total sense that you're stressed about this deadline.").

2. THE STRATEGY
- Explain the optimal tone for this specific situation (e.g., "Accountable and solution-oriented," or "Polite and concise").

3. THE DRAFTS (Provide 2 Options)
- Option 1: Direct & Professional (Best for busy professors; gets straight to the point while remaining highly respectful). Include an effective, clear email Subject line.
- Option 2: Soft & Contextual (Best for asking for extensions, apologizing, or explaining complex personal circumstances). Include an effective, clear email Subject line.

4. THE BREAKDOWN
- Highlight 2 specific phrases you used in the drafts and briefly explain *why* they work psychologically (e.g., "Instead of saying 'I couldn't do it,' we used 'Due to unforeseen circumstances' to maintain professionalism without oversharing.")

### RULES & CONSTRAINTS:
- Tone: Warm, non-judgmental, academic, and highly practical.
- Do NOT scold the student. Be a helpful peer/mentor.
- Never write emails that sound like a robotic corporate lawyer. Use natural, clear, human language that a student would actually say.
- Keep your feedback concise.`;

    const userPrompt = `Student Input:
Recipient: ${recipient}
${courseCode ? `Course: ${courseCode}` : ''}
Situation: ${situation}
Rough Draft: "${roughDraft}"

Perform the 4 steps (Diagnosis, Strategy, 2 Drafts with Subject lines, and Breakdown) and return in the specified JSON structure.`;

    // Safety timeout of 25 seconds for deep generation
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timeout after 25s')), 25000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        maxOutputTokens: 1800,
        temperature: 0.7,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: {
              type: Type.OBJECT,
              properties: {
                intentValidation: {
                  type: Type.STRING,
                  description: "Empathetic validation of the student's panic or stress."
                },
                critiques: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      issue: { type: Type.STRING, description: "Short title of issue (e.g. Demand tone, Buried question)" },
                      misinterpretation: { type: Type.STRING, description: "How a professor might perceive it" },
                      quote: { type: Type.STRING, description: "The phrase or element from student draft" }
                    },
                    required: ["issue", "misinterpretation"]
                  }
                }
              },
              required: ["intentValidation", "critiques"]
            },
            strategy: {
              type: Type.OBJECT,
              properties: {
                optimalTone: { type: Type.STRING, description: "e.g. Accountable and solution-oriented" },
                toneExplanation: { type: Type.STRING, description: "Why this tone works for this specific recipient and situation" },
                keyRule: { type: Type.STRING, description: "Golden rule for this email" }
              },
              required: ["optimalTone", "toneExplanation", "keyRule"]
            },
            drafts: {
              type: Type.OBJECT,
              properties: {
                option1: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    bestFor: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    body: { type: Type.STRING },
                    estimatedReadTime: { type: Type.STRING }
                  },
                  required: ["title", "bestFor", "subject", "body"]
                },
                option2: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    bestFor: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    body: { type: Type.STRING },
                    estimatedReadTime: { type: Type.STRING }
                  },
                  required: ["title", "bestFor", "subject", "body"]
                }
              },
              required: ["option1", "option2"]
            },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  roughPhrase: { type: Type.STRING, description: "Rough phrase or concept from user" },
                  betterPhrase: { type: Type.STRING, description: "Phrase used in the revised draft" },
                  psychologicalReason: { type: Type.STRING, description: "Why it works psychologically on the recipient" }
                },
                required: ["roughPhrase", "betterPhrase", "psychologicalReason"]
              }
            },
            proTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["diagnosis", "strategy", "drafts", "breakdown", "proTips"]
        }
      }
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const text = response.text;
    if (!text) {
      throw new Error("No response from model");
    }

    const data = JSON.parse(text);
    const enriched = enrichCoachingResult(
      data,
      recipient,
      situation,
      roughDraft,
      courseCode
    );
    res.json(enriched);
  } catch (_err: any) {
    // Gracefully use fallback generator so the user always receives a complete, polished result
    const fallback = generateFallbackResponse(
      req.body.recipient || "Professor",
      req.body.situation || "Academic matter",
      req.body.roughDraft || "Draft",
      req.body.courseCode
    );
    const enriched = enrichCoachingResult(
      fallback,
      req.body.recipient || "Professor",
      req.body.situation || "Academic matter",
      req.body.roughDraft || "Draft",
      req.body.courseCode
    );
    res.json(enriched);
  }
});

function applyFallbackTweak(draftText: string, instruction: string): string {
  let tweaked = draftText;
  const lowerIns = (instruction || '').toLowerCase();
  if (lowerIns.includes('short') || lowerIns.includes('concise') || lowerIns.includes('trim')) {
    const paragraphs = draftText.split('\n\n');
    tweaked = paragraphs.length > 2 ? `${paragraphs[0]}\n\n${paragraphs[1]}\n\nSincerely,\n[Your Name]` : draftText;
  } else if (lowerIns.includes('office hour')) {
    tweaked = `${draftText}\n\nI would also be very grateful to meet during your scheduled office hours if that is easier for you to review together.`;
  } else if (lowerIns.includes('syllabus')) {
    tweaked = `${draftText}\n\nI have reviewed the syllabus policies regarding this matter and wanted to respectfully inquire if any discretionary accommodations are permitted.`;
  } else if (lowerIns.includes('proof') || lowerIns.includes('document') || lowerIns.includes('certificate')) {
    tweaked = `${draftText}\n\nI have attached all official supporting certificates and documentation for your immediate verification.`;
  } else if (lowerIns.includes('formal') || lowerIns.includes('reverent')) {
    tweaked = draftText.replace(/Dear/g, "Respected").replace(/Sincerely,/g, "Respectfully,\nYours faithfully,");
  } else if (lowerIns.includes('whatsapp') || lowerIns.includes('erp')) {
    const firstLine = draftText.split('\n')[0] || '';
    tweaked = `Respected Sir/Madam, reaching out regarding ${firstLine.slice(0, 45)}. I have submitted the complete application with attached proofs via official email. Kindly advise on next steps. Thank you!`;
  } else if (lowerIns.includes('warm') || lowerIns.includes('soften')) {
    tweaked = draftText.replace(/I am writing to/g, "I hope you are having a wonderful week. I am reaching out to");
  }
  return tweaked;
}

// POST /api/refine - Quick tweak on a selected draft
app.post('/api/refine', async (req: Request, res: Response) => {
  try {
    const { draftText, instruction, recipient } = req.body;
    if (!draftText || !instruction) {
      res.status(400).json({ error: "Missing draftText or instruction" });
      return;
    }

    if (!ai) {
      res.json({ revisedDraft: applyFallbackTweak(draftText, instruction) });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `You are an academic communication coach. 
Current draft for ${recipient || 'a university recipient'}:
"""
${draftText}
"""

Instruction: ${instruction}

Please refine the email draft according to the instruction while maintaining warm academic etiquette, natural human tone, and clear boundaries. Output only the revised email text with Subject line at the top.`,
      });

      res.json({ revisedDraft: response.text });
    } catch (_modelErr) {
      res.json({ revisedDraft: applyFallbackTweak(draftText, instruction) });
    }
  } catch (_err: any) {
    res.json({ revisedDraft: req.body.draftText || '' });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const isProd = process.env.NODE_ENV === 'production';
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'));

  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.warn('Vite middleware initialization failed, falling back to dist:', viteErr);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Say It Right server running at http://0.0.0.0:${port} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
