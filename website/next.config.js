const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  images: {
    domains: [
      "localhost",
      "bubs.patronage.org",
      "bubs-next.vercel.app",
      "bubs-next-git-12-next-image.patronage.vercel.app",
    ],
  },
});
