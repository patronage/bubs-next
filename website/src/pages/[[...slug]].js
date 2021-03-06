import Flex from 'components/flex/Flex';
import LayoutDefault from 'components/layouts/LayoutDefault';
import PostBody from 'components/post/PostBody';
import {
  getContent,
  getGlobalProps,
  getAllContentWithSlug,
} from 'lib/wordpress';

import { GlobalsProvider } from '../contexts/GlobalsContext';

export default function Page({
  post,
  preview,
  isHome,
  globals,
  template,
  flexSections,
}) {
  // check if homepage
  // you can remove this if you've defined a homepage in wordpress
  if (isHome) {
    return (
      <GlobalsProvider globals={globals}>
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
      </GlobalsProvider>
    );
  }

  if (template === 'Flex') {
    return (
      <GlobalsProvider globals={globals}>
        <LayoutDefault
          preview={preview}
          title={post?.title}
          seo={post?.seo}
        >
          <Flex sections={flexSections} />
        </LayoutDefault>
      </GlobalsProvider>
    );
  }

  return (
    <GlobalsProvider globals={globals}>
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
    </GlobalsProvider>
  );
}

export async function getStaticProps({
  params,
  preview = false,
  previewData,
}) {
  const globals = await getGlobalProps();

  // if your homepage doesn't come from WP, you need this to custom render and not get a 404
  // next doesn't let you have index.js and [[...slug.js]]
  if (!params.slug?.length) {
    return {
      props: {
        globals,
        isHome: true,
      },
    };
  }

  let slug = '/';

  if (params.slug?.length) {
    slug += params.slug.join('/');
  }

  const data = await getContent(slug, preview, previewData);

  if (!data?.post?.slug) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      globals,
      preview,
      post: data.post,
      flexSections: data.post?.acfFlex?.flexContent || null,
      template: data.post?.template?.templateName || null,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllContentWithSlug();

  return {
    paths: allPosts.nodes.map(({ uri }) => uri) || [],
    fallback: 'blocking',
  };
}
