This is the starter Headless WordPress + [Next.js](https://github.com/vercel/next.js) used to build sites by [Patronage](https://www.patronage.org). We've previously built nearly a hunred sites using our original theme based bubs scaffolding, but are favoring headless WordPress now (link to case study to come).

### To get up and running locally:

1. Setup Wordpress by going into the `wordpress` folder and running `composer install && yarn install`. Then you can use `yarn dev` as an alias to start docker.
2. Setup Next by going into the `website` folder and pulling down env variables by running `vercel env pull` (see 'configuring vercel' if first time). Then run `vercel dev` to preview the site locally.

### Configuring vercel

Vercel is the host for the site. It integrates with github to create preview versions from pull requests, and to deploy on master.

If it's your first time getting setup, you'll need to first accept an invite to the Patronage team for the project.

Then you'll need to install/configure the [vercel cli](https://vercel.com/docs/cli):

1. `npm install -g vercel
2. `vercel login` to login

After that, the first time you run a command, you'll need to pick a project via `vercel link`. Make sure you're using the team account from the cli to do that.

### Prettier/stylelint

We have prettier and stylelint configured to format JS and SCSS respectively for consistency across developers.

Prettier will run via husky pre-commit, and there is a command line `yarn stylelint` to see SCSS warnings across the project. But it's best to configure your editor with the plugins so that they run in the background on save.

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

### Env for local overrides

When you run `vercel env pull`, it'll save keys to a gitignored .env file. These are not neccessarily the production or preview environment keys, but ones specifically saved for devs.

Any variable can be optionally ovveridden in a `.env.local`. Here is an example you might use:

```sh
## Set a wordpress localhost path if you want to load from local
#WORDPRESS_API_URL="http://www.bailouts.loc/graphql"
```

### WordPress theme notes

All plugins are managed via composer. The `headless` theme is configured to make some light adjustments to WordPress to support headless dev.

In `themes/headless/functions.php` there is a `$headless_domain` variable that should be defined for each site. This variable is used to redirect the user whenever they try and access a page URL from WordPress admin.

If this is your first time with docker, there are more instructions for getting that running in `wordpress/README.md`.
