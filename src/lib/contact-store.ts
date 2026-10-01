import { redisCommand } from '@/lib/redis';

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
};

export const contactMessagesKey = 'portfolio:contact-messages:v1';

export async function listContactSubmissions(): Promise<ContactSubmission[]> {
  const result = await redisCommand('LRANGE', contactMessagesKey, '0', '99');
  if (!Array.isArray(result)) throw new Error('Contact storage returned an invalid list');
  return result.map((item) => JSON.parse(String(item)) as ContactSubmission);
}
