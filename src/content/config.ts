import { defineCollection, z, reference } from 'astro:content';

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(['primary', 'secondary', 'ghost']).default('primary'),
});

const mediaRef = z.object({
  kind: z.enum(['image', 'youtube', 'drive']),
  src: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

const REGIONS = z.enum([
  'Greater Accra',
  'Ashanti',
  'Volta',
  'Northern',
  'Western',
  'Central',
  'Eastern',
]);

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    headline: z.string().optional(),
    introduction: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    leadershipEyebrow: z.string().optional(),
    leadershipHeading: z.string().optional(),
    leadership: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          photo: z.string().optional(),
          photoAlt: z.string().optional(),
          bio: z.string().optional(),
        }),
      )
      .optional(),
    pillarsEyebrow: z.string().optional(),
    pillarsHeading: z.string().optional(),
    pillars: z
      .array(
        z.object({
          icon: z.string().optional(),
          number: z.string().optional(),
          title: z.string(),
          description: z.string(),
          detail: z.string().optional(),
        }),
      )
      .optional(),
    programsEyebrow: z.string().optional(),
    programsHeading: z.string().optional(),
    programs: z
      .array(
        z.object({
          title: z.string(),
          tagline: z.string().optional(),
          image: z.string().optional(),
          imageAlt: z.string().optional(),
          description: z.string(),
          cta: z
            .object({
              label: z.string(),
              href: z.string(),
              variant: z.enum(['primary', 'secondary', 'ghost']).default('primary'),
            })
            .optional(),
        }),
      )
      .optional(),
    tiersEyebrow: z.string().optional(),
    tiersHeading: z.string().optional(),
    tiers: z
      .array(
        z.object({
          label: z.string(),
          priceText: z.string().optional(),
          benefits: z.array(z.string()).default([]),
          featured: z.boolean().default(false),
        }),
      )
      .optional(),
    partnersEyebrow: z.string().optional(),
    partnersHeading: z.string().optional(),
    partners: z
      .array(
        z.object({
          name: z.string(),
          logo: z.string().optional(),
          logoAlt: z.string().optional(),
          url: z.string().optional(),
          tier: z.string().optional(),
        }),
      )
      .optional(),
    sponsorsCta: z
      .object({
        heading: z.string(),
        body: z.string().optional(),
        email: z.string(),
        buttonLabel: z.string().default('Email partnerships team'),
      })
      .optional(),
    methodsEyebrow: z.string().optional(),
    methodsHeading: z.string().optional(),
    methods: z
      .array(
        z.object({
          icon: z.string().optional(),
          label: z.string(),
          value: z.string(),
          href: z.string(),
        }),
      )
      .optional(),
  }),
});

const cycles = defineCollection({
  type: 'data',
  schema: z.object({
    year: z.number().int().min(2000).max(2100),
    crownNumber: z.string(),
    theme: z.string().optional(),
    status: z.enum(['upcoming', 'current', 'past']),
    opensAt: z.coerce.date().optional(),
    closesAt: z.coerce.date().optional(),
    finaleAt: z.coerce.date().optional(),
    applicationFee: z
      .object({
        amount: z.number().optional(),
        currency: z.string().default('USD'),
        displayText: z.string().optional(),
      })
      .optional(),
    eligibility: z.array(z.string()).optional(),
    whatYoullNeed: z.array(z.string()).optional(),
  }),
});

const contestants = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    cycle: reference('cycles'),
    region: z.string().optional(),
    sashNumber: z.string().optional(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    heroVideo: z.object({ kind: z.enum(['youtube', 'drive']), url: z.string() }).optional(),
    charityPlatform: z
      .object({
        title: z.string(),
        description: z.string(),
        url: z.string().optional(),
      })
      .optional(),
    gallery: z.array(mediaRef).default([]),
    social: z
      .object({
        instagram: z.string().optional(),
        tiktok: z.string().optional(),
      })
      .optional(),
    sortOrder: z.number().default(0),
  }),
});

const queens = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    crownNumber: z.number().int(),
    year: z.number().int(),
    eraTheme: z.string().optional(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    gallery: z.array(mediaRef).default([]),
    achievements: z.array(z.string()).default([]),
    currentCity: z.string().optional(),
    currentRole: z.string().optional(),
    social: z
      .object({
        instagram: z.string().optional(),
        linkedin: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
});

const press = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    source: z.string().optional(),
    publishedAt: z.coerce.date(),
    excerpt: z.string(),
    externalUrl: z.string().optional(),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const cities = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    country: z.string(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    video: z.object({ kind: z.enum(['youtube', 'drive']), url: z.string() }).optional(),
    relatedQueens: z.array(z.string()).default([]),
    relatedContestants: z.array(z.string()).default([]),
  }),
});

const quizQuestions = defineCollection({
  type: 'data',
  schema: z.object({
    order: z.number().int(),
    question: z.string(),
    illustration: z.string().optional(),
    options: z
      .array(
        z.object({
          label: z.string(),
          weights: z.array(z.object({ region: REGIONS, weight: z.number().min(0).max(5) })),
        }),
      )
      .length(4),
  }),
});

const quizResults = defineCollection({
  type: 'content',
  schema: z.object({
    region: REGIONS,
    archetypeName: z.string(),
    shortLine: z.string().optional(),
    accentHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    illustration: z.string().optional(),
    illustrationAlt: z.string().optional(),
  }),
});

export const collections = {
  pages,
  cycles,
  contestants,
  queens,
  press,
  cities,
  'quiz-questions': quizQuestions,
  'quiz-results': quizResults,
};
