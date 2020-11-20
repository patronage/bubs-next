import { staticPropHelper, staticPathGenerator } from "lib/archive";

import Layout from "components/layout";
import PostArchive from "components/post-archive";

function TaxIndex(props) {
  return (
    <Layout title="">
      <PostArchive archiveTitle={`Tag Archive`} {...props} />
    </Layout>
  );
}

export async function getStaticProps(context) {
  const indexProps = await staticPropHelper(context, "tag");

  if (indexProps) {
    return { props: indexProps };
  }

  return {
    props: {
      notfound: true,
    },
  };
}

export async function getStaticPaths() {
  const paths = await staticPathGenerator("tag");

  return {
    paths,
    fallback: false,
  };
}

export default TaxIndex;
