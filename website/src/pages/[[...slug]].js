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
  postId,
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
        <LayoutDefault title="" preview={preview}>
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
          seo={post?.seo}
          postId={postId}
          title={post?.title}
        >
          <Flex sections={flexSections} />
        </LayoutDefault>
      </GlobalsProvider>
    );
  }

  return (
    <GlobalsProvider globals={globals}>
      <LayoutDefault
        postId={postId}
        seo={post?.seo}
        preview={preview}
        title={post?.title}
      >
        <section className="section-padded">
          <div className="container">
            <div className="row">
              <div className="col">
                <PostBody content={post?.content} />
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
        preview,
        globals: {
          ...globals,
          pageOptions: null,
        },
        isHome: true,
      },
    };
  }

  let slug = '/';

  if (params.slug?.length) {
    slug += params.slug.join('/');
  }

  const data = await getContent(slug, preview, previewData);

  if (!preview && !data?.contentNode?.slug) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      globals: {
        ...globals,
        pageOptions: data.contentNode?.acfPageOptions || null,
      },
      preview: preview || false,
      post: data.contentNode,
      flexSections:
        data.contentNode?.template?.acfFlex?.flexContent || null,
      template: data.contentNode?.template?.templateName || null,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const { contentNodes } = await getAllContentWithSlug();

  return {
    paths: contentNodes?.nodes.map(({ uri }) => uri) || [],
    fallback: 'blocking',
  };
}
