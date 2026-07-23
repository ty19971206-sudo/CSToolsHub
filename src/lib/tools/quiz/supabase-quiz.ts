import { logAudit } from '../../audit';
import { getSupabase } from '../../supabase/client';
import { buildQuizBank } from './bank';
import { navTranslations } from '../../i18n';
import type { QuizCategoryKey, QuizQuestion } from './types';

export type DbQuizQuestion = QuizQuestion & { id: string };

export type QuizAnswerLogItem = {
  questionId: string;
  selected: number | null;
  correct: number;
};

export type QuizAttemptRow = {
  id: string;
  category_id: string;
  score: number;
  total: number;
  created_at: string;
  quiz_categories?: { slug: string; name_zh: string; name_en: string };
};

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
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

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
  answers: QuizAnswerLogItem[];
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: 'no_supabase' };
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { ok: false, error: 'not_logged_in' };
  const { error } = await supabase.from('quiz_attempts').insert({
    user_id: user.user.id,
    category_id: params.categoryId,
    score: params.score,
    total: params.total,
    answers_json: params.answers,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

const PASS_RATIO = 0.8;

export async function upsertQuizCertification(params: {
  categoryId: string;
  score: number;
  total: number;
}) {
  if (params.total <= 0 || params.score / params.total < PASS_RATIO) return;
  const supabase = getSupabase();
  if (!supabase) return;
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;
  await supabase.from('quiz_certifications').upsert(
    {
      user_id: user.user.id,
      category_id: params.categoryId,
      best_score: params.score,
      best_total: params.total,
      certified_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,category_id' },
  );
}

export async function fetchMyQuizAttempts(limit = 50): Promise<QuizAttemptRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('id, category_id, score, total, created_at, quiz_categories(slug, name_zh, name_en)')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as QuizAttemptRow[];
}

export async function fetchMyCertifications(): Promise<
  { category_id: string; best_score: number; best_total: number }[]
> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];
  const { data } = await supabase
    .from('quiz_certifications')
    .select('category_id, best_score, best_total')
    .eq('user_id', user.user.id);
  return data ?? [];
}

export async function fetchQuizCategories() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('quiz_categories')
    .select('id, slug, name_zh, name_en, sort_order')
    .order('sort_order');
  return data ?? [];
}

export async function fetchAllQuestionsForCategory(categoryId: string) {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('quiz_questions')
    .select('id, zh_json, en_json, correct_index, is_active, sort_order')
    .eq('category_id', categoryId)
    .order('sort_order');
  return data ?? [];
}

export async function createQuizQuestion(params: {
  categoryId: string;
  zh: QuizQuestion['zh'];
  en: QuizQuestion['en'];
  correct: number;
}) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('quiz_questions')
    .insert({
      category_id: params.categoryId,
      zh_json: params.zh,
      en_json: params.en,
      correct_index: params.correct,
    })
    .select('id')
    .single();
  if (error) throw error;
  await logAudit('quiz.question.create', { category_id: params.categoryId, question_id: data.id });
  return data.id;
}

export async function updateQuizQuestion(
  id: string,
  params: {
    zh: QuizQuestion['zh'];
    en: QuizQuestion['en'];
    correct: number;
    is_active?: boolean;
    sort_order?: number;
  },
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('quiz_questions')
    .update({
      zh_json: params.zh,
      en_json: params.en,
      correct_index: params.correct,
      ...(params.is_active !== undefined ? { is_active: params.is_active } : {}),
      ...(params.sort_order !== undefined ? { sort_order: params.sort_order } : {}),
    })
    .eq('id', id);
  if (error) throw error;
  await logAudit('quiz.question.update', { question_id: id });
}

export async function deleteQuizQuestion(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
  if (error) throw error;
  await logAudit('quiz.question.delete', { question_id: id });
}

export type CategoryStatsAdmin = {
  category_id: string;
  slug: string;
  name_zh: string;
  name_en: string;
  attempt_count: number;
  avg_score: number;
  pass_rate: number;
};

export async function fetchQuizCategoryStatsAdmin(): Promise<CategoryStatsAdmin[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('get_quiz_category_stats_admin');
  if (error || !data) return [];
  return data as CategoryStatsAdmin[];
}

export async function fetchWeakQuestions(categoryId: string, limit = 10) {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('get_quiz_weak_questions', {
    p_category_id: categoryId,
    p_limit: limit,
  });
  if (error || !data) return [];
  return data as { question_id: string; wrong_count: number }[];
}

export type AuditLogRow = {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  meta: Record<string, unknown>;
  created_at: string;
};

export async function fetchRecentAuditLogs(limit = 50): Promise<AuditLogRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('get_recent_audit_logs', { p_limit: limit });
  if (error || !data) return [];
  return data as AuditLogRow[];
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

    const batch = questions.map((q, i) => ({
      category_id: catRow.id,
      zh_json: q.zh,
      en_json: q.en,
      correct_index: q.correct,
      sort_order: i,
      is_active: true,
    }));

    for (let i = 0; i < batch.length; i += 100) {
      const chunk = batch.slice(i, i + 100);
      const { error } = await supabase.from('quiz_questions').insert(chunk);
      if (error) throw error;
    }
  }
  await logAudit('quiz.seed', { source: 'bank.ts' });
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
      .eq('category_id', cat.id)
      .eq('is_active', true);
    stats.push({ ...cat, count: count ?? 0 });
  }
  return stats;
}
