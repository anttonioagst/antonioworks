'use client';

import UnicornScene from 'unicornstudio-react/next';

const sdkUrl = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.3.0/dist/unicornStudio.umd.js';

export function SceneBanner() {
  return <div className="identity-banner scene-banner" aria-label="Cena interativa de abertura">
    <UnicornScene
      projectId="NPMO92ym8u1OuuZMahVp"
      sdkUrl={sdkUrl}
      width="100%"
      height="100%"
      scale={1}
      dpi={1.5}
      variables={{ Banner: 0 }}
      fps={30}
      lazyLoad
      ariaLabel="Cena interativa de abertura"
    />
  </div>;
}
