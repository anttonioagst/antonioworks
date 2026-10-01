import type { Metadata } from 'next';
import Link from 'next/link';
import { Frame } from '@/components/frame';
import { listContactSubmissions, type ContactSubmission } from '@/lib/contact-store';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Mensagens recebidas',
  robots: { index: false, follow: false, noarchive: true },
};

export default async function MessagesPage() {
  let messages: ContactSubmission[];
  let unavailable = false;
  try {
    messages = await listContactSubmissions();
  } catch {
    messages = [];
    unavailable = true;
  }

  return <Frame><div className="inner-page inbox-page">
    <div className="sub-back"><Link className="back-link" href="/admin">← PAINEL</Link></div>
    <header className="contact-intro"><h1 className="serif">Mensagens recebidas</h1><p>Últimas 100 mensagens enviadas pelo formulário de contato.</p></header>
    <div className="band" aria-hidden="true"/>
    {unavailable ? <p className="inbox-empty">Não foi possível carregar as mensagens agora.</p> :
      messages.length === 0 ? <p className="inbox-empty">Ainda não há mensagens.</p> :
      <div className="inbox-list">{messages.map((item) => <article className="inbox-message" key={item.id}>
        <time dateTime={item.submittedAt}>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(item.submittedAt))}</time>
        <h2>{item.name}</h2>
        <a href={`mailto:${item.email}`}>{item.email}</a>
        <p>{item.message}</p>
      </article>)}</div>}
    <div className="band" aria-hidden="true"/>
  </div></Frame>;
}
