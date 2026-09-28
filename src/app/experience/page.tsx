import Link from 'next/link';
import Image from 'next/image';
import { FiBriefcase, FiBookOpen } from 'react-icons/fi';
import { CareerMore } from '@/components/career-more';
import { Frame } from '@/components/frame';
import { site } from '@/content/site';

export default function ExperiencePage() {
  return <Frame><div className="inner-page">
    <div className="sub-back"><Link className="back-link" href="/">← INÍCIO</Link></div>
    <div className="sub-intro"><h1 className="serif">Experiência</h1><p>Minha trajetória em projetos de engenharia e os estudos que me aproximaram da tecnologia.</p></div>
    <div className="experience-body">
      <div className="experience-label"><FiBriefcase/> Trajetória profissional</div>
      {site.experience.map(item => <section key={item.company} className="experience-group career-group">
        <div className="career-period">{item.period}</div>
        <div className="career-heading"><span className="company-mark">{item.logo ? <Image src={item.logo} alt="" width={38} height={38}/> : <span>BB</span>}</span><h2 className="section-title">{item.company}</h2></div>
        <div className="career-role">{item.role}</div>
        <p className="career-description">{item.description}</p>
        {'story' in item && item.story && 'shots' in item && item.shots && 'tools' in item && item.tools && <CareerMore company={item.company} story={item.story} shots={item.shots} tools={item.tools} />}
      </section>)}
      <div className="experience-label"><FiBookOpen/> Formação</div>
      {site.education.map(item => <section key={item.institution} className="experience-group career-group">
        <div className="career-period">{item.period}</div>
        <div className="career-heading"><span className="company-mark education-mark"><Image src={item.logo} alt="" width={38} height={38}/></span><h2 className="section-title">{item.institution}</h2></div>
        <p className="career-description">{item.course}</p>
        {item.certificates.length > 0 && <div className="certificate-grid">{item.certificates.map(certificate => <a className="certificate-card" key={certificate.title} href={certificate.image} target="_blank" rel="noopener noreferrer" aria-label={`Abrir certificado ${certificate.title}`}>
          <span className="certificate-thumb"><Image src={certificate.image} alt={`Certificado ${certificate.title}`} width={220} height={130}/></span>
          <span className="certificate-info"><strong>{certificate.title}</strong><small>{certificate.detail}</small><em>Ver certificado ↗</em></span>
        </a>)}</div>}
      </section>)}
      <a className="back-link" href={site.resumeUrl} target="_blank" rel="noopener noreferrer">Ver currículo completo ↗</a>
    </div>
  </div></Frame>;
}
