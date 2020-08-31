import Meta from "components/meta";
import Header from "components/header";
import Footer from "components/footer";

export default function Layout({ children, title, description, image }) {
  return (
    <>
      <Meta title={title} description={description} image={image} />
      <Header />
      {children}
      <Footer />
    </>
  );
}
