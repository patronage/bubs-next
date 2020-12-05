export const DOMAIN = 'https://' + process.env.VERCEL_URL || '';
export const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ||
  'https://bubsnext.wpengine.com/graphql';
export const META_TITLE = 'Bubs Next';
export const META_DESCRIPTION = 'Next.js starter for headless WP';
export const META_OG_IMAGE_URL = `${DOMAIN}/og-default.png`;
