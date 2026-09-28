# Boas práticas — portfólio de Antonio

Este guia vale para este repositório. A página interna `/design-system` mostra os tokens, componentes e movimentos em uso. O mega prompt de origem está em `AntOS-Brain/OUTPUTS/antx-site-analyzer/samworks/PROMPT.md`; ele é referência estrutural, não uma lista de conteúdo para publicar. O sistema `Personal/Antonio/DESIGN.md` cobre a marca pessoal em outros produtos e não substitui automaticamente os tokens deste portfólio.

## Antes de editar

1. Leia `AGENTS.md`, este arquivo e a seção correspondente em `/design-system`.
2. Localize o dono da mudança. Dados pessoais, projetos, URLs e certificados: `src/content/site.ts`. Estrutura de rota: `src/app/`. Comportamento compartilhado: `src/components/`. Aparência: `src/app/globals.css`.
3. Confira o estado atual no navegador, em desktop e mobile. Não use uma captura antiga como fonte de verdade.
4. Preserve alterações existentes. Este repositório pode conter trabalho local ainda não commitado.

## Regras visuais

- A coluna pública tem largura máxima de 800 px. A navegação fixa mede 48 px. As linhas tracejadas separam blocos; as faixas de 20 px criam respiro.
- O tema padrão é escuro. Por herança do template, `html.dark` representa o tema claro. Não renomeie essa classe sem atualizar persistência, toggle, CSS e testes.
- Use `--bg`, `--text`, `--secondary`, `--muted`, `--border` e seus pares claros. Acrescente tokens semânticos quando um valor se repetir; não espalhe novos hex por componentes.
- Inter é o corpo; Instrument Serif é a identidade e os títulos; Geist Mono é reservado a metadados técnicos. Evite introduzir outra família sem motivo.
- Uma ação sólida por vista. Links e chips têm hierarquia menor. Borda e espaçamento devem comunicar agrupamento antes de sombras ou gradientes decorativos.
- Capas de projeto: mesma proporção de 1,54:1, fundo gradiente cinza, captura do produto dentro da moldura e posicionada no canto. Confira as três lado a lado na home e em `/projects`. O clique na imagem abre o site real.
- Logos de empresas e escolas entram na moldura `.company-mark`, com área visual igual e cantos arredondados. Use arquivos locais em alta resolução. Não redesenhe marcas nem altere texto dentro delas. Certificados preservam a imagem original para abertura.

## Componentes e conteúdo

- Edite primeiro `site.ts`; não duplique dados em páginas. A home e `/projects` compartilham `ProjectGrid`.
- Um componente novo precisa ter uma responsabilidade clara, estados vazio/carregando/erro quando aplicável, semântica HTML e nome acessível.
- Use `<a>` para navegação e `<button>` para ações. Links externos abrem com `rel="noopener noreferrer"`.
- Não publique conteúdo do fixture Samworks. Experiências, cursos, certificados e projetos precisam corresponder ao Antonio e aos documentos fornecidos.
- O contador de vistas em `.data/views.json` é local e não é persistente em hospedagem sem armazenamento compartilhado. Não anuncie esse valor como global em produção sem resolver o armazenamento.
- Atividade do GitHub vem de uma consulta real; não escreva contagens fixas. Em falha, mostre indisponibilidade e o link do perfil.

## Movimento

Para cada novo movimento, registre na página interna: gatilho, propósito, elemento, propriedades, duração, ferramenta, interrupção e saída.

- CSS para hover, foco e cor. Motion para presença e deslocamento de layout. WAAPI/View Transitions para o tema. Canvas 2D somente para o banner. Web Audio somente após gesto.
- Não anime o scroll inteiro por decoração. Evite `transition: all`, loops sem pausa e efeitos que escondam informação.
- Respeite `prefers-reduced-motion`: o estado final deve aparecer imediatamente, o cargo não rotaciona, o banner fica estático e o som não toca.
- Animações contínuas pausam fora da viewport. Hover não pode ser o único caminho para conteúdo ou ação.
- Duração base do site: menu 120 ms; cor/press 200 ms; imagem 350 ms; cargo e tema 400 ms; CTA sheen 700 ms. Só altere quando houver razão visual específica.

## Acessibilidade e responsividade

- Um `h1` por rota; ordem lógica de headings; `lang="pt-BR"`; texto alternativo pelo propósito da imagem.
- Foco visível, navegação por teclado, rótulos de formulário, erros em texto e alvos confortáveis para toque.
- Teste 320/390/768/1440 px, zoom de 200%, ambos os temas e redução de movimento. Conteúdo não deve ficar cortado nem criar rolagem horizontal do documento.
- Verifique contraste nos dois temas. O texto `--muted` serve a metadados, não a instruções essenciais.

## Proteção do catálogo

`/design-system` usa Basic Auth no `src/proxy.ts`, sem link na navegação pública e com `noindex`. As variáveis `DESIGN_SYSTEM_USER` e `DESIGN_SYSTEM_PASSWORD` são obrigatórias. Sem elas a página permanece bloqueada. O arquivo local `.env.local` está ignorado pelo Git; configure as mesmas variáveis no ambiente de hospedagem antes de liberar o acesso. Use HTTPS fora do ambiente local. Não coloque credenciais em código, README ou commits.

## Checklist de entrega

1. `pnpm lint`
2. `pnpm build`
3. Navegar pelas rotas alteradas. Conferir imagens, links, console, teclado, tema claro/escuro e mobile.
4. Confirmar `/design-system` sem credenciais → 401; com credenciais → 200; verificar `X-Robots-Tag`.
5. Atualizar `/design-system` e este guia se tokens, componentes, animações ou regras mudarem.
6. Explicar o que mudou, como foi verificado e qualquer limitação concreta.
