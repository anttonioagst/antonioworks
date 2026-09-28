import type { Metadata } from 'next';
import Image from 'next/image';
import { Frame } from '@/components/frame';
import { SceneBanner } from '@/components/scene-banner';
import { ProjectGrid, TechStack } from '@/components/home';
import { site } from '@/content/site';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Design system interno — Antonio Augusto',
  robots: { index: false, follow: false, noarchive: true },
};

const navigation = [
  ['fundamentos', 'Fundamentos'],
  ['tipografia', 'Tipografia'],
  ['estrutura', 'Estrutura'],
  ['componentes', 'Componentes'],
  ['movimento', 'Movimento'],
  ['assets', 'Imagens e conteúdo'],
  ['acessibilidade', 'Acessibilidade'],
  ['manutencao', 'Manutenção'],
] as const;

const tokens = [
  ['Canvas', '--bg', '#0f0e0e', 'Fundo da noite'],
  ['Canvas claro', '--bg-day', '#ffffff', 'Fundo do dia'],
  ['Texto', '--text / --text-day', '#ffffff / #000000', 'Títulos e ações'],
  ['Secundário', '--secondary', '#a3a3a3', 'Descrição e apoio'],
  ['Discreto', '--muted', '#737373', 'Metadados e legendas'],
  ['Linha', '--border / --border-day', '#272727 / #e5e5e5', 'Costuras, cards e controles'],
  ['Faixa', '--band', 'rgba(255,255,255,.02)', 'Respiro entre seções'],
  ['Seleção', '--selection', '#404040', 'Seleção de texto'],
] as const;

const components = [
  ['Frame + Nav', 'src/components/frame.tsx · nav.tsx', 'Moldura de 800 px, navegação fixa e rodapé. Todas as rotas públicas.'],
  ['Identity + SceneBanner', 'src/components/home.tsx · scene-banner.tsx', 'Abertura, foto, cargo e contador. Só na home.'],
  ['About + ContactRow', 'src/components/home.tsx', 'Apresentação e destinos externos. Só na home.'],
  ['ProjectGrid', 'src/components/home.tsx', 'Capas, copy, tags e links. Home e /projects compartilham os mesmos dados.'],
  ['TechStack', 'src/components/home.tsx', 'Filtros e ícones com som em gesto. Só na home.'],
  ['GithubActivity', 'src/components/home.tsx', 'Calendário consultado do GitHub. Só na home.'],
  ['Close', 'src/components/home.tsx', 'Convite para contato. Só na home.'],
  ['Experience', 'src/components/home.tsx', 'Trajetória resumida na home, com link para a página completa.'],
  ['Career + Certificate', 'src/app/experience/page.tsx', 'Trajetória, ensino e certificados. Página /experience.'],
  ['Contact form', 'src/app/contact/page.tsx', 'Compõe um e-mail no aplicativo do visitante. Só em /contact.'],
] as const;

const motion = [
  ['Banner dither', 'Home visível', 'Canvas 2D em ~30 fps; responde discretamente ao ponteiro', 'Pausar fora da viewport; quadro estático com movimento reduzido', 'Ativo'],
  ['Cargo rotativo', 'A cada 3 s', 'Opacity, y 5 px, blur 5 px; letras em sequência de 30 ms', 'Primeiro cargo permanece quando movimento reduzido', 'Ativo'],
  ['Ponto da navegação', 'Hover ou rota ativa', 'Motion layoutId; mola 380/28', 'Ponto atual continua visível', 'Ativo'],
  ['Menu Mais / mobile', 'Abrir e fechar', 'Opacity + y −5 px + scale .95; 120 ms', 'Fecha no clique fora; teclado deve manter foco legível', 'Ativo'],
  ['Troca de tema', 'Clique no botão', 'View Transition circular, 400 ms; som curto', 'Troca imediata quando movimento reduzido ou API indisponível', 'Ativo'],
  ['Contador de vistas', 'Resposta da API', 'Número 0→N com easing quadrático em 1 s', 'Mostra o valor final sem contar', 'Ativo'],
  ['Chips de tecnologia', 'Hover ou toque', 'Cor do ícone em 200 ms e nota curta por Web Audio', 'Som desligado com movimento reduzido', 'Ativo'],
  ['Capas dos projetos', 'Hover/foco', 'Zoom de 1.025 em 350 ms', 'Sem zoom com movimento reduzido', 'Ativo'],
  ['Detalhe da experiência', 'Clique no chevron', 'Altura e opacidade em 350 ms; chevron gira 180° em 200 ms', 'Abre no estado final, sem animação', 'Ativo'],
  ['CTA', 'Hover/press', 'Sheen 700 ms; escala 1.03 / .97', 'Ação, label e foco independem da animação', 'Ativo'],
  ['Destaques em esteira', 'Enquanto visível', 'scrollLeft +0.6 px por frame, pausa na interação', 'Sem auto scroll; sem itens reais publicados no momento', 'Reservado'],
  ['Ribbon / livros / favoritos', 'Hover', 'Sheen, zoom ou overlay', 'Arquivos guardados; não aparecem no site', 'Arquivado'],
] as const;

export default function DesignSystemPage() {
  return <Frame><div className="inner-page ds-page">
    <header className="ds-hero">
      <span className="ds-eyebrow">Documento interno · versão 1</span>
      <h1 className="serif">Design system do portfólio</h1>
      <p>Regras, componentes e movimento da implementação atual. O mega prompt do Samworks é a referência estrutural; os dados e decisões finais são os deste projeto.</p>
      <nav className="ds-index" aria-label="Índice do design system">{navigation.map(([id,label])=><a key={id} href={`#${id}`}>{label}</a>)}</nav>
    </header>

    <section className="ds-section" id="fundamentos">
      <div className="ds-heading"><span>01</span><h2 className="serif">Fundamentos</h2></div>
      <p>Uma coluna de 800 px, fundo quase preto, costuras tracejadas e conteúdo em blocos. A leitura deve parecer um documento pessoal. O tema claro é um conjunto próprio de cores. A classe <code>.dark</code> no HTML ativa o tema claro, por herança do template.</p>
      <div className="ds-token-grid">{tokens.map(([name,token,value,use])=><div className="ds-token" key={name}><span className="ds-swatch" style={{background:value.startsWith('#')?value.split(' / ')[0]:'var(--band)'}}/><div><strong>{name}</strong><code>{token}</code><small>{value}</small><p>{use}</p></div></div>)}</div>
      <div className="ds-rule"><strong>Hierarquia</strong><span>Texto, espaço e linha primeiro. Uma ação sólida por vista; o restante usa link, chip ou ícone. A cor de marca aparece dentro de imagens e ícones, sem dominar a interface.</span></div>
    </section>

    <section className="ds-section" id="tipografia">
      <div className="ds-heading"><span>02</span><h2 className="serif">Tipografia</h2></div>
      <div className="ds-type-grid">
        <div><span className="ds-eyebrow">Display · Instrument Serif 400</span><p className="ds-type-display">Antonio Augusto</p><small>Wordmark 30 px · nome 36 px · seção 30 px</small></div>
        <div><span className="ds-eyebrow">Corpo · Inter</span><p className="ds-type-body">Projetos de engenharia, interfaces e desenvolvimento de aplicações.</p><small>Corpo 16 px · UI 13 px · descrição 12–14 px</small></div>
        <div><span className="ds-eyebrow">Meta · Geist Mono</span><p className="ds-type-mono">2026 / COMPONENTE / ESTADO</p><small>10–12 px; use para números, labels técnicos e código.</small></div>
      </div>
      <p>Inter forma o corpo; Instrument Serif marca identidade e títulos. Geist e Geist Mono estão carregadas como variáveis, mas a interface pública usa Geist Mono pontualmente. Não misture a tipografia do design system separado da marca pessoal nesta página.</p>
    </section>

    <section className="ds-section" id="estrutura">
      <div className="ds-heading"><span>03</span><h2 className="serif">Estrutura</h2></div>
      <div className="ds-structure"><div className="ds-structure-bar">Navegação fixa · 48 px</div><div className="ds-structure-block">Abertura e identidade</div><div className="ds-structure-band">faixa · 20 px</div><div className="ds-structure-block">Sobre · contato · GitHub · experiência · projetos · tecnologias · convite</div><div className="ds-structure-bar">Rodapé</div></div>
      <p>Home segue essa ordem. <code>/projects</code> reaproveita a grade; <code>/experience</code> reúne trabalho, formação e quatro certificados; <code>/contact</code> abre o aplicativo de e-mail. Abaixo de 640 px a grade passa a uma coluna e o menu vira compacto. Quebre o layout quando o conteúdo pedir, sem esconder informação essencial.</p>
    </section>

    <section className="ds-section" id="componentes">
      <div className="ds-heading"><span>04</span><h2 className="serif">Componentes</h2></div>
      <div className="ds-component-list">{components.map(([name,file,use])=><div className="ds-component-row" key={name}><strong>{name}</strong><code>{file}</code><span>{use}</span></div>)}</div>
      <h3>Capas de projeto · componente real</h3>
      <p>As três capas devem compartilhar proporção, fundo cinza e captura do produto posicionada no canto. A imagem inteira é um link para o site. Os dados vêm de <code>src/content/site.ts</code>.</p>
      <div className="ds-live"><ProjectGrid/></div>
      <h3>Tecnologias · componente real</h3>
      <p>O filtro muda a seleção. O som é uma resposta curta ao gesto, sem substituir o texto ou a cor.</p>
      <div className="ds-live ds-tech"><TechStack/></div>
    </section>

    <section className="ds-section" id="movimento">
      <div className="ds-heading"><span>05</span><h2 className="serif">Movimento</h2></div>
      <p>Use motion para confirmar estado ou preservar continuidade. Não adicione animação de entrada a cada seção da rolagem. Abaixo está o roteiro do mega prompt confrontado com o código atual.</p>
      <div className="ds-motion-demo"><SceneBanner/><small>Banner em código: dither, viewport e ponteiro. Cena WebGL anterior guardada em <code>src/archived/</code>.</small></div>
      <div className="ds-table-wrap"><table className="ds-table"><caption>Inventário de animações do portfólio</caption><thead><tr><th>Beat</th><th>Quando usar</th><th>Como funciona</th><th>Redução / limite</th><th>Estado</th></tr></thead><tbody>{motion.map(([beat,trigger,behavior,limit,status])=><tr key={beat}><th scope="row">{beat}</th><td>{trigger}</td><td>{behavior}</td><td>{limit}</td><td><span className="ds-status">{status}</span></td></tr>)}</tbody></table></div>
      <div className="ds-rule"><strong>Regra de escolha</strong><span>CSS para hover e transições simples; Motion para presença e layout; View Transitions/WAAPI para o tema; Canvas 2D para o banner; Web Audio para resposta sonora. Respeite <code>prefers-reduced-motion</code> e pause processos fora da viewport.</span></div>
    </section>

    <section className="ds-section" id="assets">
      <div className="ds-heading"><span>06</span><h2 className="serif">Imagens e conteúdo</h2></div>
      <div className="ds-asset-grid"><div><Image src={site.portraits[0]} alt="Retrato usado no perfil" width={220} height={220}/><strong>Retrato</strong><small><code>public/antonio-profile.png</code></small></div><div><Image src={site.projects[0].image} alt="Captura original do DevLinks" width={340} height={220}/><strong>Captura de produto</strong><small><code>public/projects/</code></small></div></div>
      <p>Empresas em <code>public/companies/</code>, cursos em <code>public/education/</code>, certificados em <code>public/certificates/</code>. Logos ficam em molduras iguais. Certificados são documentos: preserve o original acessível ao clique. Evite hotlink. Texto, URLs e listas devem ser editados em <code>src/content/site.ts</code>.</p>
    </section>

    <section className="ds-section" id="acessibilidade">
      <div className="ds-heading"><span>07</span><h2 className="serif">Acessibilidade</h2></div>
      <ul className="ds-checks"><li>Um título principal por rota, headings em ordem e links com destino claro.</li><li>Foco visível, alvos adequados ao toque, contraste de texto conferido nos dois temas.</li><li>Imagem decorativa com alt vazio; imagem informativa com descrição. O banner expõe um nome acessível.</li><li>Estados não dependem apenas de cor, som ou movimento.</li><li>Teste teclado, 320 px, 200% de zoom e <code>prefers-reduced-motion</code>.</li></ul>
    </section>

    <section className="ds-section" id="manutencao">
      <div className="ds-heading"><span>08</span><h2 className="serif">Manutenção</h2></div>
      <ol className="ds-checks"><li>Antes de editar, leia <code>BOAS_PRATICAS.md</code> na raiz e confira este catálogo.</li><li>Atualize a fonte de verdade: conteúdo em <code>site.ts</code>, tokens e aparência em <code>globals.css</code>, comportamento no componente dono.</li><li>Uma alteração visual exige estado normal, hover, foco, tema claro, mobile e movimento reduzido.</li><li>Ao criar componente ou animação, registre aqui o papel, gatilho, propriedades, duração e fallback.</li><li>Rode <code>pnpm lint</code> e <code>pnpm build</code> antes de entregar. Confira no navegador.</li></ol>
      <p className="ds-footnote">Base documental: mega prompt do estudo Samworks na Brain do AntOS. Este catálogo descreve o portfólio de Antonio e não publica fixtures, textos ou projetos de terceiros.</p>
    </section>
  </div></Frame>;
}
