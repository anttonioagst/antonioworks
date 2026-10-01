'use client';
import { useState } from 'react';

type Metric = 'visits' | 'visitors' | 'pageviews' | 'clicks';
type Day = Record<Metric, number> & { date: string };

const metrics: { key: Metric; label: string; unit: [string, string] }[] = [
  { key: 'visits', label: 'Visitas', unit: ['visita', 'visitas'] },
  { key: 'visitors', label: 'Visitantes', unit: ['visitante', 'visitantes'] },
  { key: 'pageviews', label: 'Páginas', unit: ['página vista', 'páginas vistas'] },
  { key: 'clicks', label: 'Cliques', unit: ['clique', 'cliques'] },
];
const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const dayLabel = (date: string, options: Intl.DateTimeFormatOptions) => new Date(`${date}T12:00:00Z`).toLocaleDateString('pt-BR', { timeZone: 'UTC', ...options });

export function AdminChart({ days }: { days: Day[] }) {
  const [metric, setMetric] = useState<Metric>('visits');
  const [active, setActive] = useState<number | null>(null);
  const current = metrics.find((item) => item.key === metric)!;
  const values = days.map((day) => day[metric]);
  const peak = Math.max(1, ...values);
  const total = values.reduce((sum, value) => sum + value, 0);
  const focus = active === null ? null : days[active];
  const unit = (value: number) => current.unit[value === 1 ? 0 : 1];
  const dense = days.length > 14;

  return <div className="admin-chart-card">
    <div className="admin-chart-toolbar">
      <div className="admin-segmented" role="group" aria-label="Métrica do gráfico">
        {metrics.map((item) => <button type="button" key={item.key} aria-pressed={metric === item.key} onClick={() => setMetric(item.key)}>{item.label}</button>)}
      </div>
      <p className="admin-chart-readout" aria-live="polite">
        {focus
          ? <><strong>{number.format(focus[metric])}</strong> {unit(focus[metric])} em {dayLabel(focus.date, { day: '2-digit', month: 'long' })}</>
          : <><strong>{number.format(total)}</strong> {unit(total)} · média de {number.format(total / Math.max(1, days.length))} por dia</>}
      </p>
    </div>
    <div className="admin-chart-wrap">
      <div className="admin-chart" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(${dense ? 10 : 18}px, 1fr))` }} onMouseLeave={() => setActive(null)}>
        <span className="admin-chart-peak" aria-hidden="true">{number.format(peak)}</span>
        {days.map((day, index) => <button
          type="button"
          className="admin-chart-column"
          key={day.date}
          data-active={active === index || undefined}
          aria-label={`${dayLabel(day.date, { day: '2-digit', month: 'long' })}: ${day[metric]} ${unit(day[metric])}`}
          onMouseOver={() => setActive(index)}
          onFocus={() => setActive(index)}
          onBlur={() => setActive(null)}
        >
          <span className="admin-chart-bar-area"><span style={{ height: `${day[metric] ? Math.max(3, day[metric] / peak * 100) : 0}%` }}/></span>
          <small>{!dense || index % 3 === 0 || index === days.length - 1 ? day.date.slice(8) : ''}</small>
        </button>)}
      </div>
    </div>
  </div>;
}
