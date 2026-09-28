'use client';

import { useEffect, useRef, useState } from 'react';
import { MediaPencil, replaceMedia } from './media-pencil';

const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function SceneBanner({ editable = false }: { editable?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !container || !context) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let pointer = 0;
    let targetPointer = 0;
    let lastPaint = 0;

    const resize = () => {
      width = Math.max(80, Math.round(container.clientWidth / 4));
      height = Math.max(32, Math.round(container.clientHeight / 4));
      canvas.width = width;
      canvas.height = height;
    };

    const paint = (time: number) => {
      if (!visible) return;
      if (time - lastPaint < 32 && !reducedMotion.matches) {
        frame = requestAnimationFrame(paint);
        return;
      }
      lastPaint = time;
      pointer += (targetPointer - pointer) * 0.04;
      const t = reducedMotion.matches ? 0 : time * 0.00042;
      const pixels = context.createImageData(width, height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const nx = (x / width - 0.5) * 2;
          const ny = (y / height - 0.51) * 2;
          const angle = Math.atan2(ny, nx);
          const wave = Math.sin(angle * 7 + t * 2.1) * 0.045 + Math.sin(angle * 13 - t * 1.3) * 0.018;
          const radius = Math.hypot(nx / (0.59 + pointer * 0.02), ny / 0.55);
          const distance = Math.abs(radius - 1 - wave);
          const glow = Math.exp(-distance * distance / 0.017) * (0.72 + 0.28 * Math.sin(angle * 4 - t * 2));
          const halo = Math.exp(-distance * distance / 0.09) * 0.14;
          const grain = ((x * 73 + y * 151) % 17) / 17;
          const value = Math.max(0, glow + halo + grain * 0.045);
          const threshold = (bayer[(x & 3) + ((y & 3) << 2)] + 0.5) / 16;
          const dot = value > threshold ? Math.min(1, value * 1.18) : value * 0.1;
          const blue = 0.5 + 0.5 * Math.sin(angle * 2.2 + t);
          const offset = (y * width + x) * 4;
          pixels.data[offset] = 7 + dot * (96 + blue * 43);
          pixels.data[offset + 1] = 8 + dot * (82 + blue * 44);
          pixels.data[offset + 2] = 17 + dot * (140 + blue * 55);
          pixels.data[offset + 3] = 255;
        }
      }
      context.putImageData(pixels, 0, 0);
      if (!reducedMotion.matches) frame = requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      targetPointer = (event.clientX - container.getBoundingClientRect().left) / container.clientWidth - 0.5;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) frame = requestAnimationFrame(paint);
      else cancelAnimationFrame(frame);
    });
    const sizeObserver = new ResizeObserver(() => { resize(); paint(performance.now()); });
    resize();
    observer.observe(container);
    sizeObserver.observe(container);
    container.addEventListener('pointermove', onMove);
    frame = requestAnimationFrame(paint);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      container.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className="identity-banner dither-banner media-host" role="img" aria-label={photo ? 'Banner do perfil' : 'Anel luminoso animado com efeito dither'}>
      <canvas ref={canvasRef} aria-hidden="true" hidden={Boolean(photo)} />
      {photo && <img className="identity-banner-photo" src={photo} alt="" />}
      {editable && <MediaPencil label="Trocar banner" onPick={async (file) => setPhoto(await replaceMedia('banner', file))} />}
    </div>
  );
}
