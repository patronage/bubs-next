import sectionOptions from './fragmentSectionOptions';

export function flexWysiwygContent(template = 'Flex') {
  const fragment = /* GraphQL */ `
    ... on Template_${template}_Acfflex_FlexContent_WysiwygContent {
      # contentWidth
      sectionHeading
      wysiwygContent
      ${sectionOptions}
    }
  `;

  return fragment;
}
