import LayoutDefault from 'components/layouts/LayoutDefault';
import PostArchive from 'components/post/PostArchive';

import { staticPropHelper, staticPathGenerator } from 'lib/archive';
import { getContent } from 'lib/wordpress';
import { useRouter } from 'next/router';

function PostsSinglePage({ post }) {
  return (
    <LayoutDefault title={post?.title}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>{post?.title}</h1>
            <div
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          </div>
        </div>
      </div>
    </LayoutDefault>
  );
}

function PostsIndexPage(props) {
  return (
    <LayoutDefault title="">
      <section className="pt-3 pb-3">
        <div className="container">
          <PostArchive {...props} />
        </div>
      </section>
    </LayoutDefault>
  );
}

function Blog(props) {
  const router = useRouter();
  const { query } = router;

  // If query has a slug in the url, other than `page` show the single template. else show the single.
  if (
    query &&
    Object.keys(query).length !== 0 &&
    query.slug &&
    query.slug[0] !== 'page'
  ) {
    return PostsSinglePage(props);
  } else {
    return PostsIndexPage(props);
  }
}

export async function getStaticProps(context) {
  //
  // Generate props for Post Index page
  //
  const indexProps = await staticPropHelper(context, 'post_type');

  if (indexProps) {
    return { props: indexProps };
  }

  //
  // Generate props for Post Single Page
  //
  try {
    const { post } = await getContent(context.params.slug[0]);
    return { props: { post } };
  } catch (error) {
    console.log(error);
  }

  //
  // No condition was met for this catch-all route, send 404
  //
  return {
    notFound: true,
  };
}

export async function getStaticPaths() {
  const paths = await staticPathGenerator('post_type');

  return {
    paths,
    fallback: false,
  };
}

export default Blog;
