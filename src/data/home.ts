type Cta = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const home = {
  hero: {
    eyebrow: 'Crown XXVI · Open',
    headline: 'She wears the future.',
    subline:
      'Miss Diaspora Ghana crowns women of African descent who carry continents — heritage, leadership, and craft on a single stage.',
    bgVideoUrl: '/videos/mdgh-intro.mp4',
    bgPosterImage: '',
    bgPosterImageAlt: '',
    cta: {
      label: 'Begin Application',
      href: '/apply',
      variant: 'primary',
    } satisfies Cta,
  },
  mission: {
    eyebrow: 'Why we exist',
    headline: 'A platform for the daughters of the diaspora.',
    body:
      'We celebrate the women holding Ghanaian heritage across borders — and equip them with mentorship, scholarship, and a stage that travels.',
    cta: {
      label: 'Read our mission',
      href: '/mission',
      variant: 'secondary',
    } satisfies Cta,
  },
  crownTeaser: {
    eyebrow: 'The crown',
    headline: 'Twenty-six queens. One legacy.',
    body:
      'Every Miss Diaspora Ghana since the first cycle — their work, their cities, their continuing story.',
    cta: {
      label: 'See every queen',
      href: '/heritage',
      variant: 'secondary',
    } satisfies Cta,
  },
  diasporaTeaser: {
    eyebrow: 'The diaspora',
    headline: 'A globe of Ghanaian daughters.',
    body:
      'From Accra to Atlanta, London to Toronto — explore where our queens and contestants carry the crown next.',
    cta: {
      label: 'Explore the globe',
      href: '/diaspora',
      variant: 'secondary',
    } satisfies Cta,
  },
  cycleTeaser: {
    eyebrow: 'This cycle',
    headline: 'Crown XXVI contestants.',
    body:
      'Meet the women representing the current cycle — their charity platforms, their cities, their reasons.',
    cta: {
      label: 'Meet the contestants',
      href: '/contestants',
      variant: 'secondary',
    } satisfies Cta,
  },
  becomeHer: {
    eyebrow: 'Your turn',
    headline: 'Become her.',
    body:
      'Applications for Crown XXVI are open to women of Ghanaian heritage worldwide. Begin yours today.',
    cta: {
      label: 'Begin Application',
      href: '/apply',
      variant: 'primary',
    } satisfies Cta,
  },
  seoTitle: 'Miss Diaspora Ghana — She wears the future.',
  seoDescription:
    'Miss Diaspora Ghana crowns women of African descent — celebrating heritage, leadership, and the women who carry continents.',
} as const;

export type HomeContent = typeof home;
