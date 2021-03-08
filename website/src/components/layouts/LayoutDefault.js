import Footer from 'components/Footer';
import Header from 'components/Header';
import Meta from 'components/Meta';

export default function LayoutDefault({
  children,
  title,
  description,
  image,
  seo,
}) {
  return (
    <>
      <Meta
        title={title}
        description={description}
        image={image}
        seo={seo}
      />
      <Header />
      {children}
      <Footer />
    </>
  );
}
