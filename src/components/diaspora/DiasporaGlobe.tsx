import { useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import type { GlobeMethods } from 'react-globe.gl';

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

export default function DiasporaGlobe({ cities }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
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

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;

    const controls = g.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;

    g.pointOfView({ lat: 10, lng: 0, altitude: 2.4 }, 0);

    return () => {
      controls.autoRotate = false;
    };
  }, [points]);

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
          const controls = globeRef.current?.controls();
          if (controls) controls.autoRotate = false;
          globeRef.current?.pointOfView({ lat: d.lat, lng: d.lng, altitude: 2.0 }, 1100);
          const opener = (window as any).__openCityDrawer as ((slug: string) => void) | undefined;
          if (opener) opener(d.slug);
        }}
      />
    </div>
  );
}
