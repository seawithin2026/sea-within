/**
 * SEA WITHIN — Safety‑Focused Positive Vibe Moderation System
 *
 * ✔ Protects viewers from harmful, dark, or aggressive content
 * ✔ Blocks cruelty, hate, harassment, violence, self‑harm, trauma dumping
 * ✔ Blocks low‑vibration complaining or negativity spirals
 * ✔ Allows gentle honesty, soft vulnerability, reflection, and neutral thoughts
 * ✔ Encourages warm, supportive, uplifting energy without forcing fake positivity
 *
 * This is the Sea Within safety standard.
 */

// Harmful or dangerous content — ALWAYS blocked
const BLOCKED_PATTERNS: RegExp[] = [
  // Profanity / insults
  /\b(damn|hell|crap|stupid|idiot|dumb|ugly|hate|suck|loser|freak|creep|jerk|fool)\b/i,

  // Aggression / violence
  /\b(kill|die|death|destroy|attack|fight|punch|slap|hurt|abuse|threat)\b/i,

  // Harassment
  /\b(shut\s*up|go\s*away|nobody\s*(cares|asked)|get\s*(lost|out))\b/i,

  // Discrimination
  /\b(racist|sexist|bigot)\b/i,

  // Self‑harm / suicidal content
  /\b(self.?harm|suicid|cut\s*my|end\s*(it|my\s*life))\b/i,

  // Spam
  /(.)\1{5,}/i,
  /(https?:\/\/\S+){2,}/i,
  /\b(buy|sell|discount|promo|click\s*here|subscribe|free\s*money)\b/i,
];

// Heavy negativity / trauma dumping — NOT allowed
const HEAVY_NEGATIVITY = /\b(hopeless|worthless|pointless|nothing\s*matters|i\s*give\s*up|life\s*is\s*terrible|i\s*can.?t\s*do\s*this)\b/i;

// Positive indicators — gently increase score
const POSITIVE_INDICATORS: RegExp[] = [
  /\b(grateful|thankful|blessed|appreciate|beautiful|wonderful|amazing|love|peace|calm)\b/i,
  /\b(breath|breathe|meditat|reflect|journey|grow|heal|hope|inspire|uplift)\b/i,
  /\b(kind|gentle|warm|support|encourage|strength|courage|wisdom|light)\b/i,
  /\b(nature|ocean|earth|sky|stars|sun|moon|water|fire|wind)\b/i,
  /\b(welcome|thank\s*you|sending\s*(love|warmth|light)|good\s*morning|bless)\b/i,
];

export interface ModerationResult {
  approved: boolean;
  score: number;
  reason?: string;
  message?: string;
  flags: string[];
}

export function moderateContent(content: string): ModerationResult {
  const flags: string[] = [];
  let score = 0;

  // Empty content
  if (!content || content.trim().length < 2) {
    return {
      approved: false,
      score: 0,
      reason: 'empty_content',
      message: 'Please share something meaningful with the community.',
      flags: ['empty'],
    };
  }

  // 1. Block harmful, hateful, or aggressive content
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      flags.push(`blocked_pattern: ${pattern.source}`);
      return {
        approved: false,
        score: -1,
        reason: 'harmful_content',
        message:
          'This space is for gentle, supportive, and uplifting energy. Please avoid harsh or attacking language.',
        flags,
      };
    }
  }

  // 2. Block heavy negativity / trauma dumping
  if (HEAVY_NEGATIVITY.test(content)) {
    return {
      approved: false,
      score: -0.5,
      reason: 'heavy_negative',
      message:
        'This space is for light, reflection, and gentle honesty — not heavy emotional dumping. Try sharing a softer, more reflective version.',
      flags: ['heavy_negative'],
    };
  }

  // 3. Positive indicators (soft encouragement)
  for (const pattern of POSITIVE_INDICATORS) {
    if (pattern.test(content)) {
      score += 0.15;
    }
  }

  // 4. ALL CAPS detection (shouting)
  const uppercaseRatio = (content.match(/[A-Z]/g)?.length || 0) / content.length;
  if (uppercaseRatio > 0.7 && content.length > 10) {
    flags.push('excessive_caps');
    score -= 0.2;
  }

  // 5. Excessive punctuation
  if (/[!?]{3,}/.test(content)) {
    flags.push('excessive_punctuation');
    score -= 0.1;
  }

  // Normalize score
  score = Math.max(-1, Math.min(1, score));

  // 6. APPROVE all gentle, reflective, neutral, soft content
  return {
    approved: true,
    score,
    reason: 'approved',
    message: undefined,
    flags,
  };
}
