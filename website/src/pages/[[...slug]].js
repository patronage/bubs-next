import Flex from 'components/flex/Flex';
import LayoutDefault from 'components/layouts/LayoutDefault';
import PostBody from 'components/post/PostBody';
import { getPage, getAllPagesWithSlug } from 'lib/wordpress';

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
      <LayoutDefault title="">
        <section className="section-padded">
          <div className="container">
            <div className="row">
              <div className="col">
                <h3>Home Page</h3>
              </div>
            </div>
          </div>
        </section>
      </LayoutDefault>
    );
  }

  if (template === 'Flex') {
    return (
      <LayoutDefault
        preview={preview}
        title={post?.title}
        seo={post?.seo}
      >
        <Flex sections={flexSections} />
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault
      preview={preview}
      title={post?.title}
      seo={post?.seo}
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
    </LayoutDefault>
  );
}

export async function getStaticProps({
  params,
  preview = false,
  previewData,
}) {
  // if your homepage doesn't come from WP, you need this to custom render and not get a 404
  // next doesn't let you have index.js and [[...slug.js]]
  if (!params.slug?.length) {
    return {
      props: {
        isHome: true,
      },
    };
  }

  let slug = '/';

  if (params.slug?.length) {
    slug += params.slug.join('/');
  }

  const data = await getPage(slug, preview, previewData);
  if (!data?.post?.slug) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      preview,
      post: data.pageBy,
      flexSections: data.post?.acfFlex?.flexContent || null,
      template: data.post?.template?.templateName || null,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllPagesWithSlug();

  return {
    paths: allPosts.edges.map(({ node }) => `/${node.slug}`) || [],
    fallback: 'blocking',
  };
}
