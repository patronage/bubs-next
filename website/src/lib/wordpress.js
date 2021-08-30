import fetch from 'isomorphic-unfetch';
import { WORDPRESS_API_URL } from 'lib/constants';

async function fetchAPI(query, { variables } = {}, token) {
  const headers = { 'Content-Type': 'application/json' };

  if (variables?.preview && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // console.log('API', WORDPRESS_API_URL);
  // console.log('variables', variables);
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
  // console.log("graphql results", JSON.stringify(json.data, null, 2));
  return json.data;
}

/**
 * Reusable Fragments
 */

let fragmentSEO = /* GraphQL */ `
  seo {
    breadcrumbs {
      text
      url
    }
    canonical
    metaDesc
    metaRobotsNofollow
    metaRobotsNoindex
    opengraphImage {
      sourceUrl
      mediaDetails {
        height
        width
      }
    }
    opengraphDescription
    opengraphTitle
    twitterDescription
    title
    twitterTitle
    twitterImage {
      sourceUrl
      mediaDetails {
        height
        width
      }
    }
  }
`;

let fragmentPageOptions = /* GraphQL */ `
  acfPageOptions {
    footerHideNav
    footerHideSearch
    footerHideSignup
    footerHideSocial
    footerStyle
    headerHideNav
  }
`;

let fragmentSectionOptions = /* GraphQL */ `
  backgroundColor
  hideSection
  sectionClasses
  sectionSlug
`;

let fragmentCategories = /* GraphQL */ `
  categories {
    nodes {
      name
      slug
      uri
    }
  }
`;

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
 * Get fields for single page regardless of post type.
 */
export async function getContent(slug, preview, previewData) {
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

  let query = /* GraphQL */ `
    query GetContent($slug: ID!, $preview: Boolean) {
      contentNode(id: $slug, idType: URI, asPreview: $preview) {
        __typename
        id
        databaseId
        isPreview
        link
        slug
        uri
        template {
          ... on Template_Flex {
            acfFlex {
              fieldGroupName
              flexContent {
                ... on Template_Flex_Acfflex_FlexContent_WysiwygContent {
                  fieldGroupName
                  sectionHeading
                  wysiwygContent
                  ${fragmentSectionOptions}
                }
                ... on Template_Flex_Acfflex_FlexContent_Hero {
                  fieldGroupName
                  heroHeading
                  heroSubheading
                  heroImage {
                    sourceUrl
                    mediaDetails {
                      width
                      height
                    }
                  }
                  ${fragmentSectionOptions}
                }
                ... on Template_Flex_Acfflex_FlexContent_Blockquote {
                  fieldGroupName
                  blockquote
                  quoteAttribution
                  ${fragmentSectionOptions}
                }
              }
            }
          }
        }
        ... on NodeWithTitle {
          title
        }
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              caption
              sourceUrl
              mediaDetails {
                height
                width
              }
            }
          }
        }
        ... on NodeWithTemplate {
          template {
            __typename
            templateName
          }
        }
        ... on NodeWithAuthor {
          authorId
          author {
            node {
              id
              name
              nicename
              lastName
            }
          }
        }
        ... on Page {
          isFrontPage
          content
          ${fragmentSEO}
          ${fragmentPageOptions}
        }
        ... on Post {
          content
          ${fragmentSEO}
          ${fragmentPageOptions}
        }
      }
    }
  `;

  // console.log('query for getContent', query);
  const data = await fetchAPI(
    query,
    {
      variables: { slug, preview: !!preview },
    },
    previewData?.token,
  );

  // console.log('data', data);
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
  const taxonomyQuery =
    'taxQuery: {taxArray: { taxonomy: $taxonomyType, terms: $taxonomyTerms, field: SLUG }},';

  const taxonomyParams = `
      $taxonomyType: TaxonomyEnum!
      $taxonomyTerms: [String]`;

  let query = /* GraphQL */ `
    # query GetPosts($first: Int, $contentTypes: Array) {
    query GetPosts(
      $ids: [ID]
      $first: Int
      $after: String
      $contentTypes: [ContentTypeEnum!]!
      $searchQuery: String
      $orderField: PostObjectsConnectionOrderbyEnum!
      $orderDirection: OrderEnum!
      ${taxonomyType && taxonomyTerms ? taxonomyParams : ''}
    ) {
      contentNodes(
        first: $first
        after: $after
        where: {
          ${taxonomyType && taxonomyTerms ? taxonomyQuery : ''}
          in: $ids,
          search: $searchQuery,
          contentTypes: $contentTypes,
          orderby: {field: $orderField, order: $orderDirection}}
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          slug
          uri
          ... on NodeWithFeaturedImage {
            featuredImage {
              node {
                caption
                sourceUrl(size: SOCIAL)
                mediaDetails {
                  height
                  width
                }
              }
            }
          }
          ... on NodeWithTitle {
            title
          }
          contentType {
            node {
              name
            }
          }
          ... on Post {
            ${fragmentCategories}
          }
        }
      }
    }
  `;
  // console.log('query', query);
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
  // console.log('data', JSON.stringify(data, null, 2));

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
  let fragmentMenu = /* GraphQL */ `
    nodes {
      id
      databaseId
      label
      parentId
      url
      path
    }
`;

  let query = /* GraphQL */ `
    fragment Menus on RootQuery {
      menuHeader: menuItems(where: { location: HEADER }, first: 100) {
        ${fragmentMenu}
      }
      menuFooter: menuItems(where: { location: FOOTER }, first: 100) {
        ${fragmentMenu}
      }
      menuFooterSocial: menuItems(where: { location: FOOTER_SOCIAL }, first: 100) {
        ${fragmentMenu}
      }
      menuFooterSecondary: menuItems(where: { location: FOOTER_SECONDARY }, first: 100) {
        ${fragmentMenu}
      }
    }

    fragment SEO on RootQuery {
      seo {
        openGraph {
          defaultImage {
            mediaDetails {
              width
              height
            }
            sourceUrl
          }
        }
      }
    }

    fragment GlobalOptions on RootQuery {
      acfOptionsThemeSettings {
        acfGlobalOptions {
          footer {
            fieldGroupName
            footerCopyright
          }
        }
      }
    }
    fragment Redirects on RootQuery {
      redirection {
        redirects {
          matchType
          code
          target
          origin
        }
      }
    }

    query AllGlobals {
      ...Menus
      ...SEO
      ...Redirects
      ...GlobalOptions
    }
  `;

  const data = await fetchAPI(query);
  return data;
}
