import sectionOptions from './fragmentSectionOptions';

export function flexMedia(template = 'Flex') {
  const fragment = /* GraphQL */ `
    ... on Template_${template}_Acfflex_FlexContent_Media {
      youtubeUrl
      variant
      width
      backgroundVideo {
        mediaItemUrl
        mediaDetails {
          width
          height
        }
      }
      image {
        altText
        mediaDetails {
          width
          height
        }
        sourceUrl(size: _1600_WIDE)
        mediaItemUrl
      }
      ${sectionOptions}
    }
  `;

  return fragment;
}
