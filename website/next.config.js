const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  images: {
    domains: [
      "localhost",
      "localhost:800",
      "bubsnext.wpengine.com",
      "bubsnexts.wpengine.com",
      "bubsnextd.wpengine.com",
    ],
  },
});
