import { WORDPRESS_URL } from './constants';
const API_CLIENT_SECRET = process.env.WORDPRESS_HEADLESS_SECRET;

export async function authorize(code) {
  if (!WORDPRESS_URL) {
    throw Error('WORDPRESS_URL not defined');
  }
  const response = await fetch(
    `${WORDPRESS_URL}/wp-json/wpac/v1/authorize`,
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
