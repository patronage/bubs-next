import { getPage, getAllPagesWithSlug } from "lib/wordpress";

import Layout from "components/layout";
import ErrorPage from "next/error";
import PostBody from "components/post/body";

import Flex from "components/flex/Flex";

export default function Page({
  post,
  preview,
  isHome,
  template,
  flexSections,
}) {
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

  if (template === "Flex") {
    return (
      <Layout
        preview={preview}
        title={post?.title}
        image={post?.featuredImage?.sourceUrl}
      >
        <Flex sections={flexSections} />
      </Layout>
    );
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

  // console.log("data", data);

  if (data.post.template.templateName == "Flex") {
    console.log("is a flex template, load flex components");
    console.log("flex data", data.post.acfFlex);
  } else {
    console.log("is a normal template, load basics");
  }

  return {
    props: {
      preview,
      post: data.pageBy,
      flexSections: data.post.acfFlex?.flexContent,
      template: data.post.template?.templateName,
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
