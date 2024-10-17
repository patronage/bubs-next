const fragmentMenu = /* GraphQL */ `
  nodes {
    id
    databaseId
    label
    parentId
    url
    path
    cssClasses
  }
`;

const redirectsRedirection = /* GraphQL */ `
  redirection {
    redirects {
      origin
      target
      type
      matchType
      statusCode: code
    }
  }
`;

const menus = /* GraphQL */ `
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
`;

const globalOptions = /* GraphQL */ `
  themeSettings: acfOptionsThemeSettings {
    acfGlobalOptions {
      fieldGroupName
      footer {
        footerCopyright
      }
    }
  }
`;

const seoGlobal = /* GraphQL */ `
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
`;

export const queryGlobals = /* GraphQL */ `

  fragment Redirects on RootQuery {
    redirection: ${redirectsRedirection}
  }

  fragment GlobalOptions on RootQuery {
    ${globalOptions}
  }

  fragment SEO on RootQuery {
    ${seoGlobal}
  }

  fragment Menus on RootQuery {
    ${menus}
  }

  query AllGlobals {
    ...Menus
    ...SEO
    ...Redirects
    ...GlobalOptions
  }
`;
