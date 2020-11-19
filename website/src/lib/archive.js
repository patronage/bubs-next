const { getCategories, getTags, getAllPostsWithSlug, getPostsByCategory, getPostsByTag } = require("./wordpress");

const POSTS_PER_PAGE = 1;

/**
 * staticPathGenerator helps create staticially generatable page/URL structure for various Wordpress archives. It'll do the following:
 *   * /post_type/
 *   * /post_type/page/%index%
 *   * /post_type/%slug%
 *   * /taxonomy/value
 *   * /taxonomy/value/page/%index%
 * @param {string} type What does this taxonomy represent? post_type, category, or tag
 * 
 */
export async function staticPathGenerator( type = 'post_type' ) {
  try {
    const paths = [];

    if ( type === 'category' || type === 'tag') { // Taxonomy Archive
      let allTaxonomyResults;

      // This could support custom taxonomies or authors if needed
      if ( type === 'category' ) {
        allTaxonomyResults = await getCategories();
      } else if ( type === 'tag' ) {
        allTaxonomyResults = await getTags();
      }      

      const taxonomyResults = allTaxonomyResults.edges;
    
      for ( const taxonomyResult of taxonomyResults ) {
        const slug = taxonomyResult.node.slug;
        paths.push({ params: { slug: [slug] } }); // Index Page
    
        let allPosts;

        // This could support custom taxonomies or authors if needed
        if ( type === 'category' ) {
          allPosts = await getPostsByCategory( slug );
        } else if ( type === 'tag' ) {
          allPosts = await getPostsByTag( slug );
        }
        
        const posts = allPosts.edges;
    
        // Generate Pagination Paths
        for (let i = 1; i <= Math.ceil(posts.length / POSTS_PER_PAGE); i++) {
          paths.push({ params: { slug: [slug, 'page', String(i)] } });
        }
      }
    } else { // Post type archive
      const allPosts = await getAllPostsWithSlug();
      paths.push({ params: { slug: [] } }); // Index Page
      const posts = allPosts.edges;
    
      // Generate Pagination Paths
      for (let i = 1; i <= Math.ceil(posts.length / POSTS_PER_PAGE); i++) {
        paths.push({ params: { slug: ['page', String(i)] } });
      }
    
      // Generate Post Paths
      for (const post of posts) {
        if ( post.node && post.node.slug ) {
          paths.push({ params: { slug: [post.node.slug] } });
        }    
      }
    }

    return paths;
  } catch ( error ) {
    console.error( error );

    return [];
  }
}