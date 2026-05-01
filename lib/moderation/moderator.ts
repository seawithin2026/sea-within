/**
 * SEA WITHIN — Positive Vibe Moderation System
 * 
 * Every message passes through this filter before being published.
 * Only uplifting, reflective, and supportive content is allowed.
 * 
 * This system uses keyword detection + sentiment analysis.
 * In production, connect to an AI moderation API for deeper analysis.
 */

// Words and patterns that indicate negativity, aggression, or harmful content
const BLOCKED_PATTERNS: RegExp[] = [
  // Profanity and slurs (basic filter — expand as needed)
  /\b(damn|hell|crap|stupid|idiot|dumb|ugly|hate|suck|loser|freak|creep|jerk|fool)\b/i,
  
  // Aggressive language
  /\b(kill|die|death|destroy|attack|fight|punch|slap|hurt|abuse|threat)\b/i,
  
  // Harassment patterns
  /\b(shut\s*up|go\s*away|nobody\s*(cares|asked)|get\s*(lost|out))\b/i,
  
  // Discriminatory language
  /\b(racist|sexist|bigot)\b/i,
  
  // Self-harm indicators (these should be handled with care and resources)
  /\b(self.?harm|suicid|cut\s*my|end\s*(it|my\s*life))\b/i,
  
  // Spam patterns
  /(.)\1{5,}/i, // Repeated characters
  /(https?:\/\/\S+){2,}/i, // Multiple URLs
  /\b(buy|sell|discount|promo|click\s*here|subscribe|free\s*money)\b/i,
];

// Positive indicators — messages with these are more likely to be approved
const POSITIVE_INDICATORS: RegExp[] = [
  /\b(grateful|thankful|blessed|appreciate|beautiful|wonderful|amazing|love|peace|calm)\b/i,
  /\b(breath|breathe|meditat|reflect|journey|grow|heal|hope|inspire|uplift)\b/i,
  /\b(kind|gentle|warm|support|encourage|strength|courage|wisdom|light)\b/i,
  /\b(nature|ocean|earth|sky|stars|sun|moon|water|fire|wind)\b/i,
  /\b(welcome|thank\s*you|sending\s*(love|warmth|light)|good\s*morning|bless)\b/i,
];

export interface ModerationResult {
  approved: boolean;
  score: number; // -1 (very negative) to 1 (very positive)
  reason?: string;
  message?: string;
  flags: string[];
}

export function moderateContent(content: string): ModerationResult {
  const flags: string[] = [];
  let score = 0;

  // Check for empty or very short content
  if (!content || content.trim().length < 2) {
    return {
      approved: false,
      score: 0,
      reason: 'empty_content',
      message: 'Please share something meaningful with the community.',
      flags: ['empty'],
    };
  }

  // Check for blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      flags.push(`blocked_pattern: ${pattern.source}`);
      score -= 0.4;
    }
  }

  // Check for positive indicators
  let positiveCount = 0;
  for (const pattern of POSITIVE_INDICATORS) {
    if (pattern.test(content)) {
      positiveCount++;
      score += 0.15;
    }
  }

  // ALL CAPS detection (shouting)
  const uppercaseRatio = (content.match(/[A-Z]/g)?.length || 0) / content.length;
  if (uppercaseRatio > 0.7 && content.length > 10) {
    flags.push('excessive_caps');
    score -= 0.2;
  }

  // Excessive punctuation (aggression indicator)
  if (/[!?]{3,}/.test(content)) {
    flags.push('excessive_punctuation');
    score -= 0.1;
  }

  // Normalize score to -1 to 1 range
  score = Math.max(-1, Math.min(1, score));

  // Decision
  const approved = flags.filter((f) => f.startsWith('blocked_pattern')).length === 0 && score >= -0.2;

  return {
    approved,
    score,
    reason: approved ? 'approved' : 'content_filtered',
    message: approved
      ? undefined
      : 'This space is for uplifting, reflective, and supportive communication. Please revise your message with warmth and kindness. 🌿',
    flags,
  };
}

/**
 * Enhanced moderation — connects to AI for deeper analysis.
 * Use this in production for nuanced content understanding.
 */
export async function moderateContentAI(content: string): Promise<ModerationResult> {
  // First pass — local keyword filter
  const localResult = moderateContent(content);

  // If local filter already rejected, return immediately
  if (!localResult.approved) {
    return localResult;
  }

  // In production, add AI-based sentiment analysis here:
  // Example: OpenAI Moderation API, Perspective API, or custom model
  //
  // const aiResult = await fetch('https://api.openai.com/v1/moderations', {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
  //   body: JSON.stringify({ input: content }),
  // });
  //
  // Process AI result and adjust score/approval accordingly

  return localResult;
}
