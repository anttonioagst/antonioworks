import { Nav } from './nav';import { site } from '@/content/site';
export function Frame({children}:{children:React.ReactNode}){return <><Nav/><main className="shell">{children}<footer className="section footer"><div>Portfólio de <b>{site.wordmark}</b></div><div>© {site.year} Todos os direitos reservados.</div></footer></main></>}
