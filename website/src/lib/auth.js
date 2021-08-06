import { trimTrailingSlash } from './utils';
const WP_URL = trimTrailingSlash(process.env.WORDPRESS_URL);
const API_CLIENT_SECRET = process.env.WORDPRESS_HEADLESS_SECRET;

export async function authorize(code) {
  if (!WP_URL) {
    throw Error('WORDPRESS_URL not defined');
  }
  const response = await fetch(
    `${WP_URL}/wp-json/wpac/v1/authorize`,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-wpe-headless-secret': API_CLIENT_SECRET,
      },

      method: 'POST',
      body: JSON.stringify({
        code,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw {
      error: result,
      status: response.status,
    };
  }

  return result;
}
