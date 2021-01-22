## Vercel

Vercel are the makers of Next.js, have have a hosting platform that allows for the creation of hybrid dynamic and static sites. It integrates with github to create preview versions from pull requests, and to deploy on master.

### Project setup

- monorepo setup
- ignoring non-relevant builds

### Vercel CLI

While not required, the Vercel CLI can help by allowing you to deploy to production from local (in case Github is down or not in use). It also has a `vercel dev` command that\_

To install/configure the [vercel cli](https://vercel.com/docs/cli):

1. `npm install -g vercel
2. `vercel login` to login

After that, the first time you run a command, you'll need to pick a project via `vercel link`.

We use a [monorepo](https://vercel.com/blog/monorepos) repo structure, so you'll want to run `vercel link` from the project root.

_Note: If you're workign in a team project, you'll need to first except a team invite. When linking, you'll want to make sure you're picking the team name._

### Pulling down ENV Variables

One benefit of linking with the CLI is that you can pul down ENV variables that may have been configured for local dev. You can do this by running `vercel env pull`.

## WP Engine

- Configuring for Build
