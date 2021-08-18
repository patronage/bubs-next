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

export default async function handler(req, res) {
  const GRAPHCDN_PURGE_API_URL = process.env.GRAPHCDN_PURGE_API_URL;
  const GRAPHCDN_PURGE_API_TOKEN =
    process.env.GRAPHCDN_PURGE_API_TOKEN;

  async function purgeAllPosts() {
    console.log('attempting purge');
    const res = await fetch(GRAPHCDN_PURGE_API_URL, {
      method: 'POST', // Always POST purge mutations
      headers: {
        'Content-Type': 'application/json', // and specify the Content-Type
        'graphcdn-token': GRAPHCDN_PURGE_API_TOKEN,
      },
      body: JSON.stringify({ query: 'mutation { _purgeAll }' }),
    });
    return await res.json();
  }

  if (req.method === 'POST') {
    if (!GRAPHCDN_PURGE_API_URL || !GRAPHCDN_PURGE_API_TOKEN) {
      return res
        .status(500)
        .end('Purge Failed, Graph CDN API endpoint not defined');
    }

    // const { slug } = req.query;

    // if (!slug.includes('purge')) {
    //   return res
    //     .status(500)
    //     .end('Purge Failed, must specifcy valid path');
    // }

    // if (slug.includes('post-create')) {
    //   return res
    //     .status(200)
    //     .end('Skipping purge, only running on updates');
    // }

    // TODO: handle
    console.log('body', req.body);

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
  } else {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
}
