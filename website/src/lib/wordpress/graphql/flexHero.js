import sectionOptions from './fragmentSectionOptions';

export function flexHero(template = 'Flex') {
  const fragment = /* GraphQL */ `
    ... on Template_${template}_Acfflex_FlexContent_Hero {
      heroHeading
      heroSubheading
      heroImage {
        sourceUrl
        mediaDetails {
          width
          height
        }
      }
      ${sectionOptions}
    }
  `;

  return fragment;
}
