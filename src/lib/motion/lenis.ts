import Lenis from 'lenis';
import { prefersReducedMotion } from './reduced-motion';

let lenis: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (prefersReducedMotion()) return null;
  if (lenis) return lenis;
  lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return lenis;
}

export function getLenis() {
  return lenis;
}
