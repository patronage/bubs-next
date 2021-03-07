This is the starter Headless WordPress + [Next.js](https://github.com/vercel/next.js) used to build sites by [Patronage](https://www.patronage.org). We've previously built nearly a hundred sites using our original [Timber/twig based bubs scaffolding](https://github.com/patronage/bubs), but are favoring headless WordPress now.

### To get up and running locally:

#### Next.js

1. Go into the the `website` folder and run `yarn install` to install deps.
2. Run `yarn dev` to start up your website
3. Go to http://localhost:3000.

And that's it! You're now running a local version of Next powered by the production graphql for this site.

#### WordPress

Setting up WordPress is optional. If you're only doing front-end development or local review you can talk directly to your production install of WordPress.

However, if you're customizing WordPress and in particular ACF fields, you'll want a local version you can do development against.

We use a docker container to run WordPress without any need to mess with local MySQL or Apache. _You will need to [install composer](https://getcomposer.org/download/) to manage plugin dependencies_

1. Setup Wordpress by going into the `wordpress` folder and running `composer install && yarn install`.
2. Then you can use `yarn dev` as an alias to start docker.

You can now view your wordpress site at http://localhost:8000/wp-login.php. The user is `admin`, and the password is `pass`.

To connect your local Next website to WordPress, create a `website/.env` file, and save the following: `WORDPRESS_API_URL=http://localhost:8000/graphql`. You'll need to restart Next to pickup this change, then you're up and running.

See our [WordPress docs](https://github.com/patronage/bubs-next/blob/main/docs/wordpress.md) for more about how WordPress is used and customized.

### Docs

We maintain the following docs to help you get running. _When setting up a project locally, feel free to remove the `docs` folder._

- [Configuring WordPress and Next production and hosting](https://github.com/patronage/bubs-next/blob/main/docs/hosting.md).
- [Headless WordPress Development](https://github.com/patronage/bubs-next/blob/main/docs/wordpress.md).
- [Prettier, ESLint, and Stylelint for consistent code formatting](\* [Configuring WordPress and Next production and hosting](https://github.com/patronage/bubs-next/blob/main/docs/dvelopers.md).)
