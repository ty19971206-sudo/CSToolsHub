import { getSupabase } from '../../supabase/client';
import { buildQuizBank } from './bank';
import { navTranslations } from '../../i18n';
import type { QuizCategoryKey, QuizQuestion } from './types';

export type DbQuizQuestion = QuizQuestion & { id: string };

export async function fetchQuizQuestionsBySlug(
  slug: string,
): Promise<{ categoryId: string; questions: DbQuizQuestion[] } | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: cat, error: catErr } = await supabase
    .from('quiz_categories')
    .select('id, slug')
    .eq('slug', slug)
    .maybeSingle();

  if (catErr || !cat) return null;

  const { data: rows, error: qErr } = await supabase
    .from('quiz_questions')
    .select('id, zh_json, en_json, correct_index')
    .eq('category_id', cat.id);

  if (qErr || !rows?.length) return null;

  const questions: DbQuizQuestion[] = rows.map((r) => ({
    id: r.id,
    zh: r.zh_json as QuizQuestion['zh'],
    en: r.en_json as QuizQuestion['en'],
    correct: r.correct_index,
  }));

  return { categoryId: cat.id, questions };
}

export async function saveQuizAttempt(params: {
  categoryId: string;
  score: number;
  total: number;
  answers: unknown;
}) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;
  await supabase.from('quiz_attempts').insert({
    user_id: user.user.id,
    category_id: params.categoryId,
    score: params.score,
    total: params.total,
    answers_json: params.answers,
  });
}

export async function seedQuizFromLocalBank() {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');

  const bank = buildQuizBank();
  const categories = navTranslations.en.quizCategories;

  for (const cat of categories) {
    const key = cat.key as QuizCategoryKey;
    const questions = bank[key] || [];
    if (!questions.length) continue;

    const { data: catRow, error: catErr } = await supabase
      .from('quiz_categories')
      .upsert(
        {
          slug: cat.slug,
          name_zh: navTranslations.zh.quizCategories.find((c) => c.slug === cat.slug)?.label || cat.label,
          name_en: cat.label,
          sort_order: categories.indexOf(cat),
        },
        { onConflict: 'slug' },
      )
      .select('id')
      .single();

    if (catErr || !catRow) throw catErr || new Error('category upsert failed');

    await supabase.from('quiz_questions').delete().eq('category_id', catRow.id);

    const batch = questions.map((q) => ({
      category_id: catRow.id,
      zh_json: q.zh,
      en_json: q.en,
      correct_index: q.correct,
    }));

    for (let i = 0; i < batch.length; i += 100) {
      const chunk = batch.slice(i, i + 100);
      const { error } = await supabase.from('quiz_questions').insert(chunk);
      if (error) throw error;
    }
  }
}

export async function getQuizCategoryStats() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data: cats } = await supabase.from('quiz_categories').select('id, slug, name_zh, name_en');
  if (!cats) return [];
  const stats = [];
  for (const cat of cats) {
    const { count } = await supabase
      .from('quiz_questions')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', cat.id);
    stats.push({ ...cat, count: count ?? 0 });
  }
  return stats;
}
