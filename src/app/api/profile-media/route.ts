import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const names = {
  portrait: 'antonio-profile.png',
  banner: 'identity-banner.png',
} as const;

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'unavailable' }, { status: 403 });
  }

  const form = await request.formData();
  const kind = form.get('kind');
  const file = form.get('file');
  if ((kind !== 'portrait' && kind !== 'banner') || !(file instanceof File) || !file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: 'too-large' }, { status: 400 });
  }

  const filename = names[kind];
  await writeFile(path.join(process.cwd(), 'public', filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ src: `/${filename}` });
}
