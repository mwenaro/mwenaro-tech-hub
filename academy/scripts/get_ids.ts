import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
    console.log('--- FETCHING LESSONS ---');
    const { data: phase } = await supabase
        .from('phases')
        .select('id, title')
        .eq('title', 'Phase 1 - Web Foundations')
        .single();

    if (phase) {
        const { data: lessons } = await supabase
            .from('phase_lessons')
            .select('lesson_id, order_index, lessons (title)')
            .eq('phase_id', phase.id)
            .order('order_index');
        
        lessons?.forEach(l => {
            console.log(`LESSON|${l.lesson_id}|${(l.lessons as any)?.title}`);
        });
    }

    console.log('\n--- FETCHING STUDENTS ---');
    const includeEmails = [
        'annepam4@gmail.com',
        'flavemike@outlook.com',
        'hitonmwaks14@gmail.com',
        'mustafajeilan10@gmail.com',
        'abdullahisudeismohamud@gmail.com',
        'zakariaali3355@gmail.com',
        'mwerothewebmaker@gmail.com'
    ];

    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
    authUsers?.filter(u => includeEmails.includes(u.email!)).forEach(u => {
        console.log(`STUDENT|${u.id}|${u.email}`);
    });
}

run();
