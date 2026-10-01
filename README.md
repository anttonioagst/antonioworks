# Portfólio de Antonio Augusto

Portfólio em português adaptado da referência visual [Samworks](https://samworks.vercel.app/). O conteúdo pessoal está em `src/content/site.ts`.

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`. Para conferir a versão de produção, use `pnpm lint && pnpm build && pnpm start`.

## Conteúdo

- `/`: perfil, contato, projetos, tecnologias e atividade no GitHub.
- `/projects`: os três repositórios públicos de Antonio.
- `/projects/painel-de-qualidade`: case do Painel de Qualidade feito na Estel. O conteúdo fica em `site.qualityPanel`, em `src/content/site.ts`.
- `/experience`: trajetória profissional, formação e os quatro certificados fornecidos.
- `/contact`: formulário que envia nome, e-mail e mensagem diretamente para o banco Redis.
- `/admin/mensagens`: caixa de entrada privada com os últimos 100 envios, protegida pelas mesmas credenciais do design system.
- `/admin`: painel privado com visitantes únicos, visitas, páginas vistas, origens, cliques e leituras do QR do currículo. Usa as mesmas credenciais do design system.
- `/admin/design-system`: catálogo interno com fundamentos, componentes reais, animações e regras de manutenção. A rota exige Basic Auth e aparece apenas na navegação da área administrativa. Credenciais locais em `.env.local`; em produção, configure `DESIGN_SYSTEM_USER` e `DESIGN_SYSTEM_PASSWORD` no host. Sem credenciais configuradas, a rota permanece bloqueada.

Para mexer no projeto, leia [BOAS_PRATICAS.md](BOAS_PRATICAS.md) e consulte o catálogo interno.

As páginas de livros e favoritos estão guardadas em `src/archived/`, e o componente de depoimentos permanece em `src/components/home.tsx`. Nenhum deles aparece no site até receber conteúdo pessoal.

A foto original está em `public/antonio-profile.png`, a versão aprimorada em `public/antonio-profile-upscaled.png` e o currículo em `public/curriculo-antonio.pdf` (a versão anterior em PNG continua em `public/curriculo-antonio.png`). A capa atual usa um campo de caracteres em Canvas 2D, inspirado na cena Unicorn enviada por Antonio e sem marca d'água; a integração anterior está guardada em `src/archived/`. As prévias de Wiip Club e Buddies foram capturadas dos heroes de seus sites; a prévia de DevLinks vem do repositório público.

## Integrações

- Defina `NEXT_PUBLIC_SITE_URL` com o endereço definitivo ao publicar, para gerar metadados corretos.
- `/api/contact` valida os dados e salva os envios no Redis conectado à Vercel. O formulário mostra confirmação somente depois da gravação. A caixa de entrada privada usa `DESIGN_SYSTEM_USER` e `DESIGN_SYSTEM_PASSWORD`; não há notificação por e-mail. O endpoint limita um envio por minuto por origem e usa um campo invisível contra spam.
- `/api/views` conta navegadores únicos em um conjunto Redis persistente. A integração Vercel Upstash fornece `KV_REST_API_URL` e `KV_REST_API_TOKEN`; também são aceitas `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`. Cada navegador recebe um cookie de um ano; recarregar a página não aumenta o total. Sem o banco, a interface mostra `—` em vez de um número incorreto. Limpar cookies ou usar outro navegador conta como novo visitante.
- O mesmo endpoint registra páginas vistas, visitantes únicos por dia, sessões de 30 minutos e origem inicial da sessão (referenciador ou `utm_source`). `/api/analytics/click` agrega cliques em links e botões por página, seção e ação. O painel não armazena IP, URL completa de referência ou dados do formulário. As métricas detalhadas começam na ativação do painel; o total de visitantes inclui o contador anterior.
- O QR novo para o currículo está em `public/qr-curriculo.svg` (também em PNG). Ele abre `/cv`, que registra aberturas e navegadores únicos sem guardar identidade pessoal, depois redireciona à home com `utm_source=curriculo_qr`. O QR antigo, se apontar diretamente para a home, não permite distinguir visitas passadas ou futuras até ser substituído.
- O calendário consulta o endpoint público de contribuições do próprio GitHub a cada hora. Se a consulta falhar, usa o último calendário válido salvo no Redis por até sete dias; o navegador também tenta novamente. Sem dados válidos, mostra o link do perfil.

O site publicado está em https://antonioworks.vercel.app.
