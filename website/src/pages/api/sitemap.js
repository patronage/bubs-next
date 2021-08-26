import fetch from 'isomorphic-unfetch';

const WORDPRESS_DOMAIN = process.env.WORDPRESS_DOMAIN;

export default async function (req, res) {
  const upstreamRes = await fetch(`${WORDPRESS_DOMAIN}${req.url}`);
  const sitemap = await upstreamRes.text();

  res.setHeader(
    'content-type',
    upstreamRes.headers.get('content-type'),
  );

  res.send(sitemap);
}
