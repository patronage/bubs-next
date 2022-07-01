export default function handler(req, res) {
  if (
    process.env.VERCEL_ENV === 'production' &&
    !process.env.NOINDEX
  ) {
    res.write('User-agent: *');
    res.write('\n');
    res.write('Allow: /');
    res.send();
  } else {
    res.write('User-agent: *');
    res.write('\n');
    res.write('Disallow: /');
    res.send();
  }
}
