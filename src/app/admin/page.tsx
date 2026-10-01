import type { Metadata } from 'next';
import Link from 'next/link';
import { Frame } from '@/components/frame';
import { getAnalyticsSummary, type AnalyticsSummary } from '@/lib/analytics-store';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Métricas',
  robots: { index: false, follow: false, noarchive: true },
};

const formatter = new Intl.NumberFormat('pt-BR');
const pageNames: Record<string, string> = {
  '/': 'Início', '/projects': 'Projetos', '/experience': 'Experiência', '/contact': 'Contato',
};
const displayName = (name: string) => pageNames[name] ?? (name === 'utm:curriculo_qr' ? 'QR do currículo' : name === 'direto' ? 'Direto' : name === 'interno' ? 'Interno' : name.replace(/^utm:/, 'Campanha · '));

function Ranking({ rows, empty }: { rows: { name: string; count: number }[]; empty: string }) {
  if (!rows.length) return <p className="admin-empty">{empty}</p>;
  const peak = Math.max(...rows.map((row) => row.count), 1);
  return <div className="admin-ranking">{rows.map(({ name, count }) => <div className="admin-ranking-row" key={name}>
    <div><span>{displayName(name)}</span><strong>{formatter.format(count)}</strong></div>
    <div className="admin-bar-track"><span style={{ width: `${Math.max(3, count / peak * 100)}%` }}/></div>
  </div>)}</div>;
}

export default async function AdminPage() {
  let data: AnalyticsSummary | null = null;
  try {
    data = await getAnalyticsSummary();
  } catch { /* Show storage failure without inventing metrics. */ }
  const maxVisits = Math.max(1, ...(data?.days.map((day) => day.visits) ?? []));

  return <Frame><div className="inner-page admin-page">
    <div className="sub-back"><Link className="back-link" href="/">← INÍCIO</Link><div className="admin-private-links"><Link href="/admin/mensagens">Mensagens</Link><Link href="/admin/design-system">Design system</Link></div></div>
    <header className="sub-intro"><h1 className="serif">Métricas</h1><p>Uma visão do movimento do portfólio.</p></header>
    <div className="band" aria-hidden="true"/>

    {!data ? <section className="admin-section"><p className="admin-empty">As métricas estão indisponíveis no momento. Tente novamente mais tarde.</p></section> : <>
      <section className="section admin-section"><div className="section-head"><h2 className="section-title">Visão geral</h2></div>
        <div className="admin-stats">
          {[
            ['Visitantes únicos', data.uniqueVisitors],
            ['Visitas', data.visits],
            ['Páginas vistas', data.pageviews],
            ['Cliques', data.clicks],
          ].map(([label, value]) => <div className="admin-stat" key={label}><span>{label}</span><strong>{formatter.format(Number(value))}</strong></div>)}
        </div>
        <p className="admin-note">Visitante único é um navegador com cookie. Uma visita é uma sessão de 30 minutos. Os detalhes de visitas e cliques começam na ativação deste painel; o total de visitantes inclui o contador anterior.</p>
      </section>
      <div className="band" aria-hidden="true"/>

      <section className="section admin-section"><div className="section-head"><h2 className="section-title">Últimos 14 dias</h2></div>
        <div className="admin-chart-wrap"><div className="admin-chart" aria-hidden="true">{data.days.map((day) => <div className="admin-chart-column" key={day.date}>
          <div className="admin-chart-bar-area"><span title={`${day.date}: ${day.visits} visitas`} style={{ height: `${day.visits ? Math.max(3, day.visits / maxVisits * 100) : 0}%` }}/></div>
          <small>{day.date.slice(8)}</small>
        </div>)}</div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Dia</th><th>Visitantes</th><th>Visitas</th><th>Páginas</th><th>Cliques</th></tr></thead><tbody>{[...data.days].reverse().map((day) => <tr key={day.date}><td>{new Date(`${day.date}T12:00:00Z`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</td><td>{formatter.format(day.visitors)}</td><td>{formatter.format(day.visits)}</td><td>{formatter.format(day.pageviews)}</td><td>{formatter.format(day.clicks)}</td></tr>)}</tbody></table></div>
      </section>
      <div className="band" aria-hidden="true"/>

      <section className="section admin-section"><div className="section-head"><h2 className="section-title">Páginas visitadas</h2></div><Ranking rows={data.pages} empty="As visitas por página começam a aparecer após a publicação do painel."/></section>
      <div className="band" aria-hidden="true"/>

      <section className="section admin-section"><div className="section-head"><h2 className="section-title">De onde vieram</h2></div><Ranking rows={data.sources} empty="Nenhuma origem registrada ainda."/><p className="admin-note">A origem usa o site de referência ou o parâmetro utm_source. Acesso sem referência aparece como “Direto”.</p></section>
      <div className="band" aria-hidden="true"/>

      <section className="section admin-section"><div className="section-head"><h2 className="section-title">QR do currículo</h2></div>
        <div className="admin-stats admin-qr-stats">
          <div className="admin-stat"><span>Aberturas do link</span><strong>{formatter.format(data.resumeQrScans)}</strong></div>
          <div className="admin-stat"><span>Navegadores únicos</span><strong>{formatter.format(data.resumeQrVisitors)}</strong></div>
        </div>
        <p className="admin-note">O QR novo aponta para <code>antonioworks.vercel.app/cv</code>. Cada abertura conta uma vez; navegadores únicos usam cookie. <a href="/qr-curriculo.svg" download>Baixar QR para o currículo ↗</a></p>
      </section>
      <div className="band" aria-hidden="true"/>

      <section className="section admin-section"><div className="section-head"><h2 className="section-title">Onde clicaram</h2></div>
        {data.targets.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Ação</th><th>Seção</th><th>Página</th><th>Cliques</th></tr></thead><tbody>{data.targets.map((target) => <tr key={JSON.stringify(target)}><td>{target.label}</td><td>{target.section}</td><td>{pageNames[target.path] ?? target.path}</td><td>{formatter.format(target.count)}</td></tr>)}</tbody></table></div> : <p className="admin-empty">Os cliques em links e botões aparecerão aqui.</p>}
      </section>
    </>}
    <div className="band" aria-hidden="true"/>
  </div></Frame>;
}
