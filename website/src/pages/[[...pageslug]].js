import Layout from "components/layout";
import { getPage, getAllPagesWithSlug } from "lib/wordpress";
import ErrorPage from "next/error";
import PostBody from "components/post/body";

export default function Page({ post, preview, isHome }) {
  // check if homepage
  // you can remove this if you've defined a homepage in wordpress
  if (isHome) {
    return (
      <Layout title="">
        <section className="section-padded">
          <div className="container">
            <div className="row">
              <div className="col">
                <h3>Home Page</h3>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout
      preview={preview}
      title={post?.title}
      image={post?.featuredImage?.sourceUrl}
    >
      <section className="section-padded">
        <div className="container">
          <div className="row">
            <div className="col">
              <PostBody content={post.content} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps({ params, preview = false, previewData }) {
  // if your homepage doesn't come from WP, you need this to custom render and not get a 404
  // next doesn't let you have index.js and [[...pageslug.js]]
  if (!params.pageslug?.length) {
    return {
      props: {
        isHome: true,
      },
    };
  }

  let slug = "/";
  if (params.pageslug?.length) {
    slug += params.pageslug.join("/");
  }

  const data = await getPage(slug, preview, previewData);

  return {
    props: {
      preview,
      post: data.pageBy,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllPagesWithSlug();

  return {
    paths: allPosts.edges.map(({ node }) => `/${node.slug}`) || [],
    fallback: "blocking",
  };
}
