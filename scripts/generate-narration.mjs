#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//  S E A   W I T H I N  —  Narration Audio Generator
//
//  Usage:
//    ELEVENLABS_API_KEY=sk_... node scripts/generate-narration.mjs season-1 day-1
// ═══════════════════════════════════════════════════════════════

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { DAY_SCRIPTS, VOICE_CONFIG } from '../lib/voice/voiceConfig.js';

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('\n  ✗ Missing ELEVENLABS_API_KEY environment variable.\n');
  process.exit(1);
}

const [season, day] = process.argv.slice(2);
if (!season || !day) {
  console.error('  Usage: node scripts/generate-narration.mjs <season> <day>\n');
  process.exit(1);
}

const script = DAY_SCRIPTS[season]?.[day];
if (!script) {
  console.error(`  ✗ No script found for ${season}/${day}\n`);
  process.exit(1);
}

const {
  voiceId, modelId, stability, similarityBoost,
  style, useSpeakerBoost, speed,
} = VOICE_CONFIG.elevenlabs;

function composeText(lines) {
  return lines.map((l) => l.text).join(' … … ');
}

async function synthesize(text, outputPath) {
  console.log(`  ↳ Synthesizing: ${path.basename(outputPath)}`);

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style,
          use_speaker_boost: useSpeakerBoost,
        },
        ...(speed !== undefined && { speed }),
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${body}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buffer);
  console.log(`  ✓ Saved (${(buffer.length / 1024).toFixed(0)} KB)\n`);
}

async function main() {
  const outDir = path.resolve('public/audio/narration', season);
  console.log(`\n🐚 Sea Within — generating narration for ${season}/${day}\n`);

  if (script.intro?.lines) {
    await synthesize(composeText(script.intro.lines), path.join(outDir, `${day}-intro.mp3`));
  }
  if (script.ritual?.lines) {
    await synthesize(composeText(script.ritual.lines), path.join(outDir, `${day}-ritual.mp3`));
  }

  console.log('  Next steps:');
  console.log('  1. Listen to each MP3');
  console.log('  2. Note the second each line begins');
  console.log('  3. Update the "time" fields in voiceConfig.js\n');
}

main().catch((err) => {
  console.error(`  ✗ ${err.message}\n`);
  process.exit(1);
});
