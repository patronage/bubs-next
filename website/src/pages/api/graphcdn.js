// possibility to verify token
// https://codedaily.io/tutorials/Stripe-Webhook-Verification-with-NextJS
// general docs:
// https://nextjs.org/docs/api-routes/introduction
// Docs:
// https://graphcdn.io/docs/how-to/purge-the-cache

// todo:
// * [] graphcdn API keys purge cache
// * [] process posted data, use to smart purge AllContent
// * [] process posted data, use to purge menus/globals

import fetch from 'isomorphic-unfetch';

import { getSettings } from 'lib/getSettings';

async function purgeAllPosts(url, token) {
  const response = await fetch(url, {
    method: 'POST', // Always POST purge mutations
    body: JSON.stringify({ query: 'mutation { _purgeAll }' }),
    headers: {
      'Content-Type': 'application/json',
      'graphcdn-token': token,
    },
  });

  return await response.json();
}

export default async function handler(req, res) {
  const SETTINGS = getSettings({ ...req });

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Verify env variable presense
  if (
    !SETTINGS.CONFIG.graphcdn_purge_api_url ||
    !SETTINGS.CONFIG.graphcdn_purge_api_token
  ) {
    return res
      .status(500)
      .end('Purge Failed, Graph CDN API endpoint not defined');
  }

  // @TODO: Process the incoming body.post_id and create a targetted purge request

  try {
    const response = await purgeAllPosts(
      SETTINGS.CONFIG.graphcdn_purge_api_url,
      SETTINGS.CONFIG.graphcdn_purge_api_token,
    );

    // eslint-disable-next-line no-console
    console.log('CDN data', response.data);

    if (!response.data._purgeAll) {
      throw 'CDN Failure';
    }

    // eslint-disable-next-line no-console
    console.log('Purge Success');

    return res.status(200).end('Purge Success');
  } catch (e) {
    console.error(e);
    return res.status(500).end('Purge Failed');
  }
}
