export const DOMAIN = process.env.VERCEL_URL
  ? 'https://' + process.env.VERCEL_URL
  : '';

export const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ||
  'https://bubsnext.wpengine.com/graphql';

/** SEO Tags */
export const META = {
  titleAppend: '| Patronage',
  url: 'https://bubs.patronage.org',
  twitterHandle: '@patronageorg',
  siteName: 'Bubs by Patronage',
  description:
    'Bubs is a starter for getting up and running with headless WordPress and Next.js.',
  image: `${DOMAIN}/img/default-share-graphic.jpg`,
};
