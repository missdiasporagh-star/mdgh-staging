import type { Question, QuestionOption } from '~/lib/quiz/types';

interface Props {
  question: Question;
  questionNumber: number;     // 1-indexed for display
  onSelect: (option: QuestionOption) => void;
}

export default function QuestionCard({ question, questionNumber, onSelect }: Props) {
  const ROMANS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];
  const roman = ROMANS[questionNumber] ?? String(questionNumber);

  return (
    <div className="quiz-question">
      <div className="quiz-question__eyebrow">QUESTION {roman}</div>
      <h2 className="quiz-question__title">{question.question}</h2>
      <div className="quiz-question__grid">
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            className="quiz-question__option"
            onClick={() => onSelect(opt)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <style>{`
        .quiz-question {
          width: 100%;
          max-width: 880px;
          margin: 0 auto;
          padding: 0 48px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .quiz-question__eyebrow {
          font-family: 'JetBrains Mono Variable', 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }
        .quiz-question__title {
          font-family: 'Fraunces Variable', 'Fraunces', serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #fff;
          margin: 0;
        }
        .quiz-question__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .quiz-question__option {
          background: linear-gradient(180deg, var(--color-deep-violet, #1a0833), var(--color-obsidian, #050111));
          border: 1px solid rgba(107, 43, 217, 0.4);
          border-radius: 14px;
          padding: 22px 24px;
          color: #fff;
          text-align: left;
          font-family: 'Inter Variable', 'Inter', sans-serif;
          font-size: 15px;
          line-height: 1.4;
          cursor: pointer;
          min-height: 80px;
          transition: transform 200ms cubic-bezier(.4, 0, .2, 1), border-color 200ms cubic-bezier(.4, 0, .2, 1), box-shadow 200ms cubic-bezier(.4, 0, .2, 1);
        }
        .quiz-question__option:hover,
        .quiz-question__option:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(255, 209, 102, 0.55);
          box-shadow: 0 0 0 2px rgba(255, 209, 102, 0.2), 0 6px 16px rgba(0, 0, 0, 0.3);
          outline: none;
        }
        @media (max-width: 767px) {
          .quiz-question { padding: 0 20px; gap: 24px; }
          .quiz-question__grid { grid-template-columns: 1fr; }
          .quiz-question__option { padding: 18px 16px; min-height: 64px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .quiz-question__option { transition: none; }
          .quiz-question__option:hover,
          .quiz-question__option:focus-visible { transform: none; }
        }
      `}</style>
    </div>
  );
}
