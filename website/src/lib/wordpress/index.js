import fetch from 'isomorphic-unfetch';
import { WORDPRESS_API_URL } from 'lib/constants';
import { trimLeadingSlash } from 'lib/utils';
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
        previewRevisionDatabaseId
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
export async function getContent(
  slug,
  preview,
  previewData,
  options = {},
) {
  let draft = false;
  if (preview) {
    // This is based on Next.js wordpress example: https://github.com/vercel/next.js/blob/canary/examples/cms-wordpress/lib/api.ts#L105-L112
    // If the preview is for a draft or a revision, we need to query by ID.
    // We check to see if the preview data is for the same post as the slug
    // and if it is, we set `slug` to the ID of the post and the `uriType` to `DATABASE_ID`.
    const postPreview = previewData?.post;
    const trimSlug = trimLeadingSlash(slug);
    const isId = Number.isInteger(Number(trimSlug));
    const isSamePost = isId && Number(trimSlug) === postPreview?.id;
    const isDraft = isSamePost && postPreview?.status === 'draft';
    const isRevision =
      isSamePost && postPreview?.status === 'publish';

    if ((isDraft || isRevision) && postPreview?.id) {
      draft = isDraft;
      slug = postPreview.id;
      options.uriType = 'DATABASE_ID';
    }
  }

  let query = queryContent(draft, options);

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
