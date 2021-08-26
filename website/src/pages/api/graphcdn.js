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

const GRAPHCDN_PURGE_API_URL = process.env.GRAPHCDN_PURGE_API_URL;
const GRAPHCDN_PURGE_API_TOKEN = process.env.GRAPHCDN_PURGE_API_TOKEN;

async function purgeAllPosts() {
  const response = await fetch(GRAPHCDN_PURGE_API_URL, {
    method: 'POST', // Always POST purge mutations
    body: JSON.stringify({ query: 'mutation { _purgeAll }' }),
    headers: {
      'Content-Type': 'application/json',
      'graphcdn-token': GRAPHCDN_PURGE_API_TOKEN,
    },
  });

  return await response.json();
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Verify env variable presense
  if (!GRAPHCDN_PURGE_API_URL || !GRAPHCDN_PURGE_API_TOKEN) {
    return res
      .status(500)
      .end('Purge Failed, Graph CDN API endpoint not defined');
  }

  // @TODO: Process the incoming body.post_id and create a targetted purge request

  try {
    const response = await purgeAllPosts();

    console.log('CDN data', response.data);

    if (!response.data._purgeAll) {
      throw 'CDN Failure';
    }

    console.log('Purge Success');

    return res.status(200).end('Purge Success');
  } catch (e) {
    console.error(e);
    return res.status(500).end('Purge Failed');
  }
}
