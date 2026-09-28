'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FiChevronDown, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { site } from '@/content/site';
import { playShutter } from '@/lib/sound';

const links = [
  { label: 'Início', href: '/' },
  { label: 'Projetos', href: '/projects' },
  { label: 'Experiência', href: '/experience' },
];
const extraLinks = [{ label: 'Contato', href: '/contact' }];

export function Nav() {
  const path = usePathname();
  const moreRef = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [day, setDay] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setDay(document.documentElement.classList.contains('dark')));
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMore(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    if (root.dataset.magicuiThemeVt === 'active') return;
    const next = !root.classList.contains('dark');
    const update = () => {
      root.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      setDay(next);
    };
    playShutter();
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      update();
      return;
    }
    root.dataset.magicuiThemeVt = 'active';
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(update);
    transition.ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, {
        duration: 400,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      });
    }).finally(() => transition.finished.finally(() => delete root.dataset.magicuiThemeVt));
  }

  const dot = (href: string) => (hovered ?? path) === href &&
    <motion.span className="nav-dot" layoutId="nav-dot" transition={{ type: 'spring', stiffness: 380, damping: 28 }} />;
  const themeButton = <button className="nav-icon" aria-label="Toggle theme" onClick={toggleTheme}>{day ? <FiMoon /> : <FiSun />}</button>;

  return <nav className="nav">
    <Link href="/" className="serif" style={{ fontSize: 30 }}>{site.wordmark}</Link>
    <div className="nav-links">
      {links.map(({ label, href }) => <Link className={`nav-link ${path === href ? 'active' : ''}`} href={href} key={href} onMouseEnter={() => setHovered(href)} onMouseLeave={() => setHovered(null)}>{label}{dot(href)}</Link>)}
      <div ref={moreRef} style={{ position: 'relative' }} onMouseEnter={() => setMore(true)} onMouseLeave={() => setMore(false)}>
        <button className="nav-link" onClick={() => setMore(!more)} style={{ border: 0, background: 'none', color: 'inherit', gap: 4 }}>Mais <FiChevronDown style={{ transform: more ? 'rotate(180deg)' : '', transition: 'transform .2s' }} /></button>
        <AnimatePresence>{more && <motion.div className="menu-pop" initial={{ opacity: 0, transform: 'translateY(-5px) scale(.95)' }} animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }} exit={{ opacity: 0, transform: 'translateY(-5px) scale(.95)' }} transition={{ duration: .12 }}>
          {extraLinks.map(({ label, href }) => <Link href={href} key={href} onClick={() => setMore(false)}>{label}</Link>)}
        </motion.div>}</AnimatePresence>
      </div>
      {themeButton}
    </div>
    <div className="nav-mobile" style={{ position: 'relative' }}>
      <div style={{ display: 'flex' }}>{themeButton}<button className="nav-icon" aria-label="Toggle menu" onClick={() => setMobile(!mobile)}>{mobile ? <FiX /> : <FiMenu />}</button></div>
      <AnimatePresence>{mobile && <motion.div className="menu-pop" style={{ right: 0, minWidth: 170 }} initial={{ opacity: 0, transform: 'translateY(-5px) scale(.95)' }} animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }} exit={{ opacity: 0, transform: 'translateY(-5px) scale(.95)' }} transition={{ duration: .12 }}>
        {[...links, ...extraLinks].map(({ label, href }) => <Link href={href} key={href} onClick={() => setMobile(false)}>{label}</Link>)}
      </motion.div>}</AnimatePresence>
    </div>
  </nav>;
}
