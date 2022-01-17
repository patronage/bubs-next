# Backend Performance

With a traditional WordPress site, we've found the key to low-effort scaling to be static page caches for logged out users. This can be accomplished at the edge via a CDN like Cloudflare, on the server via a load balancer like Varnish, or via any number of plugins that save pages as temporary static HTML files.

Static sites have long been popular because the only option is static content served from edge CDNs — infinitely scalable and fast for end users. The major drawback is that by only touching the database on build time, content gets out of date requiring rebuilds.

The major advantage of Next is you can have both, infinitely scalable edge cached static content, and on demand single page rebuilds behind the scenes. This [stale-while-revalidate](https://vercel.com/docs/edge-network/caching#stale-while-revalidate) approach is great for our primary use case: infrequently updated content that needs to be fast and scale to any traffic.

The two slight drawbacks we've seen running Next + wp-graphql sites in production are:

- ACF flex queries can be pretty heavy. We've seen ~1000 page sites with complex ACF and several post types take 2 - 5 seconds to return data on a dedicated server (though this has gotten better as of [version 1.6](https://github.com/wp-graphql/wp-graphql/issues/1873))
- With short revalidation times, the background SWR requests will chew through Vercel's function execution time sitting there just waiting for origin response. If you try and solve with a longer revalidation time, you'll get editor confusion. [Preview Mode](preview-mode.md) can help editors see content, but they expect published content to show up for logged out users quickly.

To address these, we've incorporated and recommend adding graphql caching via [GraphCDN](https://graphcdn.io/). This allows cached queries to return in < 20 ms, which is great for things like global menus and options which are called on every page. We've also added support for cache invalidation on publish, which allows you to keep content on the edge longer. All this allows us to have 60 second revalidate time on the Next side, with much longer graphql caches that cut origin requests by 90%+.

## Enabling GraphCDN

To enable, you'll create a new account/service here: [https://graphcdn.io/](https://graphcdn.io/).

During setup, you’ll be asked if your app has authenticated users. Our reccomendation (and how our defaults are configured) is not to check the box, and to have authenticated requests go directly to the origin, while only public requests go through their CDN. This is accomplished by setting [bypass headers](https://docs.graphcdn.io/docs/bypass-headers) on all authenticated requests.

When setting up, you'll need to point to your existing endpoint. We recommend turning on GraphQL introspection ([see security consideration](https://www.wpgraphql.com/docs/security/#introspection-disabled-by-default)), even if only temporarily. This will let the CDN store a copy of your schema.

### GraphCDN Service Required Configuration

In the future we might document advanced configuration, but the default rule to cache everything for PUBLIC users for 900 seconds has worked well for us.

To enable locally for testing, set the `WORDPRESS_API_URL` env variable in your `.env.local` to the graphql endpoint.

To enable in production, change the same env variable via Vercel's ENV settings.

To bypass the CDN for authenticated requests, set a bypass header for `x-preview-token`.

## Purging on publish with webhooks

Inside of `helpers/webhookds.php` we've written a small script that processes these WP events:

- Post create/update/delete
- Page create/update/delete
- Menu changes
- Updates to our default theme options.
- Updated to redirects for either Redirection or Yoast Premium.

There are configuration variables at the top of `functions.php`, prefixed with `$headless_webhooks_` where you can customize for your instance. One common customization is to add any custom post types you might have to the array of `$headless_webhooks_post_types`

When these events happen, a webhook will ping an API route in Next that sends a purge request to the Graph CDN. By default it's a simple `purgeAll` call, which is good enough on most sites that infrequently publish. For larger sites you might want to selectively purge content with some custom logic.

To activate purging on publish, you'll need to get an API key and save it to a `GRAPHCDN_PURGE_API_TOKEN` and also set `GRAPHCDN_PURGE_API_URL` in Vercel ENV variables.

## Debugging Graph CDN cache

Inside of the Graph CDN interface is a helpful "API playground" where you can inspect and test cache statuses.

You can try for example running a query, confirming successful `HIT` cache status, then update content in WordPress. When you rerun the query from the playground the status should change to `MISS`

## Future

Something we're keeping our eye on is the ability to invalidate the vercel edge cache via the same webhook we use to invalidate GraphCDN. This will allow us to lengthen the amount of time Vercel uses before revalidating.

[https://nextjs.org/blog/next-9-5#stable-incremental-static-regeneration](https://nextjs.org/blog/next-9-5#stable-incremental-static-regeneration)
