import Flex from 'components/flex/Flex';
import LayoutDefault from 'components/layouts/LayoutDefault';
import PostBody from 'components/PostBody';
import { GlobalsProvider } from 'contexts/GlobalsContext';
import checkRedirects from 'lib/checkRedirects';
import { getSettings } from 'lib/getSettings';
import { isStaticFile } from 'lib/utils';
import {
  getContent,
  getNodeType,
  getGlobalProps,
  getAllContentWithSlug,
} from 'lib/wordpress';

export default function Page({ post, preview, globals }) {
  const flexSections = post?.template?.acfFlex?.flexContent || null;
  const template = post?.template?.templateName || null;

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
  const SETTINGS = getSettings({});

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

  const globals = await getGlobalProps({ project: SETTINGS.PROJECT });

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

  if (!preview) {
    // Check nodeType before assuming it's a contentNode. We 404 on nonsupported types, but you could handle.
    const { nodeByUri } = await getNodeType({
      project: SETTINGS.PROJECT,
      slug,
    });
    if (!nodeByUri?.isContentNode) {
      return {
        notFound: true,
        revalidate: 60,
        props: {},
      };
    }
  }

  const data = await getContent({
    project: SETTINGS.PROJECT,
    slug,
    preview,
    previewData,
  });

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
        THEME: SETTINGS.THEME,
        CONFIG: SETTINGS.CONFIG,
      },
      preview: preview || false,
      post: data.contentNode,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const SETTINGS = getSettings({});
  const { contentNodes } = await getAllContentWithSlug({
    project: SETTINGS.PROJECT,
  });

  return {
    paths: contentNodes?.nodes.map(({ uri }) => uri) || [],
    fallback: 'blocking',
  };
}
