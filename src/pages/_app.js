import { Helmet } from "react-helmet";

import "styles/global.scss";

// You can set sitewide <head> tags in the <Helmet> below
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Helmet
        htmlAttributes={{ lang: "en" }}
        title="Hello next.js!"
        meta={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1",
          },
        ]}
        link={[
          {
            rel: "stylesheet",
            href:
              "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
          },
        ]}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
