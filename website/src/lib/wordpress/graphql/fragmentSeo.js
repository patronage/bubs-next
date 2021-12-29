const fragmentSeo = /* GraphQL */ `
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

export default fragmentSeo;
