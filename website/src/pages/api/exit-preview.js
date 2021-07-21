export default async function exit(req, res) {
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData();

  if (req.query.redirect) {
    res.writeHead(307, {
      Location: decodeURIComponent(req.query.redirect),
    });
  } else {
    res.writeHead(307, { Location: '/' });
  }

  res.end();
}
