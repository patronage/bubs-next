import { staticPropHelper, staticPathGenerator } from "lib/archive";

import LayoutDefault from "components/layouts/LayoutDefault";
import PostArchive from "components/post/PostArchive";

function CategoryIndex(props) {
  return (
    <LayoutDefault title="">
      <PostArchive archiveTitle={`Category Archive`} {...props} />
    </LayoutDefault>
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
