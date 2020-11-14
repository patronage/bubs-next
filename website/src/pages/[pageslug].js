import Layout from "components/layout";
import { getPage, getAllPagesWithSlug } from "lib/wordpress";
import ErrorPage from "next/error";
import PostBody from "components/post/body";

export default function Page({ post, preview }) {
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
  const data = await getPage(params.pageslug, preview, previewData);

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
