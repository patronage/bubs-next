import Meta from "components/Meta";
import Header from "components/Header";
import Footer from "components/Footer";

export default function LayoutDefault({ children, title, description, image }) {
  return (
    <>
      <Meta title={title} description={description} image={image} />
      <Header />
      {children}
      <Footer />
    </>
  );
}
