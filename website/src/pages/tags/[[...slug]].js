import { staticPropHelper, staticPathGenerator } from "lib/archive";

const TaxonomyArchive = () => {
  return <div>Category</div>;
};

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

export default TaxonomyArchive;
