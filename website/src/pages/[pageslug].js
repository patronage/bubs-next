import Layout from "components/layout";
import { getPage, getAllPagesWithSlug } from "lib/wordpress";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import { FaSpinner } from "react-icons/fa";

export default function Page({ post, preview }) {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
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
              {router.isFallback ? (
                <FaSpinner className="icon-spin" />
              ) : (
                <>
                  <PostBody content={post.content} />
                </>
              )}
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
    fallback: true,
  };
}
