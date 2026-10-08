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
  const isExtensionOrLate = /miss|late|extension|deadline|overslept|sick|alarm/i.test(situation + ' ' + roughDraft);
  const isGrade = /grade|score|exam mark|regrade|point/i.test(situation + ' ' + roughDraft);
  const isRecOrResearch = /recommendation|reference|research|lab|pi|lor/i.test(situation + ' ' + roughDraft);

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

  let opt1Subject = `${courseStr} Inquiry regarding recent assessment - Action proposed`;
  let opt1Body = `Dear ${recipient},\n\nI am writing to sincerely apologize for my absence during today's assessment${courseStr ? ` in ${courseCode}` : ''}. Unfortunately, an unexpected issue occurred on my end, and I take full responsibility for missing it.\n\nI understand course policies are strict, but I would greatly appreciate knowing if any makeup options or alternative assignments are permissible in this circumstance. Alternatively, I am happy to meet during your office hours to discuss how best to catch up on the material.\n\nThank you very much for your time and guidance.\n\nSincerely,\n[Your Full Name]\nStudent ID: [12345678]\nCourse: ${courseCode || '[Course Code & Section]'}`;

  let opt2Subject = `${courseStr} Apology and clarification regarding ${situation.slice(0, 30)}...`;
  let opt2Body = `Dear ${recipient},\n\nI hope you are having a good week. I am reaching out to apologize for missing today's assessment${courseStr ? ` in ${courseCode}` : ''}. I encountered an unforeseen personal setback this morning and regrettably could not attend in time.\n\nI genuinely care about this course and am committed to staying on track. I wanted to ask if there might be any opportunity for a makeup assessment under syllabus guidelines, or if you would advise visiting your upcoming office hours so I can review what was missed.\n\nThank you for your understanding and continued support.\n\nWarm regards,\n[Your Full Name]\n[Your Major / Year]`;

  if (isGrade) {
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
    opt1Subject = `${courseStr} Question regarding feedback on [Assignment/Exam Name]`;
    opt1Body = `Dear ${recipient},\n\nI hope your week is going well. I am reviewing the feedback provided on [Assignment/Exam Name] and wanted to ask if I might briefly discuss a few questions regarding the rubric.\n\nMy goal is to ensure I fully understand where my approach fell short so I can improve in future coursework. Would you have 10 minutes during your upcoming office hours, or an alternative time that suits your schedule?\n\nThank you for your time and feedback.\n\nBest regards,\n[Your Name]`;
    opt2Subject = `${courseStr} Request for feedback review on recent assignment`;
    opt2Body = `Dear ${recipient},\n\nThank you for returning our graded assignments. I have gone over the comments on [Assignment Name] and would appreciate an opportunity to clarify a couple of concepts to ensure I am meeting expectations.\n\nIf you have a brief window during office hours this week, I would be grateful for your guidance. I have prepared specific questions to keep our conversation focused.\n\nThank you for your help,\n[Your Name]`;
  }

  return {
    diagnosis: {
      intentValidation: validation,
      critiques: [
        {
          issue: "Emotional venting vs. actionable request",
          misinterpretation: critique1,
          quote: roughDraft.slice(0, 45) + "..."
        },
        {
          issue: "Pressure phrasing",
          misinterpretation: critique2,
          quote: "Demanding fast responses or overpromising"
        }
      ]
    },
    strategy: {
      optimalTone: tone,
      toneExplanation: "Professors receive dozens of urgent emails every day. When a student leads with accountability, acknowledges syllabus constraints, and proposes concrete next steps (like office hours), the professor is far more inclined to extend grace or constructive guidance.",
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
      "Always check the syllabus first: if there is an explicit drop-lowest-quiz policy, acknowledge it.",
      "Send from your official university email (.edu) so it bypasses spam filters.",
      "Include your full student ID and section number to save your instructor 3 minutes of roster lookup."
    ]
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
      res.json(fallback);
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
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

    const text = response.text;
    if (!text) {
      throw new Error("No response from model");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (err: any) {
    console.error('Error in /api/transform:', err);
    // If Gemini call fails (e.g. rate limit), gracefully use fallback generator rather than breaking
    const fallback = generateFallbackResponse(
      req.body.recipient || "Professor",
      req.body.situation || "Academic matter",
      req.body.roughDraft || "Draft",
      req.body.courseCode
    );
    res.json(fallback);
  }
});

// POST /api/refine - Quick tweak on a selected draft
app.post('/api/refine', async (req: Request, res: Response) => {
  try {
    const { draftText, instruction, recipient } = req.body;
    if (!draftText || !instruction) {
      res.status(400).json({ error: "Missing draftText or instruction" });
      return;
    }

    if (!ai) {
      let tweaked = draftText;
      const lowerIns = instruction.toLowerCase();
      if (lowerIns.includes('short') || lowerIns.includes('concise') || lowerIns.includes('trim')) {
        const paragraphs = draftText.split('\n\n');
        tweaked = paragraphs.length > 2 ? `${paragraphs[0]}\n\n${paragraphs[1]}\n\nSincerely,\n[Your Name]` : draftText;
      } else if (lowerIns.includes('office hour')) {
        tweaked = `${draftText}\n\nI would also be very grateful to meet during your scheduled office hours if that is easier for you to review together.`;
      } else if (lowerIns.includes('syllabus')) {
        tweaked = `${draftText}\n\nI have reviewed the syllabus policies regarding this matter and wanted to respectfully inquire if any discretionary accommodations are permitted.`;
      } else if (lowerIns.includes('warm') || lowerIns.includes('soften')) {
        tweaked = draftText.replace(/I am writing to/g, "I hope you are having a wonderful week. I am reaching out to");
      }
      res.json({ revisedDraft: tweaked });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an academic communication coach. 
Current draft for ${recipient || 'a university recipient'}:
"""
${draftText}
"""

Instruction: ${instruction}

Please refine the email draft according to the instruction while maintaining warm academic etiquette, natural human tone, and clear boundaries. Output only the revised email text with Subject line at the top.`,
      });

      res.json({ revisedDraft: response.text });
    } catch (modelErr) {
      console.warn('Gemini refine call failed, falling back:', modelErr);
      res.json({ revisedDraft: `${draftText}\n\n[Refined with focus: ${instruction}]` });
    }
  } catch (err: any) {
    console.error('Error in /api/refine:', err);
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
