/**
 * Variable naming convention
 *   _DOMAIN = raw domain name
 *   _URL = domain plus https
 *
 *  Required in config:
 *    * WORDPRESS_DOMAIN
 *
 *  Reccomended to use the public variations since some client-side requests need to be made
 */

export const WORDPRESS_DOMAIN =
  process.env.WORDPRESS_DOMAIN ||
  process.env.NEXT_PUBLIC_WORDPRESS_DOMAIN;

export const WORDPRESS_URL = WORDPRESS_DOMAIN
  ? WORDPRESS_DOMAIN.includes('localhost') ||
    WORDPRESS_DOMAIN.includes('.local')
    ? 'http://' + WORDPRESS_DOMAIN
    : 'https://' + WORDPRESS_DOMAIN
  : '';

export const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  (WORDPRESS_URL && WORDPRESS_URL + '/graphql') ||
  'https://bubsnext.wpengine.com/graphql';

// TODO: Should these be camelCase?/
export const CONFIG = {
  site_domain: 'bubs.patronage.org',
  wordpress_domain: WORDPRESS_DOMAIN,
  wordpress_url: WORDPRESS_URL,
  wordpress_api_url: WORDPRESS_API_URL,
  graphcdn_purge_api_url: process.env.GRAPHCDN_PURGE_API_URL || '',
  graphcdn_purge_api_token:
    process.env.GRAPHCDN_PURGE_API_TOKEN || '',
};

// Theme defaults, these get merged with the project config
export const THEME = {
  meta: {
    icon32: '',
    iconApple: '/apple-touch-icon.png',
    titleAppend: '| Patronage',
    url: 'https://bubs.patronage.org',
    twitterHandle: '@patronageorg',
    siteName: 'Bubs by Patronage',
    proxyWordPressImages: true,
  },
  i18n: {
    enabled: false,
  },
  integrations: {
    googleAnalyticsID: '',
    googleTagManagerID: '',
  },
};
