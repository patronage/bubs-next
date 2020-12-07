# Next Hosting with Vercel

Vercel are the makers of Next, and the host we most commonly use. Vercel comes with all the CDN support to optimize for Next's various [data fetching](https://nextjs.org/docs/basic-features/data-fetching) options, and [Github integration](https://vercel.com/docs/git/vercel-for-github) to automatic deployment from Git branches.

There are a few configuration settings you'll want to set when using Bubs Next.

## ENV Variables

These ENV variables need to be set:

- `WORDPRESS_API_URL` : the hosted wordpress grapqhl endpoint
- `NPM_ONLY_PRODUCTION` : `1` -- We don't need linters or Husky dependencies

## Monorepo Considerations

We setup WordPress and Next in a single repository. In order for Vercel to build the site from the `website` folder, you'll need to use their [monorepo functionality](https://vercel.com/blog/monorepos) to configure the different Root Directory.

### Skipping non-relevant Builds

With the Github integration, every commit generates a preview. Those aren't needed on commits outside of `website`, which can be setup by configuring the [ignored build step](https://vercel.com/docs/platform/projects#ignored-build-step) to have a value of `git diff HEAD^ HEAD --quiet .`
