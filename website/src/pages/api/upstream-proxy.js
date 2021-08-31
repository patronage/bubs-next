import fetch from 'isomorphic-unfetch';
import { WORDPRESS_URL, META } from 'lib/constants';
import _replace from 'lodash/replace';

// Global regex search allows replacing all URLs
const HOSTNAME_REGEX = new RegExp(WORDPRESS_URL, 'g');

export default async function (req, res) {
  const upstreamRes = await fetch(`${WORDPRESS_URL}${req.url}`);
  let content = await upstreamRes.text();

  // Pathnames where URLs within need to be replaced
  if (req.url.includes('sitemap') || req.url.includes('/feed/')) {
    content = _replace(content, HOSTNAME_REGEX, META.url);
  }

  res.setHeader(
    'Content-Type',
    upstreamRes.headers.get('content-type'),
  );

  res.setHeader('Cache-Control', 'max-age=60');

  res.send(content);
}
