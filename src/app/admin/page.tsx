import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowDownRight, FiArrowUpRight, FiMinus } from 'react-icons/fi';
import { AdminChart } from '@/components/admin-chart';
import { Frame } from '@/components/frame';
import { analyticsPeriods, getAnalyticsSummary, sampleAnalyticsSummary, type AnalyticsPeriod, type AnalyticsSummary } from '@/lib/analytics-store';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Métricas',
  robots: { index: false, follow: false, noarchive: true },
};

const formatter = new Intl.NumberFormat('pt-BR');
const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const percent = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 });
const countryNames = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
const pageNames: Record<string, string> = {
  '/': 'Início', '/projects': 'Projetos', '/projects/painel-de-qualidade': 'Case · Painel de Qualidade', '/experience': 'Experiência', '/contact': 'Contato',
};
const deviceNames: Record<string, string> = { mobile: 'Celular', tablet: 'Tablet', desktop: 'Computador' };
const sourceName = (name: string) => name === 'utm:curriculo_qr' ? 'QR do currículo' : name === 'direto' ? 'Direto' : name === 'interno' ? 'Interno' : name.replace(/^utm:/, 'Campanha · ');
const countryName = (code: string) => { try { return countryNames.of(code) ?? code; } catch { return code; } };

function Delta({ current, previous }: { current: number; previous: number }) {
  if (!previous && !current) return <span className="admin-delta" data-trend="flat"><FiMinus aria-hidden="true"/>sem dados</span>;
  if (!previous) return <span className="admin-delta" data-trend="up"><FiArrowUpRight aria-hidden="true"/>novo</span>;
  const change = (current - previous) / previous;
  const trend = Math.abs(change) < 0.005 ? 'flat' : change > 0 ? 'up' : 'down';
  const Icon = trend === 'up' ? FiArrowUpRight : trend === 'down' ? FiArrowDownRight : FiMinus;
  return <span className="admin-delta" data-trend={trend}><Icon aria-hidden="true"/>{percent.format(Math.abs(change))}</span>;
}

function Ranking({ rows, empty, label = (name) => name }: { rows: { name: string; count: number }[]; empty: string; label?: (name: string) => string }) {
  if (!rows.length) return <p className="admin-empty">{empty}</p>;
  const total = rows.reduce((sum, row) => sum + row.count, 0) || 1;
  const peak = Math.max(...rows.map((row) => row.count), 1);
  return <div className="admin-ranking">{rows.slice(0, 8).map(({ name, count }) => <div className="admin-ranking-row" key={name}>
    <div><span>{label(name)}</span><strong>{formatter.format(count)} <small>{percent.format(count / total)}</small></strong></div>
    <div className="admin-bar-track"><span style={{ width: `${Math.max(3, count / peak * 100)}%` }}/></div>
  </div>)}</div>;
}

function Section({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return <><section className="section admin-section"><div className="section-head"><h2 className="section-title">{title}</h2>{aside}</div>{children}</section><div className="band" aria-hidden="true"/></>;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const requested = Number((await searchParams).dias);
  const period: AnalyticsPeriod = analyticsPeriods.find((value) => value === requested) ?? 14;
  let data: AnalyticsSummary | null = null;
  try {
    data = await getAnalyticsSummary(period);
  } catch {
    // Local preview only: lets the layout be reviewed without production storage. Production shows the failure instead.
    if (process.env.NODE_ENV === 'development') data = sampleAnalyticsSummary(period);
  }

  const updated = data ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(data.updatedAt)) : null;
  const page = (path: string) => data?.pages.find((item) => item.name === path)?.count ?? 0;
  const funnel = data ? [
    { label: 'Chegaram ao início', count: page('/') },
    { label: 'Viram projetos ou o case', count: page('/projects') + page('/projects/painel-de-qualidade') },
    { label: 'Abriram o contato', count: page('/contact') },
    { label: 'Enviaram mensagem', count: data.messages },
  ] : [];

  return <Frame><div className="inner-page admin-page">
    <div className="sub-back"><Link className="back-link" href="/">← INÍCIO</Link><div className="admin-private-links"><Link href="/admin/mensagens">Mensagens</Link><Link href="/admin/design-system">Design system</Link></div></div>
    <header className="sub-intro admin-intro">
      <div><h1 className="serif">Métricas</h1><p>Como o portfólio está sendo visto{updated ? <> · atualizado em {updated}</> : null}.</p></div>
      <nav className="admin-segmented" aria-label="Período">
        {analyticsPeriods.map((value) => <Link key={value} href={`/admin?dias=${value}`} aria-current={value === period ? 'page' : undefined}>{value} dias</Link>)}
      </nav>
    </header>
    {data?.sample && <p className="admin-sample" role="note">Dados de exemplo: o Redis não está configurado neste ambiente local. Em produção o painel mostra os números reais.</p>}
    <div className="band" aria-hidden="true"/>

    {!data ? <section className="admin-section"><p className="admin-empty">As métricas estão indisponíveis no momento. Tente novamente mais tarde.</p></section> : <>
      <Section title={`Últimos ${period} dias`}>
        <div className="admin-stats">
          {([
            ['Visitas', 'visits'],
            ['Páginas vistas', 'pageviews'],
            ['Cliques', 'clicks'],
            ['Mensagens', 'messages'],
          ] as const).map(([label, key]) => <div className="admin-stat" key={key}>
            <span>{label}</span>
            <strong>{formatter.format(data.current[key])}</strong>
            <Delta current={data.current[key]} previous={data.previous[key]}/>
          </div>)}
        </div>
        <dl className="admin-derived">
          <div><dt>Páginas por visita</dt><dd>{data.current.visits ? decimal.format(data.current.pageviews / data.current.visits) : '—'}</dd></div>
          <div><dt>Visitas que viraram mensagem</dt><dd>{data.current.visits ? percent.format(data.current.messages / data.current.visits) : '—'}</dd></div>
          <div><dt>Visitantes únicos desde o início</dt><dd>{formatter.format(data.uniqueVisitors)}</dd></div>
        </dl>
        <AdminChart days={data.days}/>
        <p className="admin-note">A variação compara com os {period} dias anteriores. Visitante único é um navegador com cookie; uma visita é uma sessão de 30 minutos.</p>
      </Section>

      <Section title="Funil" aside={<span className="admin-aside">desde a ativação</span>}>
        <ol className="admin-funnel">
          {funnel.map((step, index) => {
            const base = funnel[0].count || 1;
            const previous = index ? funnel[index - 1].count : 0;
            return <li key={step.label}>
              <div className="admin-funnel-head"><span>{step.label}</span><strong>{formatter.format(step.count)}</strong></div>
              <div className="admin-bar-track"><span style={{ width: `${Math.max(step.count ? 2 : 0, Math.min(100, step.count / base * 100))}%` }}/></div>
              {index > 0 && <small>{previous ? `${percent.format(step.count / previous)} da etapa anterior` : '—'}</small>}
            </li>;
          })}
        </ol>
        <p className="admin-note">Páginas vistas por rota, não pessoas: quem volta a uma página conta de novo.</p>
      </Section>

      <Section title="Mensagens" aside={<Link className="muted section-action" href="/admin/mensagens">Abrir caixa ↗</Link>}>
        <div className="admin-message">
          <strong>{formatter.format(data.messages)}</strong>
          <span>{data.latestMessage
            ? <>Última de <b>{data.latestMessage.name}</b> em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(data.latestMessage.submittedAt))}.</>
            : 'Nenhuma mensagem recebida ainda.'}</span>
        </div>
      </Section>

      <Section title="Páginas visitadas">
        <Ranking rows={data.pages} label={(name) => pageNames[name] ?? name} empty="As visitas por página começam a aparecer após a publicação do painel."/>
      </Section>

      <Section title="De onde vieram">
        <Ranking rows={data.sources} label={sourceName} empty="Nenhuma origem registrada ainda."/>
        <p className="admin-note">A origem usa o site de referência ou o parâmetro utm_source. Acesso sem referência aparece como “Direto”.</p>
      </Section>

      <Section title="Público">
        <div className="admin-columns">
          <div><h3>Dispositivo</h3><Ranking rows={data.devices} label={(name) => deviceNames[name] ?? name} empty="Começa a contar a partir desta versão."/></div>
          <div><h3>País</h3><Ranking rows={data.countries} label={countryName} empty="Começa a contar a partir desta versão."/></div>
        </div>
        <p className="admin-note">Contados uma vez por visita. O país vem da Vercel; o painel guarda só o código do país, nunca o IP.</p>
      </Section>

      <Section title="QR do currículo">
        <div className="admin-stats admin-qr-stats">
          <div className="admin-stat"><span>Aberturas do link</span><strong>{formatter.format(data.resumeQrScans)}</strong></div>
          <div className="admin-stat"><span>Navegadores únicos</span><strong>{formatter.format(data.resumeQrVisitors)}</strong></div>
        </div>
        <p className="admin-note">O QR aponta para <code>antonioworks.vercel.app/cv</code>. Cada abertura conta uma vez; navegadores únicos usam cookie. <a href="/qr-curriculo.svg" download>Baixar QR para o currículo ↗</a></p>
      </Section>

      <section className="section admin-section"><div className="section-head"><h2 className="section-title">Onde clicaram</h2></div>
        {data.targets.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Ação</th><th>Seção</th><th>Página</th><th>Cliques</th></tr></thead><tbody>{data.targets.map((target) => <tr key={JSON.stringify(target)}><td>{target.label}</td><td>{target.section}</td><td>{pageNames[target.path] ?? target.path}</td><td>{formatter.format(target.count)}</td></tr>)}</tbody></table></div> : <p className="admin-empty">Os cliques em links e botões aparecerão aqui.</p>}
      </section>
    </>}
    <div className="band" aria-hidden="true"/>
  </div></Frame>;
}
