import { flexBlockquote } from './flexBlockquote';
import { flexHero } from './flexHero';
import { flexWysiwygContent } from './flexWysiwygContent';
import pageOptions from './fragmentPageOptions';
import seo from './fragmentSeo';

export function queryContent(preview) {
  const query = /* GraphQL */ `
    query GetContent($slug: ID!, $preview: Boolean) {
      contentNode(id: $slug, idType: URI, asPreview: $preview) {
        __typename
        id
        databaseId
        isPreview
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
          ${preview ? '' : seo}
          ${pageOptions}
        }
        ... on Post {
          content
          ${preview ? '' : seo}
          ${pageOptions}
        }
      }
    }
  `;

  return query;
}
