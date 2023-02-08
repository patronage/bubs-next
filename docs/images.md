# Images

One of the biggest performance wins for Next comes from the [next/image](https://nextjs.org/docs/api-reference/next/image) component co-authored with Google which encourages best practices like responsive loading via srcset, lazy loading, and more.

Additionally, bundled is [automatic image optimization](https://nextjs.org/docs/basic-features/image-optimization) via an API for resizing and serving images in WebP format without a need for third party services.

Here is how we combine those features with WordPress to provide scalable image management.

## Next Implementation

To help with lazy loading, the `flex.js` module passes in an index variale so you know if your module is one of the first two on the page. If so, we set `{priority=true}` so the image [gets preloaded](https://nextjs.org/docs/api-reference/next/image#priority).

### Responsive Images

Much image optimization is taken care of out of the box, but take note of this from the [next/image docs](https://nextjs.org/docs/api-reference/next/image#sizes):

> We recommend setting sizes when using layout="responsive" or layout="fill" and your image will not be the same width as the viewport.

Say an image is in a container, or in a column with a known max width, you can set something like this: `sizes="(min-width: 480px) 480px, 100vw"`. If an image will never be wider than 480px in this instance, you won't load a 100% width version.

### Bootstrap Sizing

Inside of `next.config.js`, we include common ratios that match the [Bootstrap grid](https://getbootstrap.com/docs/5.1/layout/grid/#grid-tiers).

## WordPress Image Sizing

One of the key requirements for next/image is to provide height and width dimensions, and WordPress helpfully provides those dimensions for us. WordPress also allows for defining custom alt text which we utilize.

In terms of sizing, WordPress comes with basic tools to set cropping thumbnails. ACF builds on these, allowing you to give the editor direction on what ratio you're looking for.

Inside of our headless theme is an `images.php` file that allows you to set these custom dimensions per site.

### Social Thumbnail Ratio

We've set a default thumbnail ratio that corresponds to Facebook's recommended image dimensions of 1200 x 628. This default thumbmnail is also used to power your yoast open graph meta tags by default. This can be customized, and editors can add custom graphics, but we find that this default thumbnail is typically all that is populated, so we wanted it to be social friendly by default.

### Additional Aspect Ratios

Additional aspect ratios can be defined in `images.php`. Anything that gets added can then be retrived via graphql, for example: `sourceUrl(size: SOCIAL)`. Be careful when setting these not to expect consistent output -- if an uploaded file is smaller than one of the provided dimensions, WordPress won't force an exact ratio.

### Image Retrieval and local dev

In the past we struggled with managing/accessing images in different environments, but by developing against content on our production site, this is largely solved.

Locally, we're able to experiment with different image sizes, and nothing needs to change on the server, all resizing happens locally.

If you're developing against local WordPress graphql, things will work similarly, only the images are served from your local WordPress host.

The only thing you need to make sure you've done is whitelisted local and public image locations in `next.config.js`.

If you need to export your images, locally, see the `Wordpress` docs for details on how to export.

### Elastic Storage

The one thing we've run into is large sites with increasingly large images storage requirements. On cloud hosts, this storage is often surprisingly limited.

We include and tend to use the [wp-stateless](https://wordpress.org/plugins/wp-stateless/) plugin to save files directly to Google Cloud. [Similar Plugins](https://wordpress.org/plugins/amazon-s3-and-cloudfront/) exist for AWS storage.

### Custom Loaders

Inside of `lib/image-loaders` we include a call to load in a [custom image loader](https://nextjs.org/docs/basic-features/image-optimization#loader) if you'd like. `nextLoader` is a utility we use to proxy images through the local next images path should you need to proxy an image outside of `next/image` (for example to resize for meta tags).

## Future Items

Future things we're looking into that we might add:

- low quality blur images: https://github.com/patronage/bubs-next/issues/110
- extracting images from WP wysiwyg and rendering them: https://github.com/patronage/bubs-next/issues/8
