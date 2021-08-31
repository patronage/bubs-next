const {
  getContent,
  getCategories,
  getAllContentWithSlug,
} = require('./wordpress');

const POSTS_PER_PAGE = 2;

/**
 * staticPathGenerator helps create staticially generatable page/URL structure for various Wordpress archives. It'll do the following:
 *   * /post_type/
 *   * /post_type/page/%index%
 *   * /post_type/%slug%
 *   * /taxonomy/%taxonomySlug%
 *   * /taxonomy/%taxonomySlug%/page/%index%
 * @param {string} type What does this taxonomy represent? post_type, category, or tag
 *
 */
export async function staticPathGenerator(type = 'post_type') {
  try {
    const paths = [];

    if (type === 'category' || type === 'tag') {
      // Taxonomy Archive
      let allTaxonomyResults = { edges: [] };

      // This could support custom taxonomies or authors if needed
      if (type === 'category') {
        allTaxonomyResults = await getCategories();
      } /*else if (type === 'tag') {
        allTaxonomyResults = await getTags();
      }*/

      const taxonomyResults = allTaxonomyResults.edges;

      for (const taxonomyResult of taxonomyResults) {
        const slug = taxonomyResult.node.slug;
        paths.push({ params: { slug: [slug] } }); // Index Page

        let allPosts = { edges: [] };

        // This could support custom taxonomies or authors if needed
        /*if (type === 'category') {
          allPosts = await getPostsByCategory(slug);
        } else if (type === 'tag') {
          allPosts = await getPostsByTag(slug);
        }*/

        const posts = allPosts.edges;

        // Generate Pagination Paths
        for (
          let i = 1;
          i <= Math.ceil(posts.length / POSTS_PER_PAGE);
          i++
        ) {
          paths.push({ params: { slug: [slug, 'page', String(i)] } });
        }
      }
    } else {
      // Post type archive
      const allPosts = await getAllContentWithSlug('POST');
      paths.push({ params: { slug: [] } }); // Index Page
      const posts = allPosts.nodes || [];

      // Generate Pagination Paths
      for (
        let i = 1;
        i <= Math.ceil(posts.length / POSTS_PER_PAGE);
        i++
      ) {
        paths.push({ params: { slug: ['page', String(i)] } });
      }

      // Generate Post Paths
      for (const post of posts) {
        if (post.node && post.node.slug) {
          paths.push({ params: { slug: [post.node.slug] } });
        }
      }
    }

    return paths;
  } catch (error) {
    console.error(error);

    return [];
  }
}

export async function staticPropHelper(
  staticPropsContext,
  contentType,
  archiveType = 'post_type',
) {
  try {
    let taxonomyIndex = 0;
    let paginatorIndex = 1;

    if (archiveType !== 'post_type') {
      taxonomyIndex = 1;
      paginatorIndex = 2;
    }

    if (
      // URL is /posts or /%taxonomySlug%/
      Object.keys(staticPropsContext.params).length ===
        taxonomyIndex ||
      // URL is /posts/page/* or /%taxonomySlug%/page/*
      staticPropsContext?.params?.slug?.[taxonomyIndex] === 'page'
    ) {
      // 404 if the paginator ID is non-numeric
      if (
        staticPropsContext?.params?.slug?.[paginatorIndex] &&
        isNaN(Number(staticPropsContext.params.slug[paginatorIndex]))
      ) {
        return {
          props: {
            notfound: true,
          },
        };
      }

      const posts = [];

      /*if (type === 'category') {
        allPosts = await getPostsByCategory(
          staticPropsContext.params.slug[0],
        );
      } else if (type === 'tag') {
        allPosts = await getPostsByTag(
          staticPropsContext.params.slug[0],
        );
      } else {
        allPosts = await getAllPostsWithSlug();
      }*/

      const allPosts = await getAllContentWithSlug(contentType);

      // Get the zero-indexed paginator index (remember URL is indexed by 1)
      //console.log(staticPropsContext.params.slug);
      const page =
        (staticPropsContext?.params?.slug?.[paginatorIndex]
          ? Number(staticPropsContext.params.slug[paginatorIndex])
          : 1) - 1;
      const sliceStart = page * POSTS_PER_PAGE;
      const filteredPosts = allPosts.nodes.slice(
        sliceStart,
        sliceStart + POSTS_PER_PAGE,
      );

      // Generate Post Paths
      for (let i = 0; i < filteredPosts.length; i++) {
        const uri = filteredPosts[i].uri;
        const { contentNode } = await getContent(uri);
        posts.push(contentNode);
      }

      return {
        posts,
        // Paginator Helpers
        paginatorIndex: page + 1, // 1-Indexed as this is strictly for display
        postsPerPage: POSTS_PER_PAGE,
        totalPosts: allPosts.nodes.length,
      };
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}
