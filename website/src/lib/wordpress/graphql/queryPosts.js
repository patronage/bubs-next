// import pageOptions from './fragmentPageOptions';
import categories from './fragmentCategories';
// import seo from './fragmentSeo';

export function queryPosts(taxonomyType, taxonomyTerms) {
  const taxonomyQuery =
    'taxQuery: {taxArray: { taxonomy: $taxonomyType, terms: $taxonomyTerms, field: SLUG }},';

  const taxonomyParams = `
      $taxonomyType: TaxonomyEnum!
      $taxonomyTerms: [String]`;

  const query = /* GraphQL */ `
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
          date
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
            ${categories}
          }
        }
      }
    }
  `;

  return query;
}
