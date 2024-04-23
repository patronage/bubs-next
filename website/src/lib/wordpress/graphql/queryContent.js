import { flexBlockquote } from './flexBlockquote';
import { flexHero } from './flexHero';
import { flexWysiwygContent } from './flexWysiwygContent';
import pageOptions from './fragmentPageOptions';
import seo from './fragmentSeo';

export function queryContent(draft, options) {
  const query = /* GraphQL */ `
    query GetContent($slug: ID!, $preview: Boolean) {
      contentNode(id: $slug, idType: ${
        options?.uriType ?? 'URI'
      }, asPreview: $preview) {
        __typename
        id
        databaseId
        isPreview
        isRestricted
        link
        slug
        uri
        date
        template {
          ... on Template_Flex {
            acfFlex {
              fieldGroupName
              flexContent {
                ${flexBlockquote()}
                ${flexHero()}
                ${flexWysiwygContent()}
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
        ... on NodeWithExcerpt {
          excerpt
        }
        ... on Page {
          isFrontPage
          content
          ${draft ? '' : seo}
          ${pageOptions}
        }
        ... on Post {
          content
          ${draft ? '' : seo}
          ${pageOptions}
        }
      }
    }
  `;

  return query;
}
