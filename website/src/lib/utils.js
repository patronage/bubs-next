export function trimTrailingSlash(str) {
  if (!str) {
    return str;
  }

  return str.replace(/\/$/, '');
}
