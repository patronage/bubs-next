One of the nice aspects of headless dev compared to traditional wordpress dev is that having a running WP locally becomes optional. Your local Next.js server can easily consume production or staging graphql endpoints with a simple ENV variable adjustment.

Sometimes you will want a local WP instance, for example when adding new ACF fields, WordPress post types, or testing out plugins.

We rely on Docker for this, and below are some details on getting up and running locally.

- Getting running locally
- Working with databases
- Working with ACF
- Working with images

## Docker

Inside of the WordPress folder is a docker-commpose.yml file that will spin up a basic WordPress image with a MariaDB database (this is better for Apple Silicon Macbooks).

The VS Code task `WordPress Docker Recreate` can be run from the task runner as an alias to get your container started.

Inside of the WordPress folder you'll find a .env.sample. You'll want to copy that to .env, and setup a unique database name for the project.

## Managing WP deps with Composer

We tend to checkin our WP plugins to github if using a private repo. However for this open source repo, we don't. You'll want to remove those lines from the top of .gitignore inside the wordpress folder.

If the plugins are not checked in, you'll need to install them with the VS Code task `Wordpress Composer Install`.

To update plugins, you can update their versions in the composer.json file, and then run the VS Code task `Wordpress Composer Update` task to install Wordpress Deps.

## New version of WordPresss

When you want to update wordpress core, you need to update the `wordpress/docker-compose.yml` file for Docker users. Then run `Wordpress Docker Recreate` task to rebuild your local container.

Also update `composer.json` so that non-docker users get the updated WP version.

## WordPress DB

If you want to pull down your DB from production to mirror locally, there is a DB import script that will run and import the latest version of a database file that exists inside of `wordpress/_data`. After importing, it will run a `local.sql` file that resets a few variables and resets the admin login to `admin:password` for ease of local dev. You can customize local.sql to make additional ovverides if you want that are project specific.

This script can be run via the VS Code task `Wordpress DB Import`

## Theme

The `headless` theme is configured to make some light adjustments to WordPress to support headless dev.

In `themes/headless/functions.php` there is a few variables that should be defined for each site.

Additionally there is a theme option under the `Headless` menu where you can set the URL of your front-end. This variable is used to redirect the user whenever they try and access a page URL from WordPress admin, or should a user stumble on a url using your wordpress domain.

## WYSIWYG Editor

There are several functions inside of `wordpress/wp-content/themes/headless/setup/helpers/wysiwyg.php` that can be enabled to:

- Customize the buttons shown
- Add classes users can apply to an element
- Modify the WYSIWYG with CSS. Our reccomendation isn't pixel perfection, but a p.small or p.large might have percentages to adjust from the defaults to give the editor a visual cue.

We set a default image width of full, so that you get a responsive image.

In `/website/src/components/post/PostBody.module.scss` we apply the WordPress WYSIWYG styles as global classes.
