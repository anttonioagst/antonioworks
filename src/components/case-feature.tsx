import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { site } from '@/content/site';

export function CaseFeature() {
  const panel = site.qualityPanel;
  return <Link className="case-feature" href={panel.href}>
    <Image src={panel.modules[0].shot} alt={`Tela de ${panel.modules[0].title} do ${panel.title}`} width={1024} height={576}/>
    <span className="case-feature-text">
      <span className="case-eyebrow">{panel.eyebrow}</span>
      <span className="case-feature-title">{panel.title}</span>
      <span className="case-feature-summary">{panel.summary}</span>
      <span className="case-feature-cta">Ler o case <FiArrowRight aria-hidden="true"/></span>
    </span>
  </Link>;
}
