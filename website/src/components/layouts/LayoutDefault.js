import Footer from 'components/Footer';
import Header from 'components/Header';
import Meta from 'components/Meta';
import PreviewModeBar from 'components/PreviewModeBar';

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
  return (
    <>
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
