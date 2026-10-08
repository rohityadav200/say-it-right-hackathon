export interface ToneWarning {
  keyword: string;
  category: 'demanding' | 'defensive' | 'informal' | 'panic';
  message: string;
  suggestion: string;
}

export function scanRoughDraft(text: string): ToneWarning[] {
  if (!text || text.trim().length < 5) return [];

  const lower = text.toLowerCase();
  const warnings: ToneWarning[] = [];

  if (/\basap\b/i.test(lower)) {
    warnings.push({
      keyword: 'ASAP',
      category: 'demanding',
      message: 'Can sound demanding to professors with full schedules.',
      suggestion: 'Use "at your earliest convenience" or "when your schedule allows".'
    });
  }

  if (/\b(not my fault|out of my control)\b/i.test(lower)) {
    warnings.push({
      keyword: 'Defensive framing',
      category: 'defensive',
      message: 'Sounds like shifting blame before taking accountability.',
      suggestion: 'Frame around "due to an unexpected personal obstacle, for which I take responsibility".'
    });
  }

  if (/\b(you need to|you must|you have to)\b/i.test(lower)) {
    warnings.push({
      keyword: 'Directive language',
      category: 'demanding',
      message: 'Telling a professor or superior what they must do triggers natural resistance.',
      suggestion: 'Rephrase as an inquiry: "Would it be possible to..." or "I would be grateful for guidance on..."'
    });
  }

  if (/\b(hey|yo|sup)\b/i.test(lower) && !/\b(they)\b/i.test(lower)) {
    warnings.push({
      keyword: 'Informal greeting',
      category: 'informal',
      message: 'Greetings like "Hey" can read as overly casual in university settings.',
      suggestion: 'Use "Dear Professor [Name]" or "Good morning [Name]".'
    });
  }

  if (/\b(i need to pass|fail this class|ruin my life|ruin my gpa)\b/i.test(lower)) {
    warnings.push({
      keyword: 'High panic / GPA pressure',
      category: 'panic',
      message: 'Puts emotional guilt on the instructor rather than focusing on academic solutions.',
      suggestion: 'Focus on "I am deeply committed to staying on track in this course".'
    });
  }

  if (/[!]{2,}|\?{2,}/.test(text)) {
    warnings.push({
      keyword: 'Multiple exclamation/question marks',
      category: 'panic',
      message: 'Multiple marks (!??) register as frantic shouting.',
      suggestion: 'Use a single polite period or question mark.'
    });
  }

  return warnings;
}
