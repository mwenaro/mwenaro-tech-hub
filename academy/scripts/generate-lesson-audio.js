const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

// ABSOLUTE PATHS
const BASE_DIR = '/home/mwero/progs/mwenaro-tech-hub/academy';
const PIPER_DIR = path.join(BASE_DIR, 'scratch/piper/piper');
const PIPER_BIN = path.join(PIPER_DIR, 'piper');
const MODEL_PATH = path.join(BASE_DIR, 'scratch/piper/en_US-bryce-medium.onnx');
const OUTPUT_DIR = path.join(BASE_DIR, 'scratch/audio_temp');
const BUCKET_NAME = 'lesson-audio';
const GROQ_MODEL = 'llama-3.1-8b-instant';
const PROMPT_FILE = path.join(BASE_DIR, 'scripts/prompts/audio-narrator.txt');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
});

async function generateSpokenScript(title, content) {
    const promptTemplate = fs.readFileSync(PROMPT_FILE, 'utf8');
    const prompt = promptTemplate.replace('{{title}}', title).replace('{{content}}', content);
    try {
        const response = await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        });
        return response.choices[0].message.content || '';
    } catch (e) {
        if (e.message.includes('429')) throw new Error('Groq Quota Exceeded');
        throw e;
    }
}

async function run() {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    
    // Query all lessons that still need audio generated
    const { data: lessonsToProcess, error } = await supabase
        .from('lessons')
        .select('id, title, content, audio_url')
        .is('audio_url', null);
    
    console.log('Found ' + lessonsToProcess.length + ' lessons.');

    for (const lesson of lessonsToProcess) {
        await new Promise(r => setTimeout(r, 10000)); // 10s delay to avoid Groq rate limits
        try {
            console.log('--- ' + lesson.title + ' ---');
            const script = await generateSpokenScript(lesson.title, lesson.content);
            const txtPath = path.join(OUTPUT_DIR, lesson.id + '.txt');
            const wavPath = path.join(OUTPUT_DIR, lesson.id + '.wav');
            const mp3Path = path.join(OUTPUT_DIR, lesson.id + '.mp3');
            fs.writeFileSync(txtPath, script);
            
            console.log('Voice...');
            // CRITICAL: Set LD_LIBRARY_PATH so Piper can find its libraries
            execSync(`export LD_LIBRARY_PATH="${PIPER_DIR}" && cat "${txtPath}" | "${PIPER_BIN}" --model "${MODEL_PATH}" --output_file "${wavPath}"`);
            
            console.log('Convert...');
            execSync(`ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${mp3Path}"`);
            
            const fileBuffer = fs.readFileSync(mp3Path);
            const fileName = lesson.id + '.mp3';
            
            console.log('Upload...');
            const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, fileBuffer, { contentType: 'audio/mpeg', upsert: true });
            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
            await supabase.from('lessons').update({ 
                audio_url: publicUrl, 
                audio_script: script,
                duration_minutes: 5 
            }).eq('id', lesson.id);
            
            fs.unlinkSync(txtPath);
            fs.unlinkSync(wavPath);
            fs.unlinkSync(mp3Path);
            console.log('✅ ' + lesson.title);
        } catch (err) { 
            console.error('❌ ' + lesson.title, err.message);
            if (err.message === 'Groq Quota Exceeded') break;
        }
    }
}
run();