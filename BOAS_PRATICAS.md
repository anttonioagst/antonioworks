# Boas práticas — portfólio de Antonio

Este guia vale para este repositório. A página interna `/admin/design-system` mostra os tokens, componentes e movimentos em uso. O mega prompt de origem está em `AntOS-Brain/OUTPUTS/antx-site-analyzer/samworks/PROMPT.md`; ele é referência estrutural, não uma lista de conteúdo para publicar. O sistema `Personal/Antonio/DESIGN.md` cobre a marca pessoal em outros produtos e não substitui automaticamente os tokens deste portfólio.

## Antes de editar

1. Leia `AGENTS.md`, este arquivo e a seção correspondente em `/admin/design-system`.
2. Localize o dono da mudança. Dados pessoais, projetos, URLs e certificados: `src/content/site.ts`. Estrutura de rota: `src/app/`. Comportamento compartilhado: `src/components/`. Aparência: `src/app/globals.css`.
3. Confira o estado atual no navegador, em desktop e mobile. Não use uma captura antiga como fonte de verdade.
4. Preserve alterações existentes. Este repositório pode conter trabalho local ainda não commitado.

## Regras visuais

- A coluna pública tem largura máxima de 800 px. A navegação fixa mede 48 px e sua faixa inteira tem fundo opaco nos dois temas. As linhas horizontais do cabeçalho e dos títulos de seção, junto das faixas de 20 px, atravessam a largura da janela; o conteúdo permanece na coluna central.
- Toda página interna segue a mesma regra: `.band` usa 20 px e `--band`, com uma linha pontilhada de 1 px em cada extremidade; cabeçalho e limites das seções usam linhas de 100vw. Quando uma faixa encostar numa seção, a linha é compartilhada. Remova a borda duplicada para não engrossar os pontilhados.
- A faixa de contato tem cinco células iguais. Cada célula é um link com estado de hover e contém um ícone em moldura própria; preserve esse padrão ao trocar os destinos.
- O tema padrão é escuro. Por herança do template, `html.dark` representa o tema claro. Não renomeie essa classe sem atualizar persistência, toggle, CSS e testes.
- Use `--bg`, `--text`, `--secondary`, `--muted`, `--border` e seus pares claros. Acrescente tokens semânticos quando um valor se repetir; não espalhe novos hex por componentes.
- Inter é o corpo; Instrument Serif é a identidade e os títulos; Geist Mono é reservado a metadados técnicos. Evite introduzir outra família sem motivo.
- Uma ação sólida por vista. Links e chips têm hierarquia menor. Borda e espaçamento devem comunicar agrupamento antes de sombras ou gradientes decorativos.
- Capas de projeto: mesma proporção de 1,54:1, fundo gradiente cinza, captura do produto dentro da moldura e posicionada no canto. Confira as três lado a lado na home e em `/projects`. O clique no card abre detalhes em um modal; os links para site e repositório continuam independentes.
- Mantenha descrição, stack e IA de cada projeto em `src/content/site.ts`. O modal deve abrir pelo teclado, fechar com Escape e preservar os links externos.
- Logos de empresas e escolas entram na moldura `.company-mark`, com área visual igual e cantos arredondados. Preserve as cores originais das marcas; não aplique filtros monocromáticos. Use arquivos locais em alta resolução. Não redesenhe marcas nem altere texto dentro delas. Certificados preservam a imagem original para abertura.

## Componentes e conteúdo

- Edite primeiro `site.ts`; não duplique dados em páginas. A home e `/projects` compartilham `ProjectGrid`.
- Um componente novo precisa ter uma responsabilidade clara, estados vazio/carregando/erro quando aplicável, semântica HTML e nome acessível.
- Use `<a>` para navegação e `<button>` para ações. Links externos abrem com `rel="noopener noreferrer"`.
- Não publique conteúdo do fixture Samworks. Experiências, cursos, certificados e projetos precisam corresponder ao Antonio e aos documentos fornecidos.
- O contador de visitantes únicos depende de Redis persistente (`KV_REST_API_URL` e `KV_REST_API_TOKEN` na Vercel). O cookie identifica um navegador por um ano; não representa uma pessoa entre dispositivos. Sem banco configurado, mantenha `—` na interface e não invente um total.
- O painel `/admin` usa os mesmos dados Redis e a mesma autenticação do design system. O QR do currículo aponta para `/cv`; mantenha esse destino estável, registre leituras e navegadores únicos por cookie, e preserve o redirecionamento com `utm_source=curriculo_qr`. Preserve a exclusão das rotas privadas da coleta, registre apenas métricas agregadas e mantenha as validações das rotas de evento. Visitas são sessões de 30 minutos; recarregamentos contam como páginas vistas, mas não criam outro visitante único.
- O formulário em `/contact` salva mensagens diretamente no Redis pela rota `/api/contact`. Preserve a validação no servidor, o limite de envio e a caixa privada em `/admin/mensagens`. Nunca exponha os dados das mensagens numa rota pública ou no código cliente.
- Atividade do GitHub vem de uma consulta real; não escreva contagens fixas. Em falha, use o último resultado válido salvo no Redis (com data de atualização) e tente a consulta novamente; sem dados válidos, mostre indisponibilidade e o link do perfil.

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

`/admin/design-system` usa Basic Auth no `src/proxy.ts`, com acesso pelo menu da área administrativa e com `noindex`. As variáveis `DESIGN_SYSTEM_USER` e `DESIGN_SYSTEM_PASSWORD` são obrigatórias. Sem elas a página permanece bloqueada. O arquivo local `.env.local` está ignorado pelo Git; configure as mesmas variáveis no ambiente de hospedagem antes de liberar o acesso. Use HTTPS fora do ambiente local. Não coloque credenciais em código, README ou commits.

## Checklist de entrega

1. `pnpm lint`
2. `pnpm build`
3. Navegar pelas rotas alteradas. Conferir imagens, links, console, teclado, tema claro/escuro e mobile.
4. Confirmar `/admin/design-system` sem credenciais → 401; com credenciais → 200; verificar `X-Robots-Tag`.
5. Atualizar `/admin/design-system` e este guia se tokens, componentes, animações ou regras mudarem.
6. Explicar o que mudou, como foi verificado e qualquer limitação concreta.
