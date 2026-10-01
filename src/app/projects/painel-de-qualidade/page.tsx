import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheck, FiLayers } from 'react-icons/fi';
import { SiClaude, SiCss, SiGoogleappsscript, SiGoogledrive, SiHtml5, SiJavascript } from 'react-icons/si';
import { Frame } from '@/components/frame';
import { site } from '@/content/site';

const panel = site.qualityPanel;

export const metadata: Metadata = {
  title: panel.title,
  description: panel.summary,
};

const stackIcons: Record<string, React.ComponentType> = {
  'Google Apps Script': SiGoogleappsscript,
  'Google Drive': SiGoogledrive,
  HTML: SiHtml5,
  CSS: SiCss,
  JavaScript: SiJavascript,
  Claude: SiClaude,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="section">
    <div className="section-head"><h2 className="section-title">{title}</h2></div>
    <div className="case-body">{children}</div>
  </section>;
}

export default function QualityPanelPage() {
  return <Frame><div className="inner-page case-page">
    <div className="sub-back"><Link className="back-link" href="/projects">← PROJETOS</Link></div>
    <header className="sub-intro">
      <span className="case-eyebrow">{panel.eyebrow}</span>
      <h1 className="serif">{panel.title}</h1>
      <p>{panel.summary}</p>
    </header>
    <dl className="case-facts">
      {panel.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
    </dl>
    <div className="band" aria-hidden="true"/>

    <Section title="O problema">
      {panel.problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </Section>
    <div className="band" aria-hidden="true"/>

    <Section title="O que o painel faz">
      <div className="case-modules">
        {panel.modules.map((module) => <article className="case-module" key={module.title}>
          <Image src={module.shot} alt={`Tela de ${module.title} do Painel de Qualidade`} width={1024} height={576}/>
          <h3>{module.title}</h3>
          <p>{module.text}</p>
        </article>)}
      </div>
      <ul className="case-features">
        {panel.features.map((feature) => <li key={feature}><FiCheck aria-hidden="true"/>{feature}</li>)}
      </ul>
    </Section>
    <div className="band" aria-hidden="true"/>

    <Section title="Como foi construído">
      {panel.build.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <div className="project-detail-tags case-stack">
        {panel.stack.map((item) => {
          const Icon = stackIcons[item] ?? FiLayers;
          return <span className="project-detail-tag" key={item}><Icon aria-hidden="true"/><span>{item}</span></span>;
        })}
      </div>
    </Section>
    <div className="band" aria-hidden="true"/>

    <Section title="O maior desafio">
      <blockquote className="case-quote">{panel.challenge}</blockquote>
    </Section>
    <div className="band" aria-hidden="true"/>

    <Section title="Resultado">
      <dl className="case-results">
        {panel.results.map((result) => <div key={result.label}><dt>{result.value}</dt><dd>{result.label}</dd></div>)}
      </dl>
      <p className="case-note">{panel.resultsNote}</p>
      <p>{panel.outcome}</p>
    </Section>
    <div className="band" aria-hidden="true"/>

    <section className="section case-close">
      <p>Quer saber mais sobre o painel ou conversar sobre uma oportunidade?</p>
      <Link className="pill" href="/contact">Vamos conversar <FiArrowRight/></Link>
    </section>
    <div className="band" aria-hidden="true"/>
  </div></Frame>;
}
