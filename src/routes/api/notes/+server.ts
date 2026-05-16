import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDb } from '../../../routes-backend/db/client';
import { getNotesFor, upsertNote } from '../../../routes-backend/db/queries';

export const GET: RequestHandler = ({ url }) => {
  const db = getDb();
  const ref_type = url.searchParams.get('ref_type') as 'exercise' | 'language';
  const ref_id = url.searchParams.get('ref_id');
  if (!ref_type || !ref_id) throw error(400, 'ref_type and ref_id required');
  return json(getNotesFor(db, ref_type, ref_id));
};

export const POST: RequestHandler = async ({ request }) => {
  const db = getDb();
  const body = await request.json();
  upsertNote(db, body);
  return json({ ok: true });
};
