import { GoogleGenAI } from '@google/genai';
import type { Model } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const apiVersion = process.env.GEMINI_API_VERSION;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to backend/.env before running.',
    );
  }

  const ai = new GoogleGenAI({ apiKey, apiVersion });
  const pager = await ai.models.list({ config: { queryBase: true } });

  const models: Model[] = [];
  for await (const model of pager) {
    models.push(model);
  }

  const supportsGenerateContent = (actions?: string[]) =>
    (actions || []).some((action) =>
      action.toLowerCase().includes('generatecontent'),
    );

  const filtered = models.filter((model) =>
    supportsGenerateContent(model.supportedActions),
  );

  const list = filtered.length > 0 ? filtered : models;

  console.log(
    `API version: ${apiVersion || 'default'} | Models returned: ${list.length}`,
  );
  console.log('---');

  for (const model of list) {
    const name = model.name || '(no name)';
    const display = model.displayName || '';
    const actions = model.supportedActions?.join(', ') || '';
    console.log(`${name} | ${display} | ${actions}`);
  }
}

listModels().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Failed to list models:', message);
  process.exit(1);
});
