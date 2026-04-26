export const site = {
  title: 'Miss Diaspora Ghana',
  tagline: 'Crowning the women who carry continents.',
  defaultDescription: 'Miss Diaspora Ghana — celebrating women of African descent.',
  social: {
    instagram: 'https://instagram.com/missdiasporaghana',
    facebook: 'https://facebook.com/missdiasporaghana',
    tiktok: 'https://tiktok.com/@missdiasporaghana',
    youtube: '',
    twitter: '',
  },
  contact: {
    email: 'info@missdiasporagh.org',
    phone: '+233 591942227',
    whatsapp: 'https://wa.me/233591942227',
    address: '',
  },
  footerCopy: 'Made for Miss Diaspora Ghana · Nubian Crown Company Limited',
} as const;

export type SiteConfig = typeof site;
