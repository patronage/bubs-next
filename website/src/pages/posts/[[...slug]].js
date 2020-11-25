import Link from "next/link";
import { useRouter } from "next/router";
import { staticPropHelper, staticPathGenerator } from "lib/archive";
import { getPost, getAllPostsWithSlug } from "lib/wordpress";

import LayoutDefault from "components/layouts/LayoutDefault";
import PostArchive from "components/post/PostArchive";

function BlogPostPage({ post }) {
  return (
    <LayoutDefault title={post.title}>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </LayoutDefault>
  );
}

function BlogIndexPage(props) {
  return (
    <LayoutDefault title="">
      <section class="pt-3 pb-3">
        <div class="container">
          <PostArchive {...props} />
        </div>
      </section>
    </LayoutDefault>
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

  if (indexProps) {
    return { props: indexProps };
  }

  //
  // Generate props for Post Single Page
  //
  try {
    const { postBy } = await getPost(context.params.postslug[0]);
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
