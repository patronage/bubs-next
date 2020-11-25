import { staticPropHelper, staticPathGenerator } from "lib/archive";

import LayoutDefault from "components/layouts/LayoutDefault";
import PostArchive from "components/post/PostArchive";

function TaxIndex(props) {
  return (
    <LayoutDefault title="">
      <PostArchive archiveTitle={`Tag Archive`} {...props} />
    </LayoutDefault>
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
