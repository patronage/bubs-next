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
  ? WORDPRESS_DOMAIN.includes('localhost')
    ? 'http://' + WORDPRESS_DOMAIN
    : 'https://' + WORDPRESS_DOMAIN
  : '';

export const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  (WORDPRESS_URL && WORDPRESS_URL + '/graphql') ||
  'https://bubsnext.wpengine.com/graphql';

// TODO: Should these be camelCase?
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
// TODO: This is the full launch boat, need to trim this down to the minimum
export const THEME = {
  sectionBackgroundDefault: 'white',
  bootstrapContentClasses: 'col-12 col-lg-10 col-xl-9 col-xxl-8',
  spacer: 5,
  paddingMobile: 2,
  paddingDesktop: 4,
  colorBody: '#fff',
  internalDomains: [],
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
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    light: '#F3F3F3',
    medium: '#dee2e6',
    dark: '#343a40',
    text: '#212529',
    body: '#ffffff',
  },
  fonts: {
    heading: 'sans-serif',
    body: 'sans-serif',
    bodySize: '16px',
    bodySizeMobile: '16px',
    bodyLetterSpacing: 'initial',
    bodyWeight: '400',
    sourceGoogle: [],
    sourceCustom: [],
    h1max: '58px',
    h1min: '28px',
    h2max: '48px',
    h2min: '25px',
    h3max: '40px',
    h3min: '22px',
    h4max: '32px',
    h4min: '20px',
    h5max: '24px',
    h5min: '18px',
    h6max: '20px',
    h6min: '16px',
  },
  // components
  header: {
    sectionBackground: 'white',
    variant: 'default', // one of default, sticky, or seamless
    logoText: '',
    logoSrc: '',
    logoWidth: 0,
    logoHeight: 0,
    showSocial: false,
  },
  footer: {
    sectionBackground: 'dark',
    logoText: '',
    logoSrc: '',
    logoWidth: 0,
    logoHeight: 0,
    disclaimerBorder: 0,
    secondLogoText: '',
    secondLogoSrc: '',
    secondLogoWidth: 0,
    secondLogoHeight: 0,
    secondLogoLink: '',
    secondLogoLinkTarget: '',
  },
  sections: {
    headerAlignment: 'center', // default, one of 'center' or 'left'
    headerWidth: 'content', // default, one of 'content' or 'dynamic'
  },
  hero: {
    bgImageMask: 'default', // one of default, or none
    buttonColorDark: 'primary',
    buttonColorLight: 'white',
    splitFullWidth: false,
  },
  featuredContent: {
    loadMoreButtonSpacer: '0',
    loadMoreText: 'See More',
    readMoreText: 'Read More',
    showDate: false,
    showAuthor: false,
    showTags: false,
    showCategories: false,
  },
};
