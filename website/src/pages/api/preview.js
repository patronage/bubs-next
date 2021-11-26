import { authorize } from 'lib/auth';
import { getContentTypes, getPreviewContent } from 'lib/wordpress';

const COOKIE_MAX_AGE = 86400;

export default async function preview(req, res) {
  let accessToken;
  const { code, id, preview_id, path, slug } = req.query;

  // Get Auth Token
  if (req.previewData.token) {
    accessToken = req.previewData.token;
  } else if (code) {
    const result = await authorize(decodeURIComponent(code));
    accessToken = result.access_token;
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // This is an admin attempt to turn preview mode on, not a request for specific content
  if (!id && !slug) {
    res.setPreviewData(
      { token: accessToken },
      { maxAge: COOKIE_MAX_AGE },
    );

    if (path) {
      res.writeHead(307, { Location: path });
    } else {
      res.writeHead(200);
    }

    return res.end();
  }

  // Get ID
  if (!id) {
    return res.status(401).json({ message: 'Invalid request' });
  }

  // Fetch WordPress to check if the provided `id` exists
  const post = await getPreviewContent(
    id,
    'DATABASE_ID',
    accessToken,
  );

  // If the post doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Post not found' });
  }

  // Get the content types to help build preview URLs
  const contentTypesArray = await getContentTypes(accessToken);
  const contentTypes = {};

  for (const contentType of contentTypesArray) {
    contentTypes[contentType.name] = contentType.restBase;
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(
    {
      post: {
        uri: post.uri,
        id: post.databaseId,
        status: post.status,
        type: post.contentType.node.name,
      },
      token: accessToken,
    },
    {
      maxAge: COOKIE_MAX_AGE,
    },
  );

  let Location = post.uri;
  const typePath = contentTypes[post.contentType.node.name];

  // Draft posts need a little help pointing towards the correct Next.js page template
  if (
    post.status === 'draft' &&
    post.contentType.node.name !== 'page'
  ) {
    Location = `/${typePath}/${post.databaseId}`;
  } else if (post.status === 'draft') {
    Location = `/${post.databaseId}`;
  } else if (preview_id && post.contentType.node.name !== 'page') {
    Location = `/${typePath}/${preview_id}`;
  } else if (preview_id || slug || path) {
    Location = `/${preview_id || slug || path}`;
  }

  // Redirect to the path from the fetched post
  res.writeHead(307, { Location });
  return res.end();
}
