import { GA_TRACKING_ID } from 'lib/gtag';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
          <link
            rel="preconnect"
            href="https://www.googletagmanager.com"
            crossOrigin="true"
          />
          <link
            rel="preconnect"
            href="https://www.google-analytics.com"
            crossOrigin="true"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com/"
            crossOrigin="true"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Roboto+Slab:wght@300&family=Source+Sans+Pro:wght@400;700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
