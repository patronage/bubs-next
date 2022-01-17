import { META } from 'lib/constants';
import { DefaultSeo } from 'next-seo';
import 'styles/global.scss';

export default function App({ Component, pageProps }) {
  return (
    // You can set sitewide <head> tags in the <Meta> component
    <>
      <DefaultSeo
        // titleTemplate={`%s | ${META.siteName}`}
        defaultTitle={META.siteName}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          site_name: META.siteName,
        }}
        twitter={{
          handle: META.twitterHandle,
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
