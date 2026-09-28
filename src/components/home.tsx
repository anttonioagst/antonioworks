'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiArrowUpRight, FiEye, FiGithub, FiGlobe, FiLinkedin, FiMail, FiPaperclip, FiPhone } from 'react-icons/fi';
import { FaInstagram } from 'react-icons/fa6';
import { SiClaude, SiClaudecode, SiCss, SiCursor, SiHtml5, SiJavascript } from 'react-icons/si';
import { MdVerified } from 'react-icons/md';
import { VscVscode } from 'react-icons/vsc';
import { AnimatePresence, motion } from 'motion/react';
import { site } from '@/content/site';
import { playNote } from '@/lib/sound';
import { CareerMore } from './career-more';
import { MediaPencil, replaceMedia } from './media-pencil';
import { SceneBanner } from './scene-banner';

const stackIcons: Record<string, React.ComponentType> = {
  HTML: SiHtml5, CSS: SiCss, JavaScript: SiJavascript,
  'VS Code': VscVscode, Cursor: SiCursor, Codex: SiClaudecode, Claude: SiClaude,
};
const stackColors: Record<string,string> = {HTML:'#e34f26',CSS:'#1572b6',JavaScript:'#f7df1e','VS Code':'#24a9f2',Cursor:'#cccccc',Codex:'#a9a9a9',Claude:'#d97757'};
const icons = { github: FiGithub, linkedin: FiLinkedin, instagram: FaInstagram, mail: FiMail, phone: FiPhone, resume: FiPaperclip };
export function Identity(){const [role,setRole]=useState(0),[views,setViews]=useState(0),[portrait,setPortrait]=useState(site.portraits[0]),[canEdit,setCanEdit]=useState(false);useEffect(()=>{setCanEdit(location.hostname==='localhost'||location.hostname==='127.0.0.1')},[]);useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const id=setInterval(()=>setRole(v=>(v+1)%site.roles.length),3000);return()=>clearInterval(id)},[]);useEffect(()=>{fetch('/api/views?increment=true').then(r=>r.json()).then(d=>{const value=Number(d.value)||0;if(matchMedia('(prefers-reduced-motion: reduce)').matches){setViews(value);return}const start=performance.now();const frame=(now:number)=>{const t=Math.min(1,(now-start)/1000);setViews(Math.round(value*t*(2-t)));if(t<1)requestAnimationFrame(frame)};requestAnimationFrame(frame)}).catch(()=>setViews(0))},[]);return <><div style={{paddingTop:48}}><SceneBanner editable={canEdit}/></div><section className="section identity-main"><div className="avatar-frame media-host">{portrait.startsWith('blob:') ? <img className="avatar" src={portrait} alt={site.wordmark}/> : <Image className="avatar" src={portrait} alt={site.wordmark} width={116} height={116}/>}{canEdit && <MediaPencil label="Trocar foto de perfil" onPick={async (file) => setPortrait(await replaceMedia('portrait', file))}/>}</div><div><span style={{fontSize:13}}>◐</span><div className="identity-name">{site.name}</div><div className="role" aria-label={site.roles[role]}><AnimatePresence mode="popLayout"><motion.span key={role} aria-hidden="true" initial={{opacity:0,transform:"translateY(5px)"}} animate={{opacity:1,transform:"translateY(0px)"}} exit={{opacity:0,transform:"translateY(-5px)"}} transition={{duration:.4}} style={{display:"inline-block"}}>{site.roles[role].split("").map((letter,i)=><motion.span key={i} initial={{opacity:0,transform:"translateY(5px)",filter:"blur(5px)"}} animate={{opacity:1,transform:"translateY(0px)",filter:"blur(0px)"}} transition={{duration:.3,delay:i*.03}} style={{display:"inline-block",whiteSpace:"pre"}}>{letter}</motion.span>)}</motion.span></AnimatePresence></div><div className="identity-location">{site.location}</div></div><div className="views"><FiEye/>{views}</div></section><div className="band"/></>}
export function About(){return <section className="section"><div className="section-head"><h2 className="section-title">Sobre</h2></div><ul className="about-list">{site.about.map((v,i)=><li key={i}><span dangerouslySetInnerHTML={{__html:v}}/></li>)}</ul></section>}
export function Experience() {
  return <section className="section">
    <div className="section-head">
      <h2 className="section-title">Experiência</h2>
      <Link className="muted" style={{ fontSize: 12 }} href="/experience">Ver tudo ↗</Link>
    </div>
    <div className="home-experience">
      {site.experience.map((item) => <article className="career-group" key={item.company}>
        <div className="career-period">{item.period}</div>
        <div className="career-heading">
          <span className="company-mark">{item.logo ? <Image src={item.logo} alt="" width={38} height={38} /> : null}</span>
          <h3 className="section-title">{item.company}</h3>
        </div>
        <div className="career-role">{item.role}</div>
        <p className="career-description">{item.description}</p>
        {'story' in item && item.story && 'shots' in item && item.shots && 'tools' in item && item.tools && <CareerMore company={item.company} story={item.story} shots={item.shots} tools={item.tools} />}
      </article>)}
    </div>
  </section>;
}
export function ContactRow(){return <section className="section"><div className="section-head"><h2 className="section-title">Contato</h2></div><div className="contact-row">{site.links.map(l=>{const Icon=icons[l.icon as keyof typeof icons];return <a className="contact-link" key={l.label} href={l.href} aria-label={l.label} target={l.href.startsWith('http')?'_blank':undefined} rel="noreferrer"><span className="contact-icon"><Icon/></span><span className="contact-label">{l.label}</span><FiArrowUpRight className="arrow"/></a>})}</div></section>}
export function ProjectGrid(){
  return <div className="project-grid">{site.projects.map((p,i)=><article className="project-card" key={p.title}>
    <a className={'project-media project-media-'+i} href={p.url} target="_blank" rel="noopener noreferrer" aria-label={'Abrir site de '+p.title}>
      <Image className="project-image" src={p.image} alt={'Capa do projeto '+p.title} width={1200} height={736}/>
    </a>
    <div className="project-title">{p.title}</div>
    <div className="project-subtitle">{p.subtitle}</div>
    <p className="project-desc">{p.description}</p>
    <div className="project-bottom"><div className="tags">{p.tags.map(t=><span className="tag" key={t}>{t}</span>)}</div>
      <div className="project-actions">{'url' in p && <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={'Ver site de '+p.title}><FiGlobe/></a>}<a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={'Ver repositório de '+p.title}><FiGithub/></a></div>
    </div>
  </article>)}</div>;
}
export function Projects(){return <section className="section"><div className="section-head"><h2 className="section-title">Projetos</h2><Link className="muted" style={{fontSize:12}} href="/projects">Ver todos ↗</Link></div><ProjectGrid/></section>}
export function TechStack(){const [filter,setFilter]=useState('Todos');return <section className="section"><div className="section-head"><div className="stack-head"><h2 className="section-title">Tecnologias</h2><span className="stack-hint"><span className="hint-hover">( passe o cursor para ouvir )</span><span className="hint-click">( toque para ouvir )</span></span></div><div className="filters">{['Todos','Frontend','Ferramentas'].map(f=><button key={f} className={filter===f?'selected':''} onClick={()=>{setFilter(f);playNote()}}>{f}</button>)}</div></div><div className="tech-list">{site.stack.filter(s=>filter==='Todos'||s[1].includes(filter==='Ferramentas'?'tools':filter.toLowerCase())).map(([name,,href,hz])=>{const Icon=stackIcons[name];return <a key={name} href={href} target="_blank" rel="noreferrer" className="tech-chip" style={{'--brand':stackColors[name]||'currentColor'} as React.CSSProperties} onMouseEnter={()=>{if(matchMedia('(hover: hover)').matches)playNote(hz,.08)}} onClick={e=>{if(matchMedia('(hover: none)').matches){e.preventDefault();playNote(hz,.08)}}}><Icon/>{name}</a>})}</div></section>}
type Activity = { total: number; days: { date: string; level: number }[] };
export function GithubActivity(){
  const [activity,setActivity]=useState<Activity|null>(null);
  const [error,setError]=useState(false);
  const scrollRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    fetch('/api/github-activity').then(response=>{if(!response.ok)throw new Error('GitHub unavailable');return response.json()})
      .then((data:Activity)=>setActivity(data)).catch(()=>setError(true));
  },[]);
  useEffect(()=>{if(!activity)return;const align=()=>{if(scrollRef.current&&innerWidth<641)scrollRef.current.scrollLeft=scrollRef.current.scrollWidth};align();addEventListener('resize',align);return()=>removeEventListener('resize',align)},[activity]);
  const empty=activity?.days[0] ? new Date(`${activity.days[0].date}T00:00:00`).getDay() : 0;
  return <section className="section"><div className="section-head"><h2 className="section-title">Atividade no GitHub</h2><a className="muted" href={`https://github.com/${site.githubUser}`} target="_blank" rel="noopener noreferrer" style={{fontSize:12}}>Ver perfil ↗</a></div>
    {activity?<><div className="calendar-wrap" ref={scrollRef}><div className="github-calendar" aria-label={`Contribuições no GitHub: ${activity.total} no último ano`}>
      {Array.from({length:empty},(_,i)=><span className="github-day github-pad" key={`pad-${i}`}/>)}
      {activity.days.map(day=><span className={`github-day github-level-${day.level}`} key={day.date} title={`${day.date} · nível ${day.level}`} aria-hidden="true"/>)}
    </div></div><p className="github-total">{activity.total} contribuições no último ano · dados do GitHub</p></>
      :<p className="github-total">{error?'Atividade temporariamente indisponível. Acesse o perfil para conferir.':'Carregando atividade…'}</p>}
  </section>;
}
type Highlight = {name:string;handle:string;text:string;avatar:string;url:string;pinned?:boolean};
export function Highlights(){const ref=useRef<HTMLDivElement>(null);const paused=useRef(false);const drag=useRef({active:false,start:0,origin:0,moved:false});useEffect(()=>{const el=ref.current;if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches)return;let frame=0;let visible=true;const observer=new IntersectionObserver(v=>visible=v[0]?.isIntersecting??false,{threshold:.01});observer.observe(el);el.scrollLeft=el.scrollWidth/3;const tick=()=>{if(visible&&!paused.current){el.scrollLeft+=.6;const d=el.scrollWidth/3;if(el.scrollLeft>2*d)el.scrollLeft-=d}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>{observer.disconnect();cancelAnimationFrame(frame)}},[]);return <section className="section"><div className="section-head"><h2 className="section-title">Destaques</h2></div><div className="highlights-wrap"><div className="highlight-track" ref={ref} onMouseEnter={()=>paused.current=true} onMouseLeave={()=>paused.current=false} onTouchStart={()=>paused.current=true} onTouchEnd={()=>paused.current=false} onWheel={()=>{paused.current=true;setTimeout(()=>paused.current=false,500)}} onMouseDown={e=>{drag.current={active:true,start:e.pageX,origin:e.currentTarget.scrollLeft,moved:false};paused.current=true}} onMouseMove={e=>{if(!drag.current.active)return;const delta=(e.pageX-drag.current.start)*1.5;if(Math.abs(delta)>5)drag.current.moved=true;e.currentTarget.scrollLeft=drag.current.origin-delta}} onMouseUp={()=>{drag.current.active=false;setTimeout(()=>paused.current=false,100)}}>{[...(site.highlights as Highlight[]),...(site.highlights as Highlight[]),...(site.highlights as Highlight[])].map((h,i)=><a className="highlight-card" key={i} href={h.url} target="_blank" rel="noreferrer" onClick={e=>{if(drag.current.moved){e.preventDefault();drag.current.moved=false}}}><div className="highlight-head"><Image src={h.avatar} alt="" width={32} height={32}/><div><div className="highlight-name">{h.name} <MdVerified style={{display:'inline',color:'var(--verified)'}}/></div><div className="highlight-handle">{h.handle}</div></div><span style={{marginLeft:'auto',color:'var(--muted)'}}>{h.pinned?"⌁ ":""}X</span></div><div className="highlight-text">“{h.text}”</div></a>)}</div></div></section>}
export function Close(){return <section className="section"><div className="section-head"><h2 className="section-title">Chegou até aqui?</h2></div><div className="close-body"><div>Se você chegou até aqui, podemos conversar sobre tecnologia e projetos.</div><Link className="pill" href="/contact">Vamos conversar <FiArrowRight/></Link></div></section>}
