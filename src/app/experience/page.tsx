import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { FiBriefcase, FiBookOpen } from 'react-icons/fi';
import { CareerMore } from '@/components/career-more';
import { EducationCards } from '@/components/education';
import { Period } from '@/components/period';
import { Frame } from '@/components/frame';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Experiência',
  description: 'Trajetória em projetos de arquitetura e engenharia, formação em Análise e Desenvolvimento de Sistemas e certificados.',
};

export default function ExperiencePage() {
  return <Frame><div className="inner-page">
    <div className="sub-back"><Link className="back-link" href="/">← INÍCIO</Link></div>
    <div className="sub-intro"><h1 className="serif">Experiência</h1><p>Minha trajetória em projetos de engenharia e os estudos que me aproximaram da tecnologia.</p></div>
    <div className="band" aria-hidden="true"/>
    <div className="experience-body">
      <div className="experience-label"><FiBriefcase/> Trajetória profissional</div>
      {site.experience.map(item => {
        const content = <>
          <div className="career-meta"><Period value={item.period}/></div>
          <div className="career-heading"><span className="company-mark">{item.logo ? <Image src={item.logo} alt="" width={144} height={144}/> : <span>BB</span>}</span><h2 className="section-title">{item.company}</h2></div>
          <div className="career-role">{item.role}</div>
          <p className="career-description">{item.description}</p>
        </>;
        return <section key={item.company} className="experience-group career-group">
          {'story' in item && item.story && 'shots' in item && item.shots && 'tools' in item && item.tools
            ? <CareerMore company={item.company} story={item.story} shots={item.shots} tools={item.tools} caseHref={'caseHref' in item ? item.caseHref : undefined}>{content}</CareerMore>
            : <div className="career-card-content">{content}</div>}
        </section>;
      })}
      <div className="band" aria-hidden="true"/>
      <div className="experience-label"><FiBookOpen/> Estudos</div>
      <EducationCards/>
      <a className="back-link" href={site.resumeUrl} target="_blank" rel="noopener noreferrer">Ver currículo completo <span className="redirect-arrow" aria-hidden="true">↗</span></a>
    </div>
    <div className="band" aria-hidden="true"/>
  </div></Frame>;
}
