import LayoutDefault from 'components/layouts/LayoutDefault';
import PostArchive from 'components/post/PostArchive';
import { GlobalsProvider } from 'contexts/GlobalsContext';
import { staticPropHelper, staticPathGenerator } from 'lib/archive';
import { getGlobalProps } from 'lib/wordpress';

function TaxIndex(props) {
  return (
    <GlobalsProvider globals={props.globals}>
      <LayoutDefault title="">
        <PostArchive archiveTitle={'Tag Archive'} {...props} />
      </LayoutDefault>
    </GlobalsProvider>
  );
}

export async function getStaticProps(context) {
  const globals = await getGlobalProps();
  const indexProps = await staticPropHelper(context, 'POST', 'tag');

  if (indexProps) {
    return {
      props: {
        ...indexProps,
        globals,
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
  const paths = await staticPathGenerator('tag');

  return {
    paths,
    fallback: 'blocking',
  };
}

export default TaxIndex;
