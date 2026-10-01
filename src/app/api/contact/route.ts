import { createHash, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { contactMessagesKey, type ContactSubmission } from '@/lib/contact-store';
import { redisCommand } from '@/lib/redis';

export const runtime = 'nodejs';

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return error('Origem inválida.', 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return error('Dados inválidos.', 415);

  let payload: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 8192) return error('Mensagem muito longa.', 413);
    payload = JSON.parse(body);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return error('Dados inválidos.', 400);
  } catch {
    return error('Dados inválidos.', 400);
  }

  if (payload.website) return NextResponse.json({ ok: true });
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  if (!name || name.length > 120 || !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || message.length > 4000) {
    return error('Confira nome, e-mail e mensagem.', 400);
  }

  const source = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || email.toLowerCase();
  const rateKey = `portfolio:contact-rate:${createHash('sha256').update(source).digest('hex')}`;
  try {
    const allowed = await redisCommand('SET', rateKey, '1', 'EX', '60', 'NX');
    if (allowed !== 'OK') return error('Aguarde um minuto antes de enviar outra mensagem.', 429);
    const submission: ContactSubmission = { id: randomUUID(), name, email, message, submittedAt: new Date().toISOString() };
    await redisCommand('LPUSH', contactMessagesKey, JSON.stringify(submission));
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return error('Não foi possível enviar agora. Tente novamente.', 503);
  }
}
