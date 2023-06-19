# Multisite

In version 1.4, we introduced the getSettings object, which allows you to configure the site's settings via a middleware function in addition to ENV variables. This allows you to configure the site's settings based on the current request, which is useful for multisite setups.

More to come on this approach in the future, but for now you can see more on the Vercel site on how they accomplish this:
https://vercel.com/guides/nextjs-multi-tenant-application#4.-configure-rewrites-for-multi-tenancy
