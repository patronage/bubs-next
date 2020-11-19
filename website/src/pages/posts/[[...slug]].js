import Link from "next/link";
import { useRouter } from "next/router";
import { staticPropHelper, staticPathGenerator } from "lib/archive";
import { getPost, getAllPostsWithSlug } from "lib/wordpress";

import Layout from "components/layout";
import Paginator from "components/paginator";

function BlogPostPage({ post }) {
  return (
    <Layout title={post.title}>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </Layout>
  );
}

function BlogIndexPage({ posts, paginatorIndex, postsPerPage, totalPosts }) {
  return (
    <Layout title="">
      <h1>Posts</h1>
      {posts.map((post, key) => {
        return (
          <div key={key}>
            <h2>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        );
      })}
      <Paginator
        index={paginatorIndex}
        postsPerPage={postsPerPage}
        totalPosts={totalPosts}
      />
    </Layout>
  );
}

function Blog(props) {
  const router = useRouter();
  const { query } = router;

  if (
    query &&
    (Object.keys(query).length === 0 ||
      (query.slug && query.slug[0] === "page"))
  ) {
    return BlogIndexPage(props);
  } else {
    return BlogPostPage(props);
  }
}

export async function getStaticProps(context) {
  //
  // Generate props for Post Index page
  //
  const indexProps = await staticPropHelper(context, "post_type");

  console.log("IndexProps", indexProps);

  if (indexProps) {
    return { props: indexProps };
  }

  //
  // Generate props for Post Single Page
  //
  try {
    const { postBy } = await getPost(context.params.slug[0]);
    return { props: { post: postBy } };
  } catch (error) {}

  //
  // No condition was met for this catch-all route, send 404
  //
  return {
    props: {
      notfound: true,
    },
  };
}

export async function getStaticPaths() {
  const paths = await staticPathGenerator("post_type");

  return {
    paths,
    fallback: false,
  };
}

export default Blog;
