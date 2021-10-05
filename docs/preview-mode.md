## Goals

A requirement for seamless transition from traditional to headless WordPress is the ability to preview content without it being live to the public. WordPress has two common built-in workflows that we support in bubs:

- While creating content, you can set its publish status to "draft". Logged in users are able to view that content.
- Certain posts exist in both a published state and a previewed revision state. We need to support viewing of both.
- We wanted to make it easy and and secure to share a preview link on any content without requiring WordPress login.
- You can publish a password protected page (_Note: this is a future feature for us, see #122)._

We also wanted to mirror the ease of use for editors, via these two features:

- In WordPress, logged in users will bypass the cache when viewing content on the website. So if you make a change, hit publish to save, then go to the url, you'll see your change regardless of the URL.
- While logged in, you see a edit bar across the top of the page. This allows you to easily view and edit content without having to find it on the backend.

With the aggressive caching of Next.js/Vercel, it took some work to enable all of these. Below you'll find an overview of the setup, and how to enable in a way that works in production, but also locally and in a staging environment.

## Approach

Our goal with implementing this was to use built in Next.js and WordPress functionality as much as possible. For Next, that meant using their [Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode) feature which allows us to bypass the cache and generate the page on demand. We then followed the pattern in their [WordPress example](https://github.com/vercel/next.js/blob/canary/examples/cms-wordpress/lib/api.js) of checking the url for an authorization secret, and using that to enable access to draft content.

# Setup Instructions

1. On your production/staging WordPress (which isn't versioned and on WP Engine requires SFTP/SSH) open `wp-config.php`, scroll to the bottom, and add two variables which help configure preview mode. These are used to help secure the authentication tokens therefore need to be randomly generated for each project. [You can get a strong random key from GRC's passwords page.](https://www.grc.com/passwords.htm) Make sure both values are different.
```
define('HEADLESS_AUTH_SECRET', 'bubs-next-wp-auth-secret-key');
define('HEADLESS_API_SECRET', 'bubs-next-headless-secret-key');
```

2. Save `HEADLESS_API_SECRET` to Vercel as an environment variable, this is needed to authenticate API calls to WordPress to securely generate the logged in user's access token to activate preview mode. `HEADLESS_AUTH_SECRET` only lives inside WordPress to encrypt the access token, DO NOT copy/use this value outside of the setting in `wp-config.php`. Set `WORDPRESS_DOMAIN` to the root URL of the Wordpress instance (without /graphql)

3. Open `wordpress/wp-content/headless/functions.php` and edit the values for `$preview_domain` for production. 
Within staging, where we often use Vercel preview builds with different URLs, the Preview URL can be set in the Appearance > Customization section in the theme, under the "Headless" options heading. 

4. Preview mode should now work. You can test by logging into Wordpress admin, creating a post (but don't publish!) and then click "Preview". If it all works, you should be able to view your post with a black bar on the top of the page indicating preview mode is enabled.
