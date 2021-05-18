Any self-hosted software comes with security obligations. Especially so with WordPress, which as the most popular CMS on the web is highly targeted with hack attempts.

As Next.js serves your front-end content, and in our configuration does most if not all requests server-side, most automated attacks won't know where to look. They will attempt a request to yourdomain.com/wp-login.php fail, then they'll go away.

But we still need to secure the graphql connection, and the WP admin interface.

## Keeping software up to date

Managed WordPress from WP Engine or Pantheon for example will go a long way by keeping your production install. As WordPress specialized hosts, they also have expertise at [taking steps to lock WordPress down](https://wpengine.com/blog/11-top-wordpress-security-concerns-how-wp-engine-takes-care-of-them-for-you/).

## Securing Graphql

We're still figuring out what we want to implement in our bubs opinionated default.

Here are some resources we're reviewing:

- https://www.wpgraphql.com/docs/authentication-and-authorization/
- https://github.com/wp-graphql/wp-graphql/blob/develop/docs/security.md
- https://github.com/wp-graphql/wp-graphql/issues/1896

## WordPress logins and Google Auth

To help lock down WordPress, we typically will enable and configure the [Google Apps Login](https://wordpress.org/plugins/google-apps-login/) plugin. There are two optional configurations in bubs which are disabled by default, but which can be enabled to add extra security.

1. In `wordpress/functions.php`, you can enable `google-login-force.php`. In production, this will redirect logged out traffic to a google login prompt. This helps obscure your email/password login form from bots. Only enable if 100% of login emails have google accounts at the same email.

2. In `wordpress/functions.php`, you can enable `password-rotation.php`. This will reset all user passwords to secure defaults every few hours (however often the `wp_version_check` is configured).

3. In our opinion, the WordPress XMLRPC functionality should be disabled, and only enabled if needed. Some hosts help here, but we want to make sure so we disable the WP xmlrpc functionality. You can renable by commenting out `xmlrpc-disable.php`.

## Audit Logs

We've included the [Simple History](https://wordpress.org/plugins/simple-history/) plugin as an audit log for WordPress activity. This can be useful to retrace steps should anything happen -- whether that's a malicuous attack, or a content editor deleting something they shouldn't have.
