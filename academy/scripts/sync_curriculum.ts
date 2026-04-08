import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- Command Line Arguments ---
const args = process.argv.slice(2);
const lessonFlag = args.find(arg => arg.startsWith('--lesson='));
const forceFlag = args.includes('--force');
const targetLessonFile = lessonFlag ? lessonFlag.split('=')[1] : null;

/**
 * Check if an entity is safe to update.
 * If updated_from is 'dashboard', it returns false unless force=true.
 */
async function isSafeToUpdate(table: string, id: string, force: boolean): Promise<boolean> {
    if (force) return true;

    const { data, error } = await supabase
        .from(table)
        .select('updated_from')
        .eq('id', id)
        .single();

    if (error || !data) return true; // Default to safe if not found or no column yet
    
    if (data.updated_from === 'dashboard') {
        return false;
    }
    return true;
}

async function syncCourse(courseSlug: string, force: boolean) {
    console.log(`\n🚀 Starting sync for course: ${courseSlug}`);

    const coursePath = path.join(process.cwd(), '..', '.docs', 'courses', `${courseSlug}.json`);
    if (!fs.existsSync(coursePath)) {
        console.error(`Course file not found: ${coursePath}`);
        return;
    }

    const courseData = JSON.parse(fs.readFileSync(coursePath, 'utf8'));
    const { title, description, image_url, course_overview, course_outline, difficulty, duration, price, modules } = courseData;

    // 1. Fetch/Upsert Course
    console.log(`Matching course by slug: ${courseSlug}...`);
    
    // Check if course exists to verify safety
    const { data: existingCourse } = await supabase.from('courses').select('id').eq('slug', courseSlug).single();
    if (existingCourse && !await isSafeToUpdate('courses', existingCourse.id, force)) {
        console.warn(`⚠️ Skipping course '${title}' (Dashboard Edits Detected). Use --force to overwrite.`);
    } else {
        const { error: cError } = await supabase
            .from('courses')
            .upsert({
                slug: courseSlug,
                title,
                description,
                image_url,
                course_overview,
                course_outline,
                level: difficulty,
                duration,
                price,
                updated_from: 'files'
            }, { onConflict: 'slug' });
        
        if (cError) {
            console.error('Error upserting course:', cError);
            return;
        }
    }

    const { data: course } = await supabase.from('courses').select('id').eq('slug', courseSlug).single();
    if (!course) return;
    const dbCourseId = course.id;

    // 2. Sync Phases & Lessons (Non-destructive)
    console.log('Syncing curriculum hierarchy...');

    const phasesMap = new Map<string, any[]>();
    modules.forEach((mod: any) => {
        if (!phasesMap.has(mod.phase)) {
            phasesMap.set(mod.phase, []);
        }
        phasesMap.get(mod.phase)!.push(mod);
    });

    let phaseOrder = 1;
    for (const [phaseTitle, phaseModules] of phasesMap.entries()) {
        // Upsert Phase
        let phaseId: string;
        const { data: existingPhase } = await supabase
            .from('phases')
            .select('id')
            .eq('course_id', dbCourseId)
            .eq('title', phaseTitle)
            .single();

        if (existingPhase && !await isSafeToUpdate('phases', existingPhase.id, force)) {
            console.warn(`  ⚠️ Skipping Phase '${phaseTitle}' (Dashboard Edits Detected).`);
            phaseId = existingPhase.id;
        } else {
            const { data: phase, error: pError } = await supabase
                .from('phases')
                .upsert({
                    course_id: dbCourseId,
                    title: phaseTitle,
                    order_index: phaseOrder++,
                    updated_from: 'files'
                }, { onConflict: 'course_id, title' })
                .select()
                .single();

            if (pError || !phase) {
                console.error(`  Error upserting phase ${phaseTitle}:`, pError);
                continue;
            }
            phaseId = phase.id;
        }

        let lessonOrder = 1;
        for (const mod of phaseModules) {
            // Check if this is the targeted lesson (if flag provided)
            if (targetLessonFile && mod.source_file !== targetLessonFile) {
                lessonOrder++;
                continue;
            }

            console.log(`    Processing Lesson: ${mod.title}`);
            const lessonFilePath = path.join(process.cwd(), '..', '.docs', 'content', mod.source_file);
            if (!fs.existsSync(lessonFilePath)) {
                console.warn(`      Lesson file missing: ${lessonFilePath}`);
                continue;
            }

            const lessonContent = JSON.parse(fs.readFileSync(lessonFilePath, 'utf8'));

            // Check if lesson exists
            const { data: existingLesson } = await supabase
                .from('lessons')
                .select('id')
                .eq('title', lessonContent.title)
                .single();

            if (existingLesson && !await isSafeToUpdate('lessons', existingLesson.id, force)) {
                console.warn(`      ⚠️ Skipping Lesson '${mod.title}' (Dashboard Edits Detected).`);
                continue;
            }

            // Upsert Lesson
            const { data: lesson, error: lError } = await supabase
                .from('lessons')
                .upsert({
                    id: existingLesson?.id, // Keep ID if exists
                    title: lessonContent.title,
                    content: lessonContent.content || '',
                    video_url: lessonContent.video_url || '',
                    has_project: lessonContent.has_project || false,
                    duration_minutes: lessonContent.duration_minutes || 30,
                    updated_from: 'files'
                }, { onConflict: 'title' })
                .select()
                .single();

            if (lError || !lesson) {
                console.error(`      Error upserting lesson ${mod.title}:`, lError);
                continue;
            }

            // Link to Phase (Upsert Join Record)
            const { error: plError } = await supabase
                .from('phase_lessons')
                .upsert({
                    phase_id: phaseId,
                    lesson_id: lesson.id,
                    order_index: lessonOrder++
                }, { onConflict: 'phase_id, lesson_id' });

            if (plError) console.error(`      Error linking lesson to phase:`, plError);

            // Sync Quiz Questions (Clear and Re-insert for target lesson only)
            console.log(`      Syncing ${lessonContent.questions?.length || 0} quiz questions...`);
            await supabase.from('questions').delete().eq('lesson_id', lesson.id);
            
            if (lessonContent.questions && lessonContent.questions.length > 0) {
                const questionsToInsert = lessonContent.questions.map((q: any) => ({
                    lesson_id: lesson.id,
                    question_text: q.question_text,
                    options: q.options,
                    correct_answer: q.correct_answer,
                    explanation: q.explanation || ''
                }));

                const { error: qError } = await supabase
                    .from('questions')
                    .insert(questionsToInsert);

                if (qError) console.error(`      Error inserting quiz questions:`, qError);
            }
        }
    }

    console.log(`✅ ${courseSlug} sync complete!`);
}

async function runSync() {
    console.log('--- Mwenaro Safe Sync CLI ---');
    if (targetLessonFile) {
        console.log(`🎯 Targeting single lesson: ${targetLessonFile}`);
    }
    if (forceFlag) {
        console.log(`⚡ Force mode enabled. Overwriting dashboard edits.`);
    }

    const coursesToSync = ['fullstack', 'web-foundations', 'react-frontend', 'backend-api'];
    for (const slug of coursesToSync) {
        await syncCourse(slug, forceFlag);
    }
}

runSync().catch(err => {
    console.error('Fatal sync error:', err);
    process.exit(1);
});
