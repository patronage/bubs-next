import { META } from 'lib/constants';
import { trimTrailingSlash } from 'lib/utils';

export default function handler(req, res) {
  if (
    process.env.VERCEL_ENV === 'production' &&
    !process.env.NOINDEX
  ) {
    let sitemap = trimTrailingSlash(META.url) + '/sitemap_index.xml';

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
