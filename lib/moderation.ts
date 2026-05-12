/**
 * SEA WITHIN — Gentle Uplifting Moderation + Safety + Emoji Protection
 *
 * ✔ Blocks cruelty, hate, harassment, violence, self‑harm
 * ✔ Blocks negativity, despair, emotional dumping
 * ✔ Blocks sexual emojis + harmful emojis
 * ✔ Blocks sexual content + inappropriate suggestions
 * ✔ Blocks personal data (emails, phone numbers, addresses)
 * ✔ Blocks spam, bots, scam links
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
      reason: "empty",
      message: "Share something real, even if it’s small.",
    };
  }

  // 🚫 1. HARD BLOCK — harmful or violent content
  const harmful = [
    "kill",
    "hurt you",
    "hate you",
    "slur1",
    "slur2",
    "slur3",
    "i want to die",
    "end my life",
    "self harm",
    "i want to hurt",
    "i will hurt",
  ];

  if (harmful.some((w) => text.includes(w))) {
    return {
      approved: false,
      reason: "harmful",
      message:
        "This sanctuary protects everyone. Harmful or attacking language isn’t allowed.",
    };
  }

  // 🚫 2. BLOCK negativity / dumping / despair
  const pityParty = [
    "nothing matters",
    "i give up",
    "life is terrible",
    "i can’t do this anymore",
    "why does this always happen to me",
    "everything sucks",
    "my life is the worst",
    "i feel hopeless",
    "i feel empty inside",
    "i hate my life",
    "i'm miserable",
    "i'm depressed",
    "i feel broken",
  ];

  if (pityParty.some((w) => text.includes(w))) {
    return {
      approved: false,
      reason: "pity_party",
      message:
        "This space welcomes honesty, depth, and vulnerability — but not heavy emotional dumping. Try sharing the light or insight beneath the feeling.",
    };
  }

  // 🚫 3. BLOCK sexual or harmful emojis
  const bannedEmojis = [
    "🍆", "🍑", "💦", "👅", "😏", "😈",
    "🔪", "💣", "🧨", "🤬", "💀", "🖕",
    "🐷", "🐍", "🤡"
  ];

  if (bannedEmojis.some((e) => content.includes(e))) {
    return {
      approved: false,
      reason: "banned_emoji",
      message:
        "Some emojis carry meanings that don’t fit the sanctuary. Try using symbols of light, kindness, or encouragement instead.",
    };
  }

  // 🚫 4. BLOCK sexual content
  const sexualKeywords = [
    "sex",
    "nude",
    "naked",
    "horny",
    "fetish",
    "kiss me",
    "touch me",
    "send nudes",
    "i want your body",
  ];

  if (sexualKeywords.some((w) => text.includes(w))) {
    return {
      approved: false,
      reason: "sexual_content",
      message:
        "This sanctuary is not for intimate or personal content. Try offering something gentle and uplifting.",
    };
  }

  // 🚫 5. BLOCK personal data
  const personalDataPatterns = [
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // phone numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i, // emails
    /\b\d{1,5}\s[A-Za-z]+\s(?:street|st|road|rd|avenue|ave|boulevard|blvd)\b/i, // addresses
  ];

  if (personalDataPatterns.some((p) => p.test(content))) {
    return {
      approved: false,
      reason: "personal_data",
      message:
        "Messages must remain anonymous. Try sharing something universal and uplifting.",
    };
  }

  // 🚫 6. BLOCK spam / bot patterns
  const spamPatterns = [
    /(https?:\/\/\S{20,})/i,
    /(buy now|click here|promo|discount|free money)/i,
    /\bcrypto\b/i,
    /\bforex\b/i,
    /\bbetting\b/i,
  ];

  if (spamPatterns.some((p) => p.test(text))) {
    return {
      approved: false,
      reason: "spam",
      message: "This sanctuary is protected from spam and promotional content.",
    };
  }

  // ⭐ ALLOW excitement, emojis, sparkles, !!!, <3, joy, passion
  return { approved: true };
}
