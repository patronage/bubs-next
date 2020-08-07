import Head from "next/head";
import { META_TITLE, META_OG_IMAGE_URL } from "lib/constants";

export default function Meta({ title, description, image }) {
  let meta_title = title ? `${title} | ${META_TITLE}` : META_TITLE;
  let meta_image = image
    ? `${image} | ${META_OG_IMAGE_URL}`
    : META_OG_IMAGE_URL;

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      {/* search */}
      <title>{meta_title}</title>
      {description && <meta name="description" content={description} />}
      {/* og/facebook */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title ? title : META_TITLE} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={meta_image} />}
      <meta property="og:site_name" content={META_TITLE} />
      <meta property="og:image" content={meta_image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="600" />
      {/* twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title ? title : META_TITLE} />
      {description && (
        <meta property="twitter:description" content={description} />
      )}
      <meta property="twitter:image" content={meta_image} />
      {/* favicons */}
      <link rel="icon" href="/cropped-favicon-32x32.png" sizes="32x32" />
      <link rel="icon" href="/cropped-favicon-192x192.png" sizes="192x192" />
      <link rel="apple-touch-icon" href="/cropped-favicon-180x180.png" />
    </Head>
  );
}
