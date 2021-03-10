import { META } from 'lib/constants';
import { nextLoader } from 'lib/image-loaders';
import { NextSeo } from 'next-seo';
import Head from 'next/head';

export default function Meta({ title, description, image, seo }) {
  let seoSettings = {
    title: seo?.title || title ? `${title} ${META.titleAppend}` : '',
    description: seo?.metaDesc || description,
    openGraph: {
      title: seo?.title || title,
      description: seo?.opengraphDescription || seo?.metaDesc,
    },
  };

  if (seo?.opengraphImage?.sourceUrl || image) {
    let imageUrl = nextLoader({
      src: seo?.opengraphImage?.sourceUrl || image,
      width: 1200,
      height: 628,
    });

    seoSettings.openGraph.images = [
      {
        url: META.url + imageUrl,
        width: 1200,
        height: 628,
      },
    ];
  }

  // console.log('seo', JSON.stringify(seoSettings, null, 4));

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
