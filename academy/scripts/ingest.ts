import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// Load Env from parent or local
const envPath = path.resolve(__dirname, '../.env.local');
require('dotenv').config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const aiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !aiKey) {
  console.error(`Missing environment variables in ${envPath}`);
  console.log('Available keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('AI') || k.includes('KEY')));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ 
    apiKey: aiKey,
    baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined
});

async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // OpenRouter supports this model
    input: text.replace(/\n/g, ' '),
  });
  return response.data[0].embedding;
}

/**
 * Ingests markdown files with recursive headers
 */
async function ingestMarkdown(filePath: string, category: string) {
  console.log(`Ingesting content from: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Basic chunking by headers
  const chunks = content.split('\n## ').filter(c => c.trim().length > 50);

  for (const chunk of chunks) {
    const textToEmbed = `## ${chunk}`;
    const embedding = await generateEmbedding(textToEmbed);

    await supabase.from('academy_knowledge').upsert({
      content: textToEmbed,
      embedding,
      metadata: {
        source: path.basename(filePath),
        category: category,
        type: 'faq'
      }
    });
  }
}

/**
 * Ingests JSON curriculum files from .docs
 */
async function ingestCurriculum(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Curriculum directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath, { recursive: true }) as string[];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const filePath = path.join(dirPath, file);
    console.log(`Ingesting curriculum: ${file}`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    if (!data.content || typeof data.content !== 'string') continue;

    const embedding = await generateEmbedding(`TITLE: ${data.title}\nCONTENT: ${data.content.substring(0, 2000)}`);

    await supabase.from('academy_knowledge').upsert({
      content: `### ${data.title}\n\n${data.content}`,
      embedding,
      metadata: {
        source: file,
        type: 'curriculum',
        title: data.title
      }
    });
  }
}

async function ingestLessons() {
  console.log('Fetching lessons from database...');
  const { data: lessons } = await supabase.from('lessons').select('id, title, content, course_id');

  if (!lessons) return;

  for (const lesson of lessons) {
    if (!lesson.content) continue;
    
    console.log(`Ingesting lesson: ${lesson.title}`);
    const textToEmbed = `Course Content: ${lesson.title}\n\n${lesson.content}`;
    const embedding = await generateEmbedding(textToEmbed);

    await supabase.from('academy_knowledge').upsert({
      content: textToEmbed,
      embedding,
      metadata: {
        lesson_id: lesson.id,
        source: 'database',
        type: 'curriculum',
        title: lesson.title
      }
    }, { onConflict: 'content' });
  }
}

async function wipeKnowledgeBase() {
  console.log('🧹 Wiping existing knowledge base...');
  const { error } = await supabase
    .from('academy_knowledge')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  if (error) {
    console.error('❌ Wipe failed:', error);
  } else {
    console.log('✅ Knowledge base cleared.');
  }
}

async function run() {
  try {
    // Always wipe for now to ensure clean state for user
    await wipeKnowledgeBase();

    // 1. Ingest Institution FAQs
    const faqPath = path.resolve(__dirname, '../src/data/academy-faqs.md');
    if (fs.existsSync(faqPath)) {
      await ingestMarkdown(faqPath, 'institution');
    }

    // 2. Ingest Curriculum from .docs (Root)
    const curriculumPath = path.resolve(__dirname, '../../.docs/content');
    await ingestCurriculum(curriculumPath);

    // 3. Ingest Lesson DB
    await ingestLessons();

    console.log('✅ Ingestion complete!');
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
  }
}

run();
