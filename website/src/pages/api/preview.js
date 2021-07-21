import { getPreviewContent } from 'lib/wordpress';
import pluralize from 'pluralize';

export default async function preview(req, res) {
  const { secret, id, preview_id } = req.query;

  // Check the secret and next parameters
  // This secret should only be known by this API route
  if (
    !id ||
    !process.env.WORDPRESS_PREVIEW_SECRET ||
    secret !== process.env.WORDPRESS_PREVIEW_SECRET
  ) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Fetch WordPress to check if the provided `id` exists
  const post = await getPreviewContent(id);

  // If the post doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Post not found' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({
    post: {
      uri: post.uri,
      id: post.databaseId,
      status: post.status,
      type: post.contentType.node.name,
    },
  });

  let Location = post.uri;
  const pluralType = pluralize(post.contentType.node.name);

  // Draft posts need a little help pointing towards the correct Next.js page template
  if (
    post.status === 'draft' &&
    post.contentType.node.name !== 'page'
  ) {
    Location = `/${pluralType}/${post.databaseId}`;
  } else if (post.status === 'draft') {
    Location = `/${post.databaseId}`;
  } else if (preview_id && post.contentType.node.name !== 'page') {
    Location = `/${pluralType}/${preview_id}`;
  } else if (preview_id) {
    Location = `/${preview_id}`;
  }

  // Redirect to the path from the fetched post
  res.writeHead(307, { Location });

  res.end();
}
