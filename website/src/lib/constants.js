export const DOMAIN = process.env.VERCEL_URL
  ? 'https://' + process.env.VERCEL_URL
  : '';

export const WORDPRESS_API_URL =
  process.env.WORDPRESS_DOMAIN + '/graphql' ||
  'https://bubsnext.wpengine.com/graphql';

/** SEO Tags */
export const META = {
  titleAppend: '| Patronage',
  url: 'https://bubs.patronage.org',
  twitterHandle: '@patronageorg',
  siteName: 'Bubs by Patronage',
};
