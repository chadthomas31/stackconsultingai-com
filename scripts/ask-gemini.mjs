#!/usr/bin/env node
// Vertex-first Gemini caller. Defaults: project stack-consulting-ai-495420, us-central1, gemini-2.5-flash.
// Usage: ask-gemini.mjs [-m model] "prompt"   |   echo ctx | ask-gemini.mjs "prompt"
import { GoogleGenAI } from '@google/genai';

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT || 'stack-consulting-ai-495420';
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const DEFAULT_MODEL = 'gemini-2.5-flash';
const ALLOWED = new Set(['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite']);

const argv = process.argv.slice(2);
let model = DEFAULT_MODEL;
const rest = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '-m' || argv[i] === '--model') {
    model = argv[++i] || DEFAULT_MODEL;
  } else {
    rest.push(argv[i]);
  }
}
if (!ALLOWED.has(model)) {
  console.error(`ERROR: model "${model}" not in [${[...ALLOWED].join(', ')}]`);
  process.exit(2);
}

const promptArg = rest.join(' ').trim();
let stdin = '';
if (!process.stdin.isTTY) {
  for await (const chunk of process.stdin) stdin += chunk;
}
const prompt = [stdin.trim(), promptArg].filter(Boolean).join('\n\n');
if (!prompt) {
  console.error('ERROR: empty prompt (pass as arg or pipe via stdin)');
  process.exit(2);
}

const ai = new GoogleGenAI({ vertexai: true, project: PROJECT, location: LOCATION });

try {
  const result = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });
  const out = result?.text ?? result?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ?? '';
  process.stdout.write(out);
  if (!out.endsWith('\n')) process.stdout.write('\n');
} catch (err) {
  console.error('Vertex error:', err?.message || err);
  process.exit(1);
}
