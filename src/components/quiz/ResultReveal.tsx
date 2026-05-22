import { useEffect, useMemo, useState } from 'react';
import { ALL_REGIONS, regionToSlug, type Region, type Weights } from '~/lib/quiz/types';

interface Props {
  weights: Weights;
  winner: Region;
  /** Optional callback fired when the reveal completes; default is to navigate. */
  onComplete?: (winnerSlug: string) => void;
  /** Ms before navigation (default 1400 — 800 for animation + 600 pause). */
  delayMs?: number;
}

const REGION_LABELS: Record<Region, string> = {
  'Greater Accra': 'GR. ACCRA',
  Ashanti: 'ASHANTI',
  Volta: 'VOLTA',
  Northern: 'NORTHERN',
  Western: 'WESTERN',
  Central: 'CENTRAL',
  Eastern: 'EASTERN',
};

export default function ResultReveal({ weights, winner, onComplete, delayMs = 1400 }: Props) {
  const [animated, setAnimated] = useState(false);

  const ranked = useMemo(() => {
    return [...ALL_REGIONS]
      .map((r) => ({ region: r, weight: weights[r] }))
      .sort((a, b) => b.weight - a.weight);
  }, [weights]);

  const maxWeight = Math.max(1, ...ranked.map((r) => r.weight));

  useEffect(() => {
    const t1 = requestAnimationFrame(() => setAnimated(true));
    const t2 = setTimeout(() => {
      const slug = regionToSlug(winner);
      if (onComplete) {
        onComplete(slug);
      } else {
        window.location.href = `/quiz/result/${slug}`;
      }
    }, delayMs);
    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
    };
  }, [winner, onComplete, delayMs]);

  return (
    <div className="result-reveal" role="status" aria-live="polite">
      <div className="result-reveal__eyebrow">COUNTING THE STARS</div>
      <ul className="result-reveal__bars">
        {ranked.map(({ region, weight }) => {
          const isWinner = region === winner;
          const targetWidth = (weight / maxWeight) * 100;
          return (
            <li key={region} className={`result-reveal__row${isWinner ? ' is-winner' : ''}`}>
              <span className="result-reveal__label">{REGION_LABELS[region]}</span>
              <div className="result-reveal__track">
                <div
                  className="result-reveal__bar"
                  style={{ width: animated ? `${targetWidth}%` : '0%' }}
                />
              </div>
              <span className="result-reveal__weight">{weight}</span>
            </li>
          );
        })}
      </ul>
      <style>{`
        .result-reveal {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
          padding: 48px 24px;
        }
        .result-reveal__eyebrow {
          font-family: 'JetBrains Mono Variable', 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          color: var(--color-saffron, #FFD166);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 8px;
        }
        .result-reveal__bars {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .result-reveal__row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .result-reveal__label {
          font-family: 'JetBrains Mono Variable', 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.55);
          letter-spacing: 0.18em;
          width: 88px;
          text-align: right;
        }
        .result-reveal__row.is-winner .result-reveal__label {
          color: rgba(255, 255, 255, 0.95);
        }
        .result-reveal__track {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 99px;
          overflow: hidden;
        }
        .result-reveal__bar {
          height: 100%;
          background: rgba(255, 209, 102, 0.35);
          border-radius: 99px;
          transition: width 800ms cubic-bezier(.2, .7, .1, 1);
        }
        .result-reveal__row.is-winner .result-reveal__bar {
          background: var(--color-saffron, #FFD166);
          box-shadow: 0 0 10px rgba(255, 209, 102, 0.5);
        }
        .result-reveal__weight {
          font-family: 'JetBrains Mono Variable', 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          width: 28px;
          text-align: right;
        }
        .result-reveal__row.is-winner .result-reveal__weight {
          color: var(--color-saffron, #FFD166);
        }
        @media (prefers-reduced-motion: reduce) {
          .result-reveal__bar { transition: none; }
        }
      `}</style>
    </div>
  );
}
