import Footer from 'components/Footer';
import Header from 'components/Header';
import Meta from 'components/Meta';
import PreviewModeBar from 'components/PreviewModeBar';
import GlobalsContext from 'contexts/GlobalsContext';
import { DefaultSeo } from 'next-seo';
import { useContext } from 'react';

export default function LayoutDefault({
  children,
  title,
  description,
  image,
  seo,
  postId,
  isRevision,
  preview,
}) {
  const globals = useContext(GlobalsContext);
  const THEME = globals.THEME;

  return (
    <>
      <DefaultSeo
        defaultTitle={THEME?.meta?.siteName}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          site_name: THEME?.meta?.siteName,
        }}
        twitter={{
          handle: THEME?.meta?.twitterHandle,
          cardType: 'summary_large_image',
        }}
      />
      <Meta
        title={title}
        description={description}
        image={image}
        seo={seo}
      />
      {preview && (
        <PreviewModeBar postId={postId} isRevision={isRevision} />
      )}
      <Header />
      {children}
      <Footer />
    </>
  );
}
