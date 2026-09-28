'use client';

import { useRef } from 'react';
import { FiEdit2 } from 'react-icons/fi';

export function MediaPencil({ label, onPick }: { label: string; onPick: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button type="button" className="media-pencil" aria-label={label} onClick={() => inputRef.current?.click()}>
        <FiEdit2 />
      </button>
      <input
        ref={inputRef}
        className="media-file"
        type="file"
        accept="image/*"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) onPick(file);
        }}
      />
    </>
  );
}

export async function replaceMedia(kind: 'portrait' | 'banner', file: File) {
  const preview = URL.createObjectURL(file);
  const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!local) return preview;

  const body = new FormData();
  body.set('kind', kind);
  body.set('file', file);
  const response = await fetch('/api/profile-media', { method: 'POST', body });
  if (!response.ok) return preview;

  const data = await response.json() as { src: string };
  URL.revokeObjectURL(preview);
  return `${data.src}?t=${Date.now()}`;
}
