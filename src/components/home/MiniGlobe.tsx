import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';

// Local minimal types — avoid importing react-globe.gl types at module top
// level, since they pull in three-conic-polygon-geometry which touches `window`
// at module load and crashes SSR (Phase 2 lesson — see [[diaspora-phase-2-shipped]]).
type GlobeComponent = ComponentType<any>;

export default function MiniGlobe() {
  const [GlobeModule, setGlobeModule] = useState<GlobeComponent | null>(null);
  const globeRef = useRef<any>(null);

  // Dynamic-import on the client only — the ~524KB Three.js bundle is fetched
  // ONLY when this component actually hydrates (which only happens when the
  // Diaspora teaser scrolls into view via `client:visible`).
  useEffect(() => {
    let cancelled = false;
    import('react-globe.gl').then((mod) => {
      if (!cancelled) setGlobeModule(() => mod.default as GlobeComponent);
    });
    return () => { cancelled = true; };
  }, []);

  // Configure controls once the library is loaded
  useEffect(() => {
    if (!GlobeModule) return;
    const id = requestAnimationFrame(() => {
      const g = globeRef.current;
      if (!g || typeof g.controls !== 'function') return;
      const c = g.controls();
      c.autoRotate = true;
      c.autoRotateSpeed = 0.6;
      c.enableZoom = false;
      c.enablePan = false;
      if (typeof g.pointOfView === 'function') {
        g.pointOfView({ lat: 10, lng: 0, altitude: 2.4 }, 0);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [GlobeModule]);

  // Until library loads (or never, on mobile/reduced-motion where the slot
  // never becomes visible), render a fixed-size placeholder so layout doesn't shift.
  if (!GlobeModule) {
    return (
      <div
        className="mini-globe mini-globe--loading"
        style={{ width: 200, height: 200 }}
        aria-hidden="true"
      />
    );
  }

  const Globe = GlobeModule;
  return (
    <div className="mini-globe" style={{ width: 200, height: 200 }} aria-hidden="true">
      <Globe
        ref={globeRef}
        width={200}
        height={200}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={undefined}
        showAtmosphere={true}
        atmosphereColor="#6B2BD9"
        atmosphereAltitude={0.18}
        showGraticules={true}
      />
    </div>
  );
}
