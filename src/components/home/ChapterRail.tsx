import { useEffect, useState } from 'react';
import './ChapterRail.css';

const chapters = [
  { id: 'hero', label: 'Hero' },
  { id: 'mission', label: 'Mission' },
  { id: 'crown', label: 'The Crown' },
  { id: 'diaspora', label: 'Diaspora' },
  { id: 'cycle', label: 'Cycle' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'become', label: 'Become Her' },
] as const;

export default function ChapterRail() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.querySelector<HTMLElement>(`[data-chapter="${c.id}"]`))
      .filter((s): s is HTMLElement => s !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          a.intersectionRatio > b.intersectionRatio ? a : b,
        );
        const idx = sections.findIndex((s) => s === top.target);
        if (idx >= 0) setActiveIdx(idx);
      },
      { threshold: [0.4, 0.6, 0.8] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="mdgh-chapter-rail" aria-label="Page chapters">
      {chapters.map((c, i) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          aria-label={`Jump to ${c.label}`}
          aria-current={i === activeIdx ? 'true' : undefined}
          className={`mdgh-chapter-rail__dot${i === activeIdx ? ' is-active' : ''}`}
        />
      ))}
    </nav>
  );
}
