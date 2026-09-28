'use client';

import Image from 'next/image';
import { useEffect, useId, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { SiClaude } from 'react-icons/si';
import { AnimatePresence, motion } from 'motion/react';

type Shot = { src: string; alt: string; caption: string };
type Tool = { name: string; color: string };

const toolIcons: Record<string, React.ComponentType> = {
  Claude: SiClaude,
};

export function CareerMore({ company, story, shots, tools }: { company: string; story: string[]; shots: Shot[]; tools: Tool[] }) {
  const [open, setOpen] = useState(false);
  const [reduce, setReduce] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setReduce(matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <div className="career-more-block">
      <button
        type="button"
        className="career-more"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? `Ocultar detalhes de ${company}` : `Ver detalhes de ${company}`}
        onClick={() => setOpen((value) => !value)}
      >
        <FiChevronDown />
      </button>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
