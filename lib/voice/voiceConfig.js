// app/lib/voice/voiceConfig.js

export const VOICE_CONFIG = {
  narratorVolume: 1.0,
  fadeIn: 600,
  fadeOut: 600,

  // ⭐ REQUIRED FOR NARRATOR TEXT ANIMATION ⭐
  textReveal: {
    animationMs: 900,
    staggerMs: 250,
  },
};

// ---- DAY 1 INTRO SCRIPT ----
const day1Intro = [
  { time: 0, text: "Choose a small room where you can sit comfortably on the floor without interruption." },
  { time: 0, text: "Surround yourself with comfort—pillows, blankets, and clothes that feel soft against your skin." },
  { time: 0, text: "Place a mirror directly in front of where you’ll be sitting." },
  { time: 0, text: "Clear the path from the door to the mirror, creating a safe space for you to walk through." },
  { time: 0, text: "Set a small battery‑operated light in front of the mirror, one you can turn on easely." },
  { time: 0, text: "Turn off the lights and let the room fall into darkness." },
  { time: 0, text: "Step outside and close the door gently behind you." },
  { time: 0, text: "The space is ready, and so are you." }
];


// ---- DAY 1 RITUAL SCRIPT ----
const day1Ritual = [
  { time: 0, text: "Before you enter the room, give yourself permission to breathe." },
  { time: 0, text: "Let each exhale melt away the things that no longer serve you." },
  { time: 0, text: "You are here, you are safe, and your are ready." },
  { time: 0, text: "When the moment feels right, open the door slowly and step into the darkness." },
  { time: 0, text: "Let the darkness wrap around you like a soft blindfold." },
  { time: 0, text: "Pause here, allowing the unfamiliar to settle gently inside you." },
  { time: 0, text: "Moments like this may have once felt overwhelming, but today something in you has shifted." },
  { time: 0, text: "You take one step, then another, trusting the clear path you created for yourself." },
  { time: 0, text: "When you reach the pillow, lower yourself gently on it, settling in front of the mirror." },
  { time: 0, text: "You can’t see your reflection yet—only the faint outline of the mirror waiting in the dark." },
  { time: 0, text: "Without an image, without a role, without expectation, you sit with yourself in silence." },
  { time: 0, text: "Feel the version of you that exists without judgment." },
  { time: 0, text: "Raw, unfiltered, and unapologetically beautiful." },
  { time: 0, text: "Today you breathe, you listen, and you let yourself become one with the darkness." },
  { time: 0, text: "You give yourself permission to release the weight you’ve carried for so long." },
  { time: 0, text: "You’ve survived so much, and now it’s time to let the past loosen its grip." },
  { time: 0, text: "You don’t need to hold everything together anymore. You are allowed to be exactly as you are." },
  { time: 0, text: "Place your hands softly on your face, letting your fingers glide across the veil of expectation you once carried." },
  { time: 0, text: "Whisper to yourself:" },
  { time: 0, text: "“By releasing this veil, I allow myself to return to who I’ve always been.”" },
  { time: 0, text: "Feel the veil lift, growing lighter as you gently set it down beside you." },
  { time: 0, text: "Sit here for a moment in the quiet." },
  { time: 0, text: "Notice the space you’ve created inside yourself." },
  { time: 0, text: "Now, turn on the light and let it reveal your face slowly." },
  { time: 0, text: "See yourself not as the world sees you, but as you truly are." },
  { time: 0, text: "You are not the same person who walked into the darkness." },
  { time: 0, text: "You didn’t wait to be saved. You saved yourself." },
  { time: 0, text: "Welcome home, beautiful soul." },
  { time: 0, text: "You now carry the light you created for yourself." },
  { time: 0, text: "Be proud of the way you showed up today." },
  { time: 0, text: "Wishing you wondeful day, until we meet again." },
  { time: 0, text: "With love, Sea Within." }
];


// ---- MASTER CONFIG ----
export const voiceConfig = {
  "season1-day1-intro": {
    audio: "/audio/narration/season-1/Day-1-Intro.m4a",
    script: day1Intro,
  },
  "season1-day1-ritual": {
    audio: "/audio/narration/season-1/Day-1-Ritual.m4a",
    script: day1Ritual,
  },
};

// ---- REQUIRED FUNCTION ----
export function getDayScript(key) {
  return voiceConfig[key];
}
