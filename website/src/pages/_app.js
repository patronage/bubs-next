import 'styles/global.scss';

export default function App({ Component, pageProps }) {
  return (
    // You can set sitewide <head> tags in the <Meta> component
    <>
      <Component {...pageProps} />
    </>
  );
}
