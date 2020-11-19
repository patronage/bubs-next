import { staticPathGenerator } from 'lib/archive';

const POSTS_PER_PAGE = 1;

const TaxonomyArchive = () => {
  return (
    <div>Taxonomy</div>
  )
}

export async function getStaticProps(context) {
  /*//
  // Generate props for Post Index page
  //
  if (
    // URL is /posts
    Object.keys(context.params).length === 0 ||
    // URL is /posts/page/*
    ( context.params && context.params.slug && context.params.slug[0] === 'page' )          
  ) {    
    // 404 if the paginator ID is non-numeric
    if ( context.params && context.params.slug && context.params.slug[1] && isNaN(Number(context.params.slug[1])) ) {
      return {
        props: {
          notfound: true,
        },
      };
    }

    const posts = [];
    // Get the zero-indexed paginator index (remember URL is indexed by 1)
    const page = ( context.params.slug ? Number(context.params.slug[1]) : 1 ) - 1;
    const allPosts = await getAllPostsWithSlug();
    const sliceStart = page * POSTS_PER_PAGE;
    const filteredPosts = allPosts.edges.slice( sliceStart, sliceStart + POSTS_PER_PAGE );

    // Generate Post Paths    
    for (let i = 0; i < filteredPosts.length; i++) {      
      const slug = filteredPosts[i].node.slug;
      const { postBy } = await getPost(slug);
      posts.push(postBy);
    }

    return {
      props: { 
        posts, 
        // Paginator Helpers
        paginatorIndex: page + 1, // 1-Indexed as this is strictly for display
        postsPerPage: POSTS_PER_PAGE,
        totalPosts: allPosts.edges.length,
      }
    };
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
  };*/

  return { props: {} }
}

export async function getStaticPaths() {
  const paths = await staticPathGenerator('category');
  
  return {
    paths,
    fallback: false,
  };
}

export default TaxonomyArchive;