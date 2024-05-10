export default async function handler(req, res) {
  const { secret, paths } = req.body;

  // Check for secret to confirm this is a valid request
  if (secret !== process.env.HEADLESS_REVALIDATE_SECRET) {
    return void res.status(401).json({ message: 'Invalid token' });
  }

  if (!paths || paths.length === 0) {
    return void res.json({ revalidated: false });
  }

  try {
    await Promise.all(paths.map((path) => res.revalidate(path)));
    return void res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    console.error(err);
    return void res.status(500).send('Error revalidating');
  }
}
