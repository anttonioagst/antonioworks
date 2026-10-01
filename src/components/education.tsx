import Image from 'next/image';
import { site } from '@/content/site';
import { Period } from './period';

export function EducationCards() {
  return <div className="education-list">{site.education.map(item => {
    const ongoing = item.status === 'Em andamento';
    return <article className="education-item" key={item.institution}>
      <div className="education-content">
        <div className="education-meta"><span className={`education-status${ongoing ? ' is-ongoing' : ''}`}>{item.status}</span><Period value={item.period}/></div>
        <div className="career-heading"><span className="company-mark education-mark"><Image src={item.logo} alt="" width={144} height={144}/></span><h3 className="section-title">{item.institution}</h3></div>
        <strong className="education-course">{item.course}</strong>
        <p className="education-description">{item.description}</p>
        {item.certificates.length > 0 && <div className="certificate-grid">{item.certificates.map(certificate => <a className="certificate-card" key={certificate.title} href={certificate.image} target="_blank" rel="noopener noreferrer" aria-label={`Abrir certificado ${certificate.title}`}>
          <span className="certificate-thumb"><Image src={certificate.image} alt="" width={220} height={130}/></span>
          <span className="certificate-info"><strong>{certificate.title}</strong><small>{certificate.detail}</small><em>Ver certificado</em></span>
        </a>)}</div>}
      </div>
    </article>;
  })}</div>;
}
