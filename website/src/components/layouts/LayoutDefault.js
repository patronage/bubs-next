import Footer from 'components/Footer';
import Header from 'components/Header';
import Meta from 'components/Meta';

export default function LayoutDefault({
  children,
  title,
  description,
  image,
}) {
  return (
    <>
      <Meta title={title} description={description} image={image} />
      <Header />
      {children}
      <Footer />
    </>
  );
}
