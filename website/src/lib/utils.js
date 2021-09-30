export function trimTrailingSlash(str) {
  if (!str || str === '/' ) {
    return str;
  }

  return str.replace(/\/$/, '');
}

export function trimLeadingSlash(str) {
  if (!str) {
    return str;
  }

  return str.replace(/^\/+/, '');
}

/**
 * Lightweight determination if filename is a static asset. Avoids external deps.
 * @param {string} fileName Name of the path or file being requested
 * @returns {bool}
 */
export function isStaticFile(fileName) {
  if (!fileName.includes('.')) {
    return false;
  }

  const staticExtensions = [
    // Text Files
    'txt',
    'css',
    'js',

    // Img Files
    'gif',
    'png',
    'jpg',
    'ico',
    'svg',

    // Other downloadable files
    'pdf',
    'mov',
    'mp4',
  ];

  const segments = fileName.split('.');
  const ext = segments[segments.length - 1];
  return staticExtensions.includes(ext);
}
