export default function handler(req, res) {
  if (req.method === 'POST') {
    const { slug } = req.query;
    let success = true;
    console.log('params', slug);
    console.log('body', req.body);
    if (success) {
      res.json({ received: true });
    }
    res.status(200).end('Purge Failed');
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
