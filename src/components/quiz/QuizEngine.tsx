import { useCallback, useState } from 'react';
import { applyAnswer, pickWinner, strongestRegion } from '~/lib/quiz/scoring';
import { emptyWeights, type Question, type QuestionOption, type Region } from '~/lib/quiz/types';
import ProgressDots from './ProgressDots';
import QuestionCard from './QuestionCard';
import ResultReveal from './ResultReveal';

interface Props {
  questions: Question[];
}

type Phase = 'idle' | 'asking' | 'revealing';

export default function QuizEngine({ questions }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [index, setIndex] = useState(0);
  const [weights, setWeights] = useState(emptyWeights());
  const [answerOrder, setAnswerOrder] = useState<Region[]>([]);

  const handleStart = useCallback(() => {
    setPhase('asking');
    setIndex(0);
    setWeights(emptyWeights());
    setAnswerOrder([]);
  }, []);

  const handleSelect = useCallback(
    (opt: QuestionOption) => {
      const newWeights = applyAnswer(weights, opt);
      const newAnswerOrder = [...answerOrder, strongestRegion(opt)];

      const isLast = index === questions.length - 1;
      setWeights(newWeights);
      setAnswerOrder(newAnswerOrder);

      if (isLast) {
        setPhase('revealing');
      } else {
        setIndex(index + 1);
      }
    },
    [weights, answerOrder, index, questions.length]
  );

  if (phase === 'idle') {
    return (
      <div className="quiz-start">
        <div className="quiz-start__eyebrow">SIX QUESTIONS · YOUR HOMELAND</div>
        <h1 className="quiz-start__title">
          Which Ghana <em>are you?</em>
        </h1>
        <p className="quiz-start__lede">
          Six questions. One archetype. The region of Ghana whose spirit lives loudest in you. Takes ninety seconds.
        </p>
        <button type="button" className="quiz-start__cta" onClick={handleStart}>
          Begin →
        </button>
        <style>{`
          .quiz-start {
            text-align: center;
            max-width: 680px;
            margin: 0 auto;
            padding: 48px 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: center;
          }
          .quiz-start__eyebrow {
            font-family: 'JetBrains Mono Variable', 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 600;
            color: var(--color-saffron, #FFD166);
            letter-spacing: 0.25em;
            text-transform: uppercase;
          }
          .quiz-start__title {
            font-family: 'Fraunces Variable', 'Fraunces', serif;
            font-weight: 500;
            font-size: clamp(40px, 6vw, 72px);
            line-height: 1.05;
            color: #fff;
            margin: 0;
          }
          .quiz-start__title em {
            font-style: italic;
            color: var(--color-saffron, #FFD166);
          }
          .quiz-start__lede {
            color: rgba(255, 255, 255, 0.7);
            font-size: 17px;
            line-height: 1.6;
            max-width: 52ch;
            margin: 0 0 16px;
          }
          .quiz-start__cta {
            background: var(--color-saffron, #FFD166);
            color: var(--color-deep-violet, #1a0833);
            border: none;
            padding: 16px 48px;
            border-radius: 999px;
            font-family: 'JetBrains Mono Variable', 'JetBrains Mono', monospace;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(255, 209, 102, 0.25);
            transition: transform 200ms cubic-bezier(.4, 0, .2, 1), box-shadow 200ms cubic-bezier(.4, 0, .2, 1);
          }
          .quiz-start__cta:hover,
          .quiz-start__cta:focus-visible {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(255, 209, 102, 0.35);
            outline: 2px solid var(--color-saffron, #FFD166);
            outline-offset: 4px;
          }
          @media (prefers-reduced-motion: reduce) {
            .quiz-start__cta { transition: none; }
            .quiz-start__cta:hover, .quiz-start__cta:focus-visible { transform: none; }
          }
        `}</style>
      </div>
    );
  }

  if (phase === 'asking') {
    const q = questions[index];
    if (!q) return null;
    return (
      <div className="quiz-active">
        <div className="quiz-active__progress">
          <ProgressDots current={index + 1} total={questions.length} />
        </div>
        <QuestionCard question={q} questionNumber={index + 1} onSelect={handleSelect} />
        <style>{`
          .quiz-active {
            display: flex;
            flex-direction: column;
            gap: 40px;
            padding: 48px 0 80px;
            min-height: 70vh;
          }
          .quiz-active__progress {
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  // phase === 'revealing'
  const winner = pickWinner(weights, answerOrder);
  return <ResultReveal weights={weights} winner={winner} />;
}
