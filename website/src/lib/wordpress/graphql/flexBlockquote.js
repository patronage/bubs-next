import sectionOptions from './fragmentSectionOptions';

export function flexBlockquote(template = 'Flex') {
  const fragment = /* GraphQL */ `
    ... on Template_${template}_Acfflex_FlexContent_Blockquote {
      fieldGroupName
      blockquote
      quoteAttribution
      ${sectionOptions}
    }
  `;

  return fragment;
}
