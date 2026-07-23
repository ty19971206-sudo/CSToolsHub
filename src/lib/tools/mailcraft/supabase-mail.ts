import { logAudit } from '../../audit';
import { getSupabase } from '../../supabase/client';

export type MailTemplateRow = {
  scene_id: string;
  subject_zh: string | null;
  body_zh: string | null;
  subject_en: string | null;
  body_en: string | null;
};

export type MailTemplateFields = {
  subjectZh: string;
  bodyZh: string;
  subjectEn: string;
  bodyEn: string;
};

export async function fetchMailTemplates(): Promise<Record<string, MailTemplateFields> | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('mail_templates')
    .select('scene_id, subject_zh, body_zh, subject_en, body_en');
  if (error || !data?.length) return null;
  const map: Record<string, MailTemplateFields> = {};
  for (const row of data) {
    map[row.scene_id] = {
      subjectZh: row.subject_zh ?? '',
      bodyZh: row.body_zh ?? '',
      subjectEn: row.subject_en ?? '',
      bodyEn: row.body_en ?? '',
    };
  }
  return map;
}

export async function upsertMailTemplate(sceneId: string, fields: MailTemplateFields) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: user } = await supabase.auth.getUser();
  const { error } = await supabase.from('mail_templates').upsert(
    {
      scene_id: sceneId,
      subject_zh: fields.subjectZh,
      body_zh: fields.bodyZh,
      subject_en: fields.subjectEn,
      body_en: fields.bodyEn,
      updated_by: user.user?.id ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'scene_id' },
  );
  if (error) throw error;
  await logAudit('mail_template.upsert', { scene_id: sceneId });
}

export async function seedMailTemplatesFromBundled(
  templates: Record<string, MailTemplateFields>,
) {
  for (const [sceneId, fields] of Object.entries(templates)) {
    await upsertMailTemplate(sceneId, fields);
  }
  await logAudit('mail_template.seed', { scenes: Object.keys(templates) });
}
