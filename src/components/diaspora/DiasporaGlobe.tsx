import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';

interface City {
  slug: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  activity: number;
  queensCount: number;
  contestantsCount: number;
}

interface Props {
  cities: City[];
}

interface PointDatum {
  lat: number;
  lng: number;
  slug: string;
  name: string;
  size: number;
  color: string;
}

// Minimal shape of what we use from react-globe.gl's runtime export.
// We avoid importing the type module at top level (it pulls in three-conic-polygon-geometry
// which touches `window` on import — SSR-unsafe). All usages are loosely typed via `any`.
type GlobeComponent = ComponentType<any>;

export default function DiasporaGlobe({ cities }: Props) {
  const [GlobeModule, setGlobeModule] = useState<GlobeComponent | null>(null);
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const points = useMemo<PointDatum[]>(() => {
    const maxActivity = Math.max(1, ...cities.map((c) => c.activity));
    return cities.map((c) => ({
      lat: c.lat,
      lng: c.lng,
      slug: c.slug,
      name: c.name,
      size: 0.35 + (c.activity / maxActivity) * 0.6,
      color: '#FFD166',
    }));
  }, [cities]);

  // Dynamic-import react-globe.gl on the client only.
  // This keeps the ~524 KB three.js bundle out of:
  //   1. the SSR render pipeline (which crashes on `window`), and
  //   2. the initial JS bundle for users whose slot is hidden by the
  //      orchestrator's gate script (mobile + reduced-motion).
  // The import is fetched ONLY when this component actually hydrates,
  // which is triggered by `client:visible` from DiasporaPage.astro —
  // and `client:visible` itself only fires once the slot is in view.
  useEffect(() => {
    let cancelled = false;
    import('react-globe.gl').then((mod) => {
      if (!cancelled) setGlobeModule(() => mod.default as GlobeComponent);
    });
    return () => { cancelled = true; };
  }, []);

  // Configure the globe controls once the library is loaded.
  useEffect(() => {
    if (!GlobeModule) return;
    // Defer to the next frame to make sure the Globe component has mounted its DOM.
    const id = requestAnimationFrame(() => {
      const g = globeRef.current;
      if (!g || typeof g.controls !== 'function') return;
      const controls = g.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = false;
      if (typeof g.pointOfView === 'function') {
        g.pointOfView({ lat: 10, lng: 0, altitude: 2.4 }, 0);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [GlobeModule, points]);

  // Until the dynamic import resolves, render a fixed-height placeholder so
  // there is NO layout shift when the globe appears.
  if (!GlobeModule) {
    return (
      <div
        ref={containerRef}
        className="diaspora-globe diaspora-globe--loading"
        style={{ width: '100%', height: '560px' }}
        aria-hidden="true"
      />
    );
  }

  const Globe = GlobeModule;

  return (
    <div ref={containerRef} className="diaspora-globe" style={{ width: '100%', height: '560px' }}>
      <Globe
        ref={globeRef}
        height={560}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={undefined}
        showAtmosphere={true}
        atmosphereColor="#6B2BD9"
        atmosphereAltitude={0.18}
        showGraticules={true}
        pointsData={points}
        pointAltitude={0.012}
        pointRadius={(d: any) => d.size}
        pointColor={(d: any) => d.color}
        pointLabel={(d: any) => `<div style="background:rgba(5,1,17,0.92);border:1px solid rgba(255,209,102,0.4);padding:6px 12px;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#FFD166;letter-spacing:0.2em;text-transform:uppercase">${d.name}</div>`}
        onPointClick={(d: any) => {
          const controls = globeRef.current?.controls?.();
          if (controls) controls.autoRotate = false;
          globeRef.current?.pointOfView?.({ lat: d.lat, lng: d.lng, altitude: 2.0 }, 1100);
          const opener = (window as any).__openCityDrawer as ((slug: string) => void) | undefined;
          if (opener) opener(d.slug);
        }}
      />
    </div>
  );
}
