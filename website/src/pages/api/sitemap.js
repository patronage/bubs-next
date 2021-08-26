import fetch from 'isomorphic-unfetch';
import { DOMAIN } from 'lib/constants';
import _replace from 'lodash/replace';

const WORDPRESS_DOMAIN = process.env.WORDPRESS_DOMAIN;

export default async function (req, res) {
  const upstreamRes = await fetch(`${WORDPRESS_DOMAIN}${req.url}`);
  const sitemap = await upstreamRes.text();

  const hostnamesReplaced = _replace(
    sitemap,
    new RegExp(WORDPRESS_DOMAIN, 'g'), // Global regex search allows replacing all URLs
    DOMAIN,
  );

  res.setHeader(
    'Content-Type',
    upstreamRes.headers.get('content-type'),
  );

  res.setHeader('Cache-Control', 'max-age=60');

  res.send(hostnamesReplaced);
}
