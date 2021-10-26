import GlobalsContext from 'contexts/GlobalsContext';
import { META } from 'lib/constants';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useContext } from 'react';

export default function Meta({ title, description, image, seo }) {
  const globals = useContext(GlobalsContext);

  // if passing in a title string, append default append if defined in META.
  let generatedTitle = title ? `${title} ${META.titleAppend}` : '';

  // populate SEO settings with either our SEO values if present, otherwise passed in specifics
  let seoSettings = {
    title: seo?.title || generatedTitle,
    description: seo?.metaDesc || description,
    openGraph: {
      title: seo?.title || title,
      description: seo?.opengraphDescription || seo?.metaDesc,
    },
  };

  // check for passed in image from SEO object or image param. Otherwise check for global fallback
  let imageUrl;

  if (seo?.opengraphImage?.sourceUrl || image) {
    imageUrl = seo?.opengraphImage?.sourceUrl || image;
  } else if (globals?.seo.openGraph?.defaultImage?.sourceUrl) {
    imageUrl = globals.seo.openGraph.defaultImage.sourceUrl;
  }

  // if relative, make absolute so that social tools don't complain
  if (
    imageUrl.indexOf('http://') === 0 ||
    imageUrl.indexOf('https://') === 0
  ) {
    imageUrl = META.url + imageUrl;
  }

  if (imageUrl) {
    seoSettings.openGraph.images = [
      {
        url: META.url + imageUrl,
        width: 1200,
        height: 628,
      },
    ];
  }

  // defaults are fine, only set noindex or nofollow if explicit
  if (seo?.metaRobotsNoindex == 'noindex') {
    seoSettings.noindex = true;
  }
  if (seo?.metaRobotsNofollow == 'nofollow') {
    seoSettings.nofollow = true;
  }

  // console.log('seoSettings', JSON.stringify(seoSettings, null, 2));
  // console.log('seo', JSON.stringify(seo, null, 2));

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
        {/* <link rel="icon" href="/cropped-favicon-32x32.png" sizes="32x32" /> */}
        <link
          rel="icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <NextSeo {...seoSettings} />
    </>
  );
}
