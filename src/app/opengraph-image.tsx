import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Antonio Augusto';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const font = await readFile(join(process.cwd(), 'public/fonts/InstrumentSerif-Regular.ttf'));

  return new ImageResponse(
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#0e0e0e', color: '#f7f7f5', fontFamily: 'Instrument Serif', fontSize: 112, fontWeight: 400, letterSpacing: '-0.025em' }}>
      Antonio Augusto
    </div>,
    { ...size, fonts: [{ name: 'Instrument Serif', data: font, weight: 400, style: 'normal' }] },
  );
}
