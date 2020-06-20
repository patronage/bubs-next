import { Helmet } from "react-helmet";
import Header from "components/header";
import Footer from "components/footer";

function LayoutDefault({ title, children }) {
  return (
    <>
      <Helmet title={title} meta={[{ property: "og:title", content: title }]} />

      <Header />

      {children}

      <Footer />
    </>
  );
}

export default LayoutDefault;
