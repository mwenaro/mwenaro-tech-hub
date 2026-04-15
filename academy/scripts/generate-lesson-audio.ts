import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const PIPER_PATH = './scratch/piper/piper'
const MODEL_PATH = './scratch/piper/en_US-bryce-medium.onnx'
const OUTPUT_DIR = './scratch/audio_temp'
const BUCKET_NAME = 'lesson-audio'
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const PROMPT_FILE = './scripts/prompts/audio-narrator.txt'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
})

async function generateSpokenScript(title, content) {
    const promptTemplate = fs.readFileSync(PROMPT_FILE, 'utf8')
    const prompt = promptTemplate.replace('{{title}}', title).replace('{{content}}', content)
    const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
    })
    return response.choices[0].message.content || ''
}

async function run() {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    const { data: phases } = await supabase.from('phases').select('id').eq('order_index', 1)
    if (!phases || phases.length === 0) return
    const phaseIds = phases.map(p => p.id)
    const { data: lessons, error } = await supabase.from('phase_lessons').select('lesson_id, lessons:lessons (id, title, content, audio_url)').in('phase_id', phaseIds).limit(1)
    const lessonsToProcess = lessons.map(pl => pl.lessons).filter(l => l && !l.audio_url)
    for (const lesson of lessonsToProcess) {
        try {
            const script = await generateSpokenScript(lesson.title, lesson.content)
            const txtPath = path.join(OUTPUT_DIR, lesson.id + '.txt')
            const wavPath = path.join(OUTPUT_DIR, lesson.id + '.wav')
            const mp3Path = path.join(OUTPUT_DIR, lesson.id + '.mp3')
            fs.writeFileSync(txtPath, script)
            execSync('cat "' + txtPath + '" | ' + PIPER_PATH + ' --model ' + MODEL_PATH + ' --output_file ' + wavPath)
            execSync('ffmpeg -y -i ' + wavPath + ' -codec:a libmp3lame -qscale:a 2 ' + mp3Path)
            const fileBuffer = fs.readFileSync(mp3Path)
            const fileName = lesson.id + '.mp3'
            const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, fileBuffer, { contentType: 'audio/mpeg', upsert: true })
            if (uploadError) throw uploadError
            const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)
            await supabase.from('lessons').update({ audio_url: publicUrl, duration_minutes: 5 }).eq('id', lesson.id)
            if (fs.existsSync(txtPath)) fs.unlinkSync(txtPath)
            if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath)
            if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path)
            console.log('SUCCESS: ' + lesson.title)
        } catch (err) { console.error('FAIL: ' + lesson.title, err) }
    }
}
run();