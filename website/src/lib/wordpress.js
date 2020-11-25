import { WORDPRESS_API_URL } from "lib/constants";

async function fetchAPI(query, { variables } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      "Authorization"
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const res = await fetch(WORDPRESS_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  // console.log("graphql results", JSON.stringify(json.data, null, 2));
  return json.data;
}

export async function getPreviewPost(id, idType = "DATABASE_ID") {
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
    }
  );
  return data.post;
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      posts(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getAllPagesWithSlug() {
  const data = await fetchAPI(`
    {
      pages {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.pages;
}

export async function getPageWithSlug() {
  const data = await fetchAPI(`
    {
      posts(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getPosts(preview) {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: {orderby: {field: DATE, order: DESC}}) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
                mediaDetails {
                  height
                  width
                }
              }
            }
            author {
              node {
                firstName
                lastName
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data?.posts;
}

export async function getPostsByCategory(categorySlug) {
  const data = await fetchAPI(`
    {
      posts(first: 10000, where: {categoryName: "${categorySlug}"}) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);

  return data?.posts;
}

export async function getPostsByTag(tagSlug) {
  const data = await fetchAPI(`
    {
      posts(first: 10000, where: {tag: "${tagSlug}"}) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);

  return data?.posts;
}

export async function getHeroes() {
  const data = await fetchAPI(`
    query AllHeroes {
      heroes {
        edges {
          node {
            hero {
              buttonLink
              buttonText
              buttonType
              fieldGroupName
              headline
              subhead
              img {
                uri
                link
                sourceUrl(size: LARGE)
                altText
                mediaDetails {
                  height
                  width
                }
              }
            }
          }
        }
      }
    }
  `);

  return data?.heroes;
}

export async function getCategories() {
  const data = await fetchAPI(`
    query AllCategories {
      categories {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);

  return data.categories;
}

export async function getTags() {
  const data = await fetchAPI(`
    query AllTags {
      tags {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);

  return data.tags;
}

export async function getPage(slug, preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === postPreview.id
    : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === "draft";
  const isRevision = isSamePost && postPreview?.status === "publish";
  let uri = slug;
  const data = await fetchAPI(
    `
    fragment PageFields on Page {
      title
      slug
      content
      template {
        templateName
      }
      featuredImage {
        node {
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
    }
    fragment SEOFields on Page {
      seo {
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
    }
    fragment FlexFields on Page {
      acfFlex {
        fieldGroupName
        flexContent {
          ... on Page_Acfflex_FlexContent_Blockquote {
            backgroundColor
            blockquote
            fieldGroupName
            quoteAttribution
            sectionClasses
            sectionSlug
          }
          ... on Page_Acfflex_FlexContent_Hero {
            backgroundColor
            fieldGroupName
            heroHeading
            heroSubheading
            heroImage {
              sourceUrl
              mediaDetails {
                height
                width
              }
            }
            sectionClasses
            sectionSlug
          }
          ... on Page_Acfflex_FlexContent_StatsCarousel {
            backgroundColor
            fieldGroupName
            sectionClasses
            sectionSlug
            statsCarousel {
              fieldGroupName
              statDetails
              statTopline
            }
          }
          ... on Page_Acfflex_FlexContent_WysiwygContent {
            backgroundColor
            fieldGroupName
            sectionClasses
            sectionHeading
            sectionSlug
            wysiwygContent
          }
        }
      }
    }
    query PageBySlug($uri: String) {
      pageBy(uri: $uri) {
        ...PageFields
        ...FlexFields
        ...SEOFields
        content
      }
    }
    `,
    {
      variables: { uri },
    }
  );

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  data.post = data.pageBy;

  return data;
}

export async function getPost(slug, preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === postPreview.id
    : slug === postPreview?.slug;
  const isDraft = isSamePost && postPreview?.status === "draft";
  const isRevision = isSamePost && postPreview?.status === "publish";
  const uri = slug;
  const data = await fetchAPI(
    `
    fragment PostFields on Post {
      title
      slug
      featuredImage {
        node {
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
    }
    query PostBySlug($uri: String) {
      postBy(uri: $uri) {
        ...PostFields
        content
      }
    }
    `,
    {
      variables: { uri },
    }
  );

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  data.post = data.pageBy;

  return data;
}

export async function getHome(preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isSamePost = "home" === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === "draft";
  const isRevision = isSamePost && postPreview?.status === "publish";
  const uri = "home";
  const data = await fetchAPI(
    `
    fragment PageFields on Page {
      title
      slug
      featuredImage {
        node {
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
      seo {
        canonical
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
      content_area {
        contentArea
        link {
          target
          title
          url
        }
      }
      component_intro {
        heading
        subheading
        tagline
        introduction
      }
      on_the_issues {
        issueArea {
          icon {
            sourceUrl
            mediaDetails {
              height
              width
            }
          }
          title
          content
          stat
          statLabel
          statSource
        }
      }
      action_bar {
        btns {
          actionIcon {
            sourceUrl
            mediaDetails {
              height
              width
            }
          }
          actionTitle
          link {
            target
            title
            url
          }
        }
        contributeBtn {
          target
          title
          url
        }
        contributeCta
      }
      sign_up {
        sectionHeading
      }
    }
    query Home {
      page(id: "home", idType: URI) {
        ...PageFields
      }
      themeSettings {
        globalOptions {
          minToMid
          watchFaces {
            demPct
            envPct
            pubPct
            rcePct
          }
        }
      }
      events {
        nodes {
          acf_events {
            eventDate
            eventLabel
            eventThumbnail {
              sourceUrl
              mediaDetails {
                height
                width
              }
            }
            eventType {
              name
            }
            minutePosition
            postContent
            fullPost
          }
          slug
        }
      }
    }
    `,
    {
      variables: { uri },
    }
  );

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  data.post = data.pageBy;

  return data;
}

export async function getPostAndMorePosts(slug, preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === postPreview.id
    : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === "draft";
  const isRevision = isSamePost && postPreview?.status === "publish";
  const data = await fetchAPI(
    `
    fragment AuthorFields on User {
      firstName
      lastName
      name
      nicename
      nickname
      uri
      slug
    }
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
      author {
        node {
          ...AuthorFields
        }
      }
      categories {
        edges {
          node {
            name
            slug
          }
        }
      }
      tags {
        edges {
          node {
            name
            slug
          }
        }
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
              author {
                ...AuthorFields
              }
            }
          }
        }
        `
            : ""
        }
      }
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? "DATABASE_ID" : "SLUG",
      },
    }
  );

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  // Filter out the main post
  data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 posts, remove the last one
  if (data.posts.edges.length > 2) data.posts.edges.pop();

  return data;
}
