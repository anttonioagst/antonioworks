'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { SiClaude } from 'react-icons/si';
import { AnimatePresence, motion } from 'motion/react';

type Shot = { src: string; alt: string; caption: string };
type Tool = { name: string; color: string };

const toolIcons: Record<string, React.ComponentType> = {
  Claude: SiClaude,
};

export function CareerMore({ company, story, shots, tools, caseHref, children }: { company: string; story: string[]; shots: Shot[]; tools: Tool[]; caseHref?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reduce, setReduce] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReduce(matchMedia('(prefers-reduced-motion: reduce)').matches));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="career-more-block">
      <div className="career-card-content">
        {children}
        <button
          type="button"
          className="career-card-hitarea"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? `Ocultar detalhes de ${company}` : `Ver detalhes de ${company}`}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="career-more" aria-hidden="true"><FiChevronDown /></span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="career-detail-clip"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="career-detail">
              <div className="career-tools">
                {tools.map((tool) => {
                  const Icon = toolIcons[tool.name];
                  return (
                    <span className="tag career-tool" key={tool.name} style={{ '--brand': tool.color } as React.CSSProperties}>
                      {Icon ? <Icon /> : null}
                      {tool.name}
                    </span>
                  );
                })}
              </div>
              {story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="career-shots">
                {shots.map((shot) => (
                  <figure key={shot.src}>
                    <Image src={shot.src} alt={shot.alt} width={1024} height={576} />
                    <figcaption>{shot.caption}</figcaption>
                  </figure>
                ))}
              </div>
              {caseHref && <Link className="career-case-link" href={caseHref}>Ver o case completo <FiArrowRight aria-hidden="true"/></Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
