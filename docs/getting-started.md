# How to get up and running

Below are the different steps you can take to run Wordpress (back-end) and Next (front-end) of a site.

To make it easier to manage the various tasks you might need, we reccomend using [VS Code Tasks](https://code.visualstudio.com/docs/editor/tasks) we've configured.

In this doc we'll refer to the tasks by name, but you can also go to `.vscode/tasks.json` to see them, and run the commands directly in terminal if you'd like.

## Repo setup

We recommend using bubs-next as a project template. This will create a new repo based on the current code -- however this is a one time linkage. There is no way to pull future updates, but that is how we intend for the project to be used.

A few customization steps we reccomend for any site:

- Delete the `docs` folder.
- Customize the constants in `website/lib/constants.js` that set default SEO Meta tags.
- Update the image whitelist domains in `website/next.config.js`
- If your project is a private repo, go into `wordpress/.gitignore`, and comment out the first section assuming your project is private. This will check in all WordPress plugin source. If you are a public repo you can optionally adjust the `.gitignore` to only hide private deps.
- If your project is a private repo, you can add shared keys in `wordpress/composer.json` to make it easier for other devs to get started. For example `{%PLUGIN_ACF_KEY}` can be converted to a fixed key. Alternatively, you can set an ENV variable and leave this private.
- Update the `WORDPRESS_DB_NAME` env variable stored in `wordpress/docker-compose.yml` so that a new DB is created for the project. Also update the `WORDPRESS_DB_NAME` variable in `wordpress/_build/db.sh`.
- Update `.env.sample` so that new developers are able to base their `.env.local` off project specific values.

## Running Next

Traditionally it took some setup to get WordPress running, but since this approach makes WordPress content available via an API, we can now develop locally and read our live site's content.

The `Next Dev` task will launch a Next development environment against the WordPress url configured in `website/src/lin/constants.js`. It can be overriden in a .env file, see Developing WordPress below for more.

After starting, Next will be available at [http://localhost:3000](http://localhost:3000)

Next will live reload code changes, and only needs to be restarted after installing new dependencies, or making changes to the next.config.js file.

A `Next Yarn Install` task exists as a convencience alias for going into the website folder and running there. You must run once before starting any project.

## Developing WordPress

If you want adjust ACF fields, add post types, or do other WordPress configuration, you will need to install WordPress. We include a docker container version of WordPress for ease of local development. Alternatively, you can use local dev environment with PHP and MySql.

This section includes some details on starting WordPress, but you'll also want to see the [WP docs](wordpress.md) for more details on making version updates, customizing ACF and themes, and more.

The `WordPress Dev` task will start docker and will be available at [http://localhost:8000/wp-login.php](http://localhost:8000/wp-login.php). You can only have one docker container running on that port at a time, so you'll need to shut down other
