import Flex from 'components/flex/Flex';
import LayoutDefault from 'components/layouts/LayoutDefault';
import PostBody from 'components/post/PostBody';
import { GlobalsProvider } from 'contexts/GlobalsContext';
import checkRedirects from 'lib/checkRedirects';
import { isStaticFile } from 'lib/utils';
import {
  getContent,
  getGlobalProps,
  getAllContentWithSlug,
} from 'lib/wordpress';

export default function Page({
  post,
  preview,
  globals,
  template,
  flexSections,
}) {
  if (template === 'Flex') {
    return (
      <GlobalsProvider globals={globals}>
        <LayoutDefault
          preview={preview}
          seo={post?.seo}
          postId={post?.databaseId}
          isRevision={post?.isPreview}
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
        postId={post?.databaseId}
        isRevision={post?.isPreview}
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
  let slug = '/';

  if (params.slug?.length) {
    slug += params.slug.join('/');
  }

  // To reduce unnecessary load on Wordpress, don't query GraphQL for common static files.
  // This prevents things like favicons, device icons.
  if (slug && isStaticFile(slug)) {
    return {
      notFound: true,
    };
  }

  const globals = await getGlobalProps();

  // Check for redirects first
  const redirect = checkRedirects(
    slug,
    globals?.redirection?.redirects,
  );

  if (
    typeof redirect === 'object' &&
    redirect?.destination &&
    redirect?.statusCode
  ) {
    return { redirect: redirect };
  }

  const data = await getContent(slug, preview, previewData);

  if (!preview && !data?.contentNode?.slug) {
    return {
      notFound: true,
      revalidate: 60,
      props: {},
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
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const { contentNodes } = await getAllContentWithSlug();

  return {
    paths: contentNodes?.nodes.map(({ uri }) => uri) || [],
    fallback: 'blocking',
  };
}
