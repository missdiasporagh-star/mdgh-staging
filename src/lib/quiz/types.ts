export type Region =
  | 'Greater Accra'
  | 'Ashanti'
  | 'Volta'
  | 'Northern'
  | 'Western'
  | 'Central'
  | 'Eastern';

export const ALL_REGIONS: Region[] = [
  'Greater Accra',
  'Ashanti',
  'Volta',
  'Northern',
  'Western',
  'Central',
  'Eastern',
];

export interface QuestionOption {
  label: string;
  weights: Array<{ region: Region; weight: number }>;
}

export interface Question {
  order: number;
  question: string;
  illustration?: string;
  options: QuestionOption[];
}

export interface ResultMeta {
  slug: string;
  region: Region;
  archetypeName: string;
  shortLine?: string;
  accentHex: string;
  illustration?: string;
  illustrationAlt?: string;
}

export type Weights = Record<Region, number>;

export function emptyWeights(): Weights {
  return {
    'Greater Accra': 0,
    Ashanti: 0,
    Volta: 0,
    Northern: 0,
    Western: 0,
    Central: 0,
    Eastern: 0,
  };
}

export function regionToSlug(region: Region): string {
  return region.toLowerCase().replace(/\s+/g, '-');
}

export function slugToRegion(slug: string): Region | null {
  const found = ALL_REGIONS.find((r) => regionToSlug(r) === slug);
  return found ?? null;
}
