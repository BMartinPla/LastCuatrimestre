/**
 * Genera un asset con Gemini (nano-banana) y lo guarda como PNG.
 * Uso: node scripts/gen-asset.mjs "<prompt>" <ruta-salida.png>
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL ?? 'gemini-2.5-flash-image';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function generate(prompt, outPath) {
  if (!KEY) throw new Error('GEMINI_API_KEY no está configurada');
  const res = await fetch(`${URL}?key=${KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'] }
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body.slice(0, 400)}`);
  }
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) {
    throw new Error(
      `Sin imagen en la respuesta: ${JSON.stringify(data).slice(0, 400)}`
    );
  }
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, Buffer.from(img.inlineData.data, 'base64'));
  console.log(`OK ${outPath} (${img.inlineData.mimeType})`);
}

const [prompt, out] = process.argv.slice(2);
if (!prompt || !out) {
  console.error('Uso: node gen-asset.mjs "<prompt>" <salida.png>');
  process.exit(1);
}
generate(prompt, out).catch((e) => {
  console.error('FAIL:', e.message);
  process.exit(1);
});
