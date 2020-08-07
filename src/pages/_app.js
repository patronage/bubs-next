import "styles/global.scss";

// You can set sitewide <head> tags in the <Helmet> below
export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
