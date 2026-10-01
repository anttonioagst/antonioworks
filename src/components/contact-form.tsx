'use client';
import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setStatus('sending');
    setFeedback('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.get('name'), email: form.get('email'), message: form.get('message'), website: form.get('website') }),
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível enviar agora. Tente novamente.');
      formElement.reset();
      setStatus('sent');
      setFeedback('Mensagem enviada. Obrigado pelo contato! Responderei pelo e-mail informado.');
    } catch (cause) {
      setStatus('error');
      setFeedback(cause instanceof Error ? cause.message : 'Não foi possível enviar agora. Tente novamente.');
    }
  }
  return <form className="contact-form" onSubmit={sendMessage}>
    <div className="field"><label htmlFor="name">NOME</label><input id="name" name="name" maxLength={120} required placeholder="Como posso chamar você?"/></div>
    <div className="field"><label htmlFor="email">E-MAIL</label><input id="email" name="email" type="email" maxLength={254} required placeholder="Como posso responder?"/></div>
    <div className="field"><label htmlFor="message">MENSAGEM</label><textarea id="message" name="message" rows={4} maxLength={4000} required placeholder="Conte sobre sua ideia ou oportunidade..."/></div>
    <div className="contact-honeypot" aria-hidden="true"><label htmlFor="website">Site</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
    <button className="pill" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando...' : 'Enviar mensagem'} <FiArrowRight/></button>
    <p className="contact-note">Seu nome, e-mail e mensagem serão usados apenas para responder ao contato.</p>
    {feedback && <p role="status" className="contact-feedback" data-state={status}>{feedback}</p>}
  </form>;
}
