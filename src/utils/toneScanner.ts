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

  if (/\b(do the needful|kindly do the needful)\b/i.test(lower)) {
    warnings.push({
      keyword: 'Kindly do the needful',
      category: 'demanding',
      message: 'Vague and passive-aggressive to faculty; they dislike having administrative burden dumped on them.',
      suggestion: 'Specify the exact requested action (e.g. "approve the attached OD slip" or "review my attached draft").'
    });
  }

  if (/\b(i beg to state|i beg to submit|most humbly)\b/i.test(lower)) {
    warnings.push({
      keyword: 'I beg to state',
      category: 'informal',
      message: 'Outdated colonial phrasing that sounds submissive rather than professionally confident.',
      suggestion: 'Use "I am writing to respectfully request..." or "I am writing to bring to your kind attention...".'
    });
  }

  if (/\basap\b/i.test(lower)) {
    warnings.push({
      keyword: 'ASAP',
      category: 'demanding',
      message: 'Can sound demanding to professors managing high teaching and research loads.',
      suggestion: 'Use "at your earliest convenience" or "as per your schedule allows".'
    });
  }

  if (/\b(plz|plzz|plsss|pls)\b/i.test(lower)) {
    warnings.push({
      keyword: 'SMS / WhatsApp slang (plz)',
      category: 'informal',
      message: 'Chat abbreviations in university emails register as careless or disrespectful.',
      suggestion: 'Write out "please" or "I would be grateful".'
    });
  }

  if (/\b(not my fault|out of my control)\b/i.test(lower)) {
    warnings.push({
      keyword: 'Defensive framing',
      category: 'defensive',
      message: 'Sounds like shifting blame before taking personal accountability.',
      suggestion: 'Frame around "due to an unexpected travel obstacle, for which I take responsibility".'
    });
  }

  if (/\b(ruin my life|ruin my cgpa|ruin my internal|fail me)\b/i.test(lower)) {
    warnings.push({
      keyword: 'Emotional / CGPA panic',
      category: 'panic',
      message: 'Puts emotional guilt on faculty rather than focusing on university policy and solutions.',
      suggestion: 'State "I am deeply committed to maintaining my academic standing in this subject".'
    });
  }

  if (/[!]{2,}|\?{2,}/.test(text)) {
    warnings.push({
      keyword: 'Multiple marks (!! / ??)',
      category: 'panic',
      message: 'Multiple punctuation marks register as frantic shouting.',
      suggestion: 'Use a single polite period or question mark.'
    });
  }

  return warnings;
}
