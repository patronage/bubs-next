import fetch from 'isomorphic-unfetch';
import { WORDPRESS_API_URL } from 'lib/constants';

async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (
    process.env.WORDPRESS_AUTH_REFRESH_TOKEN &&
    variables?.preview
  ) {
    headers[
      'Authorization'
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
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

export async function getPreviewPost(id, idType = 'DATABASE_ID') {
  const data = await fetchAPI(
    `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    },
  );
  return data.post;
}

/**
 * get all paths. used for static generation
 */
export async function getAllContentWithSlug() {
  const data = await fetchAPI(`
    query AllContent {
      contentNodes {
        nodes {
          uri
        }
      }
    }
  `);
  return data?.contentNodes;
}

function generateFlex(type) {
  let fragmentFlex = /* GraphQL */ `
    acfFlex {
      fieldGroupName
      flexContent {
        ... on ${type}_Acfflex_FlexContent_WysiwygContent {
          fieldGroupName
          sectionHeading
          wysiwygContent
          ${fragmentSectionOptions}
        }
        ... on ${type}_Acfflex_FlexContent_Hero {
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
        ... on ${type}_Acfflex_FlexContent_Blockquote {
          fieldGroupName
          blockquote
          quoteAttribution
          ${fragmentSectionOptions}
        }
      }
    }
  `;
  return fragmentFlex;
}

/**
 * Get fields for single page regardless of post type.
 */
export async function getContent(slug, preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === postPreview?.id
    : slug === postPreview?.slug;
  const isDraft = isSamePost && postPreview?.status === 'draft';
  const isRevision = isSamePost && postPreview?.status === 'publish';
  // console.log('slug for single', slug);
  let query = /* GraphQL */ `
    query GetContent($slug: ID!) {
      contentNode(id: $slug, idType: URI) {
        __typename
        id
        isPreview
        link
        slug
        uri

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
          ${generateFlex('Page')}
          ${fragmentSEO}
          ${fragmentPageOptions}
        }
        ... on Post {
          content
          ${generateFlex('Post')}
          ${fragmentSEO}
          ${fragmentPageOptions}
        }
      }
    }
  `;
  // console.log('query for getContent', query);
  const data = await fetchAPI(query, {
    variables: { slug },
  });

  /*// Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }*/

  // console.log('data', data);
  data.post = data.contentNode;
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
  contentTypes = ['POST', 'CASE_STUDIES', 'RESOURCES', 'NEWS'],
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
 * (Might merge into other queries via fragment)
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

    # fragment GlobalOptions on RootQuery {
    #   themeSettings {
    #     acfGlobalOptions {
    #       fieldGroupName
    #       newsletterButton
    #       newsletterHeading
    #     }
    #   }
    # }

    query AllGlobals {
      ...Menus
      # ...GlobalOptions
    }
  `;

  const data = await fetchAPI(query);
  return data;
}
