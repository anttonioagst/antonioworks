'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { Frame } from '@/components/frame';

export default function ContactPage() {
  const [prepared, setPrepared] = useState(false);
  function prepareEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();
    const subject = encodeURIComponent('Contato pelo portfólio — ' + name);
    const body = encodeURIComponent('Nome: ' + name + '\nE-mail: ' + email + '\n\n' + message);
    setPrepared(true);
    window.location.href = 'mailto:anttonioaugustofc@gmail.com?subject=' + subject + '&body=' + body;
  }
  return <Frame><div className="inner-page">
    <div className="sub-back"><Link className="back-link" href="/">← INÍCIO</Link></div>
    <div className="contact-intro"><h1 className="serif">Vamos conversar</h1><p>Envie uma mensagem ou fale comigo pelas redes.</p></div>
    <form className="contact-form" onSubmit={prepareEmail}>
      <div className="field"><label htmlFor="name">NOME</label><input id="name" name="name" required placeholder="Como posso chamar você?"/></div>
      <div className="field"><label htmlFor="email">E-MAIL</label><input id="email" name="email" type="email" required placeholder="Como posso responder?"/></div>
      <div className="field"><label htmlFor="message">MENSAGEM</label><textarea id="message" name="message" rows={4} required placeholder="Conte sobre sua ideia ou oportunidade..."/></div>
      <button className="pill" type="submit">Abrir e-mail <FiArrowRight/></button>
      {prepared && <p role="status" className="secondary" style={{fontSize:13}}>Seu aplicativo de e-mail foi aberto com a mensagem preenchida. Revise e confirme o envio por lá.</p>}
    </form>
  </div></Frame>;
}
