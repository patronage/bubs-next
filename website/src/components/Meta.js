import GlobalsContext from 'contexts/GlobalsContext';
import { META } from 'lib/constants';
import { nextLoader } from 'lib/image-loaders';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useContext } from 'react';

export default function Meta({ title, description, image, seo }) {
  const globals = useContext(GlobalsContext);

  let seoSettings = {
    title: seo?.title || title ? `${title} ${META.titleAppend}` : '',
    description: seo?.metaDesc || description,
    openGraph: {
      title: seo?.title || title,
      description: seo?.opengraphDescription || seo?.metaDesc,
    },
  };

  let imageUrl;

  // check for passed in image from SEO object or image param. Otherwise check for global fallback
  if (seo?.opengraphImage?.sourceUrl || image) {
    imageUrl = nextLoader({
      src: seo?.opengraphImage?.sourceUrl || image,
      width: 1200,
      height: 628,
    });
  } else if (globals?.seo.openGraph?.defaultImage?.sourceUrl) {
    imageUrl = nextLoader({
      src: globals.seo.openGraph.defaultImage.sourceUrl,
      width: 1200,
      height: 628,
    });
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
