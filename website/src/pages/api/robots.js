import { getSettings } from 'lib/getSettings';
import { trimTrailingSlash } from 'lib/utils';

export default function handler(req, res) {
  const SETTINGS = getSettings({ ...req });

  const publicUrl = trimTrailingSlash(
    `https://${SETTINGS.CONFIG.site_domain}`,
  );
  const sitemap = publicUrl + '/sitemap_index.xml';
  // let sitemap = trimTrailingSlash(META.url) + '/sitemap_index.xml';

  if (
    process.env.VERCEL_ENV === 'production' &&
    !process.env.NOINDEX
  ) {
    res.write(`Sitemap: ${sitemap}`);
    res.write('\n');
    res.write('User-agent: *');
    res.write('\n');
    res.write('Allow: /');
    res.write('\n');
    res.write('Disallow: /api');
    res.send();
  } else {
    res.write('User-agent: *');
    res.write('\n');
    res.write('Disallow: /');
    res.send();
  }
}
