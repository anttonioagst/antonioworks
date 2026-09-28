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
- `/experience`: trajetória profissional, formação e os quatro certificados fornecidos.
- `/contact`: formulário que abre o aplicativo de e-mail do visitante com a mensagem preenchida. O visitante confirma o envio no próprio aplicativo.
- `/design-system`: catálogo interno com fundamentos, componentes reais, animações e regras de manutenção. A rota exige Basic Auth e não aparece na navegação. Credenciais locais em `.env.local`; em produção, configure `DESIGN_SYSTEM_USER` e `DESIGN_SYSTEM_PASSWORD` no host. Sem credenciais configuradas, a rota permanece bloqueada.

Para mexer no projeto, leia [BOAS_PRATICAS.md](BOAS_PRATICAS.md) e consulte o catálogo interno.

As páginas de livros e favoritos estão guardadas em `src/archived/`, e o componente de depoimentos permanece em `src/components/home.tsx`. Nenhum deles aparece no site até receber conteúdo pessoal.

A foto está em `public/antonio-profile.png` e o currículo fornecido em `public/curriculo-antonio.png`. A capa atual usa um efeito dither em Canvas 2D; a integração anterior do Unicorn Studio está guardada em `src/archived/`. As prévias de Wiip Club e Buddies foram capturadas dos heroes de seus sites; a prévia de DevLinks vem do repositório público.

## Integrações

- Defina `NEXT_PUBLIC_SITE_URL` com o endereço definitivo ao publicar, para gerar metadados corretos.
- O formulário usa `mailto:` e depende de um aplicativo de e-mail instalado no dispositivo do visitante. Para envio direto, é preciso configurar um serviço de e-mail.
- `/api/views` inicia em zero e grava as visualizações em `.data/views.json` no servidor. A pasta é ignorada pelo Git. Em hospedagem sem disco persistente ou com múltiplas instâncias, configure armazenamento compartilhado antes de publicar para manter uma contagem global confiável.
- O calendário consulta o endpoint público de contribuições do próprio GitHub a cada hora. Se a resposta falhar, a página mostra um link para o perfil, sem exibir um número estimado.

O site publicado está em https://antonioworks.vercel.app.
