interface Props {
  current: number;   // 1-indexed (1..6)
  total: number;     // typically 6
}

const ROMANS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];

export default function ProgressDots({ current, total }: Props) {
  return (
    <div className="quiz-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const isCurrent = n === current;
        const isPast = n < current;
        return (
          <span
            key={n}
            className={`quiz-progress__dot${isCurrent ? ' is-current' : ''}${isPast ? ' is-past' : ''}`}
            aria-hidden="true"
          >
            {ROMANS[n] ?? String(n)}
          </span>
        );
      })}
      <style>{`
        .quiz-progress {
          display: inline-flex;
          gap: 10px;
          align-items: center;
          font-family: 'Fraunces Variable', 'Fraunces', serif;
          font-style: italic;
          font-weight: 600;
        }
        .quiz-progress__dot {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.25);
          transition: color 200ms cubic-bezier(.4, 0, .2, 1), font-size 200ms cubic-bezier(.4, 0, .2, 1), text-shadow 200ms cubic-bezier(.4, 0, .2, 1);
        }
        .quiz-progress__dot.is-past {
          color: rgba(255, 209, 102, 0.9);
          font-size: 18px;
        }
        .quiz-progress__dot.is-current {
          color: #FFD166;
          font-size: 22px;
          font-weight: 700;
          text-shadow: 0 0 8px rgba(255, 209, 102, 0.4);
        }
        @media (prefers-reduced-motion: reduce) {
          .quiz-progress__dot { transition: none; }
        }
      `}</style>
    </div>
  );
}
