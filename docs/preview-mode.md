# Setup Preview Mode

Preview mode allows you to easily view the latest version of a post, bypassing the CDN, and allowing you to preview content that isn't yet published.

1. Get SFTP credentials on WP Engine and login with Transmit (or your favorite SFTP app). On production and staging, open `wp-config.php`, scroll to the bottom, and add two variables which help configure preview mode. These are used to help secure the authentication tokens therefore need to be randomly generated for each project. [You can get a strong random key from GRC's passwords page.](https://www.grc.com/passwords.htm) Make sure both values are different. Write down the value for `WORDPRESS_HEADLESS_SECRET` as you'll need to set it in one more place.
`define('WORDPRESS_AUTH_SECRET', 'bubs-next-wp-auth-secret-key');`
`define('WORDPRESS_HEADLESS_SECRET', 'bubs-next-headless-secret-key');`
Once these are both saved and you have the value of `WORDPRESS_HEADLESS_SECRET` written down, you can close the editor and SFTP app.
2. Save the value of `WORDPRESS_HEADLESS_SECRET` to the Vercel environment variable that correlates to the `wp-config.php` you just edited.
3. Open `wordpress/wp-content/headless/functions.php` and edit the values for `$preview_domain` for staging and production. The staging URL can be also be set from within the Wordpress dashboard under `Headless Settings` menu item, but make sure a generic preview URL is selected as a fallback. 
4. Preview mode should now work. You can test by logging into Wordpress admin, creating a post (but don't publish!) and then click "Preview". If it all works, you should be able to view your post with a black bar on the top of the page indicating preview mode is enabled.
