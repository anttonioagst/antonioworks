'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MediaPencil, replaceMedia } from './media-pencil';

const glyphs = 'antonio01/<>·:';
const hash = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export function SceneBanner({ editable = false }: { editable?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !container || !context) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--font-geist-mono') || 'monospace';
    let width = 0;
    let height = 0;
    let density = 1;
    let frame = 0;
    let visible = true;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastTime = 0;

    const resize = () => {
      width = Math.max(80, container.clientWidth);
      height = Math.max(32, container.clientHeight);
      density = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      context.setTransform(density, 0, 0, density, 0, 0);
    };

    const paint = (time: number) => {
      if (!visible) return;
      const still = reducedMotion.matches;
      // Frame-rate independent easing, so the cloud glides the same at 60 Hz and 120 Hz.
      const dt = lastTime ? Math.min(64, time - lastTime) : 16;
      lastTime = time;
      const ease = 1 - Math.exp(-dt / 260);
      pointerX += (targetX - pointerX) * ease;
      pointerY += (targetY - pointerY) * ease;
      const t = still ? 0 : time * 0.00035;
      const pulse = still ? 0 : time * 0.0012;
      context.fillStyle = '#05090d';
      context.fillRect(0, 0, width, height);
      const cell = width < 500 ? 6 : 8;
      context.font = `${cell}px ${fontFamily}, monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      for (let y = 0; y < height / cell; y++) {
        for (let x = 0; x < width / cell; x++) {
          const seed = hash(x, y);
          const px = x * cell + cell / 2;
          const py = y * cell + cell / 2;
          const nx = (px / width - 0.5) * 2;
          const ny = (py / height - 0.5) * 2;
          const angle = Math.atan2(ny, nx);
          const drift = Math.sin(angle * 5 + t * 2) * 0.09 + Math.sin(nx * 7 - t * 1.7) * 0.06;
          const radius = Math.hypot((nx - pointerX * 0.24) / 0.62, (ny - pointerY * 0.18) / 0.8);
          const shell = Math.exp(-((radius - 1.06 - drift) ** 2) / 0.16);
          const upper = Math.max(0, Math.sin(nx * 5 + t + ny * 3)) * 0.17;
          const cloud = Math.max(0, shell * (0.86 + upper) + seed * 0.15 - 0.07);
          if (cloud < 0.12) continue;
          // Each cell breathes on its own phase instead of every glyph flipping on the same tick.
          const flicker = 0.5 + 0.5 * Math.sin(pulse * (0.6 + seed) + seed * 40);
          const presence = Math.min(1, Math.max(0, (Math.min(0.97, cloud * 1.7) - flicker) * 4));
          if (presence <= 0.02) continue;
          const brightness = Math.min(1, cloud * (0.65 + flicker * 0.5));
          const alpha = Math.max(0.22, brightness * 0.98) * presence;
          context.fillStyle = `rgba(${Math.round(122 + brightness * 75)},${Math.round(163 + brightness * 66)},${Math.round(195 + brightness * 52)},${alpha.toFixed(3)})`;
          const index = Math.floor(hash(x * 3, y * 7) * glyphs.length + pulse * 0.35 * (0.4 + seed)) % glyphs.length;
          context.fillText(glyphs[index], px, py);
        }
      }
      if (!still) frame = requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      const box = container.getBoundingClientRect();
      targetX = (event.clientX - box.left) / box.width - 0.5;
      targetY = (event.clientY - box.top) / box.height - 0.5;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { cancelAnimationFrame(frame); lastTime = 0; frame = requestAnimationFrame(paint); }
      else cancelAnimationFrame(frame);
    });
    const sizeObserver = new ResizeObserver(() => { cancelAnimationFrame(frame); resize(); paint(performance.now()); });
    resize();
    observer.observe(container);
    sizeObserver.observe(container);
    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(paint);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="identity-banner dither-banner media-host" role="img" aria-label={photo ? 'Banner do perfil' : 'Campo de caracteres azulados em movimento'}>
      <canvas ref={canvasRef} aria-hidden="true" hidden={Boolean(photo)} />
      {photo && <Image unoptimized className="identity-banner-photo" src={photo} alt="" width={1440} height={900} />}
      {editable && <MediaPencil label="Trocar banner" onPick={async (file) => setPhoto(await replaceMedia('banner', file))} />}
    </div>
  );
}
