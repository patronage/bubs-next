import {
  trimTrailingSlash,
  trimLeadingSlash,
  isUrlAbsolute,
  isUrlAnchor,
} from 'lib/utils';

export default function checkRedirects(slug, redirects) {
  if (slug && Array.isArray(redirects)) {
    // remove trailing slashes from each to normalize
    const redirect = redirects.find(
      (row) =>
        trimTrailingSlash(trimLeadingSlash(row.origin)) ===
        trimTrailingSlash(trimLeadingSlash(slug)),
    );

    if (redirect) {
      // check for absolute, otherwise make relative with proper slashes
      let destination;

      if (isUrlAbsolute(redirect.target)) {
        destination = redirect.target;
      } else if (isUrlAnchor(redirect.target)) {
        destination = `/${trimTrailingSlash(
          trimLeadingSlash(redirect.target),
        )}`;
      } else {
        destination = `/${trimTrailingSlash(
          trimLeadingSlash(redirect.target),
        )}/`;
      }

      return {
        destination: destination,
        statusCode: redirect.statusCode || 307,
      };
    }
  }
  return false;
}
