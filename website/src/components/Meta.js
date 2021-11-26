import GlobalsContext from 'contexts/GlobalsContext';
import { META, WORDPRESS_URL } from 'lib/constants';
import { trimTrailingSlash } from 'lib/utils';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useContext } from 'react';

export default function Meta({ title, description, image, seo }) {
  const globals = useContext(GlobalsContext);

  // make sure image is absolute
  function imagePath(imageUrl) {
    // if enabled rewrite WordPress image paths to local (origin often has noindex tags)
    if (META.proxyWordPressImages && WORDPRESS_URL) {
      let newUrl = imageUrl.replace(WORDPRESS_URL, '');
      imageUrl = newUrl;
    }
    // if root relative, make absolute so that twitter doesn't complain
    if (
      imageUrl.indexOf('http://') === -1 &&
      imageUrl.indexOf('https://') === -1 &&
      META.url &&
      imageUrl.startsWith('/')
    ) {
      imageUrl = trimTrailingSlash(META.url) + imageUrl;
    }

    return imageUrl;
  }

  // if passing in a title string, append default append if defined in META.
  let generatedTitle = title ? `${title} ${META.titleAppend}` : '';

  // populate SEO settings with either our SEO values if present, otherwise passed in specifics
  let seoSettings = {
    title: seo?.title || generatedTitle,
    description: seo?.metaDesc || description,
    openGraph: {
      title: seo?.opengraphTitle || seo?.title || title,
      description:
        seo?.opengraphDescription || seo?.metaDesc || description,
    },
  };

  // check for passed in image from SEO object or image param. Otherwise check for global fallback
  let imageUrl;

  if (seo?.opengraphImage?.sourceUrl || image) {
    imageUrl = seo?.opengraphImage?.sourceUrl || image;
  } else if (globals?.seo.openGraph?.defaultImage?.sourceUrl) {
    imageUrl = globals.seo.openGraph.defaultImage.sourceUrl;
  }

  if (imageUrl) {
    seoSettings.openGraph.images = [
      {
        url: imagePath(imageUrl),
        width: 1200,
        height: 628,
      },
    ];
  }

  // set noindex or nofollow if explicitly defined in Yoast
  if (seo?.metaRobotsNoindex == 'noindex') {
    seoSettings.noindex = true;
  }
  if (seo?.metaRobotsNofollow == 'nofollow') {
    seoSettings.nofollow = true;
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
          key="meta_viewport"
        />
        <meta charSet="utf-8" key="meta_charset" />
        {/* favicons */}
        {META.icon32 && (
          <link rel="icon" href={META.icon32} sizes="32x32" />
        )}
        {META.iconApple && (
          <link
            rel="apple-touch-icon"
            href={META.iconApple}
            sizes="180x180"
          />
        )}
        {/* twitter specific meta if defined */}
        {seo?.twitterTitle && (
          <meta
            property="twitter:title"
            content={seo.twitterTitle}
            key="meta_twitter_title"
          />
        )}
        {seo?.twitterDescription && (
          <meta
            property="twitter:description"
            content={seo.twitterDescription}
            key="meta_twitter_description"
          />
        )}
        {seo?.twitterImage?.sourceUrl && (
          <meta
            property="twitter:image"
            content={imagePath(seo.twitterImage.sourceUrl)}
            key="meta_twitter_image"
          />
        )}
      </Head>
      {/* pass customized SEO object to NextSeo to render all other tags */}
      <NextSeo {...seoSettings} />
    </>
  );
}
