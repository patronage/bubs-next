export function trimTrailingSlash(str) {
  if (!str) {
    return str;
  }

  return str.replace(/\/$/, '');
}

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
