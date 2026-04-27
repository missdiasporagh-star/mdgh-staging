import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

// Generic helpers
export async function listCollection<C extends Parameters<typeof getCollection>[0]>(name: C) {
  return getCollection(name);
}

// Page singletons (one MDX file per page key)
export async function getPage(slug: string): Promise<CollectionEntry<'pages'> | undefined> {
  return getEntry('pages', slug);
}

// Cycle queries
export async function getAllCycles() {
  return getCollection('cycles');
}

export async function getCycle(slug: string) {
  return getEntry('cycles', slug);
}

// Contestants
export async function getAllContestants() {
  return getCollection('contestants');
}

export async function getContestantsByCycle(cycleSlug: string) {
  const all = await getCollection('contestants');
  return all
    .filter((c) => c.data.cycle.id === cycleSlug)
    .sort(
      (a, b) =>
        (a.data.sortOrder ?? 0) - (b.data.sortOrder ?? 0) || a.data.name.localeCompare(b.data.name),
    );
}

export async function getContestant(slug: string) {
  return getEntry('contestants', slug);
}

// Queens
export async function getAllQueens() {
  const all = await getCollection('queens');
  return all.sort((a, b) => b.data.year - a.data.year);
}

export async function getQueen(slug: string) {
  return getEntry('queens', slug);
}

// Press
export async function getAllPress() {
  const all = await getCollection('press');
  return all.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function getPressArticle(slug: string) {
  return getEntry('press', slug);
}

// Diaspora cities
export async function getAllCities() {
  return getCollection('cities');
}

// Quiz
export async function getAllQuizQuestions() {
  const all = await getCollection('quiz-questions');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getAllQuizResults() {
  return getCollection('quiz-results');
}

export async function getQuizResultByRegion(region: string) {
  const all = await getCollection('quiz-results');
  return all.find((r) => r.data.region === region);
}
