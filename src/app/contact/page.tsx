import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/contact-form';
import { CopyEmail } from '@/components/copy-email';
import { Frame } from '@/components/frame';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Envie uma mensagem para Antonio Augusto sobre oportunidades, projetos ou tecnologia.',
};

export default function ContactPage() {
  return <Frame><div className="inner-page">
    <div className="sub-back"><Link className="back-link" href="/">← INÍCIO</Link></div>
    <div className="contact-intro"><h1 className="serif">Vamos conversar</h1><p>Envie uma mensagem ou fale comigo pelas redes.</p><CopyEmail email={site.links[0].href.replace('mailto:', '')}/></div>
    <div className="band" aria-hidden="true"/>
    <ContactForm/>
    <div className="band" aria-hidden="true"/>
  </div></Frame>;
}
