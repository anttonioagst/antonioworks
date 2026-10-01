export async function redisCommand(command: string, ...args: string[]): Promise<unknown> {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Redis storage is not configured');

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([command, ...args]),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Redis storage returned ${response.status}`);
  const data: { result?: unknown; error?: string } = await response.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}
