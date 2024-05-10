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

## Purging on publish with Stellate and Vercel On-Demand Revalidation

We're using the Stellate Wordpress plugin to purge the Stellate cache on publish. It's a simple plugin that hooks into the `save_post` action in WordPress and purges the Stellate cache on a per-post basis. We also add custom hooks to purge the redirect cache using the Redirection Wordpress plugin and to purge our ACF Theme Settings when updated.

The stellate plugin provides a callback function with any post ids and types that we're invalidated and we use this function to get the paths of any pages that were cleared from the Stellate cache and send a request to the `/api/revalidate` endpoint to also call Vercel's On-Demand Revalidation on the affected paths.

In order to call the `/api/revalidate` endpoint, we need to set the `HEADLESS_REVALIDATE_SECRET` environment variable in Vercel and in the `wp-config.php` file in our WordPress install. This should be a secure, random string that will be used to authenticate the request.

If everything is working correctly, then after you make a change in WordPress, you should see a WPStellateIntegration purging request inside of the stellate admin.

Then on the Vercel logs, you should see a 200 request on calls to /api/revalidate/

## Debugging Graph CDN cache

Inside of the Graph CDN interface is a helpful "API playground" where you can inspect and test cache statuses.

You can try for example running a query, confirming successful `HIT` cache status, then update content in WordPress. When you rerun the query from the playground the status should change to `MISS`
