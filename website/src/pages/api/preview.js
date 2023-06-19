import { authorize } from 'lib/auth';
import { getSettings } from 'lib/getSettings';
import { getPreviewContent } from 'lib/wordpress';

const COOKIE_MAX_AGE = 86400;

export default async function preview(req, res) {
  const SETTINGS = getSettings({ ...req });

  let accessToken;
  const { code, id, path, slug } = req.query;

  // Get Auth Token
  if (code) {
    // console.log(
    //   `fetching authorize token at ${SETTINGS.CONFIG.wordpress_url}`,
    // );
    const result = await authorize(
      decodeURIComponent(code),
      SETTINGS.CONFIG.wordpress_url,
    );
    // console.log(`authorize response ${result}`);
    accessToken = result.access_token;
  } else if (req.previewData.token) {
    accessToken = req.previewData.token;
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
  const post = await getPreviewContent({
    project: SETTINGS.PROJECT,
    id,
    idType: 'DATABASE_ID',
    token: accessToken,
  });

  // If the post doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Post not found' });
  }

  const postId = post?.previewRevisionDatabaseId || post?.databaseId;

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(
    {
      post: {
        uri: post.uri,
        id: postId,
        status: post.status,
        type: post.contentType.node.name,
      },
      token: accessToken,
    },
    {
      maxAge: COOKIE_MAX_AGE,
    },
  );

  const location = `/${postId}/`;

  // Redirect to the path from the fetched post
  res.writeHead(307, { location });
  return res.end();
}
