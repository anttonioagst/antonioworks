import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, Instrument_Serif } from 'next/font/google';
import { site } from '@/content/site';
import { VercelAnalytics } from '@/components/vercel-analytics';
import './globals.css';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-instrument' });
const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.domain), title: { default: 'Antonio Augusto - Portfolio', template: '%s — Antonio Augusto' }, description: site.description, openGraph: { title: 'Antonio Augusto - Portfolio', description: site.description, images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Antonio Augusto' }] }, twitter: { card: 'summary_large_image', images: ['/opengraph-image'] }, icons: { icon: site.portraits[0] } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR" className={`${inter.variable} ${instrument.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning><head><script id="theme-persistence" dangerouslySetInnerHTML={{__html:'try{var t=localStorage.getItem("theme");if(t==="dark")document.documentElement.classList.add("dark");else if(t==="light")document.documentElement.classList.remove("dark")}catch(e){}'}} /></head><body>{children}<VercelAnalytics /></body></html>; }
