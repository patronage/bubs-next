export function nextLoader({ src, width, height, quality }) {
  let root = '/_next/image';
  return `${root}?url=${encodeURIComponent(src)}&w=${width}&h=${
    height || ''
  }&q=${quality || 75}`;
}
