import { getCollection } from 'astro:content';

export async function getCurrentCycle() {
  const cycles = await getCollection('cycles');
  const current = cycles.filter((c) => c.data.status === 'current');

  if (current.length === 0) {
    throw new Error(
      'No cycle with status "current" found. Add status: "current" to exactly one entry in src/content/cycles/.',
    );
  }
  if (current.length > 1) {
    const slugs = current.map((c) => c.id).join(', ');
    throw new Error(
      `Multiple cycles with status "current" found (${slugs}). Exactly one cycle must be current at a time.`,
    );
  }

  return current[0]!;
}
