import LayoutDefault from 'components/layouts/LayoutDefault';
import PostArchive from 'components/post/PostArchive';
import { GlobalsProvider } from 'contexts/GlobalsContext';
import { staticPropHelper, staticPathGenerator } from 'lib/archive';
import { getGlobalProps } from 'lib/wordpress';

function CategoryIndex(props) {
  return (
    <GlobalsProvider globals={props.globals}>
      <LayoutDefault title="" preview={props.preview}>
        <PostArchive archiveTitle={'Category Archive'} {...props} />
      </LayoutDefault>
    </GlobalsProvider>
  );
}

export async function getStaticProps(context) {
  const globals = await getGlobalProps();
  const indexProps = await staticPropHelper(
    context,
    'POST',
    'category',
  );

  if (indexProps) {
    return {
      props: {
        ...indexProps,
        globals,
        preview: context.preview || false,
      },
      revalidate: 60,
    };
  }

  return {
    props: {
      notfound: true,
    },
  };
}

export async function getStaticPaths() {
  const paths = await staticPathGenerator('category');

  return {
    paths,
    fallback: 'blocking',
  };
}

export default CategoryIndex;
