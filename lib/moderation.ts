// ============================================
// SEA WITHIN — Positive-Vibe Moderation System
// ============================================
// This system filters all user-generated content
// to maintain a safe, uplifting, supportive atmosphere.

// Words and patterns that indicate negative, harmful, or low-vibration content
const BLOCKED_PATTERNS: RegExp[] = [
  // Profanity and slurs (broad patterns)
  /\b(f+u+c+k+|s+h+i+t+|d+a+m+n+|b+i+t+c+h+|a+s+s+h+o+l+e+)\b/gi,
  // Hate speech indicators
  /\b(hate|hatred|loathe|despise|disgusting)\b/gi,
  // Aggressive language
  /\b(kill|murder|destroy|attack|fight|punch|slap|beat)\b/gi,
  // Bullying patterns
  /\b(stupid|idiot|moron|loser|pathetic|worthless|ugly)\b/gi,
  // Discriminatory language
  /\b(racist|sexist|bigot)\b/gi,
  // Self-harm references
  /\b(suicide|self.harm|cut myself|end it all)\b/gi,
  // Spam patterns
  /\b(buy now|click here|free money|act now)\b/gi,
  // Excessive negativity
  /\b(terrible|horrible|worst|never work|give up|hopeless)\b/gi,
];

// Positive sentiment boosters - content that aligns with Sea Within's energy
const POSITIVE_INDICATORS: string[] = [
  'grateful', 'thankful', 'blessed', 'beautiful', 'peaceful',
  'healing', 'growing', 'learning', 'love', 'compassion',
  'kindness', 'gentle', 'warm', 'light', 'hope',
  'strength', 'courage', 'breathe', 'present', 'mindful',
  'support', 'together', 'community', 'journey', 'awakening',
  'nature', 'ocean', 'waves', 'calm', 'serenity',
  'wisdom', 'insight', 'reflection', 'gratitude', 'joy',
  'renewal', 'transformation', 'sacred', 'sanctuary', 'soul',
];

export interface ModerationResult {
  isApproved: boolean;
  reason?: string;
  confidence: number;
  suggestion?: string;
}

/**
 * Moderates user-generated content for the Sea Within community.
 * Returns approval status and guidance if content is blocked.
 */
export function moderateContent(content: string): ModerationResult {
  const trimmed = content.trim();

  // Empty content check
  if (!trimmed || trimmed.length === 0) {
    return {
      isApproved: false,
      reason: 'empty',
      confidence: 1.0,
      suggestion: 'Please share something meaningful with the community.',
    };
  }

  // Too short check (minimum 3 characters)
  if (trimmed.length < 3) {
    return {
      isApproved: false,
      reason: 'too_short',
      confidence: 1.0,
      suggestion: 'Please share a more complete thought with the community.',
    };
  }

  // Check against blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isApproved: false,
        reason: 'negative_content',
        confidence: 0.9,
        suggestion:
          'This space is for uplifting, reflective, and supportive communication. ' +
          'Please rephrase your message with kindness and compassion.',
      };
    }
  }

  // ALL CAPS check (shouting)
  if (trimmed.length > 10 && trimmed === trimmed.toUpperCase()) {
    return {
      isApproved: false,
      reason: 'all_caps',
      confidence: 0.7,
      suggestion:
        'In this sanctuary, we speak gently. ' +
        'Please rephrase without using all capital letters.',
    };
  }

  // Excessive exclamation/question marks
  const excessivePunctuation = (trimmed.match(/[!?]{3,}/g) || []).length;
  if (excessivePunctuation > 0) {
    return {
      isApproved: false,
      reason: 'excessive_punctuation',
      confidence: 0.6,
      suggestion:
        'This is a calm, reflective space. ' +
        'Please express yourself gently.',
    };
  }

  // Content passes all checks
  // Calculate a positivity score
  const lowerContent = trimmed.toLowerCase();
  const positiveMatches = POSITIVE_INDICATORS.filter(word =>
    lowerContent.includes(word)
  );
  const positivityScore = Math.min(positiveMatches.length / 3, 1.0);

  return {
    isApproved: true,
    confidence: 0.5 + positivityScore * 0.5,
  };
}

/**
 * Gentle rejection message shown to users when content is blocked.
 */
export function getGentleRejectionMessage(): string {
  const messages = [
    'This space is for uplifting, reflective, and supportive communication. Please rephrase with kindness.',
    'Sea Within is a sanctuary of peace. Please share words that uplift and inspire.',
    'In this space, we speak from the heart. Please try again with gentleness.',
    'Your voice matters here — please share it in a way that supports our community\'s warmth.',
    'This is a space of light. Please rephrase your message to reflect the beauty within you.',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
