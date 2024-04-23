import fetch from 'isomorphic-unfetch';
import { getSettings } from 'lib/getSettings';
import { trimTrailingSlash } from 'lib/utils';
import _replace from 'lodash/replace';

export default async function proxy(req, res) {
  const SETTINGS = getSettings({ ...req });

  const WORDPRESS_URL = SETTINGS.CONFIG.wordpress_url;
  const PUBLIC_URL = trimTrailingSlash(
    `https://${SETTINGS.CONFIG.site_domain}`,
  );

  let content;
  let contentType;

  // Global regex search allows replacing all URLs
  const HOSTNAME_REGEX = new RegExp(WORDPRESS_URL, 'g');

  const upstreamRes = await fetch(`${WORDPRESS_URL}${req.url}`, {
    redirect: 'manual',
  });

  // check response -- if a redirect, follow one time only if we're still on wordpress domain
  // following the through to next can end up with an infinite loop proxy
  if (upstreamRes.status > 300 && upstreamRes.status < 310) {
    const location = upstreamRes.headers.get('location');
    const locationURL = new URL(location, upstreamRes.url);

    // only continue following if still on WP domain
    if (locationURL.href.includes(WORDPRESS_URL)) {
      const locationURL = new URL(location, upstreamRes.url);
      const response2 = await fetch(locationURL, {
        redirect: 'manual',
      });
      content = await response2.text();
      contentType = response2.headers.get('content-type');
    } else {
      throw new Error(
        `abort proxy to non wordpress target ${locationURL.href} to avoid redirect loops`,
      );
    }
  } else {
    // no redirects, get original response text
    content = await upstreamRes.text();
    contentType = upstreamRes.headers.get('content-type');
  }

  // Pathnames where URLs within need to be replaced
  if (req.url.includes('sitemap') || req.url.includes('/feed/')) {
    content = _replace(content, HOSTNAME_REGEX, PUBLIC_URL);
  }

  if (req.url.includes('sitemap')) {
    // Change sitemap xsl file path to local
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1035198
    let sitemapFind = '//(.*)main-sitemap.xsl';
    let sitemapReplace = '/main-sitemap.xsl';
    const SITEMAP_XSL_REGEX = new RegExp(sitemapFind, 'g');
    content = _replace(content, SITEMAP_XSL_REGEX, sitemapReplace);
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'max-age=60');

  res.send(content);
}
