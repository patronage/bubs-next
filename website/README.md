This app is based on [Next.js](https://github.com/vercel/next.js)

To get up and running locally:

1. clone repo.
2. run `yarn install` to get all deps.
3. pull down env variables by running `vercel env pull` (see 'configuring vercel' if first time).
4. run `vercel dev` to preview the site locally.

### configuring vercel

Vercel is the host for the site. It integrates with github to create preview versions from pull requests, and to deploy on master.

If it's your first time getting setup, you'll need to first accept an invite to the Patronage team for the project.

Then you'll need to install/configure the [vercel cli](https://vercel.com/docs/cli):

1. `npm install -g vercel
2. `vercel login` to login

After that, the first time you run a command, you'll need to pick a project via `vercel link`. Make sure you're using the team account from the cli to do that.

### prettier/stylelint

We have prettier and styleling configured to format JS and SCSS respectively for consistency across developers.

Prettier will run via husky pre-commit, and there is a command line `yarn stylelint` to see SCSS warnings across the project. But it's best to configure your editor with the plugins so that they run in the background on save.

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

### env for local overrides

When you run `vercel env pull`, it'll save keys to a gitignored .env file. These are not neccessarily the production or preview environment keys, but once specifically saved for devs.

Any variable can be optionally ovveridden in a `.env.local`. Here are a few you might use:

```sh
## Set a wordpress localhost path if you want to load from local
#WORDPRESS_API_URL="http://www.bailouts.loc/graphql"
```
