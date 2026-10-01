import { Nav } from './nav';import { Analytics } from './analytics';import { site } from '@/content/site';
export function Frame({children}:{children:React.ReactNode}){return <><Analytics/><Nav/><main className="shell">{children}<footer className="section footer"><div>Desenvolvido por <b>{site.wordmark}</b></div><div>© {site.year} Todos os direitos reservados.</div></footer></main></>}
