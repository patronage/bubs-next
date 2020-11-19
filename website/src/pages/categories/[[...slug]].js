import { staticPropHelper, staticPathGenerator } from "lib/archive";

import Layout from "components/layout";
import PostArchive from "components/post-archive";

function CategoryIndex(props) {
  return (
    <Layout title="">
      <PostArchive archiveTitle={`Category Archive`} {...props} />
    </Layout>
  );
}

export async function getStaticProps(context) {
  const indexProps = await staticPropHelper(context, "category");

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
  const paths = await staticPathGenerator("category");

  return {
    paths,
    fallback: false,
  };
}

export default CategoryIndex;
