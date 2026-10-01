'use client';
import { useEffect, useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  return <p className="copy-email">
    Ou escreva direto para <a href={`mailto:${email}`}>{email}</a>
    <button type="button" onClick={() => navigator.clipboard?.writeText(email).then(() => setCopied(true), () => undefined)} aria-label={copied ? 'E-mail copiado' : 'Copiar e-mail'}>
      {copied ? <FiCheck aria-hidden="true"/> : <FiCopy aria-hidden="true"/>}<span>{copied ? 'Copiado' : 'Copiar'}</span>
    </button>
    <span className="visually-hidden" role="status">{copied ? 'E-mail copiado' : ''}</span>
  </p>;
}
