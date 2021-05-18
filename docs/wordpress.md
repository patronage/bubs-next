Notes on WP conventions and local dev.

- Getting running locally
- Working with databases
- Working with ACF
- Working with images

## Theme

The `headless` theme is configured to make some light adjustments to WordPress to support headless dev.

In `themes/headless/functions.php` there is a `$headless_domain` variable that should be defined for each site. This variable is used to redirect the user whenever they try and access a page URL from WordPress admin.

## WordPress DB

We have a DB import script that will run and import the latest version of a database file that exists inside of `wordpress/_data`. After importing, it will run a `local.sql` file that resets a few variables and resets the admin login to `admin:password` for ease of local dev. You can customize local.sql to make additional ovverides if you want that are project specific.

## Updating Deps with Composer

To use, you must have composer running on your computer first. Afterwords you can

- `Wordpress Composer Install` task will install Wordpress Deps.
- Run the `Wordpress Composer Install` task to install Wordpress Deps.

Setup Wordpress by going into the `wordpress` folder and running `composer install && yarn install`. Then you can use `yarn dev` as an alias to start docker. 2. Setup Next by going into the `website` folder and pulling down env variables by running `vercel env pull` (see 'configuring vercel' if first time). Then run `vercel dev` to preview the site locally.

## New version of WordPresss

When you want to update wordpress core, you need to update the `wordpress/docker-compose.yml` file for Docker users. Then run `Wordpress Docker Recreate` task to rebuild your local container.

Also update `composer.json` so that non-docker users get the updated WP version.

## WYSIWYG Editor

There are several functions inside of `wordpress/wp-content/themes/headless/setup/helpers/wysiwyg.php` that can be enabled to:

- Customize the buttons shown
- Add classes users can apply to an element
- Modify the WYSIWYG with CSS. Our reccomendation isn't pixel perfection, but a p.small or p.large might have percentages to adjust from the defaults to give the editor a visual cue.

We set a default image width of full, so that you get a responsive image.

In `/website/src/components/post/PostBody.module.scss` we apply the WordPress WYSIWYG styles as global classes.
