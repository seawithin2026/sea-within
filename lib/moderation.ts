/**
 * SEA WITHIN — Gentle Uplifting Moderation + Spam Protection
 *
 * ✔ Blocks cruelty, hate, harassment, violence, self‑harm
 * ✔ Blocks heavy negativity + pity‑party dumping
 * ✔ Blocks spam, bots, repeated characters, scam links
 * ✔ Allows excitement (!!!), joy, passion, energy
 * ✔ Allows gentle honesty + soft vulnerability
 * ✔ Allows neutral thoughts + reflection
 */

export interface ModerationResult {
  approved: boolean;
  reason?: string;
  message?: string;
}

export function moderateContent(content: string): ModerationResult {
  const text = content.trim().toLowerCase();

  if (!text) {
    return {
      approved: false,
      reason: 'empty',
      message: 'Share something real, even if it’s small.',
    };
  }

  // 🚫 1. HARD BLOCK — actual harmful content
  const harmful = [
    'kill',
    'hurt you',
    'hate you',
    'slur1',
    'slur2',
    'slur3',
    'i want to die',
    'end my life',
    'self harm',
  ];

  if (harmful.some(w => text.includes(w))) {
    return {
      approved: false,
      reason: 'harmful',
      message:
        'This sanctuary protects everyone. Harmful or attacking language isn’t allowed.',
    };
  }

  // 🚫 2. BLOCK pity‑party / heavy dumping energy
  const pityParty = [
    'nothing matters',
    'i give up',
    'life is terrible',
    'i can’t do this anymore',
    'why does this always happen to me',
    'everything sucks',
    'my life is the worst',
  ];

  if (pityParty.some(w => text.includes(w))) {
    return {
      approved: false,
      reason: 'pity_party',
      message:
        'This space is for gentle honesty, not heavy emotional dumping. Try sharing the insight or truth underneath the feeling.',
    };
  }

  // 🚫 3. BLOCK spam / bot patterns
  const spamPatterns = [
    /(https?:\/\/\S{20,})/i,       // long suspicious links
    /(buy now|click here|promo|discount|free money)/i,
    /(.)\1{6,}/i,                  // aaaaaaaa
    /\bcrypto\b/i,
    /\bforex\b/i,
    /\bbetting\b/i,
  ];

  if (spamPatterns.some(p => p.test(text))) {
    return {
      approved: false,
      reason: 'spam',
      message:
        'This sanctuary is protected from spam and promotional content.',
    };
  }

  // ⭐ 4. ALLOW excitement + passion
  // !!! is allowed
  // <3 is allowed
  // expressive punctuation is allowed

  // ⭐ 5. ALLOW emotional honesty + reflection
  return {
    approved: true,
  };
}
