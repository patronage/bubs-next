import fetch from 'isomorphic-unfetch';
import { WORDPRESS_API_URL } from 'lib/constants';
import { queryContent } from './graphql/queryContent';
import { queryGlobals } from './graphql/queryGlobals';
import { queryPosts } from './graphql/queryPosts';

async function fetchAPI(query, { variables } = {}, token) {
  const headers = { 'Content-Type': 'application/json' };

  if (variables?.preview && token) {
    headers['Authorization'] = `Bearer ${token}`;
    // for authenticated requests, hit origin and bypass CDN caching
    // https://docs.graphcdn.io/docs/bypass-headers
    headers['x-preview-token'] = '1';
  }

  // console.log('API', WORDPRESS_API_URL);
  // console.log('-------');
  // console.log('variables', variables);
  // console.log('query', typeof query, query);
  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

/**
 * Get post types and paths for preview mode redirects.
 */
export async function getContentTypes(token) {
  const query = /* GraphQL */ `
    query ContentTypes {
      contentTypes {
        nodes {
          name
          restBase
        }
      }
    }
  `;

  const data = await fetchAPI(
    query,
    {
      variables: { preview: true },
    },
    token,
  );

  return data?.contentTypes?.nodes;
}

/**
 * To assist with Preview Mode, this will grab status for content by DB id
 * (needed for revisions, unpublished content)
 */
export async function getPreviewContent(
  id,
  idType = 'DATABASE_ID',
  token,
) {
  const query = /* GraphQL */ `
    query PreviewContent($id: ID!, $idType: ContentNodeIdTypeEnum!) {
      contentNode(id: $id, idType: $idType) {
        uri
        status
        databaseId
        contentType {
          node {
            name
            uri
          }
        }
      }
    }
  `;

  const data = await fetchAPI(
    query,
    {
      variables: { id, idType, preview: true },
    },
    token,
  );

  return data.contentNode;
}

/**
 * get all paths. used for static generation
 * @param {*} contentType slug of post type
 *
 * If a contentType is passed, the allQuery graphql is modified to query for
 * only that post type instead of getting posts from any CPT
 */
export async function getAllContentWithSlug(contentType) {
  const query = /* GraphQL */ `
    ${
      contentType
        ? 'query AllContent($contentType: ContentTypeEnum!) '
        : 'query AllContent'
    } {
      ${
        contentType
          ? 'contentNodes(where: {contentTypes: [$contentType]})'
          : 'contentNodes'
      } {
        nodes {
          uri
          slug
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      contentType,
    },
  });
  return data?.contentNodes;
}

/**
 * Determine if the given pathname is a contentnode before attempting to query for it
 * @param {*} slug pathname from URL
 * @returns
 */
export async function getNodeType(slug) {
  const query = /* GraphQL */ `
    query getNodeType($slug: String!) {
      nodeByUri(uri: $slug) {
        isContentNode
        isTermNode
      }
    }
  `;

  const data = await fetchAPI(query, { variables: { slug } });

  return data;
}

/**
 * Get fields for single page regardless of post type.
 */
export async function getContent(slug, preview, previewData) {
  let draft = false;
  if (preview) {
    // Get the content types to help build preview URLs
    const contentTypesArray = await getContentTypes(
      previewData?.token,
    );
    const contentTypes = {};

    for (const contentType of contentTypesArray) {
      contentTypes[contentType.restBase] = contentType.name;
    }

    // Because static pages can't support query strings and those
    // make preview mode much easier across published statuses and post types
    // this coerces any numeric slug in preview mode to an ID and assumes post type
    const segments = slug.split('/');
    const lastSegment = segments[segments.length - 1];
    const secondLastSegment =
      segments.length > 2 ? segments[segments.length - 2] : null;
    // Get post type URL segment
    const postType = contentTypes[secondLastSegment];

    // wordpress requires a different slug structure for various post types
    if (slug !== '/' && !isNaN(Number(lastSegment))) {
      draft = true;
      if (postType === 'post') {
        slug = `/?p=${lastSegment}`;
      } else if (secondLastSegment) {
        slug = `/?id=${lastSegment}&post_type=${postType}`;
      } else {
        slug = `/?page_id=${lastSegment}`;
      }
    } else if (slug !== '/') {
      slug += '?preview=true';
    }
  }

  let query = queryContent(draft);

  const data = await fetchAPI(
    query,
    {
      variables: { slug, preview: !!preview },
    },
    previewData?.token,
  );

  return data;
}

/**
 * Get a list of posts for news.
 */

export async function getPosts({
  ids,
  first = 12,
  after = null,
  searchQuery = null,
  contentTypes = ['POST'],
  orderField = 'DATE',
  orderDirection = 'DESC',
  taxonomyType = null,
  taxonomyTerms = null,
}) {
  let query = queryPosts(taxonomyType, taxonomyTerms);

  const data = await fetchAPI(query, {
    variables: {
      contentTypes,
      first,
      searchQuery,
      after,
      ids,
      orderField,
      orderDirection,
      taxonomyType,
      taxonomyTerms,
    },
  });

  return data;
}

/** All Taxonomy Terms */

export async function getCategories() {
  let query = /* GraphQL */ `
    query AllCategories {
      categories {
        edges {
          node {
            name
            slug
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query);
  return data.categories;
}

/**
 * Global Props
 * */
export async function getGlobalProps() {
  let query = queryGlobals;
  const data = await fetchAPI(query);
  return data;
}
