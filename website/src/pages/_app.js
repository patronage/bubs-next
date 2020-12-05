import * as gtag from 'lib/gtag';
import Router from 'next/router';
import { useEffect } from 'react';
import 'styles/global.scss';

export function reportWebVitals({ id, name, label, value }) {
  let vitalEvent = {
    category:
      label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    action: name,
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  };

  gtag.event(vitalEvent);
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Google analytics:
    // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };

    Router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    // You can set sitewide <head> tags in the <Meta> component
    <>
      <Component {...pageProps} />
    </>
  );
}
