import { NextRequest, NextResponse } from 'next/server';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const file = path.join(process.cwd(), '.data', 'views.json');
let queue = Promise.resolve();

async function readViews() {
  try {
    const data = JSON.parse(await readFile(file, 'utf8'));
    return Number.isSafeInteger(data.views) && data.views >= 0 ? data.views : 0;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return 0;
    throw error;
  }
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('increment') !== 'true') {
    return NextResponse.json({ value: await readViews() });
  }

  let value = 0;
  const update = queue.then(async () => {
    value = (await readViews()) + 1;
    await mkdir(path.dirname(file), { recursive: true });
    const temporary = `${file}.${process.pid}.tmp`;
    await writeFile(temporary, JSON.stringify({ views: value }));
    await rename(temporary, file);
  });
  queue = update.catch(() => {});
  await update;
  return NextResponse.json({ value });
}
