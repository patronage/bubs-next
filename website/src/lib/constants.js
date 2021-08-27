/**
 * Variable naming convention
 *   _DOMAIN = raw domain name
 *   _URL = domain plus https
 *
 *  Required in config:
 *    * VERCEL_DOMAIN
 *    * WORDPRESS_DOMAIN
 */

export const VERCEL_DOMAIN = process.env.VERCEL_DOMAIN;

export const VERCEL_URL = VERCEL_DOMAIN
  ? VERCEL_DOMAIN.includes('localhost')
    ? 'http://' + VERCEL_DOMAIN
    : 'https://' + VERCEL_DOMAIN
  : '';

export const WORDPRESS_DOMAIN = process.env.WORDPRESS_DOMAIN;

export const WORDPRESS_URL = WORDPRESS_DOMAIN
  ? WORDPRESS_DOMAIN.includes('localhost')
    ? 'http://' + WORDPRESS_DOMAIN
    : 'https://' + WORDPRESS_DOMAIN
  : '';

export const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ||
  (WORDPRESS_URL && WORDPRESS_URL + '/graphql') ||
  'https://bubsnext.wpengine.com/graphql';

/** SEO Tags */
export const META = {
  titleAppend: '| Patronage',
  url: 'https://bubs.patronage.org',
  twitterHandle: '@patronageorg',
  siteName: 'Bubs by Patronage',
};
