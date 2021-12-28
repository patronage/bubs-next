# SEO

## Web performance

Optimizing websites for speed is one of our core reasons for pursuing a headless approach with WordPress. Since 2018, [page speed has been a factor for Google](https://developers.google.com/web/updates/2018/07/search-ads-speed) in ranking both paid search and ads. In 2021, it took on increased prominence in organic results with an increased emphasis on [Core Web Vitals and page experience](https://developers.google.com/search/blog/2021/04/more-details-page-experience).

Next.js does much of this for us out of the box, but there are a few things to be aware of with our implementation.

- Using [next/image](https://nextjs.org/docs/api-reference/next/image) to generate responsive images. For more, read our image handling docs.
- Using [next/link](https://nextjs.org/docs/api-reference/next/link) to handle transitions between pages.

## Per page meta tags

The primary way we tackle this is to combine the [WordPress Yoast SEO plugin](https://yoast.com/wordpress/plugins/seo/) with [next-seo](https://github.com/garmeeh/next-seo) to allow editors to populate each page with unique meta tags optimized for both search and social networks.

Inside of our [Meta component](../website/src/components/Meta.js), we merge together defaults defined in `lib/constants.js` and merge in passed in yoast data pulled from graphql via globals context.

Inside of the constants file, you'll want to set per site values like site name and favicons. An important variable to set is the `META.url` to the production domain. This is used to rewrite relative images and relative links from sitemaps and feeds so that those are only indexed from your production URL.

## Sitemaps and RSS Feeds

One approach to sitemaps is to [generate them in Next](https://www.npmjs.com/package/next-sitemap). You can similarly create a feed using [some custom code](https://ashleemboyer.com/how-i-added-an-rss-feed-to-my-nextjs-site) and the feed npm package.

We find however that WordPress already does a great job at this, including specific support for features like Google News indexing through a variety of well tested plugins. We've therefore implemented a lightweight proxy that grabs sitemap files from WordPress, serving them on your domain direct to search engines. Inside of [next.config.js](../website/next.config.js) we set a couple rewrites that point any requests to `*sitemap.xml` or `feed*` and retrieve them from the WordPress origin. We rewrite any absolute links so that they point to your next.js public domain.

## Further reading

- [Lighthouse SEO audits](https://web.dev/lighthouse-seo/)
- [Next.js introduction to SEO](https://nextjs.org/learn/seo/introduction-to-seo/importance-of-seo)
- Next.js 12 [bot aware ISR fallback](https://nextjs.org/blog/next-12#bot-aware-isr-fallback)
- [Core web vitals report](https://support.google.com/webmasters/answer/9205520?hl=en)
- [Vercel Analytics](https://vercel.com/analytics)
