Notes on WP conventions and local dev.

- Getting running locally
- Working with databases
- Working with ACF
- Working with images
  TODO:

* WP graphql
* ACF
* Composer and checking in Diffs
* Datbase notes

All plugins are managed via composer. The `headless` theme is configured to make some light adjustments to WordPress to support headless dev.

In `themes/headless/functions.php` there is a `$headless_domain` variable that should be defined for each site. This variable is used to redirect the user whenever they try and access a page URL from WordPress admin.
